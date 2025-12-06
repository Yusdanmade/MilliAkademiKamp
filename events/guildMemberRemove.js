const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member, client) {
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
          title: '👋 Görüşürüz!',
          description: `**${member.user.tag}** sunucudan ayrıldı!`,
          color: 0xFF0000,
          thumbnail: { url: member.user.displayAvatarURL() },
          fields: [
            { name: '👤 Kullanıcı ID', value: member.id, inline: true },
            { name: '📅 Ayrılma Tarihi', value: new Date().toLocaleDateString('tr-TR'), inline: true },
            { name: '⏰ Sunucuda Kalma Süresi', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true }
          ],
          timestamp: new Date()
        };

        await logChannel.send({ embeds: [embed] });
      }
    }

    if (config.sayaç && config.sayaç.kanal) {
      const sayaçChannel = client.channels.cache.get(config.sayaç.kanal);
      if (sayaçChannel) {
        const memberCount = member.guild.memberCount;
        const target = config.sayaç.hedef;
        
        await sayaçChannel.setName(`👥 Üye: ${memberCount}/${target}`);
        
        const embed = {
          title: '📊 Üye Sayacı Güncellendi',
          description: `Sunucudan üye ayrıldı!`,
          color: 0xFF0000,
          fields: [
            { name: '👥 Mevcut Üye', value: memberCount.toString(), inline: true },
            { name: '🎯 Hedef', value: target.toString(), inline: true },
            { name: '📉 Kalan', value: Math.max(0, target - memberCount).toString(), inline: true }
          ],
          timestamp: new Date()
        };

        await sayaçChannel.send({ embeds: [embed] });
      }
    }
  }
};