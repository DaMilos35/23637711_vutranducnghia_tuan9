import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsState {
  items: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const API = 'https://jsonplaceholder.typicode.com/posts';

const request = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Lỗi ${res.status}`);
  return res.json();
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  return (await request(`${API}?_limit=10`)) as Post[];
});

export const addPost = createAsyncThunk(
  'posts/addPost',
  async (newPost: { title: string; body: string; userId: number }) => {
    return (await request(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    })) as Post;
  }
);

export const updatePost = createAsyncThunk('posts/updatePost', async (post: Post) => {
  return (await request(`${API}/${post.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })) as Post;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
  await request(`${API}/${id}`, { method: 'DELETE' });
  return id;
});

const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Lỗi';
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.items.unshift(action.payload); 
      })  
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.items.findIndex((p: { id: number; }) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload; 
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((p: { id: number; }) => p.id !== action.payload); 
      })
  },
});

export const selectPosts = (state: RootState) => state.posts.items;
export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;

export default postsSlice.reducer;