import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const LyricsViewer = () => {
  const { currentSong, playbackPosition } = useSelector(state => state.audio);
  const [lyrics, setLyrics] = useState([]);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch lyrics for the current song
    // Here's a mock implementation
    if (currentSong) {
      const mockLyrics = [
        { text: "[Verse 1]", time: 0 },
        { text: "This is the first line of the song", time: 5000 },
        { text: "This is the second line that comes next", time: 10000 },
        // ... more lyrics
      ];
      setLyrics(mockLyrics);
    }
  }, [currentSong]);

  useEffect(() => {
    if (lyrics.length === 0) return;
    
    // Find the current active line based on playback position
    let newActiveLine = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (lyrics[i].time <= playbackPosition) {
        newActiveLine = i;
      } else {
        break;
      }
    }
    
    setActiveLine(newActiveLine);
  }, [playbackPosition, lyrics]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollView => {
          if (scrollView && lyrics[activeLine]) {
            scrollView.scrollTo({
              y: activeLine * 50,
              animated: true,
            });
          }
        }}
      >
        {lyrics.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.lyricLine,
              index === activeLine && styles.activeLyric,
            ]}
          >
            {line.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  lyricLine: {
    color: '#aaa',
    fontSize: 18,
    marginVertical: 8,
    textAlign: 'center',
  },
  activeLyric: {
    color: '#4cc9f0',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LyricsViewer;

