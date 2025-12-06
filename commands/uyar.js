const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const WarningSystem = require('../utils/warningSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyar')
    .setDescription('Kullanıcıya uyarı verir')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Uyarılacak kullanıcı')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('sebep')
        .setDescription('Uyarı sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const warningSystem = new WarningSystem();

    if (!member) {
      return await interaction.reply({ content: '❌ Kullanıcı bulunamadı!', flags: 64 });
    }

    try {
      // Uyarıyı veritabanına ekle
      const warning = warningSystem.addWarning(user.id, interaction.guild.id, reason, interaction.user.id);
      const warningCount = warningSystem.getWarningCount(user.id, interaction.guild.id);

      // Kullanıcıya DM gönder
      await user.send(`⚠️ **${interaction.guild.name}** sunucusunda uyarıldınız!\n**Sebep:** ${reason}\n**Toplam Uyarı:** ${warningCount}`).catch(() => {});
      
      const embed = {
        title: '⚠️ Uyarı Bildirimi',
        description: `**${user.tag}** kullanıcısı uyarıldı!`,
        color: 0xFFFF00,
        fields: [
          { name: '👤 Kullanıcı', value: user.tag, inline: true },
          { name: '📝 Sebep', value: reason, inline: true },
          { name: '👮 Yetkili', value: interaction.user.tag, inline: true },
          { name: '📊 Toplam Uyarı', value: warningCount.toString(), inline: true }
        ],
        timestamp: new Date()
      };

      await interaction.reply({ embeds: [embed] });

      // 3 uyarıya ulaşınca otomatik kick
      if (warningCount >= 3) {
        await member.kick('3 uyarıya ulaştığı için otomatik kick');
        await interaction.followUp(`🚨 ${user.tag} kullanıcısı 3 uyarıya ulaştığı için otomatik olarak atıldı!`);
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
            title: '⚠️ Yeni Uyarı',
            description: `**${user.tag}** kullanıcısına uyarı verildi!`,
            color: 0xFFFF00,
            fields: [
              { name: '👤 Kullanıcı', value: user.tag, inline: true },
              { name: '📝 Sebep', value: reason, inline: true },
              { name: '👮 Yetkili', value: interaction.user.tag, inline: true },
              { name: '📊 Toplam Uyarı', value: `${warningCount}/3`, inline: true }
            ],
            timestamp: new Date()
          };

          await logChannel.send({ embeds: [logEmbed] });
        }
      }

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Uyarı işlemi başarısız!', flags: 64 });
    }
  }
};