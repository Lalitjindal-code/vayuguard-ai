/**
 * Mathematical models for DIY Corsi-Rosenthal / Box-fan HEPA Purifiers.
 * Based on ASHRAE 62.2, EPA air cleaner standards, and UC Davis Corsi-Rosenthal experiments.
 */

import { PurifierRoomCalculation } from '../types/airQuality';

const TARGET_ACH = 4.5; // Air Changes per Hour for high winter smog mitigation
const COMMERCIAL_PURIFIER_COST_BASE_INR = 14500;
const DIY_FAN_COST_INR = 1200;
const MERV13_FILTER_UNIT_COST_INR = 750;
const TAPE_AND_SHROUD_INR = 100;

/**
 * Calculates required CADR (Clean Air Delivery Rate in CFM) and DIY bill of materials for any room size.
 * Formula: CADR (CFM) = (Room Volume in cu ft * Desired ACH) / 60
 */
export function calculatePurifierForRoom(
  lengthFt: number,
  widthFt: number,
  heightFt: number = 10
): PurifierRoomCalculation {
  const safeLength = Math.max(6, Math.min(lengthFt, 40));
  const safeWidth = Math.max(6, Math.min(widthFt, 40));
  const safeHeight = Math.max(7, Math.min(heightFt, 15));

  const roomAreaSqFt = Math.round(safeLength * safeWidth);
  const roomVolumeCuFt = Math.round(roomAreaSqFt * safeHeight);

  // CADR in Cubic Feet per Minute
  const requiredCadrCfm = Math.round((roomVolumeCuFt * TARGET_ACH) / 60);

  // Small rooms (< 180 sq ft) need 1 filter on intake. Larger rooms benefit from 2-4 filters (Corsi box).
  const recommendedFilters = roomAreaSqFt > 200 ? 2 : 1;

  const diyCostInr = DIY_FAN_COST_INR + recommendedFilters * MERV13_FILTER_UNIT_COST_INR + TAPE_AND_SHROUD_INR;
  // Scaled commercial equivalent price based on CADR capacity
  const commercialCostInr = Math.round(
    COMMERCIAL_PURIFIER_COST_BASE_INR * (requiredCadrCfm > 200 ? 1.4 : 1.0)
  );

  const savingsInr = commercialCostInr - diyCostInr;

  return {
    lengthFt: safeLength,
    widthFt: safeWidth,
    heightFt: safeHeight,
    roomAreaSqFt,
    roomVolumeCuFt,
    requiredCadrCfm,
    recommendedFilters,
    diyCostInr,
    commercialCostInr,
    savingsInr,
    achRating: TARGET_ACH,
  };
}
