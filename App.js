// App.js
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppNavigator from './navigation/AppNavigator';
import { useDispatch } from 'react-redux';
import { loadAudioFilesFromDevice } from './redux/audioThunks';
import { getAudioFiles } from './services/mediaLibrary';
import { registerBackgroundTask, unregisterBackgroundTask } from './services/backgroundAudio';
import * as MediaLibrary from 'expo-media-library';
import { ThemeProvider } from './theme/ThemeContext'; 

const AppWrapper = () => {

  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppInitializer />
      </ThemeProvider>
    </Provider>
  );
};

const AppInitializer = () => {
  const dispatch = useDispatch();
useEffect(() => {
  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Storage permission denied');
    }
  };
  requestPermissions();
}, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
    

        const audioFiles = await getAudioFiles();
        dispatch(loadAudioFilesFromDevice());

        await registerBackgroundTask();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();

    return () => {
      unregisterBackgroundTask();
    };
  }, [dispatch]);

  return <AppNavigator />;
};

export default AppWrapper;
