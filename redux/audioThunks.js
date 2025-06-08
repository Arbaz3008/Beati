import { createAsyncThunk } from '@reduxjs/toolkit';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import { setCurrentSong, setPlayState } from './audioSlice';
export const loadAudioFilesFromDevice = createAsyncThunk(
  'audio/loadAudioFilesFromDevice',
  async (_, thunkAPI) => {
    try {
      const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        if (!canAskAgain) {
          throw new Error('Permission permanently denied. Please enable in app settings.');
        }
        throw new Error('Permission denied');
      }
      let media = await MediaLibrary.getAssetsAsync({
        mediaType: 'audio',
        first: 100,
        sortBy: ['creationTime'],
      });
      let allAssets = [...media.assets];
      while (media.hasNextPage && media.endCursor) {
        media = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: 100,
          after: media.endCursor,
        });
        allAssets = [...allAssets, ...media.assets];
      }
      if (allAssets.length === 0) {
throw new Error('No audio files found on device');
      }
      const albums = await MediaLibrary.getAlbumsAsync();
      const albumMap = {};
      albums.forEach(a => { albumMap[a.id] = a.title; });
      let formattedSongs = allAssets.map(asset => ({
        id: asset.id,
        uri: asset.uri,
        title: asset.filename.replace(/\.[^/.]+$/, ""),
        filename: asset.filename,
        duration: asset.duration,
        album: albumMap[asset.albumId] || 'Unknown Album',
        artist: asset.artist || 'Unknown Artist',
      }));
      formattedSongs = formattedSongs.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
      return formattedSongs;
    } catch (error) {
      console.error('Error loading audio files:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
let currentSound = null;
export const playSongAsync = (song) => async (dispatch, getState) => {
  const { currentSong } = getState().audio;
  // Agar already yeh song play ho raha hai, dobara play mat karo!
  if (currentSong?.id === song.id) return;
   try {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      currentSound = null;
    }
    currentSound = new Audio.Sound();
    await currentSound.loadAsync({ uri: song.uri });
    await currentSound.playAsync();
    dispatch(setCurrentSong(song));
    dispatch(setPlayState(true));
  } catch (error) {
    console.error('Error playing song:', error);
  }
}

    