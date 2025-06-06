import * as Speech from 'expo-speech';
import { store } from '../store';
import { setCurrentSong, togglePlay, nextSong, prevSong } from '../redux/audioSlice';

const commands = {
  'play': (songTitle) => {
    const { songs } = store.getState().audio;
    const song = songs.find(s => 
      s.title.toLowerCase().includes(songTitle.toLowerCase())
    );
    if (song) {
      store.dispatch(setCurrentSong(song));
    }
  },
  'pause': () => {
    store.dispatch(togglePlay(false));
  },
  'resume': () => {
    store.dispatch(togglePlay(true));
  },
  'next': () => {
    store.dispatch(nextSong());
  },
  'previous': () => {
    store.dispatch(prevSong());
  },
};

export const startVoiceControl = async () => {
  try {
    const available = await Speech.isAvailableAsync();
    if (!available) {
      console.log('Speech recognition not available');
      return;
    }
    
    const { status } = await Speech.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission not granted');
      return;
    }
    
    // In a real app, you would use continuous recognition
    // This is a simplified version
    Speech.speak('Say a command like play, pause, next, or previous', {
      language: 'en',
    });
    
    return true;
  } catch (error) {
    console.error('Error starting voice control:', error);
    return false;
  }
};

export const processVoiceCommand = (command) => {
  const lowerCommand = command.toLowerCase();
  
  // Check for play commands with song titles
  if (lowerCommand.startsWith('play ')) {
    const songTitle = command.substring(5).trim();
    commands['play'](songTitle);
    return;
  }
  
  // Check other commands
  for (const [cmd, action] of Object.entries(commands)) {
    if (lowerCommand.includes(cmd)) {
      action();
      return;
    }
  }
  
  // Urdu support (basic)
  const urduCommands = {
    'چلاؤ': commands['play'],
    'روکو': commands['pause'],
    'جاری کرو': commands['resume'],
    'اگلا': commands['next'],
    'پچھلا': commands['previous'],
  };
  
  for (const [cmd, action] of Object.entries(urduCommands)) {
    if (lowerCommand.includes(cmd)) {
      action();
      return;
    }
  }
  
  Speech.speak('Command not recognized', { language: 'en' });
};
