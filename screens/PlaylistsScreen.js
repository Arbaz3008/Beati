import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { createPlaylist } from '../redux/playlistSlice';
import PlaylistItem from '../components/PlaylistItem';
import { useTheme } from '../theme/ThemeContext'; // ✅ Import theme hook

const PlaylistsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { playlists } = useSelector(state => state.playlists);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { theme } = useTheme(); // ✅ Get theme object

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      dispatch(createPlaylist(newPlaylistName));
      setNewPlaylistName('');
      setShowNewPlaylistInput(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Playlists</Text>

      {!showNewPlaylistInput ? (
        <TouchableOpacity 
          style={[styles.newPlaylistButton, { backgroundColor: theme.card }]}
          onPress={() => setShowNewPlaylistInput(true)}
        >
          <Ionicons name="add" size={24} color={theme.primary} />
          <Text style={[styles.newPlaylistText, { color: theme.primary }]}>New Playlist</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.newPlaylistContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
            placeholder="Playlist name"
            placeholderTextColor={theme.placeholder}
            value={newPlaylistName}
            onChangeText={setNewPlaylistName}
            autoFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: theme.border }]}
              onPress={() => {
                setShowNewPlaylistInput(false);
                setNewPlaylistName('');
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: theme.primary }]}
              onPress={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
            >
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlaylistItem 
            playlist={item} 
            onPress={() => navigation.navigate('Playlist', { playlistId: item.id })}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:11,
    flex: 1,
    //backgroundColor: '#121212',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  newPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    //backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 16,
  },
  newPlaylistText: {
    color: '#4cc9f0',
    marginLeft: 12,
    fontSize: 16,
  },
  newPlaylistContainer: {
    marginBottom: 16,
  },
  input: {
    //backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    //backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  createButton: {
    //backgroundColor: '#4cc9f0',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 80,
  },
});

export default PlaylistsScreen;
