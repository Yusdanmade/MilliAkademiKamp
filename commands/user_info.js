const { SlashCommandBuilder } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user_info')
    .setDescription('Shows user information')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to get info')
        .setRequired(false)),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    const lang = languageSystem.getLanguage(interaction.guild.id);

    const embed = {
      title: `${languageSystem.getText(interaction.guild.id, 'embeds.user_info')} - ${user.tag}`,
      thumbnail: { url: user.displayAvatarURL() },
      color: 0x00AE86,
      fields: [
        { name: lang === 'tr' ? '🆔 Kullanıcı ID' : '🆔 User ID', value: user.id, inline: true },
        { name: lang === 'tr' ? '📅 Hesap Kuruluş' : '📅 Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: lang === 'tr' ? '🤖 Bot' : '🤖 Bot', value: user.bot ? (lang === 'tr' ? 'Evet' : 'Yes') : (lang === 'tr' ? 'Hayır' : 'No'), inline: true },
        { name: lang === 'tr' ? '📅 Sunucuya Katılma' : '📅 Server Join', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : (lang === 'tr' ? 'Bilinmiyor' : 'Unknown'), inline: true },
        { name: lang === 'tr' ? '🎭 Takma Ad' : '🎭 Nickname', value: member?.nickname || (lang === 'tr' ? 'Yok' : 'None'), inline: true },
        { name: lang === 'tr' ? '🎨 Durum' : '🎨 Status', value: member?.presence?.status || (lang === 'tr' ? 'Çevrimdışı' : 'Offline'), inline: true }
      ],
      timestamp: new Date()
    };

    if (member) {
      const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id);
      if (roles.size > 0) {
        embed.fields.push({
          name: `${lang === 'tr' ? '🎭 Roller' : '🎭 Roles'} (${roles.size})`,
          value: roles.map(role => `<@&${role.id}>`).join(' ') || (lang === 'tr' ? 'Yok' : 'None'),
          inline: false
        });
      }
    }

    await interaction.reply({ embeds: [embed] });
  }
};