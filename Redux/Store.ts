import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import movieReducer from './movieslicer';

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;