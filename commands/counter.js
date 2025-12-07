const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counter')
    .setDescription('Sets member counter')
    .addIntegerOption(option => 
      option.setName('target')
        .setDescription('Target member count')
        .setRequired(true))
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('Counter channel')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const target = interaction.options.getInteger('target');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
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

    config.sayaç = {
      hedef: target,
      kanal: channel.id
    };

    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    const memberCount = interaction.guild.memberCount;
    const message = languageSystem.getText(interaction.guild.id, 'messages.counter_set', {
      channel: channel.name
    });

    const embed = {
      title: lang === 'tr' ? '📊 Sayaç Ayarlandı' : '📊 Counter Set',
      description: message,
      color: 0x00AE86,
      fields: [
        { name: lang === 'tr' ? '🎯 Hedef' : '🎯 Target', value: target.toString(), inline: true },
        { name: lang === 'tr' ? '👥 Mevcut' : '👥 Current', value: memberCount.toString(), inline: true },
        { name: lang === 'tr' ? '📈 Kalan' : '📈 Remaining', value: (target - memberCount).toString(), inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });

    await channel.setName(`👥 Üye: ${memberCount}/${target}`);
  }
};