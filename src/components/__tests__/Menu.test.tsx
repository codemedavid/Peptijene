import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Menu from '../Menu';
import {
  mockProduct,
  mockProductNoDiscount,
  mockProductOutOfStock,
} from '../../test/fixtures';

// Mock Hero component since it fetches site settings from Supabase
vi.mock('../Hero', () => ({
  default: ({ onShopAll }: { onShopAll: () => void }) => (
    <div data-testid="hero">
      <button onClick={onShopAll}>Shop All</button>
    </div>
  ),
}));

// Mock ProductDetailModal
vi.mock('../ProductDetailModal', () => ({
  default: ({ product, onClose, onAddToCart }: any) => (
    <div data-testid="product-modal">
      <span>{product.name}</span>
      <button onClick={onClose}>Close</button>
      <button onClick={() => onAddToCart(product, undefined, 1)}>Add from Modal</button>
    </div>
  ),
}));

const defaultProps = {
  addToCart: vi.fn(),
  cartItems: [],
  updateQuantity: vi.fn(),
};

const allProducts = [mockProduct, mockProductNoDiscount, mockProductOutOfStock];

function renderMenu(props = {}) {
  return render(
    <MemoryRouter>
      <Menu
        menuItems={allProducts}
        {...defaultProps}
        {...props}
      />
    </MemoryRouter>
  );
}

describe('Menu Component', () => {
  describe('rendering', () => {
    it('renders the product collection heading', () => {
      renderMenu();
      expect(screen.getByText('Our Peptide Collection')).toBeInTheDocument();
    });

    it('renders correct product count', () => {
      renderMenu();
      expect(screen.getByText('3 Results')).toBeInTheDocument();
    });

    it('renders all product cards', () => {
      renderMenu();
      expect(screen.getByText('Tirzepatide')).toBeInTheDocument();
      expect(screen.getByText('BPC-157')).toBeInTheDocument();
      expect(screen.getByText('Semaglutide')).toBeInTheDocument();
    });

    it('renders search input', () => {
      renderMenu();
      expect(screen.getByPlaceholderText('Search catalog...')).toBeInTheDocument();
    });

    it('renders sort dropdown', () => {
      renderMenu();
      expect(screen.getByText('Sort by Name')).toBeInTheDocument();
    });
  });

  describe('search functionality', () => {
    it('filters products by name', () => {
      renderMenu();

      const searchInput = screen.getByPlaceholderText('Search catalog...');
      fireEvent.change(searchInput, { target: { value: 'BPC' } });

      expect(screen.getByText('1 Results')).toBeInTheDocument();
      expect(screen.getByText('BPC-157')).toBeInTheDocument();
      expect(screen.queryByText('Tirzepatide')).not.toBeInTheDocument();
    });

    it('filters products by description', () => {
      renderMenu();

      const searchInput = screen.getByPlaceholderText('Search catalog...');
      fireEvent.change(searchInput, { target: { value: 'Body Protection' } });

      expect(screen.getByText('1 Results')).toBeInTheDocument();
      expect(screen.getByText('BPC-157')).toBeInTheDocument();
    });

    it('is case insensitive', () => {
      renderMenu();

      const searchInput = screen.getByPlaceholderText('Search catalog...');
      fireEvent.change(searchInput, { target: { value: 'tirzepatide' } });

      expect(screen.getByText('Tirzepatide')).toBeInTheDocument();
    });

    it('shows no products message when no matches', () => {
      renderMenu();

      const searchInput = screen.getByPlaceholderText('Search catalog...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText(/No products match "nonexistent"/)).toBeInTheDocument();
    });

    it('shows clear search button when no results', () => {
      renderMenu();

      const searchInput = screen.getByPlaceholderText('Search catalog...');
      fireEvent.change(searchInput, { target: { value: 'xyz' } });

      const clearButton = screen.getByText('Clear Search');
      expect(clearButton).toBeInTheDocument();

      fireEvent.click(clearButton);
      expect(screen.getByText('3 Results')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('Tirzepatide is always first regardless of sort', () => {
      renderMenu();

      // Get all product names in order
      const productNames = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
      expect(productNames[0]).toBe('Tirzepatide');
    });

    it('allows sorting by price', () => {
      renderMenu();

      const sortSelect = screen.getByDisplayValue('Sort by Name');
      fireEvent.change(sortSelect, { target: { value: 'price' } });

      // Tirzepatide should still be first (always pinned)
      const productNames = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
      expect(productNames[0]).toBe('Tirzepatide');
    });

    it('allows sorting by purity', () => {
      renderMenu();

      const sortSelect = screen.getByDisplayValue('Sort by Name');
      fireEvent.change(sortSelect, { target: { value: 'purity' } });

      // Tirzepatide still first
      const productNames = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent);
      expect(productNames[0]).toBe('Tirzepatide');
    });
  });

  describe('empty state', () => {
    it('shows empty message when no products', () => {
      renderMenu({ menuItems: [] });

      expect(screen.getByText('No products found')).toBeInTheDocument();
      expect(screen.getByText('No products available.')).toBeInTheDocument();
    });
  });
});
