const { SlashCommandBuilder } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows bot commands'),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const lang = languageSystem.getLanguage(interaction.guild.id);
    
    const embed = {
      title: languageSystem.getText(interaction.guild.id, 'embeds.help_title'),
      description: lang === 'tr' ? 'Tüm komutlar aşağıda listelenmiştir:' : 'All commands are listed below:',
      color: 0x00AE86,
      fields: [
        {
          name: languageSystem.getText(interaction.guild.id, 'embeds.moderation'),
          value: '`/ban <user> [reason]` - ' + languageSystem.getText(interaction.guild.id, 'commands.ban') + '\n' +
                  '`/kick <user> [reason]` - ' + languageSystem.getText(interaction.guild.id, 'commands.kick') + '\n' +
                  '`/warn <user> <reason>`, `/uyar <user> <reason>` - ' + languageSystem.getText(interaction.guild.id, 'commands.warn') + '\n' +
                  '`/warnings <user>` - ' + languageSystem.getText(interaction.guild.id, 'commands.warnings') + '\n' +
                  '`/clear_warnings <user>` - ' + languageSystem.getText(interaction.guild.id, 'commands.clear_warnings'),
          inline: false
        },
        {
          name: languageSystem.getText(interaction.guild.id, 'embeds.settings'),
          value: '`/log_channel <channel>` - ' + languageSystem.getText(interaction.guild.id, 'commands.log_channel') + '\n' +
                  '`/counter <target> [channel]` - ' + languageSystem.getText(interaction.guild.id, 'commands.counter') + '\n' +
                  '`/auto_role <role>` - ' + languageSystem.getText(interaction.guild.id, 'commands.auto_role') + '\n' +
                  '`/language <lang>` - ' + languageSystem.getText(interaction.guild.id, 'commands.language'),
          inline: false
        },
        {
          name: languageSystem.getText(interaction.guild.id, 'embeds.info'),
          value: '`/ping` - ' + languageSystem.getText(interaction.guild.id, 'commands.ping') + '\n' +
                  '`/server_info` - ' + languageSystem.getText(interaction.guild.id, 'commands.server_info') + '\n' +
                  '`/user_info [user]` - ' + languageSystem.getText(interaction.guild.id, 'commands.user_info') + '\n' +
                  '`/help` - ' + languageSystem.getText(interaction.guild.id, 'commands.help'),
          inline: false
        },
        {
          name: languageSystem.getText(interaction.guild.id, 'embeds.features'),
          value: lang === 'tr' 
            ? '• Spam engelleme (2 saniyede 4+ mesaj)\n• Büyük harf engelleme (%70+)\n• Link engelleme\n• Yasaklı kelime filtresi\n• Rol koruma\n• Kanal koruma\n• Uzun mesaj engelleme (500+ karakter)'
            : '• Spam protection (4+ messages in 2 seconds)\n• Excessive caps protection (70%+)\n• Link protection\n• Forbidden word filter\n• Role protection\n• Channel protection\n• Long message protection (500+ characters)',
          inline: false
        }
      ],
      footer: {
        text: `${interaction.client.user.tag} | Protection Bot v1.0`
      },
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};