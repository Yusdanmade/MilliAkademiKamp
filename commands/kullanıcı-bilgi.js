const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Kullanıcı hakkında bilgi verir')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Bilgisi bakılacak kullanıcı')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = {
      title: `👤 ${user.tag} Kullanıcı Bilgileri`,
      thumbnail: { url: user.displayAvatarURL() },
      color: 0x00AE86,
      fields: [
        { name: '🆔 Kullanıcı ID', value: user.id, inline: true },
        { name: '📅 Hesap Kuruluş', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '🤖 Bot', value: user.bot ? 'Evet' : 'Hayır', inline: true },
        { name: '📅 Sunucuya Katılma', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` : 'Bilinmiyor', inline: true },
        { name: '🎭 Takma Ad', value: member?.nickname || 'Yok', inline: true },
        { name: '🎨 Durum', value: member?.presence?.status || 'Çevrimdışı', inline: true }
      ],
      timestamp: new Date()
    };

    if (member) {
      const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id);
      if (roles.size > 0) {
        embed.fields.push({
          name: '🎭 Roller (' + roles.size + ')',
          value: roles.map(role => `<@&${role.id}>`).join(' ') || 'Yok',
          inline: false
        });
      }
    }

    await interaction.reply({ embeds: [embed] });
  }
};