// apps/bot/src/config/index.ts

export function getConfig() {
    return {
      // List of keywords considered spam.
      spamKeywords: ["hi", "gm", "hello"],
      
      // List of channel IDs to ignore in spam detection.
      ignoredChannels: [
        // e.g., "123456789012345678"
      ],
      
      // The ID of the restricted role to assign when a member sends too many spam messages.
      restrictedRoleId: process.env.RESTRICTED_ROLE_ID || "",
      
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
  