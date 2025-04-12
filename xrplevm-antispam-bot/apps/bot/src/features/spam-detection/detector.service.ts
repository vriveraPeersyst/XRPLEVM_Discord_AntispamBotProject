// apps/bot/src/features/spam-detection/detector.service.ts

import { Message, TextChannel, NewsChannel, ThreadChannel } from 'discord.js';
import { getConfig } from './config';

/**
 * Determines if the provided message should be flagged as spam.
 *
 * Rules applied:
 * - Skips if the message channel is in the ignored list.
 * - Normalizes the message (trim + lowercase).
 * - Checks for exact matches with spam keywords, e.g. "hi", "gm", "hello".
 * - Also checks if the message is a single word and is included within the channel's name (case-insensitive).
 */
export function isSpamMessage(message: Message): boolean {
  const config = getConfig();
  console.log(`Checking message: "${message.content}" from channel ${message.channel.id}`);

  if (config.ignoredChannels.includes(message.channel.id)) return false;
  
  const normalizedContent = message.content.trim().toLowerCase();
  console.log(`Normalized content: "${normalizedContent}"`);

  // Check for spam keywords first.
  if (config.spamKeywords.includes(normalizedContent)) {
    console.log(`Matched spam keyword.`);
    return true;
  }

  // Use a type guard to see if the channel has a name property.
  const channel = message.channel;
  if ('name' in channel && typeof channel.name === 'string') {
    console.log(`Checking channel name: "${channel.name}"`);
    
    // Check that the message is only one word.
    if (normalizedContent.indexOf(" ") === -1) {
      // And check if the channel's name (in lowercase) includes the message.
      if (channel.name.toLowerCase().includes(normalizedContent)) {
        console.log(
          `Channel name "${channel.name}" includes message "${normalizedContent}" (single word).`
        );
        return true;
      }
    }
  }
  
  return false;
}
