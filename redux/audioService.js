import { Audio } from 'expo-av';
import { store } from '../store';
import {
  setPlaybackPosition,
  setPlaybackDuration,
  setPlayState,
  setCurrentSong,
  nextSong,
} from './audioSlice';

class AudioService {
  constructor() {
    this.soundObject = null;
    this.sleepTimer = null;
    this.isInitialized = false;
  }

  async init() {
    if (!this.isInitialized) {
      this.soundObject = new Audio.Sound();
      this.isInitialized = true;

    }
    return this.soundObject;
  }

  handlePlaybackStatus = (status) => {
    if (!status.isLoaded) return;

    store.dispatch(setPlaybackPosition(status.positionMillis));

    if (status.durationMillis) {
      store.dispatch(setPlaybackDuration(status.durationMillis));
    }

    if (status.didJustFinish) {
      this.handleSongEnd();
    }
  };

 handleSongEnd = async () => {
  const state = store.getState().audio;
  const { repeatMode, currentQueueIndex, queue } = state;

  if (!this.soundObject) return;

  if (repeatMode === 'one') {
    await this.soundObject.replayAsync();
  } else if (repeatMode === 'all' || currentQueueIndex < queue.length - 1) {
    store.dispatch(nextSong());
    // Don't call loadAndPlay here!
  } else {
    store.dispatch(setPlayState(false));
  }
};

async loadAndPlay(uri, shouldPlay = false) {
  try {
 

    if (this.soundObject) {
      await this.soundObject.stopAsync().catch(() => {});
      await this.unloadSound();
    }

    await this.init(); // Re-initialize after unload
    const status = await this.soundObject.loadAsync(
      { uri },
      { shouldPlay }
    );

    this.soundObject.setOnPlaybackStatusUpdate(this.handlePlaybackStatus);

    if (status.durationMillis) {
      store.dispatch(setPlaybackDuration(status.durationMillis));
    }

    store.dispatch(setPlayState(shouldPlay));
    return true;
  } catch (error) {
    console.error('loadAndPlay failed:', error);
    return false;
  }
}


handlePlaybackStatus = (status) => {
  if (!status.isLoaded) return;

  store.dispatch(setPlaybackPosition(status.positionMillis));

  if (status.durationMillis) {
    store.dispatch(setPlaybackDuration(status.durationMillis));
  }

  if (status.didJustFinish) {
    this.handleSongEnd();
  }
};



  async seekTo(position) {
    try {
      if (!this.soundObject) {
        await this.init();
      }
      await this.soundObject.setPositionAsync(position);
      store.dispatch(setPlaybackPosition(position));
      return true;
    } catch (error) {
      console.error('Seek operation failed:', error);
      return false;
    }
  }

  async togglePlayback() {


    try {
      if (!this.soundObject)
      
        return;

        


      const { isPlaying } = store.getState().audio;

      if (isPlaying) {
       
        await this.soundObject.pauseAsync();
        store.dispatch(setPlayState(false));

      } else {
        await this.soundObject.playAsync();
        store.dispatch(setPlayState(true));


      }
    } catch (error) {

    }
  }

  async setRate(rate) {
    if (!this.soundObject) return;
    await this.soundObject.setRateAsync(rate, true);
  }

  async setVolume(volume) {
    if (!this.soundObject) return;
    await this.soundObject.setVolumeAsync(volume);
  }

  async unloadSound() {
    if (this.soundObject) {
      try {
        await this.soundObject.unloadAsync();
      } catch (error) {

      }
      this.soundObject = null;
      this.isInitialized = false;
    }
    this.clearSleepTimer();
  }
  

  setSleepTimer(minutes) {
    this.clearSleepTimer();
    if (minutes <= 0) return;

    const fadeDuration = 5000;
    const totalTime = minutes * 60 * 1000;
    const fadeStart = totalTime - fadeDuration;

    this.sleepTimer = setTimeout(() => {
      let i = 10;
      const fadeInterval = setInterval(() => {
        if (!this.soundObject || i < 0) {
          clearInterval(fadeInterval);
          this.soundObject?.pauseAsync();
          store.dispatch(setPlayState(false));
          return;
        }
        this.soundObject.setVolumeAsync(i / 10);
        i--;
      }, fadeDuration / 10);
    }, fadeStart);
  }

  clearSleepTimer() {
    clearTimeout(this.sleepTimer);
    this.sleepTimer = null;
    if (this.soundObject) {
      this.soundObject.setVolumeAsync(1.0);
    }
  }

  async set3DAudioEffect(enabled) {
    if (!this.soundObject) return;
    await this.soundObject.setPanAsync(enabled ? -1 : 0);
  }
}

const audioService = new AudioService();
audioService.init();

export default audioService;