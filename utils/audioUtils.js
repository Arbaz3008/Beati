// utils/audioUtils.js
import * as MediaLibrary from 'expo-media-library';

export const getAudioFiles = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Media library permission not granted');
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: 1000, // get up to 1000 audio files
    });

    return media.assets;
  } catch (error) {
    console.error('Error loading audio files:', error);
    return [];
  }
};
