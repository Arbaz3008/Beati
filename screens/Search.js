import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import SongItem from '../components/SongItem';
import { useTheme } from '../theme/ThemeContext';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const { queue: songs, currentSong } = useSelector(state => state.audio);
  const { theme } = useTheme();

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
        placeholder="Search songs..."
        placeholderTextColor={theme.text + '99'}
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongItem
            song={item}
            onPress={() => navigation.navigate('SongDetail', { song: item })}
            isCurrent={currentSong?.id === item.id}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 30,
  },
  input: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 0.5,
    borderColor: '#ccc',
    marginBottom: 10,
  },
});

export default SearchScreen;
