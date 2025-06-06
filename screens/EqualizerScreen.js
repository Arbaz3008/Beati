import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Equalizer from '../components/Equalizer';
import SleepTimer from '../components/SleepTimer';

const EqualizerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Settings</Text>
      
      <Equalizer />
      
      <SleepTimer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
});

export default EqualizerScreen;