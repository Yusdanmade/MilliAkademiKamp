const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunucu-bilgi')
    .setDescription('Sunucu hakkında bilgi verir'),
  async execute(interaction) {
    const guild = interaction.guild;
    
    const embed = {
      title: `📊 ${guild.name} Sunucu Bilgileri`,
      thumbnail: { url: guild.iconURL() },
      color: 0x00AE86,
      fields: [
        { name: '🆔 Sunucu ID', value: guild.id, inline: true },
        { name: '👑 Kurucu', value: `<@${guild.ownerId}>`, inline: true },
        { name: '📅 Kuruluş Tarihi', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '👥 Üye Sayısı', value: guild.memberCount.toString(), inline: true },
        { name: '📊 Kanal Sayısı', value: guild.channels.cache.size.toString(), inline: true },
        { name: '🎭 Rol Sayısı', value: guild.roles.cache.size.toString(), inline: true },
        { name: '🚀 Boost Seviyesi', value: `Level ${guild.premiumTier}`, inline: true },
        { name: '💎 Boost Sayısı', value: guild.premiumSubscriptionCount.toString(), inline: true },
        { name: '🔔 Doğrulama Seviyesi', value: guild.verificationLevel.toString(), inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};