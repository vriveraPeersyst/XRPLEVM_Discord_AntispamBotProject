// apps/bot/src/features/spam-detection/tracker.service.ts

import { GuildMember } from 'discord.js';
import { getConfig } from '../../../src/features/spam-detection/config';
import { assignRestrictedRole } from '../role-manager/role-manager';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'spamCounts.json');

// In-memory map to track spam message counts by member ID.
let spamCounts: Map<string, number> = new Map();

/**
 * Loads the spam count data from the JSON file.
 */
function loadSpamCounts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data) as Record<string, number>;
      spamCounts = new Map(Object.entries(parsed));
      console.log('Loaded spam counts:', spamCounts);
    }
  } catch (err) {
    console.error('Error loading spam counts:', err);
  }
}

/**
 * Saves the current spam counts into the JSON file.
 */
function saveSpamCounts() {
  try {
    // Convert the Map into a plain object
    const data = JSON.stringify(Object.fromEntries(spamCounts), null, 2);
    fs.writeFileSync(DATA_FILE, data, 'utf-8');
    console.log('Spam counts saved.');
  } catch (err) {
    console.error('Error saving spam counts:', err);
  }
}

// Load persistent spam counts on module initialization.
loadSpamCounts();

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
  saveSpamCounts();
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
    try {
      await assignRestrictedRole(member, config.restrictedRoleId);
      console.log(`Restricted role assigned to ${member.user.tag} after ${count} spam messages.`);
      // Reset the count after role assignment.
      spamCounts.set(member.id, 0);
      saveSpamCounts();
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
  saveSpamCounts();
}
