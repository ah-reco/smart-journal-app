import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Input,
  Button,
  Text,
  Card,
  Overlay,
  Icon,
} from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const NewEntryScreen = () => {
  // State management
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length < 10) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    if (mood && mood.length > 50) {
      newErrors.mood = 'Mood must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Clear previous errors
      setErrors({});

      // Validate form
      if (!validateForm()) {
        Alert.alert('Validation Error', 'Please fix the errors before submitting.');
        return;
      }

      setLoading(true);

      // Simulate API call or database save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create entry object
      const newEntry = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        mood: mood.trim() || 'Not specified',
        createdAt: new Date().toISOString(),
      };

      // Log entry (In production, you'd save to database/API)
      console.log('New journal entry created:', newEntry);

      // Show success modal
      setShowSuccessModal(true);

      // Reset form after brief delay
      setTimeout(() => {
        setShowSuccessModal(false);
        resetForm();
      }, 2000);

    } catch (error) {
      console.error('Error creating entry:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create journal entry. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setMood('');
    setErrors({});
  };

  // Handle cancel
  const handleCancel = () => {
    if (title || content || mood) {
      Alert.alert(
        'Discard Entry?',
        'Are you sure you want to discard this entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: resetForm },
        ]
      );
    } else {
      resetForm();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Icon
              name="book"
              type="feather"
              size={32}
              color="#2089dc"
            />
            <Text h3 style={styles.headerText}>
              New Journal Entry
            </Text>
          </View>

          {/* Form Card */}
          <Card containerStyle={styles.card}>
            {/* Title Input */}
            <Input
              label="Title"
              placeholder="Enter entry title"
              value={title}
              onChangeText={setTitle}
              errorMessage={errors.title}
              leftIcon={{
                type: 'feather',
                name: 'edit-3',
                size: 20,
                color: errors.title ? '#f44336' : '#999',
              }}
              inputStyle={styles.input}
              labelStyle={styles.label}
              containerStyle={styles.inputContainer}
              maxLength={100}
            />

            {/* Mood Input */}
            <Input
              label="Mood (Optional)"
              placeholder="How are you feeling?"
              value={mood}
              onChangeText={setMood}
              errorMessage={errors.mood}
              leftIcon={{
                type: 'feather',
                name: 'smile',
                size: 20,
                color: errors.mood ? '#f44336' : '#999',
              }}
              inputStyle={styles.input}
              labelStyle={styles.label}
              containerStyle={styles.inputContainer}
              maxLength={50}
            />

            {/* Content Input */}
            <Input
              label="Content"
              placeholder="Write your thoughts..."
              value={content}
              onChangeText={setContent}
              errorMessage={errors.content}
              leftIcon={{
                type: 'feather',
                name: 'file-text',
                size: 20,
                color: errors.content ? '#f44336' : '#999',
              }}
              inputStyle={styles.input}
              labelStyle={styles.label}
              containerStyle={styles.inputContainer}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />

            {/* Character Count */}
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>
                {content.length} characters
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                type="outline"
                buttonStyle={styles.cancelButton}
                containerStyle={styles.buttonWrapper}
                icon={{
                  name: 'x',
                  type: 'feather',
                  size: 20,
                  color: '#f44336',
                }}
                titleStyle={styles.cancelButtonText}
                disabled={loading}
              />

              <Button
                title="Save Entry"
                onPress={handleSubmit}
                buttonStyle={styles.submitButton}
                containerStyle={styles.buttonWrapper}
                loading={loading}
                disabled={loading}
                icon={{
                  name: 'check',
                  type: 'feather',
                  size: 20,
                  color: '#fff',
                }}
                titleStyle={styles.submitButtonText}
              />
            </View>
          </Card>
        </ScrollView>

        {/* Success Modal */}
        <Overlay
          isVisible={showSuccessModal}
          onBackdropPress={() => setShowSuccessModal(false)}
          overlayStyle={styles.overlay}
        >
          <View style={styles.successContainer}>
            <Icon
              name="check-circle"
              type="feather"
              size={60}
              color="#4caf50"
            />
            <Text h4 style={styles.successText}>
              Entry Saved!
            </Text>
            <Text style={styles.successSubtext}>
              Your journal entry has been saved successfully.
            </Text>
          </View>
        </Overlay>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    marginLeft: 10,
    color: '#333',
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  inputContainer: {
    paddingHorizontal: 0,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  characterCount: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -10,
  },
  characterCountText: {
    fontSize: 12,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    borderColor: '#f44336',
    borderWidth: 2,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#2089dc',
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  overlay: {
    borderRadius: 12,
    padding: 30,
    minWidth: 280,
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    marginTop: 15,
    marginBottom: 10,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  successSubtext: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
});

export default NewEntryScreen;
