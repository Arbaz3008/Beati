import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { setSleepTimer, pauseAudio, addTimerHistory } from '../redux/audioSlice';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import audioService from '../redux/audioService';
import BackgroundTimer from 'react-native-background-timer'; // Add this line

const SleepTimer = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [minutes, setMinutes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timerIdRef = useRef(null);
  const { theme } = useTheme();
  const { timerHistory = [], sleepTimer = 0 } = useSelector(state => state.audio);

  useEffect(() => {
    if (sleepTimer > 0) {
      setIsActive(true);
      setMinutes(sleepTimer);
    }
  }, []);

  const handleSetTimer = () => {
    const min = parseInt(minutes);
    if (min > 0) {
      dispatch(setSleepTimer(min));
      dispatch(addTimerHistory({
        id: Date.now(),
        duration: min,
        date: new Date().toISOString(),
        completed: false
      }));
      setIsActive(true);

      // Start background timer
      timerIdRef.current = BackgroundTimer.setTimeout(() => {
        audioService.pause();
        dispatch(pauseAudio());
        dispatch(setSleepTimer(0));
        dispatch(addTimerHistory({
          id: Date.now(),
          duration: min,
          date: new Date().toISOString(),
          completed: true
        }));
        setIsActive(false);
        setMinutes(0);
      }, min * 60 * 1000);

      navigation.goBack();
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerIdRef.current) {
        BackgroundTimer.clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  const handleCancelTimer = () => {
    if (timerIdRef.current) {
      BackgroundTimer.clearTimeout(timerIdRef.current);
    }
    dispatch(setSleepTimer(0));
    dispatch(addTimerHistory({
      id: Date.now(),
      duration: minutes,
      date: new Date().toISOString(),
      completed: false,
      cancelled: true
    }));
    setIsActive(false);
    setMinutes(0);
  };

  const formatHistoryItem = (item) => {
    const date = new Date(item.date);
    return {
      ...item,
      formattedDate: `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`,
      status: item.completed ? 'Completed' : item.cancelled ? 'Cancelled' : 'Active'
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>Sleep Timer</Text>

      <TextInput
        style={{
          backgroundColor: theme.inputBackground,
          color: theme.inputText,
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          textAlign: 'center',
          fontSize: 16,
        }}
        keyboardType="numeric"
        placeholder="Enter minutes"
        value={minutes.toString()}
        onChangeText={val => setMinutes(val.replace(/[^0-9]/g, ''))}
        editable={!isActive}
      />

      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: theme.primary }]}>
          {minutes > 0 ? `${minutes} min` : 'Off'}
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={120}
          value={Number(minutes)}
          step={5}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.border}
          thumbTintColor={theme.primary}
          onValueChange={(val) => setMinutes(Math.floor(val))}
          disabled={isActive}
        />
      </View>

      {!isActive ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: minutes > 0 ? theme.primary : theme.secondary }]}
          onPress={handleSetTimer}
          disabled={minutes <= 0}
        >
          <Ionicons name="time" size={20} color={minutes > 0 ? '#fff' : '#aaa'} />
          <Text style={[styles.buttonText, minutes <= 0 && styles.disabledText]}>
            Set Timer
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: '#ff3b30' }]}
          onPress={handleCancelTimer}
        >
          <Ionicons name="close" size={20} color="#fff" />
          <Text style={styles.buttonText}>Cancel Timer</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.historyTitle, { color: theme.text }]}>Timer History</Text>
      <FlatList
        data={Array.isArray(timerHistory) ? timerHistory.map(formatHistoryItem).reverse() : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.historyItem, { borderBottomColor: theme.border }]}>
            <Text style={[styles.historyText, { color: theme.text }]}>
              {item.duration} min at {item.formattedDate}
            </Text>
            <Text style={[
              styles.statusText,
              item.completed ? { color: '#4CAF50' } :
              item.cancelled ? { color: '#FF5722' } : { color: '#2196F3' }
            ]}>
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:40,
    flex: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  timerContainer: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#aaa',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  historyText: {
    fontSize: 14,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SleepTimer;
