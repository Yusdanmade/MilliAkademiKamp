const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auto_role')
    .setDescription('Sets auto role system')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('Auto role to give')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const role = interaction.options.getRole('role');
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

    config.otoRol = role.id;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));

    const message = languageSystem.getText(interaction.guild.id, 'messages.auto_role_set', {
      role: role.name
    });

    const embed = {
      title: lang === 'tr' ? '✅ Otomatik Rol Ayarlandı' : '✅ Auto Role Set',
      description: message,
      color: 0x00AE86,
      fields: [
        { name: lang === 'tr' ? '🎭 Rol' : '🎭 Role', value: role.name, inline: true },
        { name: lang === 'tr' ? '🆔 Rol ID' : '🆔 Role ID', value: role.id, inline: true },
        { name: lang === 'tr' ? '👮 Ayarlayan' : '👮 Set by', value: interaction.user.tag, inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};