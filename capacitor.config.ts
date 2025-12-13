import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4e51ff14e5744785a12c4b4defb87d89',
  appName: 'JARVIS AI Assistant',
  webDir: 'dist',
  server: {
    url: 'https://4e51ff14-e574-4785-a12c-4b4defb87d89.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    App: {
      androidScheme: 'https'
    }
  }
};

export default config;
