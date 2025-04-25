// apps/bot/src/features/scam-prevention/phishing-link-guard.ts
import { Client, Message } from 'discord.js';
import { sendAdminLog } from '../../logger';

export function registerPhishingLinkGuard(client: Client): void {
  const PHISHING_DOMAIN_REGEX = /https?:\/\/(?:www\.)?xrplevm\.app-supply\.com/;

  const TRIGGER_PHRASES = [
    "claim",
    "claim now",
    "claim your eligibility",
    "faucet",
    "official faucet",
    "airdrop",
    "reward",
    "free tokens",
    "3x tokens",
    "get tokens",
    "token successfully received",
    "successfully sent",
    "multi-chain",
    "connect wallet",
    "wallet to claim",
    "eligibility",
    "transaction",
    "click here",
    "verify wallet",
    "gasless",
    "instant tokens",
    "whitelist",
  ];

  client.on('messageCreate', async (message: Message) => {
    if (message.author.bot) return;
    const content = message.content.toLowerCase();

    const isDomainPhish = PHISHING_DOMAIN_REGEX.test(content);

    let matchCount = 0;
    for (const phrase of TRIGGER_PHRASES) {
      if (content.includes(phrase)) matchCount++;
    }
    // 🔥 Ban if more than 2 trigger phrases (instead of 3)
    const isKeywordPhish = matchCount > 2;

    if (!isDomainPhish && !isKeywordPhish) return;

    try {
      await message.delete();

      if (message.guild && message.member) {
        await message.member.ban({
          deleteMessageDays: 1,
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
      }
    } catch (err) {
      console.error('Error in phishing-link guard:', err);
    }
  });
}
