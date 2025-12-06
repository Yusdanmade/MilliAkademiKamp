const { SlashCommandBuilder } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server_info')
    .setDescription('Shows server information'),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const guild = interaction.guild;
    const lang = languageSystem.getLanguage(interaction.guild.id);
    
    const embed = {
      title: `${languageSystem.getText(interaction.guild.id, 'embeds.server_info')} - ${guild.name}`,
      thumbnail: { url: guild.iconURL() },
      color: 0x00AE86,
      fields: [
        { name: lang === 'tr' ? '🆔 Sunucu ID' : '🆔 Server ID', value: guild.id, inline: true },
        { name: lang === 'tr' ? '👑 Kurucu' : '👑 Owner', value: `<@${guild.ownerId}>`, inline: true },
        { name: lang === 'tr' ? '📅 Kuruluş Tarihi' : '📅 Created Date', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: lang === 'tr' ? '👥 Üye Sayısı' : '👥 Member Count', value: guild.memberCount.toString(), inline: true },
        { name: lang === 'tr' ? '📊 Kanal Sayısı' : '📊 Channel Count', value: guild.channels.cache.size.toString(), inline: true },
        { name: lang === 'tr' ? '🎭 Rol Sayısı' : '🎭 Role Count', value: guild.roles.cache.size.toString(), inline: true },
        { name: lang === 'tr' ? '🚀 Boost Seviyesi' : '🚀 Boost Level', value: `Level ${guild.premiumTier}`, inline: true },
        { name: lang === 'tr' ? '💎 Boost Sayısı' : '💎 Boost Count', value: guild.premiumSubscriptionCount.toString(), inline: true },
        { name: lang === 'tr' ? '🔔 Doğrulama Seviyesi' : '🔔 Verification Level', value: guild.verificationLevel.toString(), inline: true }
      ],
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};