import { useColorScheme } from 'react-native';
import { useContext } from 'react';
import { useThemeContext } from './ThemeContext';

export type ThemeType = 'light' | 'dark';

export const lightTheme = {
  background: '#f7faff',
  card: '#fff',
  text: '#222',
  primary: '#357ae8',
  secondary: '#b3d1ff',
  error: '#e83535',
};

export const darkTheme = {
  background: '#181c23',
  card: '#23272f',
  text: '#f7faff',
  primary: '#357ae8',
  secondary: '#22304a',
  error: '#e83535',
};

export function useThemeToggle() {
  const { theme, setTheme } = useThemeContext();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
}

export function getTheme(theme: ThemeType) {
  return theme === 'dark' ? darkTheme : lightTheme;
}
