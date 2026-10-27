import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectSubtotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectDiscount = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  const discountRates: Record<string, number> = {
    SUMMER10: 0.1,
    SPECIAL20: 0.2,
  };
  const rate = discountRates[state.cart.discountCode || ''] || 0;
  return subtotal * rate;
};

export const selectTax = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  return subtotal * state.cart.taxRate;
};

export const selectCartTotal = (state: RootState) => {
  const subtotal = selectSubtotal(state);
  const discount = selectDiscount(state);
  const tax = selectTax(state);
  return subtotal - discount + tax + state.cart.shippingCost;
};

export const selectCartSummary = createSelector(
  [
    selectSubtotal,
    selectDiscount,
    selectTax,
    (state: RootState) => state.cart.shippingCost,
    selectCartTotal,
    (state: RootState) => state.cart.items,
  ],
  (subtotal: any, discount: any, tax: any, shipping: any, total: any, items: any[]) => ({
    subtotal,
    discount,
    tax,
    shipping,
    total,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  })
);