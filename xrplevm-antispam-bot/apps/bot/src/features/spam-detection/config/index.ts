// apps/bot/src/config/index.ts

export function getConfig() {
  const restrictedRoleId = process.env.RESTRICTED_ROLE_ID;
  if (!restrictedRoleId) {
    throw new Error("RESTRICTED_ROLE_ID is not defined in your environment variables!");
  }

  return {
    // List of keywords considered spam.
    spamKeywords: ["hi", "gm", "hello", "xrpl"],
    
    // List of channel IDs to ignore in spam detection.
    // intros, general, faucet
    ignoredChannels: [
      "1144272382501081098",
      "1143643231930810462",
      "1352703976050528327"
    ],

    // List of category IDs to ignore.
    // Channels that belong to any of these categories will be skipped.
    ignoredCategories: [
      // Add your ignored category IDs here. For example:
      "1146153580085121165"
    ],
    
    
    // The ID of the restricted role to assign when a member sends too many spam messages.
    restrictedRoleId: restrictedRoleId,
    
    // Optionally, add configuration for channels the restricted role can access.
    restrictedChannels: {
      read: [
        // List allowed channel IDs for reading.
      ],
      write: [
        // List allowed channel IDs for writing (usually a subset, e.g., 3 channels).
      ],
    },
  };
}
