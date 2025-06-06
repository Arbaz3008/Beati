import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { toggleAudioEffect, setPlaybackRate } from '../redux/audioSlice';
import Slider from '@react-native-community/slider';

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
            name="musical-note" 
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
          
          <View style={styles.effectsRow}>
            <TouchableOpacity 
              style={[styles.effectButton, audioEffects.reverse && styles.activeEffect]}
              onPress={() => dispatch(toggleAudioEffect('reverse'))}
            >
              <Ionicons name="repeat" size={24} color={audioEffects.reverse ? '#4cc9f0' : '#aaa'} />
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
   activeToggleText: {
    color: '#4cc9f0',
  },
  toggleText: {
    color: '#aaa',
    marginLeft: 8,
    fontSize: 16,
  },
  controlGroup: {
    marginBottom: 24,
  },
  controlLabel: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
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
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    width: '30%',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeEffect: {
    borderColor: '#4cc9f0',
  },
  effectText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 12,
  },
  // Add these new styles for enhanced UI
  bpmDisplay: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  bpmText: {
    color: '#4cc9f0',
    fontSize: 32,
    fontWeight: 'bold',
  },
  bpmLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  beatIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  beatDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  activeBeatDot: {
    backgroundColor: '#4cc9f0',
  },
  trackControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  trackControl: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  trackButton: {
    backgroundColor: '#4cc9f0',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  trackButtonText: {
    color: '#121212',
    fontWeight: 'bold',
  }
  });

export default DjModeScreen;