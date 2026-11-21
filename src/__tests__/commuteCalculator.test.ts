import { describe, it, expect } from 'vitest';
import { compareCommuteModes } from '../utils/commuteCalculator';

describe('Commute Exposure & Emission Evaluator (src/utils/commuteCalculator.ts)', () => {
  it('evaluates all 4 transit modes for a specified distance', () => {
    const results = compareCommuteModes(15);
    expect(results.length).toBe(4);

    const soloCar = results.find((r) => r.mode === 'solo_car')!;
    const twoWheeler = results.find((r) => r.mode === 'two_wheeler')!;
    const transit = results.find((r) => r.mode === 'public_transit')!;
    const ev = results.find((r) => r.mode === 'ev_or_wfh')!;

    // Two-wheeler should have highest exposure index
    expect(twoWheeler.pm25ExposureIndex).toBeGreaterThan(soloCar.pm25ExposureIndex);
    expect(twoWheeler.pm25ExposureIndex).toBeGreaterThan(transit.pm25ExposureIndex);

    // Solo car should emit the highest daily CO2
    expect(soloCar.dailyCo2Kg).toBeGreaterThan(twoWheeler.dailyCo2Kg);
    expect(soloCar.dailyCo2Kg).toBeGreaterThan(transit.dailyCo2Kg);
    expect(soloCar.dailyCo2Kg).toBeGreaterThan(ev.dailyCo2Kg);

    // Metro transit has low inhalation exposure
    expect(transit.pm25ExposureIndex).toBeLessThanOrEqual(25);
  });

  it('bounds distance safely between 1 and 100 km', () => {
    const minResult = compareCommuteModes(0);
    expect(minResult[0].dailyCo2Kg).toBeGreaterThan(0);

    const maxResult = compareCommuteModes(500);
    expect(maxResult[0].dailyCo2Kg).toBe(16.5); // bounded at 100km: 100 * 165g / 1000 = 16.5kg
  });
});
