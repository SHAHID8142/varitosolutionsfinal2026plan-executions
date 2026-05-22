/**
 * @file format-price.ts
 * @description Utility for formatting currency in BDT (Bangladeshi Taka).
 *              Ensures consistent display of the ৳ symbol and comma separators.
 *
 * @example
 * formatPrice(1299) // "৳1,299"
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

/**
 * Formats a number as Bangladeshi Taka (BDT) with the ৳ symbol.
 *
 * @param amount - The number to format
 * @returns A formatted string like "৳1,299"
 */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculates the discount percentage between an original price and a sale price.
 *
 * @param originalPrice - The higher original price
 * @param salePrice - The lower discounted price
 * @returns The percentage discount (e.g., 20 for 20% off)
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
