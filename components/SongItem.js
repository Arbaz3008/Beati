// SongItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { playSongAsync } from '../redux/audioThunks';
const SongItem = ({ song, isCurrent,onPress }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const formatDuration = (sec = 0) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

const handlePress = () => {
  if (isCurrent) return;
  dispatch(playSongAsync(song));
};




  return (

          <TouchableOpacity
     onPress={onPress}

      style={[
        styles.container,
        { backgroundColor: isCurrent ? theme.highlightBackground : theme.background },
        { borderBottomColor: theme.border },
      ]}
    >
      {song.artwork ? (
        <Image 
          source={{ uri: song.artwork }} 
          style={[styles.artwork, { backgroundColor: theme.secondary }]}
        />
      ) : (
        <View style={[styles.artworkPlaceholder, { backgroundColor: theme.secondary }]}>
          <Ionicons name="musical-notes" size={24} color={theme.icon} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {song.title}
        </Text>
        <Text style={[styles.artist, { color: theme.subtext }]} numberOfLines={1}>
          {song.artist} • {song.album}
        </Text>
        
      </View>

      <Text style={[styles.duration, { color: theme.subtext }]}>
        {formatDuration(song.duration)}
      </Text>

      {isCurrent && (
        <Ionicons
          name="play"
          size={24}
          style={styles.playingIcon}
          color={theme.accent}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  artworkPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
  },
  duration: {
    fontSize: 14,
    marginRight: 8,
  },
  playingIcon: {
    marginLeft: 8,
  },
});

export default SongItem;