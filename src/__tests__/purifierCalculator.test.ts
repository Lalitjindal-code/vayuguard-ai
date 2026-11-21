import { describe, it, expect } from 'vitest';
import { calculatePurifierForRoom } from '../utils/purifierCalculator';

describe('DIY Purifier CADR Calculator (src/utils/purifierCalculator.ts)', () => {
  it('calculates correct room volume and required CADR', () => {
    // 10 x 12 x 10 room = 1200 cu.ft
    // CADR = 1200 * 4.5 / 60 = 90 CFM
    const result = calculatePurifierForRoom(10, 12, 10);
    expect(result.roomAreaSqFt).toBe(120);
    expect(result.roomVolumeCuFt).toBe(1200);
    expect(result.requiredCadrCfm).toBe(90);
    expect(result.recommendedFilters).toBe(1);
    expect(result.diyCostInr).toBeLessThan(result.commercialCostInr);
    expect(result.savingsInr).toBeGreaterThan(10000);
  });

  it('recommends 2 filters for larger rooms (> 200 sq.ft)', () => {
    // 16 x 16 x 10 = 256 sq.ft
    const result = calculatePurifierForRoom(16, 16, 10);
    expect(result.roomAreaSqFt).toBe(256);
    expect(result.recommendedFilters).toBe(2);
    expect(result.savingsInr).toBeGreaterThan(11000);
  });

  it('bounds room dimensions safely within min and max ranges', () => {
    const tooSmall = calculatePurifierForRoom(2, 2, 3);
    expect(tooSmall.lengthFt).toBe(6);
    expect(tooSmall.widthFt).toBe(6);
    expect(tooSmall.heightFt).toBe(7);

    const tooLarge = calculatePurifierForRoom(100, 100, 50);
    expect(tooLarge.lengthFt).toBe(40);
    expect(tooLarge.widthFt).toBe(40);
    expect(tooLarge.heightFt).toBe(15);
  });
});
