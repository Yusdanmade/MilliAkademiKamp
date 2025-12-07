const { Events } = require('discord.js');

module.exports = {
  name: Events.GuildMemberAdd,
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
          title: '👋 Hoş Geldin!',
          description: `**${member.user.tag}** sunucuya katıldı!`,
          color: 0x00AE86,
          thumbnail: { url: member.user.displayAvatarURL() },
          fields: [
            { name: '👤 Kullanıcı ID', value: member.id, inline: true },
            { name: '📅 Katılma Tarihi', value: new Date().toLocaleDateString('tr-TR'), inline: true },
            { name: '🔢 Hesap Yaşı', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
          ],
          timestamp: new Date()
        };

        await logChannel.send({ embeds: [embed] });
      }
    }

    // Otomatik rol verme
    if (config.otoRol) {
      try {
        await member.roles.add(config.otoRol);
        console.log(`${member.user.tag} kullanıcısına otomatik rol verildi.`);
      } catch (error) {
        console.error('Otomatik rol verme hatası:', error);
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
          description: `Sunucuya yeni üye katıldı!`,
          color: 0x00AE86,
          fields: [
            { name: '👥 Mevcut Üye', value: memberCount.toString(), inline: true },
            { name: '🎯 Hedef', value: target.toString(), inline: true },
            { name: '📈 Kalan', value: Math.max(0, target - memberCount).toString(), inline: true }
          ],
          timestamp: new Date()
        };

        await sayaçChannel.send({ embeds: [embed] });
      }
    }
  }
};