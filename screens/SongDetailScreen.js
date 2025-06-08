import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity ,Modal, Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { toggleFavorite, setPlaybackPosition, nextSong, prevSong } from '../redux/audioSlice';
import Slider from '@react-native-community/slider';
import { formatTime } from '../utils/timeUtils';
import { useTheme } from '../theme/ThemeContext';
import audioService from '../redux/audioService';
import { Menu, MenuItem } from 'react-native-material-menu';
import * as Sharing from 'expo-sharing';
import { addToPlaylist, incrementPlayCount } from '../redux/playlistSlice';

const SongDetailScreen = ({ navigation }) => {
 
  const dispatch = useDispatch();
  
  const { currentSong, isPlaying, playbackPosition, playbackDuration, favorites, sleepTimer } = useSelector(state => state.audio);
  const playCounts = useSelector(state => state.playlists.playCounts || {});
  const playlists = useSelector(state => state.playlists?.playlists || []);
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(sleepTimer ? sleepTimer * 60 : 0);
const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const displaySong = useMemo(() => currentSong, [currentSong]);

  useEffect(() => {
    if (currentSong?.id) {
      dispatch(addToPlaylist({ playlistId: 'Recently Played', songId: currentSong.id }));
      dispatch(incrementPlayCount(currentSong.id));
      if (playCounts[currentSong.id] >= 4) {
        dispatch(addToPlaylist({ playlistId: 'MostPlayed', songId: currentSong.id }));
      }
      audioService.loadAndPlay(currentSong.uri, isPlaying).catch(() => {});
    }
  }, [currentSong?.id]);

  useEffect(() => {
    if (remaining > 0) {
      const interval = setInterval(() => setRemaining(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [remaining]);
const handleAddToSelectedPlaylist = (playlistId) => {
  dispatch(addToPlaylist({ playlistId, songId: displaySong.id }));
  setShowPlaylistModal(false);
  // Optional: Show a toast message
  Alert.alert('Song added to playlist!');
};
  const handlePlayPause = useCallback(async () => {
    await audioService.togglePlayback();
  }, []);

  const handleNext = useCallback(() => dispatch(nextSong()), []);
  const handlePrev = useCallback(() => dispatch(prevSong()), []);

  const handleFavorite = useCallback(() => {
    if (displaySong?.id) dispatch(toggleFavorite(displaySong.id));
  }, [displaySong]);

  const handleSeek = useCallback(async (value) => {
    await audioService.seekTo(value);
  }, []);

  const showMenu = () => setVisible(true);
  const hideMenu = () => setVisible(false);

  const renderArtwork = () => {
    return displaySong?.artwork ? (
      <Image source={{ uri: displaySong.artwork }} style={styles.artwork} />
    ) : (
      <View style={[styles.artworkPlaceholder, { backgroundColor: theme.card }]}> 
        <Ionicons name="musical-notes" size={48} color={theme.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.songTitle, { color: theme.text }]} numberOfLines={1}>
          {displaySong?.title}
        </Text>
      </View>

      <View style={styles.artworkContainer}>{renderArtwork()}</View>

      <View style={styles.songInfo}>
        <Text style={[styles.artist, { color: theme.text }]}>{displaySong?.artist || 'Unknown Artist'}</Text>
        <Text style={[styles.album, { color: theme.subtext }]}>{displaySong?.album || 'Unknown Album'}</Text>
      </View>

      {sleepTimer > 0 && (
        <Text style={{ color: theme.text, fontSize: 16, marginLeft: 20 }}>
          Sleep: {Math.floor(remaining / 60)}:{('0' + (remaining % 60)).slice(-2)}
        </Text>
      )}

      <View style={styles.dots}>
        <Menu
          visible={visible}
          anchor={<TouchableOpacity onPress={showMenu}><Ionicons name="ellipsis-vertical-circle-sharp" size={40} color={theme.text} /></TouchableOpacity>}
          onRequestClose={hideMenu}
          style={{ backgroundColor: theme.card }}
        >
          <MenuItem textStyle={{ color: theme.text }} onPress={() => { hideMenu(); navigation.navigate('Equalizer'); }}>Equalizer</MenuItem>
          <MenuItem textStyle={{ color: theme.text }} onPress={() => { hideMenu(); navigation.navigate('Wallet'); }}>Wallet</MenuItem>
          <MenuItem textStyle={{ color: theme.text }} onPress={() => { hideMenu(); navigation.navigate('Sleep'); }}>SleepTimer</MenuItem>
          <MenuItem textStyle={{ color: theme.text }} onPress={async () => {
            hideMenu();
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(displaySong.uri);
            } else {
              Alert.alert('Sharing not available on this device');
            }
          }}>Share</MenuItem>
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
          <Ionicons name={favorites.includes(displaySong.id) ? 'heart' : 'heart-outline'} size={32} color={favorites.includes(displaySong.id) ? theme.primary : theme.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePrev}><Ionicons name="play-skip-back" size={40} color={theme.icon} /></TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPause} style={[styles.playButton, { backgroundColor: theme.primary }]}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color={theme.background} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}><Ionicons name="play-skip-forward" size={40} color={theme.icon} /></TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPlaylistModal(true)}>
          <Ionicons name="add" size={32} color={theme.icon} />
        </TouchableOpacity>
      </View>
      <Modal visible={showPlaylistModal} transparent={true}>
  <View style={[styles.modalContainer, { backgroundColor: theme.Background }]}>
    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
      <Text style={[styles.modalTitle, { color: theme.text }]}>Add to Playlist</Text>
      
      {playlists.filter(p => p.id !== 'Recently Played' && p.id !== 'MostPlayed').map(playlist => (
        <TouchableOpacity 
          key={playlist.id}
          onPress={() => handleAddToSelectedPlaylist(playlist.id)}
          style={styles.playlistItem}
        >
          <Text style={{ color: theme.text }}>{playlist.name}</Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity 
        onPress={() => setShowPlaylistModal(false)}
        style={styles.closeButton}
      >
        <Text style={{ color: theme.primary }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20, flex: 1 },
  header: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  songTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center', marginHorizontal: 16 },
  artworkContainer: { alignItems: 'center', marginVertical: 24 },
  artwork: { width: 250, height: 250, borderRadius: 8 },
  artworkPlaceholder: { width: 250, height: 250, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  songInfo: { alignItems: 'center', marginBottom: 24 },
  artist: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  album: { fontSize: 16 },
  dots: { marginTop: 11, alignSelf: 'flex-end', marginRight: 22, marginBottom: 11 },
  progressContainer: { paddingHorizontal: 16, marginBottom: 24 },
  progressBar: { width: '100%', height: 40 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4, paddingHorizontal: 8 },
  timeText: { fontSize: 20 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 32, paddingHorizontal: 16 },
  playButton: { borderRadius: 50, width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
  width: '80%',
  padding: 20,
  borderRadius: 10,
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
  textAlign: 'center',
},
playlistItem: {
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
closeButton: {
  marginTop: 15,
  alignSelf: 'center',
  padding: 10,
},
});

export default SongDetailScreen;