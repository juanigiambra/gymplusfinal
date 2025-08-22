// Definición de tipos y constantes para el tema
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

export const getTheme = (theme: ThemeType) => {
  return theme === 'dark' ? darkTheme : lightTheme;
};
