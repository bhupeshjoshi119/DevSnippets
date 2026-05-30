# Async Storage - Code Snippet Manager

A cross-platform mobile application for managing code snippets built with Expo and React Native. This app allows developers to save, organize, and quickly access their frequently used code snippets across different programming languages.

## Features

- **Save Snippets**: Store code snippets with titles, languages, and tags
- **Search & Filter**: Easily find snippets by title, language, or tags
- **Favorites**: Mark snippets as favorites for quick access
- **Organization**: View snippets in a clean, sortable list
- **Cross-Platform**: Works on iOS, Android, and Web
- **Persistent Storage**: Uses AsyncStorage for reliable data persistence
- **Modern UI**: Clean interface with intuitive navigation

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 55)
- **Language**: TypeScript
- **State Management**: Custom hooks with Context API
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **UI Components**: React Native core components + Expo Vector Icons
- **Data Persistence**: [@react-native-async-storage/async-storage](https://github.com/react-native-async-storage/async-storage)
- **Additional Libraries**:
  - React Navigation (Bottom Tabs, Elements)
  - Expo Constants, Device, Font, Glass Effect, Image, Linking, Splash Screen, SQLite, Status Bar, Symbols, System UI, Web Browser
  - React Native Gesture Handler, Reanimated, Safe Area Context, Screens, Web, Worklets
  - Expo Secure Store
  - Expo Vector Icons

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio (for Android emulators)
- Physical device for testing (optional but recommended)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd async-storage
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Choose your preferred platform:
   - Press `a` to open on Android emulator
   - Press `i` to open on iOS simulator
   - Press `w` to open in web browser
   - Scan the QR code with Expo Go app on your physical device

## Project Structure

```
src/
├── app/                    # Expo Router pages (file-based routing)
│   ├── index.tsx          # Home screen - snippet list
│   ├── create-snippet.tsx # Create new snippet form
│   ├── snippet-details.tsx # View/edit snippet details
│   ├── favorites.tsx      # Favorite snippets collection
│   ├── file-manager.tsx   # File management interface
│   └── settings.tsx       # Application settings
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
│   └── useSnippets.ts     # Snippet data management hook
├── database/               # Database utilities
│   └── snippetDB.ts       # AsyncStorage wrapper for snippets
├── screens/                # Alternative screen implementations
├── services/               # External service integrations
│   └── aiService.ts       # AI-powered snippet suggestions
├── types.ts               # TypeScript type definitions
└── assets/                 # Static assets (images, icons, etc.)
```

## Key Features Explained

### Snippet Management
Each snippet includes:
- Title
- Code content
- Programming language
- Tags (for categorization)
- Favorite status
- Creation/update timestamps

### Search Functionality
- Real-time filtering as you type
- Searches across titles, languages, and tags
- Clear search button for resetting filters

### Favorite System
- Toggle favorite status with star icon
- Dedicated favorites tab for quick access
- Visual indication of favorite snippets

### Platform Support
- **iOS**: Full support with native look and feel
- **Android**: Material Design compliant interface
- **Web**: Responsive layout that adapts to browser window
- **Expo Go**: Quick testing without native builds

## Development

### Available Scripts

```bash
# Start development server
npm start

# Start on specific platforms
npm run android
npm run ios
npm run web

# Lint code
npm run lint

# Reset project to initial state
npm run reset-project
```

### Environment Variables

Create a `.env` file in the root directory for environment-specific variables:
```
# Example environment variables
EXPO_PUBLIC_API_URL=https://api.example.com
```

## Building for Production

### Create Development Builds
```bash
expo prebuild
```

### Create Production Builds
```bash
# For iOS
expo build:ios

# For Android
expo build:android

# For web
expo export:web
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and follow the existing code style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Expo Team](https://expo.dev) for the amazing development platform
- [React Native Community](https://reactnative.dev) for the core framework
- [Async Storage Contributors](https://github.com/react-native-async-storage/async-storage) for the storage solution
- All contributors to the open-source libraries used in this project

---

Happy coding! 🚀