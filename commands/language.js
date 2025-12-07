const { SlashCommandBuilder } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Change bot language')
    .addStringOption(option => 
      option.setName('language')
        .setDescription('Select language')
        .setRequired(true)
        .addChoices(
          { name: '🇺🇸 English', value: 'en' },
          { name: '🇹🇷 Türkçe', value: 'tr' }
        )),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const selectedLanguage = interaction.options.getString('language');
    
    const success = languageSystem.setLanguage(interaction.guild.id, selectedLanguage);
    
    if (!success) {
      return await interaction.reply({ 
        content: '❌ Invalid language selection!', 
        flags: 64 
      });
    }

    const languageName = selectedLanguage === 'en' ? 'English' : 'Türkçe';
    const message = languageSystem.getText(interaction.guild.id, 'messages.language_changed', {
      language: languageName
    });

    const embed = {
      title: '🌐 Language Settings',
      description: message,
      color: 0x00AE86,
      fields: [
        { name: '🌍 Selected Language', value: languageName, inline: true },
        { name: '👮 Changed by', value: interaction.user.tag, inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};