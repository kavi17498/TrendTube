import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieslicer';

export const store = configureStore({
  reducer: {
    movies: movieReducer, 
  },
});