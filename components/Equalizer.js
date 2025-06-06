import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux';
import { setEqualizerPreset, toggleAudioEffect } from '../redux/audioSlice';
import { useTheme } from '../theme/ThemeContext'; // adjust path if needed

const Equalizer = () => {
  const dispatch = useDispatch();
  const { equalizerPreset, audioEffects } = useSelector(state => state.audio);
  const { theme } = useTheme();

  const [bands, setBands] = useState([
    { freq: '60Hz', value: 0 },
    { freq: '230Hz', value: 0 },
    { freq: '910Hz', value: 0 },
    { freq: '4kHz', value: 0 },
    { freq: '14kHz', value: 0 },
  ]);

  const presets = {
    normal: [0, 0, 0, 0, 0],
    pop: [2, 1, 0, 1, 2],
    rock: [4, 2, -1, 2, 4],
    jazz: [3, 1, 0, -1, 2],
    classical: [3, 1, 0, 1, 3],
    bass: [6, 3, 0, -1, -2],
    '8d': [5, 2, -2, 2, 5],
    '3d': [3, 1, -1, 1, 3],
  };

  useEffect(() => {
    if (equalizerPreset && presets[equalizerPreset]) {
      const newBands = bands.map((band, index) => ({
        ...band,
        value: presets[equalizerPreset][index],
      }));
      setBands(newBands);
    }
  }, [equalizerPreset]);

  const handleBandChange = (index, value) => {
    const newBands = [...bands];
    newBands[index].value = value;
    setBands(newBands);
  };

  const handlePresetSelect = (preset) => {
    dispatch(setEqualizerPreset(preset));
  };

  const toggleEffect = (effect) => {
    dispatch(toggleAudioEffect({ effect }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Equalizer</Text>

      <View style={styles.presetsRow}>
        {Object.keys(presets).map(preset => (
          <TouchableOpacity
            key={preset}
            style={[
              styles.presetButton,
              { backgroundColor: equalizerPreset === preset ? theme.primary : theme.secondary }
            ]}
            onPress={() => handlePresetSelect(preset)}
          >
            <Text style={{ color: theme.text, fontSize: 12 }}>
              {preset.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {bands.map((band, index) => (
        <View key={band.freq} style={styles.bandContainer}>
          <Text style={[styles.bandLabel, { color: theme.text }]}>{band.freq}</Text>
          <Slider
            style={styles.slider}
            minimumValue={-6}
            maximumValue={6}
            value={band.value}
            step={1}
            minimumTrackTintColor={theme.accent}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
            onValueChange={(value) => handleBandChange(index, value)}
          />
          <Text style={[styles.bandValue, { color: theme.text }]}>
            {band.value > 0 ? `+${band.value}` : band.value}
          </Text>
        </View>
      ))}

      <Text style={[styles.title, { color: theme.text }]}>Audio Effects</Text>

      <View style={styles.effectsContainer}>
        {['reverb', 'echo', 'reverse', '8d', '3d'].map(effect => (
          <TouchableOpacity
            key={effect}
            style={[
              styles.effectButton,
              {
                backgroundColor: audioEffects[effect] ? theme.primary : theme.secondary,
              }
            ]}
            onPress={() => toggleEffect(effect)}
          >
            <Text style={[styles.effectText, { color: theme.text }]}>
              {effect.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:50,
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  bandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bandLabel: {
    width: 50,
    fontSize: 12,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  bandValue: {
    width: 30,
    textAlign: 'right',
    fontSize: 12,
  },
  effectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  effectButton: {
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  effectText: {
    fontSize: 12,
  },
});

export default Equalizer;
