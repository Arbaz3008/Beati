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

  } catch (error) {

  }
};

export const unregisterBackgroundTask = async () => {
  try {
    if (soundObject) {
      await soundObject.unloadAsync();
      soundObject = null;

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
 
  } catch (error) {
    console.error('playAudio error:', error);
  }
};
