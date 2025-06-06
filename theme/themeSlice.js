import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTheme: 'dark',
  themes: {
    dark: {
      primary: '#4cc9f0',
      secondary: '#f72585',
      background: '#121212',
      card: '#1a1a1a',
      text: '#ffffff',
      border: '#333333',
    },
    light: {
      primary: '#4361ee',
      secondary: '#f72585',
      background: '#f8f9fa',
      card: '#ffffff',
      text: '#212529',
      border: '#dee2e6',
    },
    neon: {
      primary: '#00f5d4',
      secondary: '#f15bb5',
      background: '#0a0a0a',
      card: '#1a1a1a',
      text: '#ffffff',
      border: '#333333',
    },
  },
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    createTheme: (state, action) => {
      const { name, colors } = action.payload;
      state.themes[name] = colors;
    },
  },
});

export const { setTheme, createTheme } = themeSlice.actions;

export default themeSlice.reducer;