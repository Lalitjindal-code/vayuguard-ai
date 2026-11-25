/**
 * Copies text to the user's clipboard using the async Clipboard API
 * with a synchronous textarea fallback for restricted or legacy browser contexts.
 *
 * @param text - Plain text string to copy
 * @returns Promise resolving to true if copy succeeded, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return copied;
    }

    return false;
  } catch {
    return false;
  }
}
