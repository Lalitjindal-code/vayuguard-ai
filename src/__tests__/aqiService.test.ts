import { describe, it, expect } from 'vitest';
import { calculateIndianCpcbAqi, calculateSeverity } from '../services/aqiService';

describe('Official Indian CPCB NAQI Engine (src/services/aqiService.ts)', () => {
  it('calculates CPCB Good tier (0-50) correctly', () => {
    // PM2.5 = 20 µg/m³, PM10 = 30 µg/m³
    const result = calculateIndianCpcbAqi(20, 30);
    expect(result.aqi).toBeLessThanOrEqual(50);
    expect(result.severity).toBe('Good');
    expect(result.cpcbCategory).toBe('Good');
  });

  it('calculates CPCB Satisfactory / Moderate tier correctly', () => {
    // PM2.5 = 55 (Satisfactory)
    const resultSatisfactory = calculateIndianCpcbAqi(55, 70);
    expect(resultSatisfactory.aqi).toBeGreaterThanOrEqual(51);
    expect(resultSatisfactory.aqi).toBeLessThanOrEqual(100);
    expect(resultSatisfactory.cpcbCategory).toBe('Satisfactory');

    // PM2.5 = 85 (Moderate)
    const resultModerate = calculateIndianCpcbAqi(85, 120);
    expect(resultModerate.aqi).toBeGreaterThanOrEqual(101);
    expect(resultModerate.aqi).toBeLessThanOrEqual(200);
    expect(resultModerate.cpcbCategory).toBe('Moderate');
  });

  it('calculates CPCB Poor and Very Poor tiers correctly', () => {
    // PM2.5 = 110 (Poor: 201-300)
    const resultPoor = calculateIndianCpcbAqi(110, 200);
    expect(resultPoor.aqi).toBeGreaterThan(200);
    expect(resultPoor.aqi).toBeLessThanOrEqual(300);
    expect(resultPoor.cpcbCategory).toBe('Poor');

    // PM2.5 = 180 (Very Poor: 301-400)
    const resultVeryPoor = calculateIndianCpcbAqi(180, 250);
    expect(resultVeryPoor.aqi).toBeGreaterThan(300);
    expect(resultVeryPoor.aqi).toBeLessThanOrEqual(400);
    expect(resultVeryPoor.cpcbCategory).toBe('Very Poor');
  });

  it('calculates CPCB Severe Smog tier (401-500+) correctly for winter peaks', () => {
    // PM2.5 = 295 µg/m³ (Delhi winter severe smog)
    const resultSevere = calculateIndianCpcbAqi(295, 440);
    expect(resultSevere.aqi).toBeGreaterThanOrEqual(401);
    expect(resultSevere.severity).toBe('Severe');
    expect(resultSevere.cpcbCategory).toBe('Severe');
    expect(resultSevere.dominantPollutant).toBe('PM2.5');
  });

  it('assigns correct diurnal safe ventilation window based on AQI', () => {
    const severeWindow = calculateSeverity(435);
    expect(severeWindow.severity).toBe('Severe');
    expect(severeWindow.inversionRisk).toBe('High');
    expect(severeWindow.safeVentilationWindow).toContain('1:30 PM');

    const goodWindow = calculateSeverity(42);
    expect(goodWindow.severity).toBe('Good');
    expect(goodWindow.inversionRisk).toBe('Low');
    expect(goodWindow.safeVentilationWindow).toContain('8:00 AM');
  });
});
