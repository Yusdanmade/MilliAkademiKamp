const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const WarningSystem = require('../utils/warningSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyarı-sil')
    .setDescription('Kullanıcının tüm uyarılarını siler')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Uyarıları silinecek kullanıcı')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const warningSystem = new WarningSystem();
    const warningCount = warningSystem.getWarningCount(user.id, interaction.guild.id);

    if (warningCount === 0) {
      return await interaction.reply({ 
        content: `ℹ️ ${user.tag} kullanıcısının zaten uyarısı yok!`,
        flags: 64 
      });
    }

    const success = warningSystem.clearWarnings(user.id, interaction.guild.id);

    if (success) {
      const embed = {
        title: '✅ Uyarılar Silindi',
        description: `**${user.tag}** kullanıcısının **${warningCount}** uyarısı silindi!`,
        color: 0x00AE86,
        fields: [
          { name: '👤 Kullanıcı', value: user.tag, inline: true },
          { name: '👮 Yetkili', value: interaction.user.tag, inline: true },
          { name: '📊 Silinen Uyarı', value: warningCount.toString(), inline: true }
        ],
        timestamp: new Date()
      };

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({ content: '❌ Uyarılar silinirken hata oluştu!', flags: 64 });
    }
  }
};