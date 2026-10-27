import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import postsReducer from './slices/postsSlice';
import cartReducer from './slices/cartSlice';
import productsReducer from './slices/productsSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;