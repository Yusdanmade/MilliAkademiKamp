const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Botu başlatan script
function startBot() {
  const botPath = path.join(__dirname, 'index.js');
  
  console.log('🤖 Bot başlatılıyor...');
  
  // Node.js process'i başlat - detached: true ile arka planda çalışır
  const botProcess = spawn('node', [botPath], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false
  });

  // Process'i parent'tan ayır
  botProcess.unref();

  // Çıktıları logla
  botProcess.stdout.on('data', (data) => {
    console.log(`[BOT] ${data.toString().trim()}`);
  });

  botProcess.stderr.on('data', (data) => {
    console.error(`[BOT HATA] ${data.toString().trim()}`);
  });

  // Process durumunu kontrol et
  botProcess.on('close', (code) => {
    console.log(`📝 Bot process kapandı. Kod: ${code}`);
    if (code !== 0) {
      console.log('⚠️ Bot hata ile kapandı, yeniden başlatılıyor...');
      setTimeout(() => startBot(), 5000);
    }
  });

  botProcess.on('error', (error) => {
    console.error('❌ Bot başlatılırken hata:', error);
  });

  console.log(`✅ Bot başlatıldı! PID: ${botProcess.pid}`);
  return botProcess.pid;
}

// Botu durduran script
function stopBot() {
  const { exec } = require('child_process');
  
  exec('tasklist | findstr "node.exe"', (error, stdout, stderr) => {
    if (error || !stdout) {
      console.log('❌ Çalışan bot process bulunamadı.');
      return;
    }

    const lines = stdout.split('\n');
    let found = false;

    lines.forEach(line => {
      if (line.includes('node.exe')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[1];
        
        if (pid && !isNaN(pid)) {
          exec(`taskkill /PID ${pid} /F`, (killError) => {
            if (!killError) {
              console.log(`✅ Bot durduruldu. PID: ${pid}`);
              found = true;
            } else {
              console.log(`❌ PID ${pid} durdurulamadı:`, killError.message);
            }
          });
        }
      }
    });

    if (!found) {
      console.log('❌ Çalışan bot bulunamadı.');
    }
  });
}

// Bot durumunu kontrol et
function checkBot() {
  const { exec } = require('child_process');
  
  exec('tasklist | findstr "node.exe"', (error, stdout, stderr) => {
    if (error || !stdout) {
      console.log('❌ Bot çalışmıyor.');
      return;
    }

    const lines = stdout.split('\n');
    let botCount = 0;

    lines.forEach(line => {
      if (line.includes('node.exe')) {
        botCount++;
      }
    });

    console.log(`📊 ${botCount} adet node process çalışıyor.`);
  });
}

// Komut satırı argümanlarını kontrol et
const command = process.argv[2];

switch (command) {
  case 'start':
    startBot();
    break;
  case 'stop':
    stopBot();
    break;
  case 'restart':
    console.log('🔄 Bot yeniden başlatılıyor...');
    stopBot();
    setTimeout(() => {
      startBot();
    }, 3000);
    break;
  case 'status':
    checkBot();
    break;
  default:
    console.log('🤖 Koruma Bot Controller');
    console.log('');
    console.log('Kullanım:');
    console.log('  node bot-controller.js start    - Botu başlatır');
    console.log('  node bot-controller.js stop     - Botu durdurur');
    console.log('  node bot-controller.js restart  - Botu yeniden başlatır');
    console.log('  node bot-controller.js status   - Bot durumunu kontrol eder');
    console.log('');
    console.log('Örnek:');
    console.log('  node bot-controller.js start');
    break;
}