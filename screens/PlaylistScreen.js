import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SongItem from '../components/SongItem';
import { useTheme } from '../theme/ThemeContext'; // Adjust the import path to your context file
import { useDispatch } from 'react-redux';
import { setCurrentSong } from '../redux/audioSlice';
const PlaylistScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();

  const { playlistId } = route.params;
  const { theme } = useTheme();

  const playlists = useSelector(state => state.playlists?.playlists || []);
  const songs = useSelector(state => state.audio?.songs || []);
  const playCounts = useSelector(state => state.playlists.playCounts);

  const playlist = playlists.find(p => p.id === playlistId);
  const playlistSongs = songs.filter(song => playlist?.songs?.includes(song.id));
const handleSongPress = (item) => {
  dispatch(setCurrentSong(item)); // Pehle currentSong set karo
  navigation.navigate('SongDetail'); // Bas screen pe jao, params ki zarurat nahi
};

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.playlistName, { color: theme.text }]} numberOfLines={1}>
          {playlist?.name}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={[styles.songCount, { color: theme.subtext }]}>
        {playlistSongs.length} songs
      </Text>

      <FlatList
        data={playlistSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem 
            song={item} 
            playCount={playCounts?.[item.id] || 0}
             onPress={() => handleSongPress(item)}
            showOptions={false}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30,
  },
  playlistName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  songCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default PlaylistScreen;
