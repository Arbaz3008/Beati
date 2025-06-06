import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createPlaylist, addToPlaylist } from '../redux/playlistSlice';
import { useTheme } from '../theme/ThemeContext';

const PlaylistModal = ({ visible, onClose, songId }) => {
  const dispatch = useDispatch();
 const playlists = useSelector(state => state.playlists?.playlists || []);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const { theme } = useTheme();

  const handleAddToPlaylist = (playlistId) => {
    dispatch(addToPlaylist({ playlistId, songId }));
    onClose();
  };

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      dispatch(createPlaylist(newPlaylistName));
      setNewPlaylistName('');
      setShowNewPlaylistInput(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add to Playlist</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close-thick" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          
          {!showNewPlaylistInput ? (
            <>
              <FlatList
                data={playlists.filter(p => p.id !== 'recent')}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.playlistItem, { borderBottomColor: theme.border }]}
                    onPress={() => handleAddToPlaylist(item.id)}
                  >
                    <Ionicons name="musical-notes" size={20} color={theme.text} />
                    <Text style={[styles.playlistName, { color: theme.text }]}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: theme.subtext }]}>
                    No playlists available
                  </Text>
                }
              />
              
              <TouchableOpacity 
                style={styles.newPlaylistButton}
                onPress={() => setShowNewPlaylistInput(true)}
              >
                <Ionicons name="add" size={20} color={theme.primary} />
                <Text style={[styles.newPlaylistText, { color: theme.primary }]}>
                  Create New Playlist
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.newPlaylistContainer}>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    backgroundColor: theme.inputBackground,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                placeholder="Playlist name"
                placeholderTextColor={theme.subtext}
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                autoFocus
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[
                    styles.cancelButton, 
                    { backgroundColor: theme.secondary }
                  ]}
                  onPress={() => {
                    setShowNewPlaylistInput(false);
                    setNewPlaylistName('');
                  }}
                >
                  <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.createButton, 
                    { backgroundColor: theme.primary }
                  ]}
                  onPress={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                >
                  <Text style={[styles.buttonText, { color: theme.buttonText }]}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  playlistName: {
    marginLeft: 12,
    fontSize: 16,
  },
  newPlaylistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  newPlaylistText: {
    marginLeft: 12,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  newPlaylistContainer: {
    marginTop: 16,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  createButton: {
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlaylistModal;