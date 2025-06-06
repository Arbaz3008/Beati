
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { unhideSong, setCurrentSong } from '../redux/audioSlice';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const WalletScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const hiddenSongs = useSelector(state => state.audio.hiddenSongs);
  const dispatch = useDispatch();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState([]);

  const handleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background, padding: 20, marginTop: 30 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, marginBottom: 10, color: theme.text }}>Hidden Songs</Text>
        <TouchableOpacity onPress={() => setSelectionMode(!selectionMode)}>
          <Text style={{ color: theme.primary, fontWeight: 'bold' }}>
            {selectionMode ? 'Cancel' : 'Select'}
          </Text>
        </TouchableOpacity>
        {selectionMode && selected.length > 0 && (
          <TouchableOpacity onPress={() => {
            selected.forEach(id => dispatch(unhideSong(id)));
            setSelected([]);
            setSelectionMode(false);
          }}>
            <Text style={{ color: 'green', fontWeight: 'bold', marginLeft: 8 }}>Unhide All</Text>
          </TouchableOpacity>
        )}
      </View>
     Bilkul! Song ke left side pe sequence number (1, 2, 3, ...) dikhana bohot asaan hai.  
FlatList ke renderItem me index prop milta hai, use yahan use karo:

js
<FlatList
  data={hiddenSongs}
  keyExtractor={item => item.id}
  renderItem={({ item, index }) => (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      justifyContent: 'space-between'
    }}>
      {/* Sequence number */}
      <Text style={{ color: theme.text, width: 30 }}>{index + 1}.</Text>
      {/* Song title */}
      <Text style={{ color: theme.text, flex: 1 }}>{item.title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {selectionMode && (
          <TouchableOpacity onPress={() => handleSelect(item.id)}>
            <Ionicons
              name={selected.includes(item.id) ? 'checkbox' : 'square-outline'}
              size={24}
              color={theme.primary}
              style={{ marginRight: 8 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => dispatch(unhideSong(item.id))}>
          <Ionicons name="remove-circle-outline" size={24} color={theme.primary} style={{ marginRight: 8 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          dispatch(setCurrentSong(item));
          navigation && navigation.navigate && navigation.navigate('SongDetail', { song: item });
        }}>
                <Ionicons name="play-circle-outline" size={24} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
       <TouchableOpacity onPress={()=>navigation.navigate('HomeMain')}>
          <Ionicons name="add-circle-outline" size={60} color={theme.primary} style={{ 
            alignSelf:"flex-end"}} />
        </TouchableOpacity>
    </View>
  );
};

export default WalletScreen;