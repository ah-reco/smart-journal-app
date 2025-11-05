# EntryDetailScreen Documentation

## Overview

The `EntryDetailScreen` is a comprehensive React Native screen component that displays journal entries with AI-powered analysis. It provides a clean, intuitive interface built with React Native Elements and includes robust error handling.

## Features

### Core Functionality
- **Entry Display**: Shows entry title, content, creation date, and tags
- **AI Analysis**: Generate and display AI-powered insights about the entry
- **Delete Entry**: Remove entries with confirmation dialog
- **Pull to Refresh**: Reload entry data with pull-down gesture
- **Error Handling**: Comprehensive error states with retry options

### AI Analysis Components
1. **Sentiment Analysis**: Identifies the emotional tone (positive, negative, neutral, mixed)
2. **Summary**: Provides a concise overview of the entry
3. **Insights**: Generates meaningful observations about the content
4. **Recommendations**: Offers personalized suggestions based on sentiment

## File Structure

```
src/
├── screens/
│   ├── EntryDetailScreen.js      # Main screen component
│   └── HomeScreen.js              # Home/list screen
├── components/
│   └── common/
│       ├── Loading.js             # Loading indicator component
│       └── ErrorView.js           # Error display component
├── context/
│   └── EntryContext.js            # Global state management
├── services/
│   ├── storageService.js          # AsyncStorage operations
│   └── aiService.js               # AI analysis logic
├── navigation/
│   └── AppNavigator.js            # Navigation configuration
└── utils/
    ├── theme.js                   # Theme configuration
    ├── constants.js               # App constants
    └── sampleData.js              # Sample data for testing
```

## Usage

### Navigation

Navigate to the EntryDetailScreen from any screen:

```javascript
navigation.navigate('EntryDetail', { entryId: 'entry-id-here' });
```

### Props

The screen receives props via React Navigation route params:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `entryId` | string | Yes | The unique identifier of the entry to display |

### Example

```javascript
import { useNavigation } from '@react-navigation/native';

function EntryListItem({ entry }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
    >
      <Text>{entry.title}</Text>
    </TouchableOpacity>
  );
}
```

## Data Structure

### Entry Object

```javascript
{
  id: string,                  // Unique identifier
  title: string,               // Entry title
  content: string,             // Entry content
  createdAt: string,           // ISO date string
  updatedAt: string,           // ISO date string
  tags: string[],              // Optional tags
  aiAnalysis: {                // Optional AI analysis
    sentiment: string,         // 'positive' | 'negative' | 'neutral' | 'mixed'
    summary: string,           // Brief summary
    insights: string[],        // Array of insights
    recommendations: string[], // Array of recommendations
    generatedAt: string        // ISO date string
  }
}
```

## AI Analysis Service

The AI service provides simulated analysis. To integrate with a real AI API (like Claude):

1. **Set Environment Variables**:
   ```bash
   EXPO_PUBLIC_AI_API_ENDPOINT=https://api.anthropic.com/v1/messages
   EXPO_PUBLIC_AI_API_KEY=your-api-key-here
   ```

2. **Update aiService.js**:
   The `callAIAPI` method in `src/services/aiService.js` contains example code for Claude API integration.

3. **Modify Analysis Methods**:
   Replace the simulated logic in `analyzeSentiment`, `generateInsights`, etc., with calls to `callAIAPI`.

## Context API

The app uses React Context for state management:

```javascript
import { useEntries } from '../context/EntryContext';

function MyComponent() {
  const {
    entries,              // All entries
    currentEntry,         // Currently selected entry
    loading,              // Loading state
    error,                // Error message
    analyzingEntry,       // AI analysis in progress
    analysisError,        // AI analysis error
    getEntry,             // Load a specific entry
    saveEntry,            // Save/update an entry
    deleteEntry,          // Delete an entry
    analyzeEntry,         // Generate AI analysis
    clearError,           // Clear error state
    clearAnalysisError,   // Clear analysis error
  } = useEntries();

  // Your component logic here
}
```

## Styling

The app uses a centralized theme system:

```javascript
import { theme } from '../utils/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
  },
});
```

### Theme Colors

- **primary**: `#6366F1` - Primary brand color
- **secondary**: `#8B5CF6` - Secondary/accent color
- **success**: `#10B981` - Success states
- **error**: `#EF4444` - Error states
- **warning**: `#F59E0B` - Warning states
- **background**: `#F9FAFB` - App background
- **card**: `#FFFFFF` - Card background
- **text**: `#111827` - Primary text
- **textSecondary**: `#6B7280` - Secondary text

## Error Handling

The screen implements comprehensive error handling:

1. **Loading Errors**: Network or storage failures
2. **Analysis Errors**: AI service failures
3. **Delete Errors**: Storage operation failures
4. **Not Found**: Entry doesn't exist

All errors display with:
- Clear error messages
- Retry functionality
- User-friendly icons

## Testing

### Load Sample Data

Use the sample data utility for testing:

```javascript
import { createSampleEntries, createSampleEntryWithAnalysis } from '../utils/sampleData';
import storageService from '../services/storageService';

// Load sample entries
const samples = createSampleEntries();
await storageService.saveEntries(samples);

// Load entry with pre-generated analysis
const entryWithAnalysis = createSampleEntryWithAnalysis();
await storageService.saveEntry(entryWithAnalysis);
```

### Running the App

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Key Components

### Loading Component

Displays a loading indicator with optional message:

```javascript
<Loading message="Loading entry..." fullScreen={true} />
```

### ErrorView Component

Displays errors with retry functionality:

```javascript
<ErrorView
  message="Failed to load entry"
  onRetry={loadEntry}
  retryText="Try Again"
  fullScreen={true}
/>
```

## Best Practices

1. **Error Boundaries**: Wrap the app in error boundaries for production
2. **Offline Support**: Implement offline-first approach with AsyncStorage
3. **Performance**: Use React.memo and useCallback for optimization
4. **Accessibility**: Add accessibility labels to interactive elements
5. **Loading States**: Always show loading indicators for async operations

## Future Enhancements

Potential improvements for the EntryDetailScreen:

1. **Edit Mode**: Allow in-place editing of entries
2. **Share Functionality**: Share entries with others
3. **Export Options**: Export as PDF or text
4. **Voice Recording**: Add audio entries
5. **Image Attachments**: Support photos in entries
6. **Advanced Analytics**: Mood trends over time
7. **Reminders**: Set reminders to journal
8. **Themes**: Dark mode support

## Troubleshooting

### Common Issues

1. **Navigation Error**
   ```
   Error: Couldn't find a 'EntryDetail' screen
   ```
   **Solution**: Ensure the screen is registered in AppNavigator.js

2. **Context Error**
   ```
   Error: useEntries must be used within an EntryProvider
   ```
   **Solution**: Wrap your app with EntryProvider in App.js

3. **AsyncStorage Error**
   ```
   Error: Failed to load entries
   ```
   **Solution**: Check AsyncStorage permissions and clear app data

## Support

For issues or questions:
- Check the console logs for detailed error messages
- Verify all dependencies are installed: `npm install`
- Clear app data and restart: `expo start --clear`

## License

This component is part of the Smart Journal App project.
