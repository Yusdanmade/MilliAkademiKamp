const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');
const WarningSystem = require('../utils/warningSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear_warnings')
    .setDescription('Clears all user warnings')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to clear warnings')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const warningSystem = new WarningSystem();
    const user = interaction.options.getUser('user');
    const warningCount = warningSystem.getWarningCount(user.id, interaction.guild.id);
    const lang = languageSystem.getLanguage(interaction.guild.id);

    if (warningCount === 0) {
      const message = lang === 'tr' 
        ? `ℹ️ ${user.tag} kullanıcısının zaten uyarısı yok!`
        : `ℹ️ ${user.tag} has no warnings!`;
      return await interaction.reply({ 
        content: message,
        flags: 64 
      });
    }

    const success = warningSystem.clearWarnings(user.id, interaction.guild.id);

    if (success) {
      const embed = {
        title: lang === 'tr' ? '✅ Uyarılar Silindi' : '✅ Warnings Cleared',
        description: lang === 'tr' 
          ? `**${user.tag}** kullanıcısının **${warningCount}** uyarısı silindi!`
          : `**${warningCount}** warnings of **${user.tag}** have been cleared!`,
        color: 0x00AE86,
        fields: [
          { name: lang === 'tr' ? '👤 Kullanıcı' : '👤 User', value: user.tag, inline: true },
          { name: lang === 'tr' ? '👮 Yetkili' : '👮 Moderator', value: interaction.user.tag, inline: true },
          { name: lang === 'tr' ? '📊 Silinen Uyarı' : '📊 Cleared Warnings', value: warningCount.toString(), inline: true }
        ],
        timestamp: new Date()
      };

      await interaction.reply({ embeds: [embed] });
    } else {
      const message = languageSystem.getText(interaction.guild.id, 'messages.operation_failed');
      await interaction.reply({ content: message, flags: 64 });
    }
  }
};