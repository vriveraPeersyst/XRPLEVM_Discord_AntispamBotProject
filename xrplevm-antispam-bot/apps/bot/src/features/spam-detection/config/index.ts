// apps/bot/src/config/index.ts

export function getConfig() {
  const restrictedRoleId = process.env.RESTRICTED_ROLE_ID;
  if (!restrictedRoleId) {
    throw new Error("RESTRICTED_ROLE_ID is not defined in your environment variables!");
  }

  return {
    // List of keywords considered spam.
    spamKeywords: ["hi", "gm", "hello", "xrpl", "lfg", "gmm", "helo", "halo", "halloe", "hii", "hey", "hay", "hei", "hai", "heloo", "gg", "gn", "yo"],
    
    // List of channel IDs to ignore in spam detection.
    // intros, general, faucet
    ignoredChannels: [
      "1144272382501081098",
      "1143643231930810462",
      "1352703976050528327",
      "1297011356310175796",
      "1144274602902696019",
      "1309228017343795272",
      "1297016037027352586",
      "1340513184490197012",
      "1144280919348350977"
    ],

    // List of category IDs to ignore.
    // Channels that belong to any of these categories will be skipped.
    ignoredCategories: [
      // Add your ignored category IDs here. For example:
      "1146153580085121165"
    ],

    // Admin log channel ID (private channel for admin logs).
    adminLogChannelId: process.env.ADMIN_LOG_CHANNEL_ID || "",
    
    
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
