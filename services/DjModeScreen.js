import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Slider } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { toggleAudioEffect, setPlaybackRate } from '../redux/audioSlice';
import Equalizer from '../components/Equalizer';

const DjModeScreen = () => {
  const dispatch = useDispatch();
  const { audioEffects, playbackRate } = useSelector(state => state.audio);
  const [crossfade, setCrossfade] = useState(0);
  const [bpm, setBpm] = useState(120);
  const [isMixing, setIsMixing] = useState(false);

  const toggleMixing = () => {
    setIsMixing(!isMixing);
    if (!isMixing) {
      dispatch(toggleAudioEffect({ effect: 'echo', value: true }));
      dispatch(toggleAudioEffect({ effect: 'reverb', value: true }));
    }
  };

  const handleRateChange = (value) => {
    dispatch(setPlaybackRate(value));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DJ Mode</Text>
      
      <View style={styles.modeToggle}>
        <TouchableOpacity 
          style={[styles.toggleButton, isMixing && styles.activeToggle]}
          onPress={toggleMixing}
        >
          <Ionicons 
            name="md-musical-note" 
            size={24} 
            color={isMixing ? '#4cc9f0' : '#aaa'} 
          />
          <Text style={[styles.toggleText, isMixing && styles.activeToggleText]}>
            {isMixing ? 'Mixing ON' : 'Mixing OFF'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {isMixing && (
        <>
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Playback Speed: {playbackRate.toFixed(1)}x</Text>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={2.0}
              value={playbackRate}
              step={0.1}
              minimumTrackTintColor="#4cc9f0"
              maximumTrackTintColor="#333"
              thumbTintColor="#4cc9f0"
              onValueChange={handleRateChange}
            />
          </View>
          
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Crossfade: {crossfade}%</Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={crossfade}
              minimumTrackTintColor="#4cc9f0"
              maximumTrackTintColor="#333"
              thumbTintColor="#4cc9f0"
              onValueChange={setCrossfade}
            />
          </View>
          
          <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>BPM: {bpm}</Text>
            <Slider
              style={styles.slider}
              minimumValue={60}
              maximumValue={200}
              value={bpm}
              minimumTrackTintColor="#4cc9f0"
              maximumTrackTintColor="#333"
              thumbTintColor="#4cc9f0"
              onValueChange={setBpm}
            />
          </View>
          
          <Equalizer />
          
          <View style={styles.effectsRow}>
            <TouchableOpacity 
              style={[styles.effectButton, audioEffects.reverse && styles.activeEffect]}
              onPress={() => dispatch(toggleAudioEffect('reverse'))}
            >
              <Ionicons name="md-repeat" size={24} color={audioEffects.reverse ? '#4cc9f0' : '#aaa'} />
              <Text style={styles.effectText}>Reverse</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.effectButton, audioEffects.echo && styles.activeEffect]}
              onPress={() => dispatch(toggleAudioEffect('echo'))}
            >
              <Ionicons name="md-echo" size={24} color={audioEffects.echo ? '#4cc9f0' : '#aaa'} />
              <Text style={styles.effectText}>Echo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.effectButton, audioEffects.reverb && styles.activeEffect]}
              onPress={() => dispatch(toggleAudioEffect('reverb'))}
            >
              <Ionicons name="md-mic" size={24} color={audioEffects.reverb ? '#4cc9f0' : '#aaa'} />
              <Text style={styles.effectText}>Reverb</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
  modeToggle: {
    marginBottom: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeToggle: {
    borderColor: '#4cc9f0',
  },
  toggleText: {
    color: '#aaa',
    marginLeft: 12,
    fontSize: 16,
  },
  activeToggleText: {
    color: '#4cc9f0',
  },
  controlGroup: {
    marginBottom: 20,
  },
  controlLabel: {
    color: '#fff',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  effectsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  effectButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    width: '30%',
  },
  activeEffect: {
    backgroundColor: '#4cc9f0',
  },
  effectText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
});

export default DjModeScreen;
