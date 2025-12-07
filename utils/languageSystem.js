const fs = require('fs');
const path = require('path');

class LanguageSystem {
  constructor() {
    this.languageFile = path.join(__dirname, '../language.json');
    this.languages = {
      'en': {
        'bot_name': 'Protection Bot',
        'commands': {
          'ping': 'Shows bot ping',
          'help': 'Shows bot commands',
          'ban': 'Bans a user from server',
          'kick': 'Kicks a user from server',
          'warn': 'Warns a user',
          'warnings': 'Shows user warnings',
          'clear_warnings': 'Clears all user warnings',
          'log_channel': 'Sets log channel',
          'counter': 'Sets member counter',
          'auto_role': 'Sets auto role system',
          'server_info': 'Shows server information',
          'user_info': 'Shows user information',
          'language': 'Changes bot language'
        },
        'messages': {
          'user_not_found': '❌ User not found!',
          'operation_failed': '❌ Operation failed!',
          'ban_success': '✅ {user} has been banned!\n**Reason:** {reason}',
          'kick_success': '✅ {user} has been kicked!\n**Reason:** {reason}',
          'warn_success': '⚠️ {user} has been warned!',
          'no_warnings': '✅ {user} has no warnings!',
          'warnings_cleared': '✅ {count} warnings of {user} have been cleared!',
          'log_channel_set': '✅ Log channel set as **{channel}**!',
          'counter_set': '✅ Counter set as **{channel}**!',
          'auto_role_set': '✅ Auto role set as **{role}**!',
          'spam_detected': '⚠️ {user}, stop spamming!',
          'caps_detected': '⚠️ {user}, please don\'t use excessive caps!',
          'link_detected': '⚠️ {user}, links are not allowed!',
          'word_detected': '⚠️ {user}, please don\'t use forbidden words!',
          'long_message': '⚠️ {user}, please don\'t send long messages!',
          'language_changed': '✅ Language changed to **{language}**!',
          'auto_kick': '🚨 {user} has been automatically kicked for reaching 3 warnings!'
        },
        'embeds': {
          'help_title': '🤖 Protection Bot Commands',
          'moderation': '🛡️ **Moderation Commands**',
          'settings': '⚙️ **Settings Commands**',
          'info': '📊 **Information Commands**',
          'features': '🛡️ **Automatic Protection Features**',
          'server_info': '📊 Server Information',
          'user_info': '👤 User Information',
          'warning_notification': '⚠️ Warning Notification',
          'new_warning': '⚠️ New Warning',
          'spam_detection': '⚠️ Spam Detected',
          'caps_detection': '⚠️ Excessive Caps Detected',
          'link_detection': '🔗 Link Detected',
          'word_detection': '🚫 Forbidden Word Detected',
          'role_deleted': '🛡️ Role Deleted - Protection Active',
          'channel_deleted': '🛡️ Channel Deleted - Protection Active',
          'welcome': '👋 Welcome!',
          'goodbye': '👋 Goodbye!',
          'counter_updated': '📊 Member Counter Updated'
        }
      },
      'tr': {
        'bot_name': 'Koruma Botu',
        'commands': {
          'ping': 'Botun ping değerini gösterir',
          'help': 'Botun komutlarını gösterir',
          'ban': 'Kullanıcıyı sunucudan banlar',
          'kick': 'Kullanıcıyı sunucudan atar',
          'warn': 'Kullanıcıya uyarı verir',
          'warnings': 'Kullanıcının uyarılarını gösterir',
          'clear_warnings': 'Kullanıcının tüm uyarılarını siler',
          'log_channel': 'Log kanalını ayarlar',
          'counter': 'Üye sayacını ayarlar',
          'auto_role': 'Otomatik rol sistemini ayarlar',
          'server_info': 'Sunucu hakkında bilgi verir',
          'user_info': 'Kullanıcı hakkında bilgi verir',
          'language': 'Bot dilini değiştirir'
        },
        'messages': {
          'user_not_found': '❌ Kullanıcı bulunamadı!',
          'operation_failed': '❌ İşlem başarısız!',
          'ban_success': '✅ {user} başarıyla banlandı!\n**Sebep:** {reason}',
          'kick_success': '✅ {user} başarıyla atıldı!\n**Sebep:** {reason}',
          'warn_success': '⚠️ {user} kullanıcısı uyarıldı!',
          'no_warnings': '✅ {user} kullanıcısının uyarısı yok!',
          'warnings_cleared': '✅ {user} kullanıcısının {count} uyarısı silindi!',
          'log_channel_set': '✅ Log kanalı olarak **{channel}** ayarlandı!',
          'counter_set': '✅ Sayaç olarak **{channel}** ayarlandı!',
          'auto_role_set': '✅ Otomatik rol olarak **{role}** ayarlandı!',
          'spam_detected': '⚠️ {user}, spam atma!',
          'caps_detected': '⚠️ {user}, lütfen büyük harf kullanmayın!',
          'link_detected': '⚠️ {user}, link atmak yasak!',
          'word_detected': '⚠️ {user}, lütfen küfür/hakaret etmeyin!',
          'long_message': '⚠️ {user}, çok uzun mesaj atma!',
          'language_changed': '✅ Dil **{language}** olarak değiştirildi!',
          'auto_kick': '🚨 {user} kullanıcısı 3 uyarıya ulaştığı için otomatik olarak atıldı!'
        },
        'embeds': {
          'help_title': '🤖 Koruma Botu Komutları',
          'moderation': '🛡️ **Moderasyon Komutları**',
          'settings': '⚙️ **Ayar Komutları**',
          'info': '📊 **Bilgi Komutları**',
          'features': '🛡️ **Otomatik Koruma Özellikleri**',
          'server_info': '📊 Sunucu Bilgileri',
          'user_info': '👤 Kullanıcı Bilgileri',
          'warning_notification': '⚠️ Uyarı Bildirimi',
          'new_warning': '⚠️ Yeni Uyarı',
          'spam_detection': '⚠️ Spam Tespiti',
          'caps_detection': '⚠️ Büyük Harf Tespiti',
          'link_detection': '🔗 Link Tespiti',
          'word_detection': '🚫 Yasaklı Kelime Tespiti',
          'role_deleted': '🛡️ Rol Silindi - Koruma Aktif',
          'channel_deleted': '🛡️ Kanal Silindi - Koruma Aktif',
          'welcome': '👋 Hoş Geldin!',
          'goodbye': '👋 Görüşürüz!',
          'counter_updated': '📊 Üye Sayacı Güncellendi'
        }
      }
    };
    this.defaultLanguage = 'en';
    this.guildLanguages = this.loadLanguages();
  }

  loadLanguages() {
    try {
      if (fs.existsSync(this.languageFile)) {
        return JSON.parse(fs.readFileSync(this.languageFile, 'utf8'));
      }
    } catch (error) {
      console.error('Language file loading error:', error);
    }
    return {};
  }

  saveLanguages() {
    try {
      fs.writeFileSync(this.languageFile, JSON.stringify(this.guildLanguages, null, 2));
    } catch (error) {
      console.error('Language file saving error:', error);
    }
  }

  setLanguage(guildId, language) {
    if (!this.languages[language]) {
      return false;
    }
    this.guildLanguages[guildId] = language;
    this.saveLanguages();
    return true;
  }

  getLanguage(guildId) {
    return this.guildLanguages[guildId] || this.defaultLanguage;
  }

  getText(guildId, key, placeholders = {}) {
    const language = this.getLanguage(guildId);
    const langData = this.languages[language];
    
    let text = this.getNestedValue(langData, key);
    if (!text) {
      // Fallback to English
      const englishData = this.languages['en'];
      text = this.getNestedValue(englishData, key) || key;
    }

    // Replace placeholders
    for (const [placeholder, value] of Object.entries(placeholders)) {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }

    return text;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  getAvailableLanguages() {
    return Object.keys(this.languages).map(code => ({
      code,
      name: this.languages[code].bot_name
    }));
  }
}

module.exports = LanguageSystem;