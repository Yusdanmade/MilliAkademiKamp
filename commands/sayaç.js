const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sayaç')
    .setDescription('Sayaç kanalını ayarlar')
    .addIntegerOption(option => 
      option.setName('hedef')
        .setDescription('Hedef üye sayısı')
        .setRequired(true))
    .addChannelOption(option => 
      option.setName('kanal')
        .setDescription('Sayaç kanalı')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const target = interaction.options.getInteger('hedef');
    const channel = interaction.options.getChannel('kanal') || interaction.channel;
    
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
    const embed = {
      title: '📊 Sayaç Ayarlandı',
      description: `**${channel.name}** kanalı sayaç olarak ayarlandı!`,
      color: 0x00AE86,
      fields: [
        { name: '🎯 Hedef', value: target.toString(), inline: true },
        { name: '👥 Mevcut', value: memberCount.toString(), inline: true },
        { name: '📈 Kalan', value: (target - memberCount).toString(), inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });

    await channel.setName(`👥 Üye: ${memberCount}/${target}`);
  }
};