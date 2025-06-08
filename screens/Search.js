import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong } from '../redux/audioSlice';
import SongItem from '../components/SongItem';
import { useTheme } from '../theme/ThemeContext';
import { debounce } from 'lodash';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState([]);
  const { queue: songs, currentSong } = useSelector(state => state.audio);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  // Debounced search function
  const debouncedFilter = useCallback(
    debounce((searchTerm) => {
      const results = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSongs(results);
    }, 300),
    [songs]
  );

  // Update filtered songs when query changes
  useEffect(() => {
    debouncedFilter(query);
  }, [query, debouncedFilter]);

  // Initial set
  useEffect(() => {
    setFilteredSongs(songs);
  }, [songs]);

  // Memoized press handler
  const handlePress = useCallback(
    (song) => {
      dispatch(setCurrentSong(song));
      navigation.navigate('SongDetail', { song });
    },
    [dispatch, navigation]
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
        keyExtractor={(item, idx) => item.id + '_' + idx}
        renderItem={({ item }) => (
          <SongItem
            song={item}
            onPress={() => handlePress(item)}
            isCurrent={currentSong?.id === item.id}
          />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
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
