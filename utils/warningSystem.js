const fs = require('fs');
const path = require('path');

class WarningSystem {
  constructor() {
    this.warningsFile = path.join(__dirname, '../warnings.json');
    this.warnings = this.loadWarnings();
  }

  loadWarnings() {
    try {
      if (fs.existsSync(this.warningsFile)) {
        return JSON.parse(fs.readFileSync(this.warningsFile, 'utf8'));
      }
    } catch (error) {
      console.error('Uyarılar yüklenemedi:', error);
    }
    return {};
  }

  saveWarnings() {
    try {
      fs.writeFileSync(this.warningsFile, JSON.stringify(this.warnings, null, 2));
    } catch (error) {
      console.error('Uyarılar kaydedilemedi:', error);
    }
  }

  addWarning(userId, guildId, reason, moderatorId) {
    if (!this.warnings[guildId]) {
      this.warnings[guildId] = {};
    }
    if (!this.warnings[guildId][userId]) {
      this.warnings[guildId][userId] = [];
    }

    const warning = {
      id: Date.now(),
      reason,
      moderatorId,
      timestamp: new Date().toISOString()
    };

    this.warnings[guildId][userId].push(warning);
    this.saveWarnings();
    return warning;
  }

  getWarnings(userId, guildId) {
    return this.warnings[guildId]?.[userId] || [];
  }

  clearWarnings(userId, guildId) {
    if (this.warnings[guildId]?.[userId]) {
      delete this.warnings[guildId][userId];
      this.saveWarnings();
      return true;
    }
    return false;
  }

  getWarningCount(userId, guildId) {
    return this.getWarnings(userId, guildId).length;
  }
}

module.exports = WarningSystem;