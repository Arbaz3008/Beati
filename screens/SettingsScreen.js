import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Fontisto } from '@expo/vector-icons';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../theme/ThemeContext';

const SettingsScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      <ThemeToggle />
      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => navigation.navigate('Equalizer')}
      >
        <Fontisto name="equalizer" size={24} color={theme.icon} />
        <Text style={[styles.settingText, { color: theme.text }]}>Equalizer & Audio Effects</Text>
        <Ionicons name="arrow-forward" size={20} color={theme.subtitle} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => navigation.navigate('DjMode')}
      >
        <Ionicons name="musical-notes" size={24} color={theme.icon} />
        <Text style={[styles.settingText, { color: theme.text }]}>DJ Mode</Text>
        <Ionicons name="arrow-forward" size={20} color={theme.subtitle} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.settingItem, { borderBottomColor: theme.border }]}
        onPress={() => navigation.navigate('DjMode')}
      >
        <Ionicons name="notifications" size={24} color={theme.icon} />
        <Text style={[styles.settingText, { color: theme.text }]}>Alarm & Sleep Timer</Text>
        <Ionicons name="arrow-forward" size={20} color={theme.subtitle} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}  onPress={() => navigation.navigate('Share')}>
        <Ionicons name="share" size={24} color={theme.icon} />
        <Text style={[styles.settingText, { color: theme.text }]}>Nearby Sharing</Text>
        <Ionicons name="arrow-forward" size={20} color={theme.subtitle} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
        <Ionicons name="mic" size={24} color={theme.icon} />
        <Text style={[styles.settingText, { color: theme.text }]}>Voice Commands</Text>
        <Ionicons name="arrow-forward" size={20} color={theme.subtitle} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:11,
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
});

export default SettingsScreen;
