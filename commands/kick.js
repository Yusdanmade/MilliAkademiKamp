const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const LanguageSystem = require('../utils/languageSystem');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from server')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('User to kick')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Kick reason')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
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

    if (!member.kickable) {
      const message = lang === 'tr' ? '❌ Bu kullanıcıyı atamam!' : '❌ I cannot kick this user!';
      return await interaction.reply({ content: message, flags: 64 });
    }

    try {
      await member.kick(reason);
      
      const successMessage = languageSystem.getText(interaction.guild.id, 'messages.kick_success', {
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