import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong, hideSong, playSongFromQueue } from '../redux/audioSlice';
import { loadAudioFilesFromDevice } from '../redux/audioThunks';
import SongItem from '../components/SongItem';
import MusicControls from '../components/MusicControls';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const sortingOptions = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
];

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { songs, hiddenSongs, currentSong } = useSelector(state => state.audio);
  const { theme } = useTheme();
 const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortType, setSortType] = useState('name_asc');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const pressTimers = useRef({});

  const visibleSongs = useMemo(() =>
    songs.filter(song => !hiddenSongs.some(h => h.id === song.id)),
    [songs, hiddenSongs]
  );

  const sortedSongs = useMemo(() => {
    const sorted = [...visibleSongs];
    switch (sortType) {
      case 'name_asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sorted.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'oldest':
        sorted.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    return sorted;
  }, [visibleSongs, sortType]);

 

  useEffect(() => {
    dispatch(loadAudioFilesFromDevice());
    return () => {
      Object.values(pressTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, [dispatch]);

  const currentIndex = useMemo(
    () => songs.findIndex(song => song.id === currentSong?.id),
    [songs, currentSong]
  );
  

  const handleSongPress = useCallback((song) => {
    dispatch(setCurrentSong(song));
    navigation.navigate('SongDetail', { song });
  }, [dispatch, navigation]);

  const handleSongLongPress = useCallback((song) => {
    setSelectionMode(true);
    setSelectedSongs(prev => [...prev, song.id]);
  }, []);

  const handleSongPressIn = useCallback((song) => {
    pressTimers.current[song.id] = setTimeout(() => {
      handleSongLongPress(song);
    }, 1000);
  }, [handleSongLongPress]);

  const handleSongPressOut = useCallback((song) => {
    clearTimeout(pressTimers.current[song.id]);
  }, []);

  const handlePlaySong = useCallback((song) => {
    dispatch(playSongFromQueue({ queue: sortedSongs, songId: song.id }));
    navigation.navigate('SongDetail', { song });
  }, [dispatch, sortedSongs, navigation]);

  const toggleSelection = useCallback((id) => {
    setSelectedSongs(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  }, []);

  const renderItem = useCallback(({ item }) => {
    const isSelected = selectedSongs.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => selectionMode ? toggleSelection(item.id) : handleSongPress(item)}
        onPressIn={() => handleSongPressIn(item)}
        onPressOut={() => handleSongPressOut(item)}
        delayLongPress={300}
        style={[
          styles.songRow,
          { backgroundColor: isSelected ? '#e0e0e0' : theme.background }
        ]}
      >
        {selectionMode && (
          <Ionicons
            name={isSelected ? 'checkbox' : 'square-outline'}
            size={24}
            color={theme.primary}
            style={styles.checkboxIcon}
          />
        )}
        <SongItem
          song={item}
          onPress={() => handlePlaySong(item)}
          isCurrent={currentSong?.id === item.id}
        />
      </TouchableOpacity>
    );
  }, [selectionMode, selectedSongs, handleSongPress, handlePlaySong, handleSongPressIn, handleSongPressOut, theme, currentSong]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
        <Text style={[styles.title, { color: theme.text }]}>All Songs</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowSortOptions(true)}>
          <MaterialIcons name="swap-vert-circle" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          if (selectionMode && selectedSongs.length > 0) {
            selectedSongs.forEach(id => dispatch(hideSong(id)));
            setSelectedSongs([]);
          }
          setSelectionMode(!selectionMode);
        }}>
          <MaterialCommunityIcons
            name={selectionMode ? 'lock' : 'lock-open'}
            size={24}
            color={selectionMode ? theme.primary : theme.text}
          />
        </TouchableOpacity>
        <Text style={[styles.total, { color: theme.text }]}>
          {currentIndex >= 0 ? `${currentIndex + 1} / ${visibleSongs.length}` : `0 / ${visibleSongs.length}`}

        </Text>
      </View>

      <Modal
        visible={showSortOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            {sortingOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setSortType(opt.value);
                  setShowSortOptions(false);
                }}
                style={styles.modalOption}
              >
                <Text style={{ color: theme.text }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <FlatList
        data={sortedSongs}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderItem}
        extraData={selectedSongs}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={(data, index) => (
          { length: 70, offset: 70 * index, index }
        )}
      />

      {currentSong && <MusicControls navigation={navigation} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    padding: 10,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  total: {
    fontSize: 16,
    marginBottom: 5,
  },
  listContent: {
    paddingBottom: 80,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxIcon: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#0006',
  },
  modalContent: {
    borderRadius: 8,
    marginTop: 60,
    elevation: 5,
  },
  modalOption: {
    padding: 12,
  },
});

export default HomeScreen;
