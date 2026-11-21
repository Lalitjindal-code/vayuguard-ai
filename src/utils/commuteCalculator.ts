/**
 * Pure mathematical formulas for evaluating head-to-head personal inhalation exposure
 * and vehicular carbon footprint across urban commute modes.
 */

import { CommuteComparisonItem } from '../types/airQuality';

const WORKING_DAYS_PER_MONTH = 24;

/**
 * Calculates comparative daily emissions, monthly fuel/fare cost, and roadside inhalation risk
 * for a user-specified round-trip commute distance (in km).
 *
 * @param roundTripKm - Daily round trip commute distance in kilometers
 * @returns Array of 4 commute modes evaluated head-to-head
 */
export function compareCommuteModes(roundTripKm: number): CommuteComparisonItem[] {
  const distance = Math.max(1, Math.min(roundTripKm, 100));

  return [
    {
      mode: 'solo_car',
      label: 'Solo Petrol/Diesel Car',
      // Approx 165g CO2 / km for average compact sedan/SUV in Indian city stop-go traffic
      dailyCo2Kg: Math.round(((distance * 165) / 1000) * 10) / 10,
      // Approx ₹9.5 per km fuel + maintenance
      monthlyCostInr: Math.round(distance * 9.5 * WORKING_DAYS_PER_MONTH),
      // Cabin air recirculated is moderate (45/100), but creates highest road congestion & tailpipe soot
      pm25ExposureIndex: 45,
      healthAdvice:
        'Always keep AC on internal recirculation. Avoid cracking windows in slow traffic where exhaust enters.',
    },
    {
      mode: 'two_wheeler',
      label: 'Two-Wheeler (Motorcycle / Scooter)',
      // Approx 45g CO2 / km
      dailyCo2Kg: Math.round(((distance * 45) / 1000) * 10) / 10,
      // Approx ₹2.8 per km petrol
      monthlyCostInr: Math.round(distance * 2.8 * WORKING_DAYS_PER_MONTH),
      // Open air breathing directly behind diesel bus & truck exhausts (95/100 exposure!)
      pm25ExposureIndex: 95,
      healthAdvice:
        'Extremely high roadside lung deposition. A certified valve-less N95/FFP2 mask is mandatory to prevent bronchiole inflammation.',
    },
    {
      mode: 'public_transit',
      label: 'Metro Transit + E-Rickshaw',
      // Approx 18g CO2 / passenger-km on electrified mass rapid transit
      dailyCo2Kg: Math.round(((distance * 18) / 1000) * 10) / 10,
      // Metro token + shared e-rickshaw (~₹55/day avg)
      monthlyCostInr: Math.round(Math.min(distance * 3.5, 90) * WORKING_DAYS_PER_MONTH),
      // Air-filtered metro cabins have low PM2.5 (20/100)
      pm25ExposureIndex: 20,
      healthAdvice:
        'Lowest personal inhalation. Filtered air conditioning on underground and elevated lines spares your lungs.',
    },
    {
      mode: 'ev_or_wfh',
      label: 'Electric Vehicle / E-Cycle / WFH',
      // Tailpipe emissions = 0. Grid factor approx 25g CO2/km
      dailyCo2Kg: Math.round(((distance * 25) / 1000) * 10) / 10,
      // EV charging approx ₹1.2 / km
      monthlyCostInr: Math.round(distance * 1.2 * WORKING_DAYS_PER_MONTH),
      // Low exposure (15/100)
      pm25ExposureIndex: 15,
      healthAdvice:
        'Zero direct tailpipe pollution emitted in residential colonies. Ideal sustainable choice for high-smog cities.',
    },
  ];
}
