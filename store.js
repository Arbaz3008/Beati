import { configureStore } from '@reduxjs/toolkit';
import audioReducer from './redux/audioSlice';
import playlistReducer from './redux/playlistSlice';
import themeReducer from './theme/themeSlice';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
const persistConfig = {
  key: 'audio',
  storage: AsyncStorage,
  whitelist: ['favorites','playlists', 'hiddenSongs'] 
};
const playlistPersistConfig = {
  key: 'playlists',
  storage: AsyncStorage,
};

const persistedAudioReducer = persistReducer(persistConfig, audioReducer);
const persistedPlaylistReducer = persistReducer(playlistPersistConfig, playlistReducer);

export const store = configureStore({
  reducer: {
    audio: persistedAudioReducer,
    playlists: persistedPlaylistReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});
export const persistor = persistStore(store);
