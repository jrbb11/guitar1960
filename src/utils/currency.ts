/**
 * Format a number as Philippine Peso currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as Philippine Peso without symbol
 */
export const formatPrice = (amount: number | null | undefined): string => {
  if (amount == null) return '₱0.00';
  return `₱${amount.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
