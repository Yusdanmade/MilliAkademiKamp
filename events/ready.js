const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
    console.log(`📊 ${client.guilds.cache.size} sunucuda aktif`);
  }
};