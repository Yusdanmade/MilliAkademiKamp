const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log_channel')
    .setDescription('Sets log channel')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Log channel to set')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const channel = interaction.options.getChannel('channel');
    const lang = languageSystem.getLanguage(interaction.guild.id);
    
    const fs = require('fs');
    let config = {};
    
    try {
      if (fs.existsSync('./config.json')) {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
      }
    } catch (error) {
      console.error('Config okuma hatası:', error);
    }

    config.logChannel = channel.id;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    const message = languageSystem.getText(interaction.guild.id, 'messages.log_channel_set', {
      channel: channel.name
    });

    const embed = {
      title: lang === 'tr' ? '✅ Log Kanalı Ayarlandı' : '✅ Log Channel Set',
      description: message,
      color: 0x00AE86,
      fields: [
        { name: lang === 'tr' ? '📝 Kanal' : '📝 Channel', value: channel.name, inline: true },
        { name: lang === 'tr' ? '🆔 Kanal ID' : '🆔 Channel ID', value: channel.id, inline: true },
        { name: lang === 'tr' ? '👮 Ayarlayan' : '👮 Set by', value: interaction.user.tag, inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};