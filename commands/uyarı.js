const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uyarı')
    .setDescription('Kullanıcıya uyarı verir')
    .addUserOption(option => 
      option.setName('kullanıcı')
        .setDescription('Uyarılacak kullanıcı')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('sebep')
        .setDescription('Uyarı sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı');
    const reason = interaction.options.getString('sebep');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      return await interaction.reply({ content: '❌ Kullanıcı bulunamadı!', flags: 64 });
    }

    try {
      await user.send(`⚠️ **${interaction.guild.name}** sunucusunda uyarıldınız!\n**Sebep:** ${reason}`);
      
      const embed = {
        title: '⚠️ Uyarı Bildirimi',
        description: `**${user.tag}** kullanıcısı uyarıldı!`,
        color: 0xFFFF00,
        fields: [
          { name: '👤 Kullanıcı', value: user.tag, inline: true },
          { name: '📝 Sebep', value: reason, inline: true },
          { name: '👮 Yetkili', value: interaction.user.tag, inline: true }
        ],
        timestamp: new Date()
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Uyarı işlemi başarısız!', flags: 64 });
    }
  }
};