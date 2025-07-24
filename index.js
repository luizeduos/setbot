import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Função assíncrona de inicialização
async function loadBot() {
  // Carregar comandos
  const commandsPath = './commands';
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    client.commands.set(command.default.data.name, command.default);
  }

  // Carregar eventos
  const eventsPath = './events';
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = await import(`./events/${file}`);
    event.default(client);
  }

  // Login
  client.login(process.env.TOKEN);
}

loadBot();
