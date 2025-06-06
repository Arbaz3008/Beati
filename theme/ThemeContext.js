import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState('system');
  const [isDark, setIsDark] = useState(systemTheme === 'dark');

 const themeMap = {
  light: {
    primary: '#4cc9f0',
    background: '#ffffff',
    card: '#f8f8f8',
    text: '#333333',
    subtext: '#666666',
    border: '#e0e0e0',
    tabBar: '#ffffff',
    tabActive: '#4cc9f0',
    tabInactive: '#888888',
    statusBar: 'dark',
    icon: '#333333',
    highlightBackground: '#e6f7ff',
    secondary: '#dddddd',
    accent: '#4cc9f0',
    inputBackground: '#f0f0f0',
    inputText: '#000000',
  },
  dark: {
    primary: '#4cc9f0',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    subtext: '#aaaaaa',
    border: '#333333',
    tabBar: '#1a1a1a',
    tabActive: '#4cc9f0',
    tabInactive: '#666666',
    statusBar: 'light',
    icon: '#ffffff',
    highlightBackground: '#1e1e1e',
    secondary: '#333333',
    accent: '#4cc9f0',
     inputBackground: '#2a2a2a',
      inputText: '#ffffff',
  },
  neon: {
    primary: '#00ff9d',
    background: '#0a0a0a',
    card: '#1a1a1a',
    text: '#ffffff',
    subtext: '#bbbbbb',
    border: '#00ff9d',
    tabBar: '#121212',
    tabActive: '#00ff9d',
    tabInactive: '#555555',
    statusBar: 'light',
    icon: '#00ff9d',
    highlightBackground: '#1f1f1f',
    secondary: '#111111',
    accent: '#00ff9d',
     inputBackground: '#1f1f1f',
     inputText: '#00ff9d',
  },
  system: {
    primary: '#4cc9f0',
    background: systemTheme === 'dark' ? '#121212' : '#ffffff',
    card: systemTheme === 'dark' ? '#1e1e1e' : '#f8f8f8',
    text: systemTheme === 'dark' ? '#ffffff' : '#333333',
    subtext: systemTheme === 'dark' ? '#aaaaaa' : '#666666',
    border: systemTheme === 'dark' ? '#333333' : '#e0e0e0',
    tabBar: systemTheme === 'dark' ? '#1a1a1a' : '#ffffff',
    tabActive: '#4cc9f0',
    tabInactive: systemTheme === 'dark' ? '#666666' : '#888888',
    statusBar: systemTheme === 'dark' ? 'light' : 'dark',
    icon: systemTheme === 'dark' ? '#ffffff' : '#333333',
    highlightBackground: systemTheme === 'dark' ? '#1e1e1e' : '#e6f7ff',
    secondary: systemTheme === 'dark' ? '#333333' : '#dddddd',
    accent: '#4cc9f0',
    inputBackground: systemTheme === 'dark' ? '#2a2a2a' : '#f0f0f0',
    inputText: systemTheme === 'dark' ? '#ffffff' : '#000000',
  }
};

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme');
        if (savedTheme) {
          setTheme(savedTheme);
          setIsDark(savedTheme === 'dark' || (savedTheme === 'system' && systemTheme === 'dark'));
        }
      } catch (error) {
        console.log('Error loading theme', error);
      }
    };
    
    loadTheme();
    
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === 'system') {
        setIsDark(colorScheme === 'dark');
      }
    });
    
    return () => subscription.remove();
  }, [theme, systemTheme]);

  const toggleTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('@theme', newTheme);
      setTheme(newTheme);
      setIsDark(newTheme === 'dark' || (newTheme === 'system' && systemTheme === 'dark'));
    } catch (error) {
      console.log('Error saving theme', error);
    }
  };

  const currentTheme = themeMap[theme] || themeMap.system;

  return (
    <ThemeContext.Provider value={{ 
      theme: currentTheme, 
      themeName: theme, 
      isDark, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);