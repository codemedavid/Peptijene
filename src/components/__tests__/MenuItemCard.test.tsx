import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MenuItemCard from '../MenuItemCard';
import type { Product } from '../../types';
import {
  mockProduct,
  mockProductNoDiscount,
  mockProductOutOfStock,
  mockProductUnavailable,
} from '../../test/fixtures';

describe('MenuItemCard Component', () => {
  describe('rendering', () => {
    it('renders product name and description', () => {
      render(<MenuItemCard product={mockProductNoDiscount} />);

      expect(screen.getByText('BPC-157')).toBeInTheDocument();
      expect(screen.getByText('Body Protection Compound-157')).toBeInTheDocument();
    });

    it('renders product image when available', () => {
      render(<MenuItemCard product={mockProduct} />);

      const img = screen.getByAltText('Tirzepatide');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/tirzepatide.jpg');
    });

    it('renders placeholder icon when no image', () => {
      render(<MenuItemCard product={mockProductNoDiscount} />);

      // Should not have an img element
      expect(screen.queryByAltText('BPC-157')).not.toBeInTheDocument();
    });

    it('displays featured badge for featured products', () => {
      render(<MenuItemCard product={mockProduct} />);

      expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('does not display featured badge for non-featured products', () => {
      render(<MenuItemCard product={mockProductNoDiscount} />);

      expect(screen.queryByText('Featured')).not.toBeInTheDocument();
    });
  });

  describe('pricing', () => {
    it('shows base price for product without discount', () => {
      render(<MenuItemCard product={mockProductNoDiscount} />);

      // Base price is 1200
      expect(screen.getByText('₱1,200')).toBeInTheDocument();
    });

    it('shows discount badge when discount is active', () => {
      // Use a product without variations so product-level discount applies
      const discountedProduct: Product = {
        ...mockProduct,
        variations: [],
      };
      render(<MenuItemCard product={discountedProduct} />);

      // Should show % OFF badge (product has discount_active=true, discount_price=1500, base=2000)
      expect(screen.getByText(/OFF/)).toBeInTheDocument();
    });

    it('shows original price with strikethrough when discounted', () => {
      // Use a product without variations so product-level discount applies
      const discountedProduct: Product = {
        ...mockProduct,
        variations: [],
      };
      render(<MenuItemCard product={discountedProduct} />);

      // Discount price = 1500, original = 2000
      expect(screen.getByText('₱1,500')).toBeInTheDocument();
      expect(screen.getByText('₱2,000')).toBeInTheDocument();
    });
  });

  describe('variations', () => {
    it('renders variation buttons', () => {
      render(<MenuItemCard product={mockProduct} />);

      expect(screen.getByText('5mg')).toBeInTheDocument();
      expect(screen.getByText('10mg')).toBeInTheDocument();
    });

    it('selects first variation by default', () => {
      render(<MenuItemCard product={mockProduct} />);

      const button5mg = screen.getByText('5mg');
      // First variation should be selected (has brand-50 background class)
      expect(button5mg.className).toContain('brand-50');
    });

    it('switches selected variation on click', () => {
      render(<MenuItemCard product={mockProduct} />);

      fireEvent.click(screen.getByText('10mg'));
      const button10mg = screen.getByText('10mg');
      expect(button10mg.className).toContain('brand-50');
    });
  });

  describe('stock status', () => {
    it('shows out of stock overlay for zero-stock product', () => {
      render(<MenuItemCard product={mockProductOutOfStock} />);

      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });

    it('shows unavailable overlay for unavailable product', () => {
      render(<MenuItemCard product={mockProductUnavailable} />);

      expect(screen.getByText('Unavailable')).toBeInTheDocument();
    });

    it('disables add to cart button for out-of-stock product', () => {
      render(<MenuItemCard product={mockProductOutOfStock} />);

      const addButton = screen.getByText('Add to Cart').closest('button');
      expect(addButton).toBeDisabled();
    });

    it('disables add to cart button for unavailable product', () => {
      render(<MenuItemCard product={mockProductUnavailable} />);

      const addButton = screen.getByText('Add to Cart').closest('button');
      expect(addButton).toBeDisabled();
    });
  });

  describe('interactions', () => {
    it('calls onAddToCart when add button is clicked', () => {
      const onAddToCart = vi.fn();
      render(<MenuItemCard product={mockProduct} onAddToCart={onAddToCart} />);

      fireEvent.click(screen.getByText('Add to Cart'));

      expect(onAddToCart).toHaveBeenCalledTimes(1);
      expect(onAddToCart).toHaveBeenCalledWith(
        mockProduct,
        expect.objectContaining({ id: 'var-1' }), // first variation selected by default
        1
      );
    });

    it('calls onProductClick when image area is clicked', () => {
      const onProductClick = vi.fn();
      render(<MenuItemCard product={mockProduct} onProductClick={onProductClick} />);

      // Click the overlay div (which has title="View details")
      const overlay = screen.getByTitle('View details');
      fireEvent.click(overlay);

      expect(onProductClick).toHaveBeenCalledWith(mockProduct);
    });

    it('does not call onAddToCart for out-of-stock product', () => {
      const onAddToCart = vi.fn();
      render(<MenuItemCard product={mockProductOutOfStock} onAddToCart={onAddToCart} />);

      fireEvent.click(screen.getByText('Add to Cart'));

      expect(onAddToCart).not.toHaveBeenCalled();
    });

    it('shows cart quantity indicator', () => {
      render(<MenuItemCard product={mockProduct} cartQuantity={3} />);

      expect(screen.getByText('3 in cart')).toBeInTheDocument();
    });

    it('does not show cart quantity when zero', () => {
      render(<MenuItemCard product={mockProduct} cartQuantity={0} />);

      expect(screen.queryByText(/in cart/)).not.toBeInTheDocument();
    });
  });
});
