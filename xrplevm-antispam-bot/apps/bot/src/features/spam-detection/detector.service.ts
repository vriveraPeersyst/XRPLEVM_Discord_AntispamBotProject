// apps/bot/src/features/spam-detection/detector.service.ts

import { Message, TextChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { getConfig } from './config';

/**
 * Determines if the provided message should be flagged as spam.
 *
 * Rules applied:
 * - Skips if the message channel is in the ignored list.
 * - Skips if the channel's parent category is in the ignored categories list.
 * - Normalizes the message (trim + lowercase).
 * - Checks for exact matches with spam keywords, e.g. "hi", "gm", "hello".
 * - Also checks if the message is a single word and is included within the channel's name (case-insensitive).
 */
export function isSpamMessage(message: Message): boolean {
  const config = getConfig();
  console.log(`Checking message: "${message.content}" from channel ${message.channel.id}`);

  // Skip if the channel is in the ignored list.
  if (config.ignoredChannels.includes(message.channel.id)) {
    return false;
  }

  // Skip if the channel belongs to an ignored category.
  const channel = message.channel;
  if ('parent' in channel && channel.parent && config.ignoredCategories.includes(channel.parent.id)) {
    console.log(`Channel ${channel.id} belongs to an ignored category (${channel.parent.id}). Skipping spam check.`);
    return false;
  }

  const normalizedContent = message.content.trim().toLowerCase();
  console.log(`Normalized content: "${normalizedContent}"`);

  // Check for spam keywords.
  if (config.spamKeywords.includes(normalizedContent)) {
    console.log(`Matched spam keyword.`);
    return true;
  }

  // Check if the channel has a name property.
  if ('name' in channel && typeof channel.name === 'string') {
    console.log(`Checking channel name: "${channel.name}"`);

    // Proceed only if the message is a single word.
    if (normalizedContent.indexOf(" ") === -1) {
      // Check if the channel's name (in lowercase) includes the message.
      if (channel.name.toLowerCase().includes(normalizedContent)) {
        console.log(`Channel name "${channel.name}" includes message "${normalizedContent}" (single word).`);
        return true;
      }
    }
  }

  return false;
}
