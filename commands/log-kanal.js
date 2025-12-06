const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('log-kanal')
    .setDescription('Log kanalını ayarlar')
    .addChannelOption(option => 
      option.setName('kanal')
        .setDescription('Log kanalı olarak ayarlanacak kanal')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const channel = interaction.options.getChannel('kanal');
    
    const fs = require('fs');
    const config = { logChannel: channel.id };
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    await interaction.reply({ 
      content: `✅ Log kanalı olarak **${channel.name}** ayarlandı!`,
      ephemeral: false 
    });
  }
};