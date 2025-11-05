import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Icon } from '@rneui/themed';
import { useEntries } from '../context/EntryContext';
import Loading from '../components/common/Loading';
import ErrorView from '../components/common/ErrorView';
import { theme } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const { entries, loading, error, loadEntries } = useEntries();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <Loading message="Loading entries..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadEntries} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Journal</Text>
        <Text style={styles.headerSubtitle}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {entries.length === 0 ? (
          <Card containerStyle={styles.emptyCard}>
            <Icon
              name="book"
              type="material"
              size={60}
              color={theme.colors.placeholder}
            />
            <Text style={styles.emptyText}>
              No journal entries yet. Create your first entry to get started!
            </Text>
          </Card>
        ) : (
          entries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              onPress={() => navigation.navigate('EntryDetail', { entryId: entry.id })}
            >
              <Card containerStyle={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{entry.title || 'Untitled Entry'}</Text>
                  {entry.aiAnalysis && (
                    <Icon
                      name="psychology"
                      type="material"
                      size={20}
                      color={theme.colors.secondary}
                    />
                  )}
                </View>
                <Text style={styles.cardDate}>{formatDate(entry.createdAt)}</Text>
                <Text numberOfLines={2} style={styles.cardContent}>
                  {entry.content}
                </Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  emptyCard: {
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    flex: 1,
  },
  cardDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  cardContent: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 20,
  },
});
