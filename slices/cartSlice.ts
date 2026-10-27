import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  taxRate: number;
  shippingCost: number;
}

const loadCart = (): CartItem[] => {
  try {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('cartItems') || '[]');
    }
  } catch {}
  return [];
};

const saveCart = (items: CartItem[]) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(items));
    }
  } catch {}
};

const removeStorageCart = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('cartItems');
    }
  } catch {}
};

const initialState: CartState = {
  items: loadCart(),
  discountCode: null,
  taxRate: 0.1,
  shippingCost: 10,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
      const existingItem = state.items.find((item: { id: number; }) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCart(state.items);
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item: { id: number; }) => item.id === action.payload);
      if (item) item.quantity += 1;
      saveCart(state.items);
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((item: { id: number; }) => item.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item: { id: number; }) => item.id !== action.payload);
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      removeStorageCart();
    },
    applyDiscount: (state, action: PayloadAction<string>) => {
      state.discountCode = action.payload;
    },
    setShippingCost: (state, action: PayloadAction<number>) => {
      state.shippingCost = action.payload;
    },
  },
});

export default cartSlice.reducer;
export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
  setShippingCost,
} = cartSlice.actions;