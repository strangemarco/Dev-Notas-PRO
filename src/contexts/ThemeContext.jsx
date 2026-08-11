import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext({
  theme: 'system',
  accentColor: 'blue',
  setTheme: () => {},
  setAccentColor: () => {},
});

export const ThemeProvider = ({ children }) => {
  // Inicializar estado desde localStorage o usar valores por defecto
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('devnotas-theme-v2') || 'light';
  });

  const [accentColor, setAccentColorState] = useState(() => {
    return localStorage.getItem('devnotas-accent-v2') || 'red';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('devnotas-theme-v2', newTheme);
  };

  const setAccentColor = (newColor) => {
    setAccentColorState(newColor);
    localStorage.setItem('devnotas-accent-v2', newColor);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar clase para el tema
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemPrefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }

    // Aplicar atributo para el color de acento
    root.setAttribute('data-accent', accentColor);
    
  }, [theme, accentColor]);

  // Escuchar cambios de preferencia del sistema si el tema es 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(e.matches ? 'dark' : 'light');
    };

    // Soporte para navegadores antiguos
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    accentColor,
    setTheme,
    setAccentColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
