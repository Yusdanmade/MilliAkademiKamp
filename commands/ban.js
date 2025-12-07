const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from server')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to ban')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Ban reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const languageSystem = new LanguageSystem();
    const lang = languageSystem.getLanguage(interaction.guild.id);
    
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || (lang === 'tr' ? 'Sebep belirtilmedi' : 'No reason provided');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) {
      const message = languageSystem.getText(interaction.guild.id, 'messages.user_not_found');
      return await interaction.reply({ content: message, flags: 64 });
    }

    if (!member.bannable) {
      const message = lang === 'tr' ? '❌ Bu kullanıcıyı banlayamam!' : '❌ I cannot ban this user!';
      return await interaction.reply({ content: message, flags: 64 });
    }

    try {
      await member.ban({ reason });
      
      const successMessage = languageSystem.getText(interaction.guild.id, 'messages.ban_success', {
        user: user.tag,
        reason: reason
      });
      
      await interaction.reply({ content: successMessage });
    } catch (error) {
      console.error(error);
      const message = languageSystem.getText(interaction.guild.id, 'messages.operation_failed');
      await interaction.reply({ content: message, flags: 64 });
    }
  }
};