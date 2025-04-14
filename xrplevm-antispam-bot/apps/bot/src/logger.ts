// apps/bot/src/logger.ts

import { Client, TextChannel, DMChannel, NewsChannel } from "discord.js";
import { getConfig } from "./features/spam-detection/config";

/**
 * Sends a log message to the designated admin log channel.
 * @param client The Discord client.
 * @param logMessage The message to send.
 */
export async function sendAdminLog(client: Client, logMessage: string): Promise<void> {
  const config = getConfig();
  const adminChannelId = config.adminLogChannelId;
  if (!adminChannelId) return; // If no admin channel is configured, do nothing.
  
  try {
    const channel = await client.channels.fetch(adminChannelId);
    // Check if the channel is text-based and has a "send" method.
    if (channel && (channel instanceof TextChannel || channel instanceof DMChannel || channel instanceof NewsChannel)) {
        await channel.send(logMessage);
    } else {
        console.error("The fetched channel cannot send messages or is not a text-based channel.");
    }
  } catch (error) {
    console.error("Error sending admin log:", error);
  }
}
