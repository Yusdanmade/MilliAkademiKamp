const { Events, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: Events.GuildChannelDelete,
  async execute(channel, client) {
    const fs = require('fs');
    let config = {};
    
    try {
      if (fs.existsSync('./config.json')) {
        config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
      }
    } catch (error) {
      console.error('Config okuma hatası:', error);
    }

    if (config.logChannel) {
      const logChannel = client.channels.cache.get(config.logChannel);
      if (logChannel) {
        const embed = {
          title: '🛡️ Kanal Silindi - Koruma Aktif',
          description: `**${channel.name}** kanalı silindi!`,
          color: 0xFF0000,
          fields: [
            { name: '📝 Kanal ID', value: channel.id, inline: true },
            { name: '📂 Tür', value: channel.type.toString(), inline: true },
            { name: '📊 Kategori', value: channel.parent?.name || 'Yok', inline: true }
          ],
          timestamp: new Date()
        };

        await logChannel.send({ embeds: [embed] });
      }
    }

    const auditLogs = await channel.guild.fetchAuditLogs({
      type: 12,
      limit: 1
    });

    const deletionLog = auditLogs.entries.first();
    if (!deletionLog) return;

    const { executor } = deletionLog;
    const member = await channel.guild.members.fetch(executor.id);

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      await channel.guild.channels.create({
        name: channel.name,
        type: channel.type,
        parent: channel.parent,
        position: channel.position,
        topic: channel.topic,
        nsfw: channel.nsfw,
        rateLimitPerUser: channel.rateLimitPerUser
      });

      if (config.logChannel) {
        const logChannel = client.channels.cache.get(config.logChannel);
        if (logChannel) {
          await logChannel.send(`🔄 **${channel.name}** kanalı geri oluşturuldu!`);
        }
      }
    }
  }
};