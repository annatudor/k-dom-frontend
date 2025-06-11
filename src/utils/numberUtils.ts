// src/utils/numberUtils.ts
/**
 * Formatează numerele pentru afișare
 * @param num - Numărul de formatat
 * @returns String formatat (ex: "1.2K", "1.5M")
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formatează numerele mari pentru statistici
 * @param num - Numărul de formatat
 * @returns String formatat cu + (ex: "1.2K+", "500+")
 */
export const formatStatNumber = (num: number): string => {
  return `${formatNumber(num)}${num >= 100 ? "+" : ""}`;
};

/**
 * Formatează procentajele
 * @param value - Valoarea
 * @param total - Totalul
 * @returns String formatat (ex: "75.5%")
 */
export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return "0%";
  return `${((value / total) * 100).toFixed(1)}%`;
};
