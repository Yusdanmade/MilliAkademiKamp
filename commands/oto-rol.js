const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oto-rol')
    .setDescription('Otomatik rol sistemini ayarlar')
    .addRoleOption(option => 
      option.setName('rol')
        .setDescription('Otomatik verilecek rol')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const role = interaction.options.getRole('rol');
    
    const fs = require('fs');
    let config = {};
    
    try {
      if (fs.existsSync('./config.json')) {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
      }
    } catch (error) {
      console.error('Config okuma hatası:', error);
    }

    config.otoRol = role.id;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    const embed = {
      title: '✅ Otomatik Rol Ayarlandı',
      description: `**${role.name}** rolü otomatik olarak verilecek!`,
      color: 0x00AE86,
      fields: [
        { name: '🎭 Rol', value: role.name, inline: true },
        { name: '🆔 Rol ID', value: role.id, inline: true },
        { name: '👮 Ayarlayan', value: interaction.user.tag, inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};