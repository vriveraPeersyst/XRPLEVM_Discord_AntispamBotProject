import { Client, Message } from 'discord.js';
import { sendAdminLog } from '../../logger';

// Configuration
const FAUCET_CHANNEL_ID = '1352703976050528327';
const FAUCET_BOT_ID     = '1352122210332053597';

// Regex matching "!faucet {address}" where address starts with 0x or ethm and is a single word
const FAUCET_CMD_REGEX = /^!faucet\s+(0x[0-9a-fA-F]{40}|ethm[0-9a-zA-Z]{8,})$/;

/**
 * Enforces that only the faucet bot or valid !faucet commands appear in the faucet channel.
 */
export function registerFaucetGuard(client: Client): void {
  client.on('messageCreate', async (message: Message) => {
    // Only enforce inside the faucet channel
    if (message.channel.id !== FAUCET_CHANNEL_ID) return;

    // Allow messages sent by the faucet bot itself
    if (message.author.id === FAUCET_BOT_ID) return;

    const content = message.content.trim();

    // Allow only valid !faucet commands
    if (FAUCET_CMD_REGEX.test(content)) {
      return;
    }

    // Otherwise delete the message
    try {
      await message.delete();
      console.log(`Deleted invalid faucet message [${message.id}] from ${message.author.tag}`);

      // Log deletion to admin channel
      const channelName =
        'name' in message.channel && typeof (message.channel as any).name === 'string'
          ? (message.channel as any).name
          : message.channel.id;

      await sendAdminLog(
        client,
        `Deleted invalid faucet message from **${message.author.tag}** in **${channelName}**: "${message.content}"`
      );
    } catch (err) {
      console.error(`Failed to delete or log message [${message.id}]:`, err);
    }
  });
}
