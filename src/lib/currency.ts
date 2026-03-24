export type Currency = 'USD' | 'EUR' | 'UZS';

// Approximate rates — in production, fetch from Central Bank API
const rates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  UZS: 12850,
};

export function convertCurrency(amountUSD: number, to: Currency): number {
  return Math.round(amountUSD * rates[to]);
}

export function formatCurrency(amount: number, currency: Currency): string {
  switch (currency) {
    case 'USD':
      return `$${amount.toLocaleString('en-US')}`;
    case 'EUR':
      return `€${amount.toLocaleString('de-DE')}`;
    case 'UZS':
      return `${amount.toLocaleString('uz-UZ')} UZS`;
    default:
      return `$${amount.toLocaleString('en-US')}`;
  }
}

export function getFormattedPrice(amountUSD: number, currency: Currency): string {
  const converted = convertCurrency(amountUSD, currency);
  return formatCurrency(converted, currency);
}
