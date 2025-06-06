import * as MediaLibrary from 'expo-media-library';

export const getAudioFiles = async () => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Media library permission not granted');
      return [];
    }

    const media = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.audio,
      sortBy: [MediaLibrary.SortBy.creationTime],
      first: 1000, // Fetch up to 1000 audio files
    });

    const audioFiles = media.assets.map(asset => ({
      id: asset.id,
      title: asset.filename.replace(/\.[^/.]+$/, ""), // Remove file extension
      uri: asset.uri,
      duration: asset.duration ? asset.duration * 1000 : null, // Some assets may not have duration
      creationTime: asset.creationTime,
    }));

    console.log('Total audio files found:', audioFiles.length);
    return audioFiles;
  } catch (error) {
    console.error('Error getting audio files:', error);
    return [];
  }
};
