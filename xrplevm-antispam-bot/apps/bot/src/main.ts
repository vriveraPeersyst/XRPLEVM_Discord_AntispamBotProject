import { Client } from 'discord.js';
import { createBotClient } from './bot.factory';
import { isSpamMessage } from './features/spam-detection/detector.service';
import { incrementSpamCount, checkAndApplyRestriction } from './features/spam-detection/tracker.service';
import { config as dotenvConfig } from 'dotenv';
import { sendAdminLog } from './logger';
import { registerFaucetGuard } from './features/scam-prevention/faucet-guard';

dotenvConfig();

const client: Client = createBotClient();

// Register the faucet-guard before other handlers
registerFaucetGuard(client);

client.on('messageCreate', async (message) => {
  // Ignore messages from bots.
  if (message.author.bot) return;

  // Only process messages from guilds.
  if (!message.guild || !message.member) return;

  // Check if the message is considered spam.
  if (isSpamMessage(message)) {
    console.log(`Spam message detected from ${message.author.tag}: "${message.content}"`);

    // Immediately increment the spam count for the user.
    incrementSpamCount(message.member);

    // Check the spam count and assign a restricted role if necessary.
    await checkAndApplyRestriction(message.member);

    // Schedule deletion of the spam message after a 30-second delay.
    setTimeout(async () => {
      try {
        await message.delete();
        console.log(`Deleted spam message from ${message.author.tag}`);

        // Safely retrieve the channel name if available.
        const channelName =
          'name' in message.channel && typeof message.channel.name === 'string'
            ? message.channel.name
            : 'Unknown Channel';

        // Send deletion log to the admin log channel, including the sender's name.
        await sendAdminLog(
          client,
          `Deleted spam message from **${message.author.tag}** in **${channelName}**: "${message.content}"`
        );
      } catch (error) {
        console.error(`Error deleting message from ${message.author.tag}: ${error}`);
      }
    }, 30000);
  }
});

// Start the bot by logging in with the token provided in the .env file.
client.login(process.env.TOKEN);
