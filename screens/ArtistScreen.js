import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import AlbumCard from '../components/AlbumCard';

const ArtistScreen = ({ route, navigation }) => {
  const { artist } = route.params;
  const { songs } = useSelector(state => state.audio);
  
  const artistSongs = songs.filter(song => song.artist === artist);
  const albums = [...new Set(artistSongs.map(song => song.album))];

  return (
    <View style={styles.container}>
      <View style={styles.artistHeader}>
        <View style={styles.artistPlaceholder}>
          <Ionicons name="person" size={48} color="#4cc9f0" />
        </View>
        <View style={styles.artistInfo}>
          <Text style={styles.artistName}>{artist}</Text>
          <Text style={styles.stats}>{albums.length} albums • {artistSongs.length} songs</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Albums</Text>
      <FlatList
        horizontal
        data={albums}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <AlbumCard 
            album={item} 
            artist={artist}
            onPress={() => navigation.navigate('Album', { album: item })}
          />
        )}
        contentContainerStyle={styles.horizontalList}
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Popular</Text>
      <FlatList
        data={artistSongs.slice(0, 5)}
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
  artistHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  artistPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  artistInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  artistName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stats: {
    color: '#aaa',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  horizontalList: {
    paddingBottom: 16,
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default ArtistScreen;