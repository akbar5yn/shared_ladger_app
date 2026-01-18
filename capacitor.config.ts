import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Shared Ladger',
  webDir: '.output/public',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;
