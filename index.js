const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.on('ready', async () => {
  const commands = client.commands.map(cmd => cmd.data.toJSON());
  
  try {
    await client.application.commands.set(commands);
    console.log('✅ Slash commands loaded!');
  } catch (error) {
    console.error('❌ Command loading error:', error);
  }

  // Status ayarla
  client.user.setActivity('Milli Akademi Kamp', { type: 'PLAYING' });
  console.log('🎮 Status ayarlandı: Milli Akademi Kamp oynuyor');
});

client.login(process.env.DISCORD_TOKEN);