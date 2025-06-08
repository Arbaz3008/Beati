import React, { useEffect, useState, useRef,useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSong } from '../redux/audioSlice';
import { loadAudioFilesFromDevice } from '../redux/audioThunks';
import SongItem from '../components/SongItem';
import MusicControls from '../components/MusicControls';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { hideSong,playSongFromQueue } from '../redux/audioSlice';

const sortingOptions = [
  { label: 'Name (A-Z)', value: 'name_asc' },
  { label: 'Name (Z-A)', value: 'name_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
];

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { songs, hiddenSongs, currentSong } = useSelector(state => state.audio);
const visibleSongs = useMemo(() => 
  songs.filter(song => !hiddenSongs.some(h => h.id === song.id)),
  [songs, hiddenSongs]
);

  const { theme } = useTheme();
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortType, setSortType] = useState('name_asc');
  const [sortedSongs, setSortedSongs] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const pressTimers = useRef({});

  useEffect(() => {
    let sorted = [...visibleSongs];
    if (sortType === 'name_asc') sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === 'name_desc') sorted.sort((a, b) => b.title.localeCompare(a.title));
    if (sortType === 'newest') sorted.sort((a, b) => b.id.localeCompare(a.id));
    if (sortType === 'oldest') sorted.sort((a, b) => a.id.localeCompare(b.id));
    setSortedSongs(sorted);
  }, [visibleSongs, sortType]);
  
 

  useEffect(() => {
    dispatch(loadAudioFilesFromDevice());
    return () => {
      // Clean up all timers when component unmounts
      Object.values(pressTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, [dispatch]);

  const handleSongPress = (song) => {
    dispatch(setCurrentSong(song));
    navigation.navigate('SongDetail', { song });
  };

  const handleSongLongPress = (song) => {
    setSelectionMode(true);
    setSelectedSongs(prev => [...prev, song.id]);
  };

  const handleSongPressIn = (song) => {
    pressTimers.current[song.id] = setTimeout(() => {
      handleSongLongPress(song);
    }, 1000); // 1 second delay
  };

  const handleSongPressOut = (song) => {
    clearTimeout(pressTimers.current[song.id]);
  };
  const handlePlaySong = (song) => {
  dispatch(playSongFromQueue({
    queue: sortedSongs,
    songId: song.id
  }));
  navigation.navigate('SongDetail', { song });
};


  const currentIndex = songs.findIndex(song => song.id === currentSong?.id);

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
          {currentIndex >= 0 ? `${currentIndex + 1} / ${songs.length}` : `0 / ${songs.length}`}
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
        data={visibleSongs}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (selectionMode) {
                setSelectedSongs(prev =>
                  prev.includes(item.id)
                    ? prev.filter(id => id !== item.id)
                    : [...prev, item.id]
                );
              } else {
                handleSongPress(item);
              }
            }}
            onPressIn={() => handleSongPressIn(item)}
            onPressOut={() => handleSongPressOut(item)}
            onLongPress={() => handleSongLongPress(item)}
            delayLongPress={300}
            style={{
              backgroundColor: selectedSongs.includes(item.id) ? '#e0e0e0' : theme.background,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {selectionMode && (
              <Ionicons
                name={selectedSongs.includes(item.id) ? 'checkbox' : 'square-outline'}
                size={24}
                color={theme.primary}
                style={{ marginRight: 8 }}
              />
            )}
        <SongItem
  song={item}
  onPress={() => handlePlaySong(item)}
  isCurrent={currentSong?.id === item.id}
/>

          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
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