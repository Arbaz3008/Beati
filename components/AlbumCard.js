// AlbumCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AlbumCard = ({ album, artist, artwork, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.artworkContainer}>
        {artwork ? (
          <Image 
            source={{ uri: artwork }} 
            style={styles.artwork}
            resizeMode="cover"
          />
        ) : (
          <Ionicons name="album" size={60} color="#4cc9f0" />
        )}
      </View>
      <Text style={styles.albumTitle} numberOfLines={1}>{album || 'Unknown Album'}</Text>
      <Text style={styles.artist} numberOfLines={1}>{artist || 'Unknown Artist'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 16,
  },
  artworkContainer: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  albumTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artist: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default AlbumCard;