const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');
const WarningSystem = require('../utils/warningSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Shows user warnings')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to check warnings')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const warningSystem = new WarningSystem();
    const user = interaction.options.getUser('user');
    const warnings = warningSystem.getWarnings(user.id, interaction.guild.id);
    const lang = languageSystem.getLanguage(interaction.guild.id);

    if (warnings.length === 0) {
      const message = languageSystem.getText(interaction.guild.id, 'messages.no_warnings', { user: user.tag });
      return await interaction.reply({ 
        content: message,
        flags: 64 
      });
    }

    const embed = {
      title: `${lang === 'tr' ? '⚠️' : '⚠️'} ${user.tag} - ${lang === 'tr' ? 'Uyarıları' : 'Warnings'}`,
      description: `${lang === 'tr' ? 'Toplam' : 'Total'} **${warnings.length}** ${lang === 'tr' ? 'uyarı' : 'warnings'}`,
      color: 0xFFFF00,
      fields: warnings.map((warning, index) => ({
        name: `${lang === 'tr' ? 'Uyarı' : 'Warning'} #${index + 1}`,
        value: `**${lang === 'tr' ? 'Sebep' : 'Reason'}:** ${warning.reason}\n**${lang === 'tr' ? 'Tarih' : 'Date'}:** ${new Date(warning.timestamp).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}\n**ID:** ${warning.id}`,
        inline: false
      })),
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};