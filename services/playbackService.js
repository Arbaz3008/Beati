import { Audio } from 'expo-av';

let sound = null;

export const playAudio = async (uri) => {
  try {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    sound = newSound;
    await sound.playAsync();
  } catch (error) {
    console.error('Audio play error:', error);
  }
};

export const pauseAudio = async () => {
  if (sound) {
    await sound.pauseAsync();
  }
};

export const stopAudio = async () => {
  if (sound) {
    await sound.stopAsync();
    await sound.unloadAsync();
    sound = null;
  }
};
