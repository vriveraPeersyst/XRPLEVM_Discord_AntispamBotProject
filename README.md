# XRPL EVM Antispam Bot

The **XRPL EVM Antispam Bot** helps keep our Discord server clean by automatically detecting and removing spam messages. It operates in real time and can also purge historical messages. In addition, it tracks spam counts persistently and logs deleted messages to a private admin channel for moderation transparency.

---

## Features

- **Real-Time Spam Detection & Cleanup**  
  - Monitors every new message in guild channels (ignoring bots and configured channels/categories).  
  - Flags messages that match defined spam keywords (e.g., "hi", "gm", "hello", "xrpl") or that are single words found within a channel's name (for example, "funding" in "💰・funding").
  - Increments a persistent spam count for each user.
  - If a user exceeds a threshold (default: 3 spam messages), a restricted role is automatically assigned to limit their access.
  - Schedules the deletion of spam messages 30 seconds after detection.

- **Historical Purge Script**  
  - A separate script scans the message history of all text-based channels (except for those in ignored channels or categories) and deletes spam messages without affecting role assignments.

- **Persistent Spam Tracking**  
  - Spam counts are stored in a JSON file (`spamCounts.json`), ensuring data survives bot restarts.

- **Admin Logging**  
  - When a spam message is deleted, the bot sends a log message (including the sender’s tag, channel name, and message content) to a designated admin-only log channel.
  - This offers transparency and helps moderators review what content was removed.

- **Configurable Ignorance**  
  - Specific channels (like General, Intros, Faucet) and entire categories (e.g., the GLOBAL category) can be excluded from spam detection and purging, as defined in the configuration.

---

## Installation & Setup

### Prerequisites

- **Node.js** (v16 or later)  
- **pnpm** (recommended) – install globally using:  
  ```bash
  npm install -g pnpm
  ```
- A Discord Bot with the following permissions:  
  - **Manage Messages** – to delete spam messages.  
  - **Manage Roles** – to assign the restricted role.  
  - Ensure the bot’s role is positioned above the restricted role in your server’s role hierarchy.

### Clone & Install

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/<your_username>/xrplevm-antispam-bot.git
   cd xrplevm-antispam-bot
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install -w
   ```

3. **Configure Environment Variables:**

   Copy the example file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and fill in:
   ```
   TOKEN=your_discord_bot_token_here
   RESTRICTED_ROLE_ID=your_restricted_role_id_here
   ADMIN_LOG_CHANNEL_ID=your_admin_log_channel_id_here
   ```

---

## Running the Bot

### Real-Time Operation

Start the bot with:

```bash
pnpm run dev:bot
```

- The bot monitors incoming messages in real time.
- It logs detections, increments spam counts, checks for and applies role restrictions, and schedules spam message deletions.
- When a message is deleted, a log message is sent to the designated admin log channel.

### Historical Purge

To run the historical spam purge script:

```bash
pnpm ts-node apps/bot/src/purgeHistory.ts
```

- This script iterates through past messages in all channels (excluding ignored channels/categories) and deletes those flagged as spam.

---

## Deployment with PM2

An example PM2 ecosystem configuration is provided to run the bot continuously. Make sure your environment is set up with pnpm.

**ecosystem.config.js**
```js
module.exports = {
  apps: [
    {
      name: "xrplevm-antispam-bot",
      script: "pnpm",
      args: "run dev:bot",
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
```

Start your bot under PM2 with:

```bash
pm2 start ecosystem.config.js
pm2 save
```

---

## Repository Structure

```plaintext
xrplevm-antispam-bot/
├── .env.example                     # Example environment variables
├── apps
│   └── bot
│       └── src
│           ├── bot.factory.ts       # Creates the Discord client with required intents
│           ├── logger.ts            # Sends logs to the admin-only log channel
│           ├── main.ts              # Real-time spam detection, role management, and deletion
│           ├── purgeHistory.ts      # Historical spam purge script
│           └── features
│               ├── role-manager
│               │   └── role-manager.ts  # Service for assigning the restricted role
│               └── spam-detection
│                   ├── config
│                   │   └── index.ts     # Configuration: spam keywords, ignored channels/categories, etc.
│                   ├── detector.service.ts  # Determines if a message is spam
│                   └── tracker.service.ts   # Tracks and persists spam counts
├── ecosystem.config.js              # PM2 configuration file
├── package.json                     # Project metadata and dependencies
├── pnpm-workspace.yaml              # pnpm workspace configuration
└── tsconfig.json                    # TypeScript configuration
```

*Total: 8 directories, 13 files (plus the generated `spamCounts.json`)*

---

## How It Works

1. **Initialization:**  
   The bot loads environment variables, creates a client via `bot.factory.ts`, and logs in.

2. **Real-Time Spam Detection:**  
   - Incoming messages are passed to `detector.service.ts`, which first skips ignored channels/categories.  
   - It then checks for spam keywords or if a single-word message is a substring of the channel's name.
   
3. **Spam Tracking & Restriction:**  
   - When spam is detected, `tracker.service.ts` increments the user's spam count (persisted to disk).
   - If the threshold is reached, `role-manager.ts` assigns a restricted role, and the spam count resets.
   
4. **Deletion & Admin Logging:**  
   - Spam messages are scheduled for deletion 30 seconds after detection.
   - Upon deletion, `logger.ts` sends a detailed log message (including the sender's tag and channel name) to the configured admin log channel.

5. **Historical Purge:**  
   - The `purgeHistory.ts` script browses past messages in eligible channels, deletes spam messages, and logs deletion events.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a feature branch:  
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes.
4. Push the branch and open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [discord.js](https://discord.js.org/) – For providing the Discord API framework.
- Our community and moderators – For inspiring and testing this solution.
- All contributors who help improve this project.