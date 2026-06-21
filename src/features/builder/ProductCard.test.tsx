import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '@/state/CartContext';
import { testCatalog } from '@/test/fixtures';
import { ProductCard } from './ProductCard';

const camV4 = testCatalog.products[0];

function renderCard() {
  return render(
    <CartProvider catalog={testCatalog}>
      <ProductCard product={camV4} selectionMode="multi" />
    </CartProvider>,
  );
}

describe('<ProductCard>', () => {
  it('renders the product name and its seeded quantity', () => {
    renderCard();
    expect(screen.getByText('Wyze Cam v4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // seeded white qty
  });

  it('increments the quantity when "+" is clicked', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(
      screen.getByRole('button', { name: /increase wyze cam v4 quantity/i }),
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('disables "−" once the quantity hits the minimum', async () => {
    const user = userEvent.setup();
    renderCard();

    const decrease = screen.getByRole('button', {
      name: /decrease wyze cam v4 quantity/i,
    });
    await user.click(decrease); // 1 -> 0
    expect(decrease).toBeDisabled();
  });

  it('shows the color variants', () => {
    renderCard();
    const group = screen.getByRole('radiogroup', { name: /color/i });
    expect(within(group).getByText('White')).toBeInTheDocument();
    expect(within(group).getByText('Black')).toBeInTheDocument();
  });
});
