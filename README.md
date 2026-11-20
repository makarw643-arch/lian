# Lian · Personal Planner PWA

A calm, offline-first personal planner web application optimized for mobile devices (iPhone, iPad, Android) and desktop browsers.

## Features
- **Direct Access**: No login or registration required; all planner data saves locally in `localStorage` and `IndexedDB`.
- **Optional Local Passcode Lock**: Disabled by default; optionally enable AES-GCM 256 local encryption in Settings.
- **Offline PWA**: Service Worker (`/sw.js`) and Web App Manifest (`/manifest.webmanifest`) with iOS `apple-touch-icon` and Android maskable icons.
- **Planner Suite**: Daily tasks, habits & yearly overview, mood tracker, sleep log, 5 interactive notebooks with stickers, local gramophone audio player, Pomodoro focus timer, stopwatch, and Jalali/Gregorian calendar.
