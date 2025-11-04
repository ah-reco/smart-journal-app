# Smart Journal App - Setup Guide

## Prerequisites

1. Node.js and npm installed
2. Expo CLI installed (`npm install -g expo-cli`)
3. A Supabase account (free at https://supabase.com)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Project name: `smart-journal` (or your preferred name)
   - Database password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for the project to be created (takes ~2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, click on "Settings" (gear icon in the sidebar)
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

### 3. Configure Your App

1. Open the file `src/services/supabase.js`
2. Replace the placeholder values:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your anon key
   ```

### 4. Enable Email Authentication (Optional but Recommended)

By default, Supabase requires email verification. You can configure this:

1. In Supabase dashboard, go to "Authentication" → "Providers"
2. Click on "Email" provider
3. Configure settings:
   - **Enable email confirmation**: Toggle ON/OFF based on your needs
   - **Enable email provider**: Make sure it's enabled

For development, you might want to disable email confirmation:
1. Go to "Authentication" → "Settings"
2. Under "Email Auth", disable "Enable email confirmations"

## Running the App

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm start
```

This will open the Expo development tools in your browser.

### Run on Device/Emulator

- **iOS Simulator** (Mac only): Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**:
  1. Install "Expo Go" app from App Store or Play Store
  2. Scan the QR code shown in the terminal

## Features

### Authentication Features
- ✅ Email/Password Sign Up
- ✅ Email/Password Login
- ✅ Automatic session persistence
- ✅ Sign Out functionality
- ✅ Comprehensive error handling
- ✅ Form validation

### UI Features
- Clean tabbed interface for Login/Signup
- Real-time form validation
- Loading states
- Error messages
- Responsive design

## Project Structure

```
smart-journal-app/
├── src/
│   ├── context/
│   │   └── AuthContext.js        # Authentication state management
│   ├── screens/
│   │   ├── AuthScreen.js         # Login/Signup screen
│   │   └── HomeScreen.js         # Main app screen (after login)
│   └── services/
│       └── supabase.js           # Supabase client configuration
├── App.js                        # Root component
├── package.json
└── SETUP.md                      # This file
```

## Troubleshooting

### "Invalid API key" Error
- Double-check that you copied the correct anon key from Supabase
- Make sure there are no extra spaces or quotes

### "Failed to fetch" Error
- Check your internet connection
- Verify the Supabase URL is correct
- Make sure your Supabase project is active

### Email Not Received (for verification)
- Check spam folder
- In Supabase, check "Authentication" → "Settings" → "SMTP Settings"
- For development, consider disabling email confirmation

### App Won't Start
- Clear cache: `expo start -c`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all peer dependencies are installed

## Testing the Authentication

1. **Sign Up**:
   - Switch to "Sign Up" tab
   - Enter a valid email and password (min 6 characters)
   - Confirm password
   - Click "Sign Up"
   - If email confirmation is enabled, check your email

2. **Login**:
   - Switch to "Login" tab
   - Enter your email and password
   - Click "Login"
   - You should see the HomeScreen with your user info

3. **Sign Out**:
   - Click the "Sign Out" button
   - You should return to the AuthScreen

## Next Steps

Now that authentication is set up, you can:

1. **Add more screens**: Create journal entry screens, settings, etc.
2. **Add navigation**: Install React Navigation for multi-screen apps
3. **Create database tables**: Set up tables in Supabase for journal entries
4. **Add features**: Search, tags, mood tracking, etc.
5. **Customize UI**: Update colors, fonts, and styles to match your brand

## Security Notes

⚠️ **Important**: Never commit your Supabase credentials to version control!

For production:
1. Use environment variables (`.env` file)
2. Add `.env` to `.gitignore`
3. Use `expo-constants` or `react-native-config` for env variables
4. Set up proper Row Level Security (RLS) policies in Supabase

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Native Elements](https://reactnativeelements.com/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## Support

If you encounter issues:
1. Check the Expo logs in the terminal
2. Check the browser console in Expo DevTools
3. Review Supabase logs in the dashboard
4. Search for error messages online

Happy coding! 🚀
