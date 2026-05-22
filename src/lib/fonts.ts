/**
 * @file fonts.ts
 * @description Google Fonts configuration for the project.
 *              Loads Inter for English and Hind Siliguri for Bangla.
 *              Uses CSS variables for easy integration with Tailwind.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-22
 */

import { Plus_Jakarta_Sans, Hind_Siliguri } from 'next/font/google';

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const hindSiliguri = Hind_Siliguri({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['bengali', 'latin'],
  variable: '--font-hind',
  display: 'swap',
});
