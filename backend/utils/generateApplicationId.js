import crypto from 'crypto';

/**
 * Server-side Unique Application ID Generator
 * Format: CSC-YYYY-XXXXXX (e.g., CSC-2026-894215)
 */
export const generateApplicationId = () => {
  const currentYear = new Date().getFullYear();
  // Generate 6-digit random number using secure random bytes
  const randomNum = Math.floor(100000 + crypto.randomInt(900000));
  return `CSC-${currentYear}-${randomNum}`;
};

export default generateApplicationId;
