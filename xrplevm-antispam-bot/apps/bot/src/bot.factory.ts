// apps/bot/src/bot.factory.ts

import { Client, GatewayIntentBits } from 'discord.js';

export function createBotClient(): Client {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent, // Needed to access the content of the messages.
    ],
  });

  client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  return client;
}
