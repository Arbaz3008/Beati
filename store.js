
import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './redux/audioSlice';
import playlistReducer from './redux/playlistSlice';
import themeReducer from './theme/themeSlice';

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    playlists: playlistReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

