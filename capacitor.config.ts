import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'pl.aurine.documentstudio',
  appName: 'Aurine Document Studio',
  webDir: 'dist',
  server: {
    url: 'https://24821986-0778-4cd7-a537-86166b53ce81.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
