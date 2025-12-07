const { Events, PermissionFlagsBits } = require('discord.js');

module.exports = {
  name: Events.GuildRoleDelete,
  async execute(role, client) {
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
          title: '🛡️ Rol Silindi - Koruma Aktif',
          description: `**${role.name}** rolü silindi!`,
          color: 0xFF0000,
          fields: [
            { name: '📝 Rol ID', value: role.id, inline: true },
            { name: '🎨 Renk', value: role.hexColor || 'Yok', inline: true },
            { name: '👥 Pozisyon', value: role.position.toString(), inline: true }
          ],
          timestamp: new Date()
        };

        await logChannel.send({ embeds: [embed] });
      }
    }

    const auditLogs = await role.guild.fetchAuditLogs({
      type: 32,
      limit: 1
    });

    const deletionLog = auditLogs.entries.first();
    if (!deletionLog) return;

    const { executor } = deletionLog;
    const member = await role.guild.members.fetch(executor.id);

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) {
      await role.guild.roles.create({
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        mentionable: role.mentionable,
        permissions: role.permissions,
        position: role.position
      });

      if (config.logChannel) {
        const logChannel = client.channels.cache.get(config.logChannel);
        if (logChannel) {
          await logChannel.send(`🔄 **${role.name}** rolü geri oluşturuldu!`);
        }
      }
    }
  }
};