import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Input, Button, Text, Tab, TabView } from '@rneui/themed';
import { useAuth } from '../context/AuthContext';

const AuthScreen = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn, signUp } = useAuth();

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation (only for signup)
    if (tabIndex === 1) {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Invalid email or password' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Please verify your email before logging in' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        // Login successful
        Alert.alert('Success', 'Logged in successfully!');
        // Clear form
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await signUp(email, password);

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered')) {
          setErrors({ general: 'This email is already registered' });
        } else if (error.message.includes('Password should be')) {
          setErrors({ password: error.message });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        // Signup successful
        Alert.alert(
          'Success',
          'Account created! Please check your email to verify your account.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Switch to login tab
                setTabIndex(0);
                // Clear form
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              },
            },
          ]
        );
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clear errors when switching tabs
  const handleTabChange = (index) => {
    setTabIndex(index);
    setErrors({});
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text h2 style={styles.title}>
            Smart Journal
          </Text>
          <Text style={styles.subtitle}>Your personal journaling companion</Text>
        </View>

        <View style={styles.tabContainer}>
          <Tab
            value={tabIndex}
            onChange={handleTabChange}
            indicatorStyle={styles.tabIndicator}
            variant="primary"
          >
            <Tab.Item
              title="Login"
              titleStyle={styles.tabTitle}
              containerStyle={tabIndex === 0 ? styles.activeTab : styles.inactiveTab}
            />
            <Tab.Item
              title="Sign Up"
              titleStyle={styles.tabTitle}
              containerStyle={tabIndex === 1 ? styles.activeTab : styles.inactiveTab}
            />
          </Tab>
        </View>

        <TabView value={tabIndex} onChange={setTabIndex} animationType="spring">
          {/* Login Form */}
          <TabView.Item style={styles.tabView}>
            <View style={styles.form}>
              <Input
                placeholder="Email"
                leftIcon={{ type: 'material', name: 'email', color: '#666' }}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                errorMessage={errors.email}
                disabled={loading}
                containerStyle={styles.inputContainer}
              />

              <Input
                placeholder="Password"
                leftIcon={{ type: 'material', name: 'lock', color: '#666' }}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry
                errorMessage={errors.password}
                disabled={loading}
                containerStyle={styles.inputContainer}
              />

              {errors.general && (
                <Text style={styles.errorText}>{errors.general}</Text>
              )}

              <Button
                title={loading ? 'Logging in...' : 'Login'}
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
              />
            </View>
          </TabView.Item>

          {/* Signup Form */}
          <TabView.Item style={styles.tabView}>
            <View style={styles.form}>
              <Input
                placeholder="Email"
                leftIcon={{ type: 'material', name: 'email', color: '#666' }}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: null });
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                errorMessage={errors.email}
                disabled={loading}
                containerStyle={styles.inputContainer}
              />

              <Input
                placeholder="Password"
                leftIcon={{ type: 'material', name: 'lock', color: '#666' }}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: null });
                }}
                secureTextEntry
                errorMessage={errors.password}
                disabled={loading}
                containerStyle={styles.inputContainer}
              />

              <Input
                placeholder="Confirm Password"
                leftIcon={{ type: 'material', name: 'lock-outline', color: '#666' }}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: null });
                }}
                secureTextEntry
                errorMessage={errors.confirmPassword}
                disabled={loading}
                containerStyle={styles.inputContainer}
              />

              {errors.general && (
                <Text style={styles.errorText}>{errors.general}</Text>
              )}

              <Button
                title={loading ? 'Creating account...' : 'Sign Up'}
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
              />

              <Text style={styles.infoText}>
                By signing up, you agree to receive a verification email.
              </Text>
            </View>
          </TabView.Item>
        </TabView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    color: '#2089dc',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  tabContainer: {
    marginBottom: 20,
  },
  tabIndicator: {
    backgroundColor: '#2089dc',
    height: 3,
  },
  tabTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: 'white',
  },
  inactiveTab: {
    backgroundColor: '#f0f0f0',
  },
  tabView: {
    width: '100%',
    paddingTop: 20,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2089dc',
    borderRadius: 8,
    paddingVertical: 12,
  },
  errorText: {
    color: '#ff190c',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default AuthScreen;
