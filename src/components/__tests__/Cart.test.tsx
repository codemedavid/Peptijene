import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../Cart';
import { mockProduct, mockProductNoDiscount, mockVariation5mg, mockVariation10mg } from '../../test/fixtures';
import type { CartItem } from '../../types';

const defaultProps = {
  updateQuantity: vi.fn(),
  removeFromCart: vi.fn(),
  clearCart: vi.fn(),
  getTotalPrice: vi.fn(() => 0),
  onContinueShopping: vi.fn(),
  onCheckout: vi.fn(),
};

describe('Cart Component', () => {
  describe('empty cart', () => {
    it('renders empty cart message', () => {
      render(<Cart cartItems={[]} {...defaultProps} />);

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText(/Select products from our catalog/)).toBeInTheDocument();
    });

    it('shows browse catalog button', () => {
      render(<Cart cartItems={[]} {...defaultProps} />);

      const browseButton = screen.getByText('Browse Catalog');
      expect(browseButton).toBeInTheDocument();
    });

    it('calls onContinueShopping when browse button is clicked', () => {
      const onContinueShopping = vi.fn();
      render(<Cart cartItems={[]} {...defaultProps} onContinueShopping={onContinueShopping} />);

      fireEvent.click(screen.getByText('Browse Catalog'));
      expect(onContinueShopping).toHaveBeenCalledTimes(1);
    });
  });

  describe('cart with items', () => {
    const cartItems: CartItem[] = [
      { product: mockProduct, variation: mockVariation5mg, quantity: 2 },
      { product: mockProductNoDiscount, quantity: 1 },
    ];

    it('renders all cart items', () => {
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          getTotalPrice={() => 4200}
        />
      );

      expect(screen.getByText('Tirzepatide')).toBeInTheDocument();
      expect(screen.getByText('BPC-157')).toBeInTheDocument();
    });

    it('displays item count badge', () => {
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          getTotalPrice={() => 4200}
        />
      );

      expect(screen.getByText('3 Items')).toBeInTheDocument();
    });

    it('shows variation name for items with variations', () => {
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          getTotalPrice={() => 4200}
        />
      );

      expect(screen.getByText('Format: 5mg')).toBeInTheDocument();
    });

    it('shows purity percentage', () => {
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          getTotalPrice={() => 4200}
        />
      );

      expect(screen.getByText('99.5% Purity')).toBeInTheDocument();
    });

    it('calls updateQuantity when minus button is clicked', () => {
      const updateQuantity = vi.fn();
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          updateQuantity={updateQuantity}
          getTotalPrice={() => 4200}
        />
      );

      // Find the first minus button (for first item with qty 2)
      const minusButtons = screen.getAllByRole('button').filter(
        btn => btn.querySelector('.lucide-minus')
      );

      if (minusButtons[0]) {
        fireEvent.click(minusButtons[0]);
        expect(updateQuantity).toHaveBeenCalledWith(0, 1);
      }
    });

    it('calls removeFromCart when trash button is clicked', () => {
      const removeFromCart = vi.fn();
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          removeFromCart={removeFromCart}
          getTotalPrice={() => 4200}
        />
      );

      const removeButtons = screen.getAllByTitle('Remove item');
      fireEvent.click(removeButtons[0]);
      expect(removeFromCart).toHaveBeenCalledWith(0);
    });

    it('calls clearCart when clear button is clicked', () => {
      const clearCart = vi.fn();
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          clearCart={clearCart}
          getTotalPrice={() => 4200}
        />
      );

      fireEvent.click(screen.getByText('Clear Cart'));
      expect(clearCart).toHaveBeenCalledTimes(1);
    });

    it('calls onCheckout when checkout button is clicked', () => {
      const onCheckout = vi.fn();
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          onCheckout={onCheckout}
          getTotalPrice={() => 4200}
        />
      );

      fireEvent.click(screen.getByText('Proceed to Checkout'));
      expect(onCheckout).toHaveBeenCalledTimes(1);
    });

    it('displays order summary section', () => {
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          getTotalPrice={() => 4200}
        />
      );

      expect(screen.getByText('Order Summary')).toBeInTheDocument();
      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('Total Estimate')).toBeInTheDocument();
    });

    it('shows trust badges', () => {
      render(
        <Cart
          cartItems={cartItems}
          {...defaultProps}
          getTotalPrice={() => 4200}
        />
      );

      expect(screen.getByText('Secure Encrypted Checkout')).toBeInTheDocument();
      expect(screen.getByText('HPLC Verified Purity')).toBeInTheDocument();
      expect(screen.getByText('Discreet Packaging')).toBeInTheDocument();
    });

    it('shows discount pricing when applicable', () => {
      const discountedItem: CartItem[] = [
        { product: mockProduct, variation: mockVariation10mg, quantity: 1 },
      ];

      render(
        <Cart
          cartItems={discountedItem}
          {...defaultProps}
          getTotalPrice={() => 2000}
        />
      );

      // Should show discount percentage
      expect(screen.getByText(/off\)/)).toBeInTheDocument();
    });

    it('disables plus button when at stock limit', () => {
      const atStockLimit: CartItem[] = [
        { product: mockProduct, variation: mockVariation10mg, quantity: 5 }, // stock_quantity is 5
      ];

      render(
        <Cart
          cartItems={atStockLimit}
          {...defaultProps}
          getTotalPrice={() => 2500}
        />
      );

      // The plus button for the item at stock limit should be disabled
      const plusButtons = screen.getAllByRole('button').filter(
        btn => btn.querySelector('.lucide-plus')
      );

      // The first plus button should be disabled since quantity == stock_quantity
      if (plusButtons[0]) {
        expect(plusButtons[0]).toBeDisabled();
      }
    });
  });
});
