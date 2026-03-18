import { describe, it, expect } from 'vitest';
import { formatPrice, formatPriceWithDecimals, CURRENCY_SYMBOL, CURRENCY_CODE } from '../currency';

describe('currency utilities', () => {
  describe('formatPrice', () => {
    it('formats whole numbers with peso sign', () => {
      expect(formatPrice(1000)).toBe('₱1,000');
    });

    it('formats zero', () => {
      expect(formatPrice(0)).toBe('₱0');
    });

    it('truncates decimals (no fraction digits)', () => {
      const result = formatPrice(1500.99);
      expect(result).not.toContain('.99');
      expect(result).toContain('₱');
    });

    it('formats large numbers with commas', () => {
      expect(formatPrice(1000000)).toBe('₱1,000,000');
    });

    it('formats small numbers', () => {
      expect(formatPrice(5)).toBe('₱5');
    });
  });

  describe('formatPriceWithDecimals', () => {
    it('formats with 2 decimal places', () => {
      expect(formatPriceWithDecimals(1500)).toBe('₱1,500.00');
    });

    it('formats with existing decimals', () => {
      expect(formatPriceWithDecimals(1500.5)).toBe('₱1,500.50');
    });

    it('formats zero with decimals', () => {
      expect(formatPriceWithDecimals(0)).toBe('₱0.00');
    });

    it('rounds to 2 decimal places', () => {
      const result = formatPriceWithDecimals(99.999);
      expect(result).toBe('₱100.00');
    });
  });

  describe('constants', () => {
    it('exports correct currency symbol', () => {
      expect(CURRENCY_SYMBOL).toBe('₱');
    });

    it('exports correct currency code', () => {
      expect(CURRENCY_CODE).toBe('PHP');
    });
  });
});
