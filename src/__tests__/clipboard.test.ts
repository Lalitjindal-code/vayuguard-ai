import { describe, it, expect, vi, afterEach } from 'vitest';
import { copyToClipboard } from '../utils/clipboard';

describe('Clipboard Utility (src/utils/clipboard.ts)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('copies text using navigator.clipboard.writeText when available', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    const result = await copyToClipboard('VayuGuard RWA Notice');
    expect(result).toBe(true);
    expect(writeTextMock).toHaveBeenCalledWith('VayuGuard RWA Notice');
  });

  it('returns false gracefully if clipboard API throws', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    const result = await copyToClipboard('Test text');
    expect(result).toBe(false);
  });
});
