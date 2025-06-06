import { createSlice } from '@reduxjs/toolkit';
import { loadAudioFilesFromDevice } from './audioThunks';

const initialState = {
  songs: [],
  hiddenSongs: [],
  currentSong: null,
  isPlaying: false,
  playbackPosition: 0,
  playbackDuration: 0,
  playbackRate: 1,
  isShuffled: false,
  repeatMode: 'none',
  queue: [],
  currentQueueIndex: 0,
  equalizerPreset: 'normal',
  audioEffects: {
    reverb: false,
    echo: false,
    pitch: 1.0,
    reverse: false,
     '8d': false,
    '3d': false,
  },
  visualizationData: [],
  favorites: [],
  history: [],
   sleepTimer: 0,
  timerHistory: [],
  alarm: null,
  isLoading: false,
  error: null,
};

const audioSlice = createSlice({
  name: 'audio', // Fixed slice name
  initialState,
  reducers: {
    playSongFromQueue: (state, action) => {
  const { queue, songId } = action.payload;
  state.queue = queue;
  state.currentQueueIndex = queue.findIndex(song => song.id === songId);
  state.currentSong = queue[state.currentQueueIndex];
  state.isPlaying = true;
},
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.history = [...state.history, action.payload];
    },
    addTimerHistory: (state, action) => {
      // Initialize timerHistory if it doesn't exist
      if (!state.timerHistory) {
        state.timerHistory = [];
      }
      state.timerHistory.push(action.payload);
      // Keep only the last 20 items
      if (state.timerHistory.length > 20) {
        state.timerHistory.shift();
      }
    },
    pauseAudio: (state) => {
      console.log('AUDIO PAUSED'); 
  state.isPlaying = false;
},
    setSongs: (state, action) => {
      state.songs = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setPlaybackPosition: (state, action) => {
      state.playbackPosition = action.payload;
    },
    setPlaybackDuration: (state, action) => {
      state.playbackDuration = action.payload;
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
    
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },
    setRepeatMode: (state, action) => {
      state.repeatMode = action.payload;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
      state.currentQueueIndex = 0;
    },
    nextSong: (state) => {
      if (state.currentQueueIndex < state.queue.length - 1) {
        state.currentQueueIndex += 1;
        state.currentSong = state.queue[state.currentQueueIndex];
      }
    },
    prevSong: (state) => {
      if (state.currentQueueIndex > 0) {
        state.currentQueueIndex -= 1;
        state.currentSong = state.queue[state.currentQueueIndex];
      }
    },
    
    setEqualizerPreset: (state, action) => {
      state.equalizerPreset = action.payload;
    },
    toggleAudioEffect: (state, action) => {
      const { effect, value } = action.payload;
      state.audioEffects[effect] = value !== undefined ? value : !state.audioEffects[effect];
    },
    setVisualizationData: (state, action) => {
      state.visualizationData = action.payload;
    },
    toggleFavorite: (state, action) => {
      const songId = action.payload;
      if (state.favorites.includes(songId)) {
        state.favorites = state.favorites.filter(id => id !== songId);
      } else {
        state.favorites.push(songId);
      }
    },
    setSleepTimer: (state, action) => {
      state.sleepTimer = action.payload;
    },
    setAlarm: (state, action) => {
      state.alarm = action.payload;
    },
    setPlayState: (state, action) => {
  state.isPlaying = action.payload;
},
    setSongs: (state, action) => { state.songs = action.payload; },
    hideSong: (state, action) => {
      const song = state.songs.find(s => s.id === action.payload);
      if (song) {
        state.hiddenSongs.push(song);
        state.songs = state.songs.filter(s => s.id !== action.payload);
        state.queue = state.queue.filter(s => s.id !== action.payload);

      }
    },
    unhideSong: (state, action) => {
      const song = state.hiddenSongs.find(s => s.id === action.payload);
      if (song) {
        state.songs.push(song);
        state.hiddenSongs = state.hiddenSongs.filter(s => s.id !== action.payload);
      }
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAudioFilesFromDevice.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAudioFilesFromDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.songs = action.payload; // Store in songs array
        state.queue = action.payload; // Also store in queue
        if (action.payload.length > 0) {
          state.currentSong = action.payload[0];
        }
      })
      .addCase(loadAudioFilesFromDevice.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  playSongFromQueue,
  setCurrentSong,
  setSongs,
  togglePlay,
  setPlaybackPosition,
  setPlaybackDuration,
  setPlaybackRate,
  toggleShuffle,
  setRepeatMode,
  setQueue,
  nextSong,
  prevSong,
  setEqualizerPreset,
  toggleAudioEffect,
  setVisualizationData,
  toggleFavorite,
 setSleepTimer,
  addTimerHistory,
  setAlarm,
  setPlayState,
  hideSong, unhideSong,
  pauseAudio
} = audioSlice.actions;

export default audioSlice.reducer;