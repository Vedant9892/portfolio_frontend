import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme: 'light' or 'dark'. Stored in localStorage so it persists across visits.
 * We toggle a class on <body> so CSS can style the whole page (e.g. body.dark).
 */
const STORAGE_KEY = 'portfolio-theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (value) => {
    setThemeState(value === 'dark' ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
