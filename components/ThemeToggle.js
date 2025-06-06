import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const ThemeToggle = () => {
  const { theme, themeName, toggleTheme } = useTheme();

  const themes = [
    { name: 'dark', label: 'Dark' },
    { name: 'neon', label: 'Neon' },
    { name: 'system', label: 'System Default' }
  ];

  return (

    <View style={[styles.container, { backgroundColor: theme.card }]}>
     
      
      {themes.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.button,
            themeName === item.name && styles.activeButton,
            { 
              borderColor: theme.primary,
              backgroundColor: themeName === item.name ? theme.primary + '20' : 'transparent'
            }
          ]}
          onPress={() => toggleTheme(item.name)}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
       flexDirection:"row",
       justifyContent:"space-between"
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,

  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
 
  },
  activeButton: {
    borderWidth: 2,
  },
  buttonText: {
    textAlign: 'center',
  },
});

export default ThemeToggle;