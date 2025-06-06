import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux';
import SongItem from '../components/SongItem';

const AlbumScreen = ({ route, navigation }) => {
  const { album } = route.params;
  const { songs } = useSelector(state => state.audio);
  
  const albumSongs = songs.filter(song => song.album === album);

  return (
    <View style={styles.container}>
      <View style={styles.albumHeader}>
        {albumSongs[0]?.artwork ? (
          <Image source={{ uri: albumSongs[0].artwork }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkPlaceholder]}>
            <Ionicons name="album" size={48} color="#4cc9f0" />
          </View>
        )}
        <View style={styles.albumInfo}>
          <Text style={styles.albumTitle}>{album}</Text>
          <Text style={styles.artist}>{albumSongs[0]?.artist || 'Unknown Artist'}</Text>
          <Text style={styles.songCount}>{albumSongs.length} songs</Text>
        </View>
      </View>

      <FlatList
        data={albumSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem 
            song={item} 
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
  albumHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  artwork: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 16,
  },
  artworkPlaceholder: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  albumTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  artist: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 8,
  },
  songCount: {
    color: '#aaa',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default AlbumScreen;