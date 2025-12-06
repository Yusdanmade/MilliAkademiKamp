const { Events } = require('discord.js');

const userMessages = new Map();

module.exports = {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const userId = message.author.id;
    const now = Date.now();

    // Kullanıcının mesajlarını al
    if (!userMessages.has(userId)) {
      userMessages.set(userId, []);
    }
    
    const messages = userMessages.get(userId);
    messages.push({ message, timestamp: now });

    // 2 saniyeden eski mesajları temizle
    const recentMessages = messages.filter(msg => now - msg.timestamp < 2000);
    userMessages.set(userId, recentMessages);

    // Spam kontrolü (2 saniyede 4+ mesaj)
    if (recentMessages.length >= 4) {
      try {
        // Önce timeout ver
        const member = await message.guild.members.fetch(userId).catch(() => null);
        if (member) {
          await member.timeout(60000, 'Spam yapmaktan dolayı timeout');
        }

        // Sonra mesajları sil
        for (const msgData of recentMessages) {
          await msgData.message.delete().catch(() => {});
        }

        // Son olarak uyarı mesajı gönder
        await message.channel.send(`⚠️ ${message.author}, Spam atma! (1 dakika timeout)`);

        // Log gönder
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
              title: '⚠️ Spam Tespiti',
              description: `**${message.author.tag}** spam yapıyor!`,
              color: 0xFFFF00,
              fields: [
                { name: '👤 Kullanıcı', value: message.author.tag, inline: true },
                { name: '📊 Mesaj Sayısı', value: recentMessages.length.toString(), inline: true },
                { name: '📍 Kanal', value: message.channel.name, inline: true },
                { name: '⏰ Cezası', value: '1 dakika timeout', inline: true }
              ],
              timestamp: new Date()
            };

            await logChannel.send({ embeds: [embed] });
          }
        }

        // Mesajları temizle
        userMessages.set(userId, []);
        
      } catch (error) {
        console.error('Spam engelleme hatası:', error);
      }
    }

    // Büyük harf kontrolü
    if (message.content.length > 10) {
      const upperCaseCount = (message.content.match(/[A-ZÇĞÖŞÜİ]/g) || []).length;
      const totalChars = message.content.replace(/\s/g, '').length;
      const upperCaseRatio = upperCaseCount / totalChars;
      
      if (upperCaseRatio > 0.7) {
        try {
          await message.delete();
          await message.channel.send(`⚠️ ${message.author}, lütfen büyük harf kullanmayın!`);
          
          // Log gönder
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
                title: '⚠️ Büyük Harf Tespiti',
                description: `**${message.author.tag}** çok fazla büyük harf kullandı!`,
                color: 0xFFFF00,
                fields: [
                  { name: '👤 Kullanıcı', value: message.author.tag, inline: true },
                  { name: '📍 Kanal', value: message.channel.name, inline: true },
                  { name: '📊 Büyük Harf Oranı', value: `%${Math.round(upperCaseRatio * 100)}`, inline: true }
                ],
                timestamp: new Date()
              };

              await logChannel.send({ embeds: [embed] });
            }
          }
        } catch (error) {
          console.error('Büyük harf engelleme hatası:', error);
        }
        return;
      }
    }

    // Link kontrolü
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|discord\.gg\/[^\s]+)/gi;
    if (linkRegex.test(message.content)) {
      try {
        await message.delete();
        await message.channel.send(`⚠️ ${message.author}, link atmak yasak!`);
        
        // Log gönder
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
              title: '🔗 Link Tespiti',
              description: `**${message.author.tag}** link attı!`,
              color: 0xFF0000,
              fields: [
                { name: '👤 Kullanıcı', value: message.author.tag, inline: true },
                { name: '📍 Kanal', value: message.channel.name, inline: true },
                { name: '🔗 Link', value: message.content.substring(0, 100) + '...', inline: true }
              ],
              timestamp: new Date()
            };

            await logChannel.send({ embeds: [embed] });
          }
        }
      } catch (error) {
        console.error('Link engelleme hatası:', error);
      }
      return;
    }

    // Yasaklı kelime kontrolü
    const bannedWords = ['küfür', 'hakaret', 'argo', 'salam', 'salak', 'aptal', 'gerizekalı'];
    const containsBannedWord = bannedWords.some(word => 
      message.content.toLowerCase().includes(word)
    );

    if (containsBannedWord) {
      try {
        await message.delete();
        await message.channel.send(`⚠️ ${message.author}, lütfen küfür/hakaret etmeyin!`);
        
        // Log gönder
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
              title: '🚫 Yasaklı Kelime Tespiti',
              description: `**${message.author.tag}** yasaklı kelime kullandı!`,
              color: 0xFF0000,
              fields: [
                { name: '👤 Kullanıcı', value: message.author.tag, inline: true },
                { name: '📍 Kanal', value: message.channel.name, inline: true },
                { name: '💬 Mesaj', value: message.content.substring(0, 100) + '...', inline: true }
              ],
              timestamp: new Date()
            };

            await logChannel.send({ embeds: [embed] });
          }
        }
      } catch (error) {
        console.error('Yasaklı kelime engelleme hatası:', error);
      }
      return;
    }

    // Uzun mesaj kontrolü
    if (message.content.length > 500) {
      try {
        await message.delete();
        await message.channel.send(`⚠️ ${message.author}, çok uzun mesaj atma!`);
      } catch (error) {
        console.error('Uzun mesaj engelleme hatası:', error);
      }
    }
  }
};