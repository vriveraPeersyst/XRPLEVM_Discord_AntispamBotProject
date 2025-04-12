// apps/bot/src/features/spam-detection/detector.service.ts

import { Message, TextChannel, NewsChannel, VoiceChannel } from 'discord.js';
import { getConfig } from '../../../src/features/spam-detection/config';

/**
 * Determines if the provided message should be flagged as spam.
 *
 * Rules applied:
 * - Skips if the message channel is in the ignored list.
 * - Normalizes the message (trim + lowercase).
 * - Checks for exact matches with spam keywords, e.g. "hi", "gm", "hello".
 * - Also checks if the message exactly matches the channel's name (case-insensitive).
 */
export function isSpamMessage(message: Message): boolean {
    // Retrieve configuration details for spam keywords and ignored channels.
    const config = getConfig();
  
    // Skip processing for channels in the ignore list.
    if (config.ignoredChannels.includes(message.channel.id as never)) return false;
  
    // Spam keywords as provided in the config.
    const spamKeywords = config.spamKeywords; // e.g., ["hi", "gm", "hello"]
  
    // Normalize the message content.
    const normalizedContent = message.content.trim().toLowerCase();
  
    // Check if the message exactly matches one of the spam keywords.
    if (spamKeywords.includes(normalizedContent)) return true;
  
    // Optionally check if the content is just the channel name.
    const channel = message.channel;
    if (
      channel instanceof TextChannel ||
      channel instanceof NewsChannel ||
      channel instanceof VoiceChannel
    ) {
      // Safely access the 'name' property
      if (normalizedContent === channel.name.toLowerCase()) return true;
    }
  
    // If none of the conditions match, the message is not spam.
    return false;
  }
