import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: [
    {
      id: 'MostPlayed',
      name: 'Most Played',
      songs: [],
    },
    {
      id: 'Recently Played',
      name: 'Recently Played',
      songs: [],
    },
  ],
};

const playlistSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    createPlaylist: (state, action) => {
      state.playlists.push({
        id: Date.now().toString(),
        name: action.payload,
        songs: [],
      });
    },
    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(playlist => playlist.id !== action.payload);
    },
    addToPlaylist: (state, action) => {
      const { playlistId, songId } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist && !playlist.songs.includes(songId)) {
        playlist.songs.push(songId);
      }
    },
    removeFromPlaylist: (state, action) => {
      const { playlistId, songId } = action.payload;
      const playlist = state.playlists.find(p => p.id === playlistId);
      if (playlist) {
        playlist.songs = playlist.songs.filter(id => id !== songId);
      }
    },
    updateRecentlyPlayed: (state, action) => {
      const recentPlaylist = state.playlists.find(p => p.id === 'recent');
      if (recentPlaylist) {
        // Add to beginning and keep only last 50
        recentPlaylist.songs = [action.payload, ...recentPlaylist.songs.slice(0, 49)];
      }
    },
  },
});

export const {
  createPlaylist,
  deletePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  updateRecentlyPlayed,
} = playlistSlice.actions;

export default playlistSlice.reducer; 