Below is the updated README file for your final version:

---

```markdown
# XRPL EVM Antispam Bot

The XRPL EVM Antispam Bot helps keep our Discord clean by automatically detecting and removing spam messages. It works both in real time (during message creation) and via a historical purge script. Additionally, the bot tracks spam counts persistently and (in real-time operation) assigns a restricted role to repeat offenders.

---

## Features

- **Real-Time Spam Removal:**  
  Monitors new messages and deletes those that:
  - Match common spam keywords (e.g. "hi", "gm", "hello", "xrpl").
  - Are a single word that appears within the channel's name (e.g. sending "funding" in a channel named "💰・funding").

- **Historical Purge:**  
  A separate script scans the message history of all channels (excluding specified channels/categories) and deletes any spam messages.

- **Spam Tracking:**  
  User spam counts are stored persistently in a JSON file (`spamCounts.json`), ensuring counts remain after bot restarts.

- **Role Enforcement:**  
  In real-time operation, if a user accumulates more than 3 spam messages, the bot assigns a restricted role to limit their access.  
  *(Note: The historical purge script only deletes messages and does not assign roles.)*

- **Configurable Ignorance:**  
  The bot ignores certain channels (like General, Intros, and Faucet) and entire categories (e.g. the GLOBAL category) based on the configuration.

---

## Installation & Setup

### Prerequisites

- **Node.js** (v16+ recommended)
- **pnpm** (install via `npm install -g pnpm`)
- **Discord Bot Token & Restricted Role ID:**  
  Create your bot in the [Discord Developer Portal](https://discord.com/developers/applications) and ensure the bot’s role is high enough in the role hierarchy to assign roles.

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/<your_username>/xrplevm-antispam-bot.git
   cd xrplevm-antispam-bot
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install -w
   ```

3. **Environment Configuration:**  
   Duplicate the example environment file and fill in the required values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   ```
   TOKEN=your_discord_bot_token_here
   RESTRICTED_ROLE_ID=your_restricted_role_id_here
   ```

---

## Running the Bot

### Real-Time Operation

Start the bot with:

```bash
pnpm run dev:bot
```

- The bot listens for new messages, checks them using its spam criteria, increments spam counts (persistently stored), and will assign the restricted role if a user crosses the spam threshold.
- Spam messages are scheduled for deletion 30 seconds after detection.

### Historical Purge

To purge spam messages from channel histories (without role assignment), run:

```bash
pnpm ts-node apps/bot/src/purgeHistory.ts
```

This script logs in the bot, iterates through guild channels (ignoring channels/categories as configured), fetches message history, and deletes messages flagged as spam.

---

## Repository Structure

```plaintext
xrplevm-antispam-bot/
├── .env.example                  # Example file for environment variables
├── apps
│   └── bot
│       └── src
│           ├── bot.factory.ts       # Creates the Discord client
│           ├── main.ts              # Real-time message handling and spam filtering
│           ├── purgeHistory.ts      # Script to purge historical spam messages
│           └── features
│               ├── role-manager
│               │   └── role-manager.ts  # Service to assign the restricted role
│               └── spam-detection
│                   ├── config
│                   │   └── index.ts     # Configuration: keywords, ignored channels/categories, etc.
│                   ├── detector.service.ts  # Determines if a message is spam
│                   └── tracker.service.ts   # Tracks spam counts; saves data to spamCounts.json
├── package.json                  # Project metadata and dependencies
├── pnpm-workspace.yaml           # pnpm workspace configuration
└── tsconfig.json                 # TypeScript compiler options
```

*Total: 8 directories, 11 files (plus the generated `spamCounts.json`)*

---

## How It Works

1. **Initialization & Login:**  
   The bot loads environment variables, creates the client via `bot.factory.ts`, and logs in using the token from `.env`.

2. **Real-Time Spam Detection:**  
   - On every new message (ignoring bots and non-guild messages), `detector.service.ts` verifies if the message qualifies as spam by comparing against spam keywords or by checking if a single-word message is part of the channel name.
   - Messages in ignored channels or those within ignored categories are skipped.

3. **Spam Counting & Restricted Role Assignment:**  
   - `tracker.service.ts` increments a user's spam count (persisted in `spamCounts.json`).
   - When the spam threshold (3 messages) is reached, the bot assigns the restricted role to the offending user (if they don't already have it) and resets their spam count.

4. **Historical Purge:**  
   The separate `purgeHistory.ts` script revisits channel histories (excluding ignored channels/categories), deletes all spam messages based on the same criteria, and logs its progress.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`
3. Commit your changes.
4. Push and open a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [discord.js](https://discord.js.org/) for the Discord API framework.
- The XRPL and Discord communities for ongoing inspiration and support.
```

---

Feel free to modify sections as needed. This README provides a clear overview of the project's functionality, configuration, and usage. Enjoy your bot!