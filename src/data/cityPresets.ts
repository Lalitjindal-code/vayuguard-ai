import { AirQualityTelemetry, HourlyForecastPoint } from '../types/airQuality';

export interface CityPreset {
  name: string;
  label: string;
  telemetry: AirQualityTelemetry;
}

/**
 * Creates a localized city preset list from an hourly curve builder,
 * separating static benchmark city telemetry from live API client logic.
 */
export function buildCityPresets(
  createCurve: (basePm25: number) => HourlyForecastPoint[]
): CityPreset[] {
  return [
    {
      name: 'Delhi NCR',
      label: 'Delhi (CPCB 435)',
      telemetry: {
        city: 'Delhi NCR',
        latitude: 28.6139,
        longitude: 77.209,
        aqi: 435,
        pm25: 295,
        pm10: 440,
        severity: 'Severe',
        cpcbCategory: 'Severe',
        dominantPollutant: 'PM2.5',
        inversionRisk: 'High',
        safeVentilationWindow: '1:30 PM - 3:30 PM',
        updatedAt: 'Live Telemetry',
        isSimulated: true,
        hourlyForecast: createCurve(295),
      },
    },
    {
      name: 'Bhopal',
      label: 'Bhopal (CPCB 238)',
      telemetry: {
        city: 'Bhopal',
        latitude: 23.2599,
        longitude: 77.4126,
        aqi: 238,
        pm25: 142,
        pm10: 210,
        severity: 'Poor',
        cpcbCategory: 'Poor',
        dominantPollutant: 'PM2.5',
        inversionRisk: 'Moderate',
        safeVentilationWindow: '12:30 PM - 4:00 PM',
        updatedAt: 'Live Telemetry',
        isSimulated: true,
        hourlyForecast: createCurve(142),
      },
    },
    {
      name: 'Mumbai',
      label: 'Mumbai (CPCB 132)',
      telemetry: {
        city: 'Mumbai',
        latitude: 19.076,
        longitude: 72.8777,
        aqi: 132,
        pm25: 68,
        pm10: 125,
        severity: 'Moderate',
        cpcbCategory: 'Moderate',
        dominantPollutant: 'PM2.5',
        inversionRisk: 'Moderate',
        safeVentilationWindow: '11:00 AM - 4:30 PM',
        updatedAt: 'Live Telemetry',
        isSimulated: true,
        hourlyForecast: createCurve(68),
      },
    },
    {
      name: 'Bengaluru',
      label: 'Bengaluru (CPCB 42)',
      telemetry: {
        city: 'Bengaluru',
        latitude: 12.9716,
        longitude: 77.5946,
        aqi: 42,
        pm25: 14,
        pm10: 38,
        severity: 'Good',
        cpcbCategory: 'Good',
        dominantPollutant: 'PM10',
        inversionRisk: 'Low',
        safeVentilationWindow: '8:00 AM - 6:00 PM',
        updatedAt: 'Live Telemetry',
        isSimulated: true,
        hourlyForecast: createCurve(14),
      },
    },
  ];
}
