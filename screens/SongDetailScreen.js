import React, { useState,useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { togglePlay, toggleFavorite, setPlaybackPosition, nextSong, prevSong } from '../redux/audioSlice';
import Slider from '@react-native-community/slider';
import { formatTime } from '../utils/timeUtils';
import { useTheme } from '../theme/ThemeContext';
import audioService from '../redux/audioService';
import { Menu, MenuItem } from 'react-native-material-menu';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const SongDetailScreen = ({ route, navigation }) => {
  const { song } = route.params;
  const dispatch = useDispatch();
  const { currentSong, isPlaying, playbackPosition, playbackDuration, favorites } = useSelector(state => state.audio);
 const sleepTimer = useSelector(state => state.audio.sleepTimer);
  const [remaining, setRemaining] = useState(sleepTimer ? sleepTimer * 60 : 0);
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();

    const handlePlayPause = async () => {
  await audioService.togglePlayback();
};

  const handleNext = () => dispatch(nextSong());
  const handlePrev = () => dispatch(prevSong());
  const handleFavorite = () => dispatch(toggleFavorite(song.id));
  const handleSeek = async (value) => {
    await audioService.seekTo(value);
  };

  const displaySong = currentSong || song;

  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);


   useEffect(() => {
    if (remaining > 0) {
      const interval = setInterval(() => {
        setRemaining(r => r - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [remaining]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      contentContainerStyle={styles.scrollContent}
    >
       
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>{displaySong.title}</Text>
       
      </View>

      <View style={styles.artworkContainer}>
        {song.artwork ? (
          <Image source={{ uri: song.artwork }} style={styles.artwork} />
        ) : (
          <View style={[styles.artworkPlaceholder, { backgroundColor: theme.card }]}>
            <Ionicons name="musical-notes" size={48} color={theme.primary} />
          </View>
        )}
      </View>

      <View style={styles.songInfo}>
        <Text style={[styles.artist, { color: theme.text }]}>{song.artist || 'Unknown Artist'}</Text>
        <Text style={[styles.album, { color: theme.subtext }]}>{song.album || 'Unknown Album'}</Text>
      </View>
      <View style={{alignSelf:"flex-start", marginLeft: 20, marginTop: 10}}>
         {sleepTimer > 0 && (

        <Text style={{ color: theme.text, fontSize: 16 }}>
          Sleep: {Math.floor(remaining / 60)}:{('0' + (remaining % 60)).slice(-2)}
        </Text>
      )}
      </View>
      <View style={styles.dots}>
       <Menu
          visible={visible}
          anchor={
            <TouchableOpacity onPress={showMenu}>
              <Ionicons name="ellipsis-vertical-circle-sharp" size={40} color={theme.text} />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          style={{ backgroundColor: theme.card }}
        >
          <MenuItem 
            onPress={() => {
              hideMenu();
              navigation.navigate('Equalizer');
            }}
            textStyle={{ color: theme.text }}
          >
            Equalizer
          </MenuItem>
          <MenuItem 
            onPress={() => {
              hideMenu();
              navigation.navigate('Lyrics');
            }}
            textStyle={{ color: theme.text }}
          >
            Lyrics
          </MenuItem>
          <MenuItem 
            onPress={() => {
              hideMenu();
              navigation.navigate('Playlists', { songId: song.id });
            }}
            textStyle={{ color: theme.text }}
          >
            Add to Playlist
          </MenuItem>
          <MenuItem
            onPress={() => {
              hideMenu();
              navigation.navigate('Wallet');
            }}
            textStyle={{ color: theme.text }}>
Wallet
          </MenuItem>
           <MenuItem
            onPress={() => {
              hideMenu();
              navigation.navigate('Sleep');
            }}
            textStyle={{ color: theme.text }}>
SleepTimer
          </MenuItem>
          <MenuItem
  onPress={async () => {
    hideMenu();
    // Song file ka URI lo, yahan example ke liye song.uri
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(song.uri);
    } else {
      alert('Sharing not available on this device');
    }
  }}
  textStyle={{ color: theme.text }}>
  Share
</MenuItem>

        </Menu>
        </View>
      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={playbackDuration}
          value={playbackPosition}
          minimumTrackTintColor={theme.primary}
          maximumTrackTintColor={theme.secondary}
          thumbTintColor={theme.primary}
          onSlidingComplete={handleSeek}
        />
        
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, { color: theme.subtext }]}>{formatTime(playbackPosition)}</Text>
          <Text style={[styles.timeText, { color: theme.subtext }]}>{formatTime(playbackDuration)}</Text>
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={handleFavorite}>
          <Ionicons 
            name={favorites.includes(song.id) ? "heart" : "heart-outline"} 
            size={32} 
            color={favorites.includes(song.id) ? theme.primary : theme.icon} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrev}>
          <Ionicons name="play-skip-back" size={40} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handlePlayPause} 
          style={[styles.playButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={48} 
            color={theme.background} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <Ionicons name="play-skip-forward" size={40} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Playlists', { songId: song.id })}>
          <Ionicons name="add" size={32} color={theme.icon} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dots:{
marginTop:11,
 alignSelf: 'flex-end',
  marginRight:22,
  marginBottom:11,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  artworkContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  artwork: {
    width: 250,
    height: 250,
    borderRadius: 8,
  },
  artworkPlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  artist: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  album: {
    fontSize: 16,
  },
  progressContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 8
  },
  timeText: {
    fontSize: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  playButton: {
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SongDetailScreen;