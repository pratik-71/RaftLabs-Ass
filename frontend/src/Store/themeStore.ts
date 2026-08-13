import { create } from 'zustand';

interface ThemeState {
  colors: {
    primary: string;
    primaryHover: string;
    background: string;
    surface: string;
    textMain: string;
    textMuted: string;
    border: string;
    success: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export const useThemeStore = create<ThemeState>(() => ({
  colors: {
    primary: '#FA4A0C', // Vibrant Tomato Red
    primaryHover: '#E33A00',
    background: '#FFFFFF',
    surface: '#F6F6F9',
    textMain: '#2D2D2D',
    textMuted: '#9A9A9D',
    border: '#EAEAEA',
    success: '#4CAF50',
  },
  fonts: {
    heading: '"Outfit", sans-serif',
    body: '"Inter", sans-serif',
  }
}));
