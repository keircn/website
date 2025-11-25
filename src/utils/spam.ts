const SPAM_KEYWORDS = [
  "viagra",
  "cialis",
  "casino",
  "crypto",
  "bitcoin",
  "forex",
  "loan",
  "pills",
];

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const MAX_URLS = 2;

export function containsSpam(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SPAM_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

export function hasTooManyUrls(text: string): boolean {
  const urls = text.match(URL_REGEX);
  return urls ? urls.length > MAX_URLS : false;
}

export function containsSuspiciousPatterns(text: string): boolean {
  const repeatedChars = /(.)\1{10,}/;
  if (repeatedChars.test(text)) return true;

  const allCaps = /^[A-Z\s!?]{20,}$/;
  if (allCaps.test(text)) return true;

  return false;
}

export function validateContent(name: string, message: string): string | null {
  if (containsSpam(name) || containsSpam(message)) {
    return "Your message contains prohibited content";
  }

  if (hasTooManyUrls(message)) {
    return `Maximum ${MAX_URLS} URLs allowed`;
  }

  if (containsSuspiciousPatterns(message)) {
    return "Your message contains suspicious patterns";
  }

  return null;
}
