// apps/bot/src/purgeHistory.ts

import { Client, TextChannel, NewsChannel, ThreadChannel, GuildBasedChannel } from 'discord.js';
import { createBotClient } from './bot.factory';
import { isSpamMessage } from './features/spam-detection/detector.service';
import { config as dotenvConfig } from 'dotenv';
import { getConfig } from './features/spam-detection/config';

dotenvConfig();

const client: Client = createBotClient();

client.once('ready', async () => {
  console.log(`Bot is ready. Starting purge of spam messages...`);

  const config = getConfig();

  // Iterate through each guild the bot is in.
  for (const guild of client.guilds.cache.values()) {
    console.log(`Processing guild: ${guild.name} (${guild.id})`);

    // Get all text-based channels.
    const channels = guild.channels.cache.filter(
      (channel: GuildBasedChannel) =>
        channel instanceof TextChannel ||
        channel instanceof NewsChannel ||
        channel instanceof ThreadChannel
    ) as Map<string, TextChannel | NewsChannel | ThreadChannel>;

    for (const channel of channels.values()) {
      // Skip channels that are explicitly ignored.
      if (config.ignoredChannels.includes(channel.id)) {
        console.log(`Skipping ignored channel: ${channel.id}`);
        continue;
      }

      // Skip channels that belong to an ignored category.
      if (channel.parent && config.ignoredCategories.includes(channel.parent.id)) {
        console.log(
          `Skipping channel ${channel.name} (ID: ${channel.id}) because its category ${channel.parent.name} (ID: ${channel.parent.id}) is ignored.`
        );
        continue;
      }

      console.log(`Processing channel: ${channel.name} (${channel.id})`);

      let lastId: string | undefined = undefined;
      let totalFetched = 0;
      let spamDeleted = 0;

      // Paginate through channel messages in batches.
      while (true) {
        try {
          const fetchOptions: { limit: number; before?: string } = { limit: 100 };
          if (lastId) fetchOptions.before = lastId;
          const messages = await channel.messages.fetch(fetchOptions);

          if (messages.size === 0) break;
          totalFetched += messages.size;

          for (const message of messages.values()) {
            // Skip messages from bots.
            if (message.author.bot) continue;
            // Delete message if it qualifies as spam.
            if (isSpamMessage(message)) {
              try {
                await message.delete();
                spamDeleted++;
                console.log(
                  `Deleted spam message [${message.id}] from ${message.author.tag} in ${channel.name}`
                );
              } catch (error) {
                console.error(`Error deleting message [${message.id}] in channel ${channel.id}:`, error);
              }
            }
          }
          lastId = messages.last()?.id;
        } catch (err) {
          console.error(`Error fetching messages from channel ${channel.id}:`, err);
          break;
        }
      }

      console.log(
        `Finished channel ${channel.name}: Fetched ${totalFetched} messages, deleted ${spamDeleted} spam messages.`
      );
    }
  }

  console.log('Purge complete. Exiting.');
  process.exit(0);
});

client.login(process.env.TOKEN);
