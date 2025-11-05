import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Icon } from '@rneui/themed';
import { theme } from '../../utils/theme';

export default function ErrorView({
  message = 'Something went wrong',
  onRetry,
  retryText = 'Try Again',
  fullScreen = true,
}) {
  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.container;

  return (
    <View style={containerStyle}>
      <Icon
        name="error-outline"
        type="material"
        size={60}
        color={theme.colors.error}
        containerStyle={styles.iconContainer}
      />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button
          title={retryText}
          onPress={onRetry}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          icon={{
            name: 'refresh',
            type: 'material',
            size: 20,
            color: 'white',
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  message: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  buttonContainer: {
    minWidth: 150,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
  },
});
