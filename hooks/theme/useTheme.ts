import { useThemeContext } from './ThemeContext';
import { getTheme } from './ThemeConstants';
export * from './ThemeConstants';

export function useThemeToggle() {
  const { theme, setTheme } = useThemeContext();
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const colors = getTheme(theme);
  return { theme, toggleTheme, colors };
}
