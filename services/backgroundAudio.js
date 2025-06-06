import { Audio } from 'expo-av';

let soundObject;

export const registerBackgroundTask = async () => {
  try {
    await Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    console.log('Audio mode configured for background playback');
  } catch (error) {
    console.error('registerBackgroundTask error:', error);
  }
};

export const unregisterBackgroundTask = async () => {
  try {
    if (soundObject) {
      await soundObject.unloadAsync();
      soundObject = null;
      console.log('Sound unloaded');
    }
  } catch (error) {
    console.error('unregisterBackgroundTask error:', error);
  }
};

export const playAudio = async (track) => {
  try {
    if (soundObject) {
      await soundObject.unloadAsync(); // Clean previous audio
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.url },
      { shouldPlay: true }
    );

    soundObject = sound;
    console.log('Playing audio:', track.title || track.url);
  } catch (error) {
    console.error('playAudio error:', error);
  }
};
