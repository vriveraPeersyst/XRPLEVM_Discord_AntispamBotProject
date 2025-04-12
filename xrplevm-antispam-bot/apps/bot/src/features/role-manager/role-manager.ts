// apps/bot/src/features/role-manager/role-manager.service.ts

import { GuildMember } from 'discord.js';

/**
 * Assigns the restricted role to a member.
 * @param member - The guild member to update.
 * @param restrictedRoleId - The ID of the restricted role to be applied.
 */
export async function assignRestrictedRole(
  member: GuildMember,
  restrictedRoleId: string
): Promise<void> {
  // Check if the member already has the restricted role to avoid duplicate work.
  if (member.roles.cache.has(restrictedRoleId)) {
    console.log(`${member.user.tag} already has the restricted role.`);
    return;
  }

  try {
    await member.roles.add(restrictedRoleId);
    console.log(`Assigned restricted role to ${member.user.tag}`);
  } catch (error) {
    console.error(`Failed to assign restricted role to ${member.user.tag}: ${error}`);
  }
}
