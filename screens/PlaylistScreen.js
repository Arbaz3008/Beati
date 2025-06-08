import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import SongItem from '../components/SongItem';

const PlaylistScreen = ({ route, navigation }) => {
const { playlistId } = route.params;
  const playlists = useSelector(state => state.playlists?.playlists || []);
  const songs = useSelector(state => state.audio?.songs || []);


const playlist = playlists.find(p => p.id === playlistId);

  const playlistSongs = songs.filter(song => playlist?.songs?.includes(song.id));
const playCounts = useSelector(state => state.playlists.playCounts);


return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.playlistName} numberOfLines={1}>{playlist?.name}</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.songCount}>{playlistSongs.length} songs</Text>
      <FlatList
        data={playlistSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <SongItem 
  song={item} 
  playCount={playCounts?.[item.id] || 0}
  onPress={() => navigation.navigate('SongDetail', { song: item })}
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
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  playlistName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  songCount: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default PlaylistScreen;