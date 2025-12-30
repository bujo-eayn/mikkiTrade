/**
 * Format large numbers with K, M, B suffixes
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export function formatNumber(num: number | null | undefined, decimals: number = 1): string {
  // Handle null, undefined, or invalid numbers
  if (num == null || isNaN(num)) {
    return '0';
  }

  if (num < 1000) {
    return num.toString();
  }

  const lookup = [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];

  const item = lookup.find((item) => num >= item.value);

  if (!item) {
    return num.toString();
  }

  const formatted = (num / item.value).toFixed(decimals);

  // Remove trailing zeros after decimal point
  const cleanedNumber = parseFloat(formatted).toString();

  return cleanedNumber + item.symbol;
}

/**
 * Format number with commas (e.g., 1,234,567)
 */
export function formatWithCommas(num: number | null | undefined): string {
  if (num == null || isNaN(num)) {
    return '0';
  }
  return num.toLocaleString();
}

/**
 * Format currency (KES) with M/K notation
 * >= 1M: Shows as "1M", "1.2M", "1.25M" (up to 2 decimals when needed)
 * < 1M: Shows as "900K", "654K" (no decimals for K)
 * @param num - The number to format
 * @returns Formatted string (e.g., "KES 1.25M", "KES 900K")
 */
export function formatCurrency(num: number | null | undefined): string {
  if (num == null || isNaN(num)) {
    return 'KES 0';
  }

  // Handle millions (>= 1,000,000)
  if (num >= 1000000) {
    const millions = num / 1000000;

    // For whole millions (e.g., 1M, 2M)
    if (millions % 1 === 0) {
      return `KES ${millions}M`;
    }

    // For decimals, show up to 2 decimal places but remove trailing zeros
    const formatted = millions.toFixed(2);
    const cleaned = parseFloat(formatted).toString();
    return `KES ${cleaned}M`;
  }

  // Handle thousands (>= 1,000 and < 1,000,000)
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    return `KES ${thousands}K`;
  }

  // Handle smaller numbers (< 1,000)
  return `KES ${num}`;
}

/**
 * Format currency (KES) with commas - legacy format
 * @deprecated Use formatCurrency for M/K notation
 */
export function formatCurrencyWithCommas(num: number | null | undefined): string {
  if (num == null || isNaN(num)) {
    return 'KES 0';
  }
  return `KES ${formatWithCommas(num)}`;
}
