import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../theme/ThemeContext'; 
import SongItem from '../components/SongItem';

const FavoritesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const songs = useSelector(state => state.audio?.songs || []);
  const favorites = useSelector(state => state.audio?.favorites || []);
  const currentSong = useSelector(state => state.audio?.currentSong);
const uniqueFavorites = [...new Set(favorites)];
const favoriteSongs = songs.filter(song => uniqueFavorites.includes(song.id));



  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: theme.subtext }]}>
        No favorite songs yet
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Favorites</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          {favoriteSongs.length} {favoriteSongs.length === 1 ? 'song' : 'songs'}
        </Text>
      </View>

      <FlatList
        data={favoriteSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem 
            song={item} 
            onPress={() => navigation.navigate('SongDetail', { song: item })}
            showOptions={false}
            isFavorite={true}
            isCurrent={currentSong?.id === item.id}
            theme={theme}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:11,
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 16,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;