const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const WarningSystem = require('../utils/warningSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyarılar')
    .setDescription('Kullanıcının uyarılarını gösterir')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Uyarıları bakılacak kullanıcı')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const warningSystem = new WarningSystem();
    const warnings = warningSystem.getWarnings(user.id, interaction.guild.id);

    if (warnings.length === 0) {
      return await interaction.reply({ 
        content: `✅ ${user.tag} kullanıcısının uyarısı bulunmuyor!`,
        flags: 64 
      });
    }

    const embed = {
      title: `⚠️ ${user.tag} - Uyarıları`,
      description: `Toplam **${warnings.length}** uyarı`,
      color: 0xFFFF00,
      fields: warnings.map((warning, index) => ({
        name: `Uyarı #${index + 1}`,
        value: `**Sebep:** ${warning.reason}\n**Tarih:** ${new Date(warning.timestamp).toLocaleDateString('tr-TR')}\n**ID:** ${warning.id}`,
        inline: false
      })),
      timestamp: new Date()
    };

    await interaction.reply({ embeds: [embed] });
  }
};