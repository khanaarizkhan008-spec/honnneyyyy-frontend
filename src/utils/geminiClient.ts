import type { CheckResult, InputMode, RescueSituation } from '../types';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function clearAllStoredData(): void {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export async function checkMessageWithBestie(
  content: string,
  mode: InputMode
): Promise<CheckResult> {
  const trimmed = content.trim();

  try {
    const response = await fetch(`${API_BASE}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: trimmed, mode }),
    });

    if (!response.ok) {
      return runLocalHeuristicCheck(trimmed, mode);
    }

    const parsed = (await response.json()) as CheckResult;
    if (
      typeof parsed.sweetener_score !== 'number' ||
      !parsed.verdict_headline ||
      !Array.isArray(parsed.sugared_vs_raw)
    ) {
      return runLocalHeuristicCheck(trimmed, mode);
    }

    return parsed;
  } catch {
    return runLocalHeuristicCheck(trimmed, mode);
  }
}

export async function askBestieReply(
  situation: RescueSituation,
  question: string
): Promise<string> {
  const cleanQ = question.trim();
  if (!cleanQ) return '';

  try {
    const response = await fetch(`${API_BASE}/api/rescue-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ situation, question: cleanQ }),
    });

    if (!response.ok) {
      return getLocalRescueReply(situation, cleanQ);
    }

    const data = (await response.json()) as { reply?: string };
    return data.reply?.trim() || getLocalRescueReply(situation, cleanQ);
  } catch {
    return getLocalRescueReply(situation, cleanQ);
  }
}

function getLocalRescueReply(situation: RescueSituation, question: string): string {
  const lower = question.toLowerCase();
  if (situation === 'photos' || lower.includes('threat') || lower.includes('delete')) {
    return `Don't argue, don't pay, and don't beg—that only feeds their leverage. Screenshot their profile and threats first, then go completely silent and block them while we lock your socials to private.`;
  }
  if (situation === 'money' || lower.includes('bank') || lower.includes('upi')) {
    return `Skip replying to them right now—every minute counts for your bank. Screenshot the chat and transaction ID, call 1930, and tell your bank's fraud desk it was an unauthorized social-engineering transfer.`;
  }
  return `Try something breezy that buys you space without tipping them off: "Hey, my phone's acting weird and I'm swamped with family stuff tonight—let's catch up later." Then mute, screenshot, and block when you're ready.`;
}

export function runLocalHeuristicCheck(content: string, mode: InputMode): CheckResult {
  const lower = content.toLowerCase();

  const patterns = [
    {
      regex: /(telegram|whatsapp|signal|snap|off this app|move off|priv\d*|@\w+)/i,
      points: 24,
      tactic: 'Platform Isolation',
      margin: 'Moving you off the dating app erases safety logs and makes reporting harder.',
      sweet: 'Let’s move somewhere more private so we can talk properly.',
      raw: 'I want to get you off the monitored app before you notice my red flags.',
    },
    {
      regex: /(soulmate|dream person|never felt|connection like this|fate|destiny|love you|marry)/i,
      points: 22,
      tactic: 'Love-Bombing Rush',
      margin: 'Intense soulmate talk after hours or days is a textbook hook to lower your guard.',
      sweet: "I've never felt a connection like this—you're literally my dream person.",
      raw: 'If I flood you with affection fast enough, you’ll stop asking normal questions.',
    },
    {
      regex: /(keep us secret|don't tell|dont tell|jealous|just between us)/i,
      points: 20,
      tactic: 'Secrecy Conditioning',
      margin: 'Healthy people never ask you to hide them from your friends.',
      sweet: 'Just keep us between us for now—people get jealous.',
      raw: 'Do NOT show these messages to your friends because they will spot the scam.',
    },
    {
      regex: /(crypto|usdt|binance|trading|arbitrage|liquidity|forex|profit|18%|guaranteed|invest|vip\.co|\.xyz|\.top)/i,
      points: 34,
      tactic: 'Fake Wealth / Trading Hook',
      margin: 'Classic "pig-butchering" setup: flexing easy returns and steering you to a fake site.',
      sweet: 'My uncle taught me a quiet trick—I can show you tonight.',
      raw: 'I’m about to send you to a rigged trading dashboard that steals your deposit.',
    },
    {
      regex: /(wrong number|assistant|elena|fate wanted)/i,
      points: 20,
      tactic: 'Accidental Opener',
      margin: '"Wrong number, you seem so kind" is one of the most scripted openers on the internet.',
      sweet: 'Oops, wrong number! You seem so kind though.',
      raw: 'I blasted this exact "accidental" opener to 500 numbers this morning.',
    },
    {
      regex: /(private photo|nude|video call|turn on your camera|30 seconds|if you trust me|already have your insta|expose|leak)/i,
      points: 38,
      tactic: 'Intimate Pressure / Leverage',
      margin: 'Testing your boundaries with guilt ("if you trust me") or subtle threats is a major sextortion red flag.',
      sweet: 'Send one quick photo so I know you actually trust me.',
      raw: 'Give me compromising material I can use to blackmail you in five minutes.',
    },
    {
      regex: /(upi|gift card|steam card|wire|urgent|hospital|customs|stuck at|flight ticket|pay)/i,
      points: 34,
      tactic: 'Urgent Money Pull',
      margin: 'Manufactured emergencies are designed to make you send money before thinking.',
      sweet: 'I just need a small favor right now, I’ll pay you right back.',
      raw: 'Once you send this transfer, I’m vanishing or asking for double.',
    },
  ];

  let score = mode === 'link' ? 18 : 10;
  const flagged_phrases: CheckResult['flagged_phrases'] = [];
  const sugared_vs_raw: CheckResult['sugared_vs_raw'] = [];

  for (const rule of patterns) {
    const match = content.match(rule.regex);
    if (match) {
      score += rule.points;
      flagged_phrases.push({
        quote: match[0],
        tactic: rule.tactic,
        margin_note: rule.margin,
      });
      sugared_vs_raw.push({
        sweet_line: rule.sweet,
        hidden_meaning: rule.raw,
      });
    }
  }

  if (mode === 'link' || /https?:\/\/\S+/i.test(lower)) {
    const urlMatch = content.match(/https?:\/\/\S+/i);
    const hasSketchyTld = /(\.xyz|\.top|\.vip|\.club|\.co\/trade|bit\.ly|tinyurl)/i.test(lower);
    if (hasSketchyTld) {
      score += 28;
      flagged_phrases.push({
        quote: urlMatch ? urlMatch[0] : 'Suspicious short/trading link',
        tactic: 'Unverified Off-Platform Link',
        margin_note: 'Freshly minted domains and shorteners hide fake login or wallet-drain pages.',
      });
    }
  }

  score = Math.max(8, Math.min(97, score));

  const risk_level: CheckResult['risk_level'] =
    score >= 65 ? 'high' : score >= 35 ? 'medium' : 'low';

  if (flagged_phrases.length === 0) {
    flagged_phrases.push({
      quote: content.slice(0, 64) + (content.length > 64 ? '...' : ''),
      tactic: 'Nothing Obviously Scripted Yet',
      margin_note: 'No classic scam triggers popped up here, though always trust your gut if they rush money or secrecy.',
    });
  }

  if (sugared_vs_raw.length === 0) {
    sugared_vs_raw.push({
      sweet_line: content.slice(0, 90) + (content.length > 90 ? '...' : ''),
      hidden_meaning:
        risk_level === 'low'
          ? 'Reads fairly normal on the surface—just keep your boundaries firm if they suddenly ask for money, links, or private pics.'
          : 'Notice how fast they’re pushing intimacy or urgency before you actually know them.',
    });
  }

  const verdict_headline =
    risk_level === 'high'
      ? 'Pure artificial sweetener, bestie.'
      : risk_level === 'medium'
        ? 'A little too sugary—stay sharp.'
        : 'Looks calm so far, keep your standards high.';

  const costar_roast =
    risk_level === 'high'
      ? "He doesn't want your heart, bestie—he wants your Telegram and your UPI."
      : risk_level === 'medium'
        ? 'Cute opener, questionable agenda. Keep your wallet and camera off.'
        : 'No major red flags yet, just don’t let charm rush your boundaries.';

  const bestie_note =
    risk_level === 'high'
      ? "I'm so glad you showed me this before going any further. Every line here follows a rehearsed honey-trap script—fast flattery, isolation, or pressure. You're not crazy for feeling weird about it; your instincts were dead on."
      : risk_level === 'medium'
        ? "There are a couple of yellow flags here that feel a little rehearsed. You don't have to ghost immediately if you're unsure, just don't move off-app, don't click their links, and don't send anything private."
        : "This looks pretty normal right now, and you're smart for double-checking anyway. Keep things on the original app until you've actually verified they're real.";

  return {
    sweetener_score: score,
    verdict_headline,
    costar_roast,
    bestie_note,
    flagged_phrases: flagged_phrases.slice(0, 4),
    sugared_vs_raw: sugared_vs_raw.slice(0, 3),
    risk_level,
    source: 'local',
  };
}
