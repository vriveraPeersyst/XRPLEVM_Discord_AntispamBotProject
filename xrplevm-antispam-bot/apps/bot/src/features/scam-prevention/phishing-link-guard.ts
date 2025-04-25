// apps/bot/src/features/scam-prevention/phishing-link-guard.ts
import { Client, Message, PermissionsBitField } from 'discord.js';
import { sendAdminLog } from '../../logger';

export function registerPhishingLinkGuard(client: Client): void {
  const PHISHING_DOMAIN_REGEX = /(?:https?:\/\/)?(?:www\.)?xrplevm\.app\-supply(?:\.com)?/i;
  const TRIGGER_PHRASES = [
    "claim", "claim now", "claim your eligibility",
    "faucet", "official faucet",
    "airdrop", "reward", "free tokens",
    "3x tokens", "get tokens",
    "token successfully received", "successfully sent",
    "multi-chain", "connect wallet",
    "wallet to claim", "eligibility",
    "transaction", "click here",
    "verify wallet", "gasless",
    "instant tokens", "whitelist",
  ];

  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    const content = message.content.toLowerCase();

    const isDomainPhish = PHISHING_DOMAIN_REGEX.test(content);
    let matchCount = 0;
    for (const phrase of TRIGGER_PHRASES) {
      if (content.includes(phrase)) matchCount++;
    }
    const isKeywordPhish = matchCount > 2;

    if (!isDomainPhish && !isKeywordPhish) return;

    // 1) Always delete the message if it's flagged
    try {
      await message.delete();
    } catch (err) {
      console.error('Failed to delete phishing message:', err);
    }

    // 2) Attempt to ban
    if (!message.guild) return;
    const me = message.guild.members.me;
    if (!me) {
      await sendAdminLog(
        client,
        `⚠️ Could not determine bot's guild member in order to ban ${message.author.tag}`
      );
      return;
    }

    // Check bot has BanMembers permission
    if (!me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      await sendAdminLog(
        client,
        `⚠️ Missing Ban Members permission to ban **${message.author.tag}**`
      );
      return;
    }

    // Check target is bannable
    const member = message.member;
    if (!member || !member.bannable) {
      await sendAdminLog(
        client,
        `⚠️ Cannot ban **${message.author.tag}** (role hierarchy or missing permissions on target)`
      );
      return;
    }

    // Perform the ban
    try {
      await member.ban({
        deleteMessageSeconds: 60 * 60 * 24, // delete last 24h
        reason: isDomainPhish
          ? 'Posted phishing/fake-faucet link'
          : `Suspicious faucet-scam content (${matchCount} trigger phrases)`,
      });

      const why = isDomainPhish
        ? 'phishing link'
        : `${matchCount} faucet-scam phrases`;
      await sendAdminLog(
        client,
        `🚫 Banned **${message.author.tag}** for ${why}: \`${message.content}\``
      );
    } catch (err) {
      console.error('Error banning phishing user:', err);
      await sendAdminLog(
        client,
        `⚠️ Failed to ban **${message.author.tag}**: ${String(err)}`
      );
    }
  });
}
