import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UsersState {
  list: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!res.ok) throw new Error('Failed to fetch');
  return (await res.json()) as User[];
});

const initialState: UsersState = {
  list: [],
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Lỗi tải dữ liệu';
      });
  },
});

export const selectUsers = (state: RootState) => state.users.list;
export const selectUsersStatus = (state: RootState) => state.users.status;
export const selectUsersError = (state: RootState) => state.users.error;

export default usersSlice.reducer;