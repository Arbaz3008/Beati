import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const PlaylistItem = ({ playlist, onPress }) => {
  const { theme } = useTheme();

  const renderIcon = () => {
    switch (playlist.type) {
      case 'favorites':
        return <Ionicons name="heart" size={24} color={theme.favorite} />;
      case 'recent':
        return <MaterialIcons name="history" size={24} color={theme.primary} />;
      default:
        return <Ionicons name="musical-notes" size={24} color={theme.icon} />;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderBottomColor: theme.border }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: theme.card }
      ]}>
        {renderIcon()}
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={[styles.songCount, { color: theme.subtext }]}>
          {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
        </Text>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={25} 
        color={theme.subtext} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default PlaylistItem;