import { useState, useEffect, useCallback } from 'react';

export type ThemeType = 'jarvis' | 'ironman' | 'ultron' | 'vision' | 'friday';

interface ThemeColors {
  primary: string;
  primaryGlow: string;
  secondary: string;
  accent: string;
}

export const themes: Record<ThemeType, ThemeColors> = {
  jarvis: {
    primary: '190 100% 50%',
    primaryGlow: '190 100% 70%',
    secondary: '35 100% 55%',
    accent: '185 100% 45%',
  },
  ironman: {
    primary: '0 85% 55%',
    primaryGlow: '35 100% 60%',
    secondary: '35 100% 55%',
    accent: '0 90% 45%',
  },
  ultron: {
    primary: '0 0% 60%',
    primaryGlow: '0 85% 50%',
    secondary: '0 85% 45%',
    accent: '0 0% 70%',
  },
  vision: {
    primary: '280 80% 60%',
    primaryGlow: '280 100% 75%',
    secondary: '55 90% 55%',
    accent: '280 70% 50%',
  },
  friday: {
    primary: '210 100% 55%',
    primaryGlow: '210 100% 70%',
    secondary: '280 60% 55%',
    accent: '220 90% 50%',
  },
};

export const themeNames: Record<ThemeType, string> = {
  jarvis: 'JARVIS (Cyan)',
  ironman: 'Iron Man (Red/Gold)',
  ultron: 'Ultron (Silver/Red)',
  vision: 'Vision (Purple/Gold)',
  friday: 'F.R.I.D.A.Y (Blue)',
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('jarvis-theme');
    return (saved as ThemeType) || 'jarvis';
  });

  const applyTheme = useCallback((theme: ThemeType) => {
    const root = document.documentElement;
    const colors = themes[theme];
    
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--jarvis-cyan', colors.primary);
    root.style.setProperty('--jarvis-cyan-glow', colors.primaryGlow);
    root.style.setProperty('--jarvis-cyan-dim', colors.primary.replace(/\d+%$/, '30%'));
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--jarvis-orange', colors.secondary);
    root.style.setProperty('--jarvis-orange-glow', colors.secondary.replace(/\d+%$/, '65%'));
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--ring', colors.primary);
    root.style.setProperty('--sidebar-primary', colors.primary);
    root.style.setProperty('--sidebar-ring', colors.primary);
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const setTheme = useCallback((theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('jarvis-theme', theme);
  }, []);

  return { currentTheme, setTheme, themes, themeNames };
};
