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
const persistedAudioReducer = persistReducer(persistConfig, audioReducer);
export const store = configureStore({
  reducer: {
    audio: persistedAudioReducer,
    playlists: playlistReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});
export const persistor = persistStore(store);
