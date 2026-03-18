import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../useCart';
import {
  mockProduct,
  mockProductNoDiscount,
  mockProductOutOfStock,
  mockVariation5mg,
  mockVariation10mg,
  mockVariationOutOfStock,
} from '../../test/fixtures';

describe('useCart hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with empty cart', () => {
      const { result } = renderHook(() => useCart());
      expect(result.current.cartItems).toEqual([]);
      expect(result.current.getTotalItems()).toBe(0);
      expect(result.current.getTotalPrice()).toBe(0);
    });

    it('loads cart from localStorage', () => {
      const savedCart = [{ product: mockProduct, variation: mockVariation5mg, quantity: 2 }];
      localStorage.setItem('peptide_cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart());

      // Wait for useEffect
      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('peptide_cart', 'invalid-json{{{');
      const { result } = renderHook(() => useCart());
      expect(result.current.cartItems).toEqual([]);
    });
  });

  describe('addToCart', () => {
    it('adds a product without variation', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product.id).toBe('prod-2');
      expect(result.current.cartItems[0].quantity).toBe(1);
      expect(result.current.cartItems[0].variation).toBeUndefined();
    });

    it('adds a product with variation', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].variation?.id).toBe('var-1');
    });

    it('adds custom quantity', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount, undefined, 3);
      });

      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('increments quantity for existing product', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('treats same product with different variations as separate items', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg);
      });
      act(() => {
        result.current.addToCart(mockProduct, mockVariation10mg);
      });

      expect(result.current.cartItems).toHaveLength(2);
    });

    it('blocks adding out-of-stock product', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductOutOfStock);
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('out of stock')
      );
    });

    it('blocks adding out-of-stock variation', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariationOutOfStock);
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('out of stock')
      );
    });

    it('caps quantity at available stock for new items', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation10mg, 100); // stock is 5
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
      expect(window.alert).toHaveBeenCalled();
    });

    it('caps quantity at available stock when incrementing existing item', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation10mg, 4); // stock is 5
      });
      act(() => {
        result.current.addToCart(mockProduct, mockVariation10mg, 3); // would be 7, exceeds 5
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
    });
  });

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.updateQuantity(0, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
    });

    it('removes item when quantity set to 0', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.updateQuantity(0, 0);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('removes item when quantity set to negative', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.updateQuantity(0, -1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('caps quantity at available stock', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation10mg); // stock is 5
      });
      act(() => {
        result.current.updateQuantity(0, 50);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('removes item by index', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg);
      });
      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.removeFromCart(0);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product.id).toBe('prod-2');
    });
  });

  describe('clearCart', () => {
    it('removes all items', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg);
      });
      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('clears localStorage (saves empty array)', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });
      act(() => {
        result.current.clearCart();
      });

      // clearCart removes the key, but the useEffect saves [] back
      const saved = localStorage.getItem('peptide_cart');
      expect(saved).toBe('[]');
    });
  });

  describe('getTotalPrice', () => {
    it('calculates total for items without variations (uses base_price)', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount, undefined, 2);
      });

      // No discount: base_price=1200, qty=2
      expect(result.current.getTotalPrice()).toBe(2400);
    });

    it('calculates total for items with variations (uses variation price)', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg, 3);
      });

      // Variation price=1500, qty=3
      expect(result.current.getTotalPrice()).toBe(4500);
    });

    it('uses discount_price when discount is active (product without variation)', () => {
      const { result } = renderHook(() => useCart());

      // mockProduct has discount_active=true, discount_price=1500, base_price=2000
      act(() => {
        result.current.addToCart(mockProduct, undefined, 1);
      });

      expect(result.current.getTotalPrice()).toBe(1500);
    });

    it('sums multiple items correctly', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg, 2); // 1500 * 2
      });
      act(() => {
        result.current.addToCart(mockProductNoDiscount, undefined, 1); // 1200 * 1
      });

      expect(result.current.getTotalPrice()).toBe(4200);
    });

    it('returns 0 for empty cart', () => {
      const { result } = renderHook(() => useCart());
      expect(result.current.getTotalPrice()).toBe(0);
    });
  });

  describe('getTotalItems', () => {
    it('counts total quantity across all items', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProduct, mockVariation5mg, 2);
      });
      act(() => {
        result.current.addToCart(mockProductNoDiscount, undefined, 3);
      });

      expect(result.current.getTotalItems()).toBe(5);
    });
  });

  describe('localStorage persistence', () => {
    it('saves cart to localStorage on change', () => {
      const { result } = renderHook(() => useCart());

      act(() => {
        result.current.addToCart(mockProductNoDiscount);
      });

      const saved = JSON.parse(localStorage.getItem('peptide_cart')!);
      expect(saved).toHaveLength(1);
      expect(saved[0].product.id).toBe('prod-2');
    });
  });
});
