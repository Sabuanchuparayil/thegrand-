// UK Taxation System - VAT and Tax Compliance

/**
 * UK VAT Rate (Standard Rate)
 * As of 2024, the standard VAT rate in the UK is 20%
 */
export const UK_VAT_RATE = 0.20; // 20%

/**
 * UK VAT Rates by Category
 */
export const UK_VAT_RATES = {
  standard: 0.20, // 20% - Most goods and services
  reduced: 0.05, // 5% - Some energy-saving materials
  zero: 0.00, // 0% - Most food, children's clothes, books
  exempt: null, // Exempt - Insurance, financial services
} as const;

/**
 * Calculate VAT amount
 * @param amount - Amount excluding VAT
 * @param vatRate - VAT rate (default: standard UK rate 20%)
 * @returns VAT amount
 */
export function calculateVAT(amount: number, vatRate: number = UK_VAT_RATE): number {
  return Math.round(amount * vatRate * 100) / 100;
}

/**
 * Calculate amount including VAT
 * @param amountExcludingVAT - Amount excluding VAT
 * @param vatRate - VAT rate (default: standard UK rate 20%)
 * @returns Amount including VAT
 */
export function calculateAmountIncludingVAT(
  amountExcludingVAT: number,
  vatRate: number = UK_VAT_RATE
): number {
  return Math.round((amountExcludingVAT + calculateVAT(amountExcludingVAT, vatRate)) * 100) / 100;
}

/**
 * Extract VAT from amount including VAT
 * @param amountIncludingVAT - Amount including VAT
 * @param vatRate - VAT rate (default: standard UK rate 20%)
 * @returns Object with amount excluding VAT and VAT amount
 */
export function extractVAT(
  amountIncludingVAT: number,
  vatRate: number = UK_VAT_RATE
): { amountExcludingVAT: number; vatAmount: number } {
  const amountExcludingVAT = Math.round((amountIncludingVAT / (1 + vatRate)) * 100) / 100;
  const vatAmount = Math.round((amountIncludingVAT - amountExcludingVAT) * 100) / 100;
  return { amountExcludingVAT, vatAmount };
}

/**
 * Calculate order totals with UK VAT
 * @param subtotal - Subtotal excluding VAT
 * @param shipping - Shipping cost excluding VAT
 * @param vatRate - VAT rate (default: standard UK rate 20%)
 * @returns Order totals breakdown
 */
export function calculateOrderTotalsWithVAT(
  subtotal: number,
  shipping: number = 0,
  vatRate: number = UK_VAT_RATE
): {
  subtotal: number;
  shipping: number;
  vat: number;
  total: number;
  vatRate: number;
} {
  const subtotalVAT = calculateVAT(subtotal, vatRate);
  const shippingVAT = calculateVAT(shipping, vatRate);
  const totalVAT = subtotalVAT + shippingVAT;
  const total = subtotal + shipping + totalVAT;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    vat: Math.round(totalVAT * 100) / 100,
    total: Math.round(total * 100) / 100,
    vatRate,
  };
}

/**
 * Get VAT registration number format
 * UK VAT numbers are 9 digits (GB prefix optional)
 */
export function formatVATNumber(vatNumber: string): string {
  // Remove spaces and format
  const cleaned = vatNumber.replace(/\s+/g, "");
  if (cleaned.startsWith("GB")) {
    return cleaned;
  }
  return `GB${cleaned}`;
}

/**
 * Validate UK VAT number format
 */
export function isValidVATNumber(vatNumber: string): boolean {
  const cleaned = vatNumber.replace(/\s+/g, "").replace(/^GB/i, "");
  // UK VAT numbers are 9 digits
  return /^\d{9}$/.test(cleaned);
}

/**
 * Tax invoice information for UK compliance
 */
export interface TaxInvoiceInfo {
  vatNumber?: string;
  companyName: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  vatRate: number;
  vatAmount: number;
  totalExcludingVAT: number;
  totalIncludingVAT: number;
}

/**
 * Generate tax invoice details for UK compliance
 */
export function generateTaxInvoiceInfo(
  order: {
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
  },
  companyInfo: {
    name: string;
    vatNumber?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  }
): TaxInvoiceInfo {
  return {
    vatNumber: companyInfo.vatNumber,
    companyName: companyInfo.name,
    address: companyInfo.address,
    vatRate: UK_VAT_RATE,
    vatAmount: order.tax,
    totalExcludingVAT: order.subtotal + order.shippingCost,
    totalIncludingVAT: order.total,
  };
}




