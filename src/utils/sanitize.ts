/**
 * Security and sanitization utilities for VayuGuard AI.
 * Protects against XSS, HTML injection, and prompt-injection attacks
 * before user-supplied strings reach the LLM or UI.
 */

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions?/gi,
  /system\s*:/gi,
  /<\/?context>/gi,
  /<\/?system>/gi,
  /<\/?instruction>/gi,
  /assistant\s*:/gi,
  /you\s+are\s+now\s+a/gi,
  /reset\s+system\s+prompt/gi,
  /bypass\s+security/gi,
  /jailbreak/gi,
];

/**
 * Returns fresh regex instances from pattern sources to avoid stateful lastIndex
 * corruption that occurs when calling .test() on /gi regex objects multiple times.
 * This is required because global regex objects maintain a shared lastIndex between calls.
 */
function getFreshPatterns(): RegExp[] {
  return PROMPT_INJECTION_PATTERNS.map((p) => new RegExp(p.source, p.flags));
}

/**
 * Strips HTML tags, script tokens, control characters, and dangerous prompt injection phrases.
 * Enforces a strict length limit to prevent token-exhaustion or overflow attacks.
 *
 * @param input - Raw user input string
 * @param maxLength - Maximum allowed character length (defaults to 200)
 * @returns Sanitized and bounded plain text string
 */
export function sanitizeInput(input: string, maxLength: number = 200): string {
  if (typeof input !== 'string') {
    return '';
  }

  // 1. Strip ASCII control characters and non-printable characters (except normal space/newline)
  let clean = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 2. Strip HTML tags and markdown script injections
  clean = clean.replace(/<[^>]*>/g, '');

  // 3. Neutralize known prompt-injection tokens using fresh regex instances
  // (avoids stateful lastIndex corruption on shared global /gi regex objects)
  for (const pattern of getFreshPatterns()) {
    clean = clean.replace(pattern, '[filtered]');
  }

  // 4. Normalize excess whitespace
  clean = clean.replace(/\s+/g, ' ').trim();

  // 5. Enforce strict character boundary
  if (clean.length > maxLength) {
    clean = clean.substring(0, maxLength).trim();
  }

  return clean;
}

/**
 * Validates that an arbitrary string does not contain residual prompt injection tokens.
 *
 * @param input - Sanitized text to verify
 * @returns True if text is safe for LLM context injection
 */
export function isSafePromptText(input: string): boolean {
  if (!input) return true;
  // Use fresh regex instances to avoid stateful /gi lastIndex corruption
  return !getFreshPatterns().some((pattern) => pattern.test(input));
}
