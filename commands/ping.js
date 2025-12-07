const { SlashCommandBuilder } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows bot ping'),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const lang = languageSystem.getLanguage(interaction.guild.id);
    
    const sent = await interaction.reply({ content: '⏳ Measuring ping...', fetchReply: true });
    const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
    
    const message = lang === 'tr' 
      ? `🏓 Pong! Gecikme: ${timeDiff}ms | API Gecikmesi: ${Math.round(interaction.client.ws.ping)}ms`
      : `🏓 Pong! Latency: ${timeDiff}ms | API Latency: ${Math.round(interaction.client.ws.ping)}ms`;
    
    await interaction.editReply(message);
  }
};