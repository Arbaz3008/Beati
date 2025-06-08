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
  playCounts: {},
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
    playlist.songs.unshift(songId); // Naya song sabse aage
    if (playlist.songs.length > 50) {
      playlist.songs = playlist.songs.slice(0, 50); // Sirf 50 hi rahenge
    }
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
      const recentPlaylist = state.playlists.find(p => p.id === 'Recently Played');
      if (recentPlaylist) {
        recentPlaylist.songs = [action.payload, ...recentPlaylist.songs.filter(id => id !== action.payload)].slice(0, 50);
      }
    },
     incrementPlayCount: (state, action) => {
      const songId = action.payload;
      if (state.playCounts[songId]) {
        state.playCounts[songId] += 1;
      } else {
        state.playCounts[songId] = 1;
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
  incrementPlayCount
} = playlistSlice.actions;

export default playlistSlice.reducer; 