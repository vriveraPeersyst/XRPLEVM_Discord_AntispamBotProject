# XRPL EVM Antispam Bot

The **XRPL EVM Antispam Bot** is designed to help moderate spam in your XRPL EVM Discord community. It detects spam messages based on specific keywords and channel-name matching rules, tracks spam counts persistently across bot restarts, and automatically assigns a restricted role when the spam threshold is exceeded.

---

## Features

- **Spam Detection:**  
  - Flags messages that match defined keywords (e.g. `"hi"`, `"gm"`, `"hello", "xrpl"`).  
  - Detects single-word messages that appear anywhere in the channel’s name (e.g. detecting `"funding"` in a channel named "💰・funding").

- **Spam Tracking:**  
  - Increments a user's spam count upon every detected spam message.
  - Persists spam counts to `spamCounts.json` so data survives bot restarts.

- **Role Management:**  
  - Automatically assigns a restricted role when a member exceeds 3 spam messages.
  - Ensures the restricted role is only assigned if the user does not already have it.

- **Message Cleanup:**  
  - Deletes spam messages 30 seconds after detection, helping to keep channels clean.

---

## Installation & Setup

### Prerequisites

- **Node.js:** Version 16 or later (LTS recommended).
- **pnpm:** Install via `npm install -g pnpm`.
- **Discord Bot:**  
  - Create a bot via the [Discord Developer Portal](https://discord.com/developers/applications).  
  - Ensure the bot has the **Manage Messages** and **Manage Roles** permissions.  
  - Verify that the bot’s role is above the restricted role in your server’s role hierarchy.

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

   - Copy the example file:

     ```bash
     cp .env.example .env
     ```

   - Edit `.env` and set your Discord bot token and restricted role ID:

     ```dotenv
     TOKEN=your_discord_bot_token_here
     RESTRICTED_ROLE_ID=your_restricted_role_id_here
     ```

---

## Running the Bot

Launch the bot using:

```bash
pnpm run dev:bot
```

The bot logs critical events to the console, such as successful login, spam message detection, spam count increments, role assignments, and deletion of spam messages after a 30-second delay.

---

## Repository Structure

```plaintext
xrplevm-antispam-bot/
├── .env.example                   # Example environment configuration
├── apps
│   └── bot
│       └── src
│           ├── bot.factory.ts     # Discord client factory
│           ├── main.ts            # Entry point & event handling
│           └── features
│               ├── role-manager
│               │   └── role-manager.ts    # Role assignment service
│               └── spam-detection
│                   ├── config
│                   │   └── index.ts       # Configuration (keywords, ignored channels, etc.)
│                   ├── detector.service.ts  # Spam detection logic
│                   └── tracker.service.ts   # Spam tracking & persistent storage
├── package.json                   # Project metadata and dependencies
├── pnpm-workspace.yaml            # pnpm workspace configuration
├── spamCounts.json                # Persistent storage for spam counts
└── tsconfig.json                  # TypeScript configuration
```

*Total: 8 directories, 11 files*

---

## How It Works

1. **Initialization:**  
   - The bot loads environment variables and initializes the Discord client using `bot.factory.ts`.
   - When ready, it logs the bot's tag (e.g., "Logged in as XRPLEVM_Antispam_bot#9445!").

2. **Message Monitoring:**  
   - The bot listens for every message (ignoring bot messages and non-guild messages).
   - Each message is passed to `isSpamMessage` in the detector service:
     - The message is normalized (trimmed and converted to lowercase).
     - It checks for exact spam keyword matches.
     - It further checks if a single-word message is included anywhere in the channel's name.

3. **Spam Tracking & Role Assignment:**  
   - For every detected spam message, the bot increments the user’s spam count.
   - Spam counts are persisted in `spamCounts.json`.
   - When a user's spam count reaches 3, the bot assigns the restricted role (using `assignRestrictedRole`) and resets the count.

4. **Message Cleanup:**  
   - Spam messages are scheduled for deletion after 30 seconds, ensuring channels remain clutter-free.

---

## Contributing

Contributions are welcome! If you have suggestions, feature additions, or bug fixes:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`.
3. Commit your changes and push the branch.
4. Open a pull request explaining your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [discord.js](https://discord.js.org/) – For providing the robust framework used in this project.
- The XRPL and Discord communities – For inspiration and feedback.
- All contributors who help improve the project.