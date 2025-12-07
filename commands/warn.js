const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to warn')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Warning reason')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const lang = languageSystem.getLanguage(interaction.guild.id);
    
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const WarningSystem = require('../utils/warningSystem');
    const warningSystem = new WarningSystem();

    if (!member) {
      const message = languageSystem.getText(interaction.guild.id, 'messages.user_not_found');
      return await interaction.reply({ content: message, flags: 64 });
    }

    try {
      // Uyarıyı veritabanına ekle
      const warning = warningSystem.addWarning(user.id, interaction.guild.id, reason, interaction.user.id);
      const warningCount = warningSystem.getWarningCount(user.id, interaction.guild.id);

      // Kullanıcıya DM gönder
      const dmMessage = lang === 'tr' 
        ? `⚠️ **${interaction.guild.name}** sunucusunda uyarıldınız!\n**Sebep:** ${reason}\n**Toplam Uyarı:** ${warningCount}`
        : `⚠️ You have been warned in **${interaction.guild.name}** server!\n**Reason:** ${reason}\n**Total Warnings:** ${warningCount}`;
      
      await user.send(dmMessage).catch(() => {});
      
      const embed = {
        title: languageSystem.getText(interaction.guild.id, 'embeds.warning_notification'),
        description: languageSystem.getText(interaction.guild.id, 'messages.warn_success', { user: user.tag }),
        color: 0xFFFF00,
        fields: [
          { name: lang === 'tr' ? '👤 Kullanıcı' : '👤 User', value: user.tag, inline: true },
          { name: lang === 'tr' ? '📝 Sebep' : '📝 Reason', value: reason, inline: true },
          { name: lang === 'tr' ? '👮 Yetkili' : '👮 Moderator', value: interaction.user.tag, inline: true },
          { name: lang === 'tr' ? '📊 Toplam Uyarı' : '📊 Total Warnings', value: warningCount.toString(), inline: true }
        ],
        timestamp: new Date()
      };

      await interaction.reply({ embeds: [embed] });

      // 3 uyarıya ulaşınca otomatik kick
      if (warningCount >= 3) {
        await member.kick('3 uyarıya ulaştığı için otomatik kick');
        const autoKickMessage = languageSystem.getText(interaction.guild.id, 'messages.auto_kick', { user: user.tag });
        await interaction.followUp(autoKickMessage);
      }

      // Log gönder
      const fs = require('fs');
      let config = {};
      
      try {
        if (fs.existsSync('./config.json')) {
          config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        }
      } catch (error) {
        console.error('Config okuma hatası:', error);
      }

      if (config.logChannel) {
        const logChannel = interaction.client.channels.cache.get(config.logChannel);
        if (logChannel) {
          const logEmbed = {
            title: languageSystem.getText(interaction.guild.id, 'embeds.new_warning'),
            description: languageSystem.getText(interaction.guild.id, 'messages.warn_success', { user: user.tag }),
            color: 0xFFFF00,
            fields: [
              { name: lang === 'tr' ? '👤 Kullanıcı' : '👤 User', value: user.tag, inline: true },
              { name: lang === 'tr' ? '📝 Sebep' : '📝 Reason', value: reason, inline: true },
              { name: lang === 'tr' ? '👮 Yetkili' : '👮 Moderator', value: interaction.user.tag, inline: true },
              { name: lang === 'tr' ? '📊 Toplam Uyarı' : '📊 Total Warnings', value: `${warningCount}/3`, inline: true }
            ],
            timestamp: new Date()
          };

          await logChannel.send({ embeds: [logEmbed] });
        }
      }

    } catch (error) {
      console.error(error);
      const message = languageSystem.getText(interaction.guild.id, 'messages.operation_failed');
      await interaction.reply({ content: message, flags: 64 });
    }
  }
};