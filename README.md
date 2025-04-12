
# XRPL EVM Antispam Bot

A Discord bot designed to help manage spam in the XRPL EVM Discord community. The bot automatically deletes spam messages (e.g., "hi", "gm", "hello", or messages that simply match the channel name), tracks spam counts per user, and assigns a restricted role once a user exceeds a defined spam threshold.

## Features

- **Spam Message Deletion:**  
  Detects and deletes messages matching configured spam keywords or that match the channel name, after a 60-second delay.

- **Real-Time Antispam:**  
  Monitors all new messages to identify and handle spam promptly.

- **Channel Exclusion:**  
  Ignores spam detection on specified channels (configured via the settings).

- **Spam Tracking & Role Management:**  
  Tracks spam counts per user and assigns a restricted role to users that exceed a pre-defined spam threshold (default: 3 spam messages).

## Repository Structure

```plaintext
xrplevm-antispam-bot/
├── .env.example                # Example environment file with necessary variables
├── apps
│   └── bot
│       └── src
│           ├── bot.factory.ts           # Discord bot client factory
│           ├── main.ts                  # Bot entry point and event handling
│           ├── config/
│           │   └── index.ts             # Configuration settings (spam keywords, ignored channels, etc.)
│           ├── features/
│           │   ├── spam-detection
│           │   │   ├── detector.service.ts  # Spam detection logic
│           │   │   ├── tracker.service.ts   # Spam count tracking logic
│           │   └── role-manager
│           │       └── role-manager.ts      # Role management (assigning restricted role)
│           └── utils/                    # Utility functions (if needed)
│           └── test/                     # Test files for unit tests
├── directory-skeleton.txt      # Directory structure snapshot file
├── package.json                # Package definition and dependencies
├── pnpm-workspace.yaml         # pnpm workspace configuration
└── tsconfig.json               # TypeScript configuration
```

## Getting Started

### Prerequisites

- **Node.js:** Version 16 or later (LTS recommended)  
- **pnpm:** Install globally with `npm install -g pnpm`  
- **Discord Bot:** Create a bot via the [Discord Developer Portal](https://discord.com/developers/applications) and obtain your bot token.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/<your_username>/xrplevm-antispam-bot.git
   cd xrplevm-antispam-bot
   ```

2. **Install Dependencies:**

   Since dependencies are managed at the root level, run:

   ```bash
   pnpm install -w
   ```

3. **Configure Environment Variables:**

   - Copy `.env.example` to `.env`:
     
     ```bash
     cp .env.example .env
     ```

   - Edit the `.env` file to include your Discord bot token and the restricted role ID:

     ```dotenv
     TOKEN=your_discord_bot_token_here
     RESTRICTED_ROLE_ID=your_restricted_role_id_here
     ```

### Running the Bot

Start the bot in development mode with:

```bash
pnpm run dev:bot
```

The bot will log in to Discord using the provided token. It will monitor messages, automatically delete detected spam after a 60-second delay, track user spam counts, and assign a restricted role if a user exceeds the spam threshold.

## Testing

If you add tests, run them (for example, using Jest) with:

```bash
pnpm test
```

## Configuration

All configurable options are centralized in `apps/bot/src/config/index.ts`:
- **spamKeywords:** An array of keywords considered as spam. (Default: `["hi", "gm", "hello"]`)
- **ignoredChannels:** A list of channel IDs where the bot should not perform spam detection.
- **restrictedRoleId:** The role ID to assign to users who exceed the spam threshold.
- **restrictedChannels (Optional):** Further configuration for channels accessible to restricted users.

## Contributing

Contributions are welcome! If you'd like to improve the bot or add features, please:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes.
4. Push your changes and open a pull request.

For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [discord.js](https://discord.js.org/)
- [pnpm](https://pnpm.io/)
- Community inspirations and contributions to anti-spam solutions in Discord communities.