import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { togglePlay, nextSong, prevSong, toggleShuffle, setRepeatMode } from '../redux/audioSlice';
import Slider from '@react-native-community/slider';
import { addToPlaylist,incrementPlayCount } from '../redux/playlistSlice';
import audioService from '../redux/audioService';
import { useTheme } from '../theme/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const MusicControls = () => {
  const navigation = useNavigation();
  const [songKey, setSongKey] = useState(0);
 
const playCounts = useSelector(state => state.playlists.playCounts || {});


useEffect(() => {
  const loadAndTrackSong = async () => {
    if (currentSong?.id && currentSong?.uri) {
      try {
        dispatch(addToPlaylist({ playlistId: 'Recently Played', songId: currentSong.id }));
        dispatch(incrementPlayCount(currentSong.id));

        if (playCounts[currentSong.id] >= 4) {
          dispatch(addToPlaylist({ playlistId: 'MostPlayed', songId: currentSong.id }));
        }

        await audioService.loadAndPlay(currentSong.uri, isPlaying);
      } catch (e) {
        console.log('loadAndPlay error:', e.message);
      }
    }
  };

  loadAndTrackSong();
}, [currentSong?.id, songKey]);


  const dispatch = useDispatch();
  const {
    currentSong,
    isPlaying,
    playbackPosition,
    playbackDuration,
    isShuffled,
    repeatMode,
  } = useSelector(state => state.audio);
  
  const { theme } = useTheme();



  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };


  const handleSeek = async (value) => {
    try {
      await audioService.seekTo(value);
    } catch (error) {
 
    }
  };
const handlePlayPause = async () => {
  await audioService.togglePlayback();
  
};

  const handleNext = () => {
    dispatch(nextSong());
    setSongKey(k => k + 1);

  };

  const handlePrevious = () => {
    dispatch(prevSong());
    setSongKey(k => k + 1);

  };

  const handleShuffle = () => {
    dispatch(toggleShuffle());
  };

  const handleRepeat = () => {
    const modes = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    dispatch(setRepeatMode(modes[nextIndex]));
  };


 const handleSongPress = () => {
     navigation.navigate('SongDetail', { song: currentSong });
   };


 




   if (!currentSong) return null;
  return (
    <View style={[styles.container, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
 <TouchableOpacity onPress={handleSongPress}>
     
  <View style={styles.songInfo}>
    <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>
      {currentSong.title || 'Unknown Title'}
    </Text>
    <Text style={[styles.songArtist, { color: theme.subtext }]} numberOfLines={1}>
      {currentSong.artist || 'Unknown Artist'}
    </Text>
    
  </View>
</TouchableOpacity>

      <Slider
        style={styles.progressBar}
        minimumValue={0}
        maximumValue={playbackDuration || 1}
        value={playbackPosition || 0}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={theme.border}
        thumbTintColor={theme.primary}
        onSlidingComplete={handleSeek}
      />
      
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: theme.subtext }]}>{formatTime(playbackPosition)}</Text>
        <Text style={[styles.timeText, { color: theme.subtext }]}>{formatTime(playbackDuration)}</Text>
      </View>
      
      <View style={styles.controlsRow}>
        <TouchableOpacity onPress={handleShuffle}>
          <Ionicons 
            name="shuffle" 
            size={24} 
            color={isShuffled ? theme.primary : theme.tabInactive} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handlePrevious}>
          <MaterialCommunityIcons name="skip-backward" size={32} color={theme.icon} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handlePlayPause} style={[styles.playButton, { backgroundColor: theme.primary }]}>
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={36} 
            color={theme.background} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleNext}>
          <MaterialCommunityIcons name="skip-forward" size={32} color={theme.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRepeat}>
          <MaterialIcons 
            name={repeatMode === 'one' ? 'repeat-one' : 'repeat'} 
            size={24} 
            color={repeatMode !== 'none' ? theme.primary : theme.tabInactive} 
          />
        </TouchableOpacity>
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
  },
  songInfo: {
    marginBottom: 8,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  songArtist: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    right:0,
    //left:13
  },
  playButton: {
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MusicControls;
