export interface LunarParameters {
  beta: number;
  maxBeta: number;
  phi: number;
  sinPhi: number;
}

export interface VisibilityResult {
  angularSep: number;
  isVisible: boolean;
  details: {
    cosBeta: number;
    sinBeta: number;
    ratio: number;
    term1: number;
    term2: number;
    cosResult: number;
  };
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

/**
 * Calculate the age of the moon for a given date
 */
export function calculateMoonAge(date: Date): number {
  const knownNewMoon = new Date(2000, 0, 6, 18, 14);
  const synodicMonth = 29.53058867;
  
  const diff = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const age = diff % synodicMonth;
  return age < 0 ? age + synodicMonth : age;
}

/**
 * Find the approximate new moon date for a given month
 */
export function findNewMoon(date: Date): Date {
  const age = calculateMoonAge(date);
  const daysToNewMoon = age < 15 ? -age : (29.53 - age);
  
  const newMoon = new Date(date);
  newMoon.setDate(newMoon.getDate() + Math.round(daysToNewMoon));
  
  return newMoon;
}

/**
 * Calculate lunar visibility using astronomical formulas
 */
export function calculateVisibility(
  beta: number,
  maxBeta: number,
  phi: number,
  sinPhi: number
): VisibilityResult {
  const betaRad = (beta * Math.PI) / 180;
  const maxBetaRad = (maxBeta * Math.PI) / 180;
  const phiRad = (phi * Math.PI) / 180;

  const cosBeta = Math.cos(betaRad);
  const sinBeta = Math.sin(betaRad);
  const sinMaxBeta = Math.sin(maxBetaRad);

  const ratio = sinBeta / sinMaxBeta;
  const term1 = Math.sqrt(1 - ratio * ratio);
  const term2 = ratio * (sinPhi / Math.cos(phiRad));

  const cosResult = cosBeta * (term1 * Math.cos(phiRad) + term2);
  const angularSep = (Math.acos(cosResult) * 180) / Math.PI;

  const isVisible = angularSep >= 10;

  return {
    angularSep,
    isVisible,
    details: {
      cosBeta,
      sinBeta,
      ratio,
      term1,
      term2,
      cosResult,
    },
  };
}

/**
 * Generate simplified lunar parameters based on date and location
 */
export function generateLunarParameters(
  date: Date,
  location: Location
): LunarParameters {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  // Latitude effect could be used for more precise calculations
  Math.sin((location.lat * Math.PI) / 180);

  const beta = -4.48 + Math.sin((dayOfYear / 365) * 2 * Math.PI) * 2 + (Math.random() * 1 - 0.5);
  const maxBeta = 5.148;
  const phi = 1.22 + Math.sin((dayOfYear / 29.53) * 2 * Math.PI) * 0.5 + (Math.random() * 0.3 - 0.15);
  const sinPhi = Math.sin((phi * Math.PI) / 180);

  return {
    beta,
    maxBeta,
    phi,
    sinPhi,
  };
}

/**
 * Calculate approximate sunset time based on latitude and date
 */
export function calculateSunsetTime(latitude: number, date: Date): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  let sunsetHour = 18;
  sunsetHour += Math.sin((latitude * Math.PI) / 180) * 2;
  const seasonalAdjustment = Math.sin(((dayOfYear - 80) / 365) * 2 * Math.PI) * 0.5;
  sunsetHour += seasonalAdjustment;

  const totalMinutes = Math.round(sunsetHour * 4) * 15;
  const hour = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
