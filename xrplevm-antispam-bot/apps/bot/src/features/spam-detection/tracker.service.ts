// apps/bot/src/features/spam-detection/tracker.service.ts

import { GuildMember } from 'discord.js';
import { getConfig } from '../../../src/features/spam-detection/config';
import { assignRestrictedRole } from '../role-manager/role-manager';

// In-memory map to track spam message counts by member ID.
const spamCounts: Map<string, number> = new Map();

// Spam threshold before restricted role is applied.
const SPAM_THRESHOLD = 3;

/**
 * Increments the spam count for a given guild member.
 * @param member - The guild member sending a potential spam message.
 * @returns The new spam count for the member.
 */
export function incrementSpamCount(member: GuildMember): number {
  const memberId = member.id;
  const currentCount = spamCounts.get(memberId) || 0;
  const newCount = currentCount + 1;
  spamCounts.set(memberId, newCount);
  console.log(`Spam count for ${member.user.tag} is now ${newCount}`);
  return newCount;
}

/**
 * Checks if the member has reached the spam threshold and applies the restricted role if needed.
 * If the threshold is met, it calls the role manager and resets the spam count.
 * @param member - The guild member to check.
 */
export async function checkAndApplyRestriction(member: GuildMember): Promise<void> {
  const count = spamCounts.get(member.id) || 0;
  if (count >= SPAM_THRESHOLD) {
    const config = getConfig();
    // Apply the restricted role using the role manager service.
    try {
      await assignRestrictedRole(member, config.restrictedRoleId);
      console.log(`Restricted role assigned to ${member.user.tag} after ${count} spam messages.`);
      // Optionally reset the count after role assignment.
      spamCounts.set(member.id, 0);
    } catch (error) {
      console.error(`Error applying restricted role for ${member.user.tag}: ${error}`);
    }
  }
}

/**
 * Gets the current spam count for a given member.
 * @param memberId - The Discord ID of the member.
 * @returns The current spam count (0 if not found).
 */
export function getSpamCount(memberId: string): number {
  return spamCounts.get(memberId) || 0;
}

/**
 * Resets the spam count for a given member.
 * @param memberId - The Discord ID of the member.
 */
export function resetSpamCount(memberId: string): void {
  spamCounts.delete(memberId);
}
