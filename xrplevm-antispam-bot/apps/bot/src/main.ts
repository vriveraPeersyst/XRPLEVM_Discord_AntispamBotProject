// apps/bot/src/main.ts

import { Client } from 'discord.js';
import { createBotClient } from './bot.factory';
import { isSpamMessage } from './features/spam-detection/detector.service';
import { incrementSpamCount, checkAndApplyRestriction } from './features/spam-detection/tracker.service';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const client: Client = createBotClient();

client.on('messageCreate', async (message) => {
  // Ignore messages from bots.
  if (message.author.bot) return;

  // Ensure the message is from a guild (to access member information).
  if (!message.guild || !message.member) return;

  // Check if the message is considered spam (includes checks for ignored channels).
  if (isSpamMessage(message)) {
    console.log(`Spam message detected from ${message.author.tag}: "${message.content}"`);

    // Immediately increment the spam count for the user.
    incrementSpamCount(message.member);
    
    // Check the spam count and assign a restricted role if necessary.
    await checkAndApplyRestriction(message.member);

    // Schedule deletion of the spam message after a 60-second delay.
    setTimeout(async () => {
      try {
        await message.delete();
        console.log(`Deleted spam message from ${message.author.tag}`);
      } catch (error) {
        console.error(`Error deleting message from ${message.author.tag}: ${error}`);
      }
    }, 60000);
  }
});

// Start the bot by logging in with the token provided in the .env file.
client.login(process.env.TOKEN);
