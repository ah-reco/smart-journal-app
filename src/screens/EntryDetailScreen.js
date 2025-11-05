import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { Text, Card, Button, Chip, Divider, Icon } from '@rneui/themed';
import { useEntries } from '../context/EntryContext';
import Loading from '../components/common/Loading';
import ErrorView from '../components/common/ErrorView';
import { theme } from '../utils/theme';
import { SENTIMENT_TYPES } from '../utils/constants';

export default function EntryDetailScreen({ route, navigation }) {
  const { entryId } = route.params;
  const {
    currentEntry,
    getEntry,
    deleteEntry,
    analyzeEntry,
    analyzingEntry,
    analysisError,
    clearAnalysisError,
  } = useEntries();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEntry();
  }, [entryId]);

  const loadEntry = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await getEntry(entryId);
    } catch (err) {
      console.error('Error loading entry:', err);
      setError('Failed to load entry. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [entryId, getEntry]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEntry();
    setRefreshing(false);
  }, [loadEntry]);

  const handleAnalyze = useCallback(async () => {
    if (!currentEntry) return;

    try {
      clearAnalysisError();
      await analyzeEntry(currentEntry);
      Alert.alert('Success', 'AI analysis generated successfully!');
    } catch (err) {
      console.error('Analysis error:', err);
      Alert.alert('Error', 'Failed to generate AI analysis. Please try again.');
    }
  }, [currentEntry, analyzeEntry, clearAnalysisError]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entryId);
              Alert.alert('Success', 'Entry deleted successfully');
              navigation.goBack();
            } catch (err) {
              console.error('Delete error:', err);
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            }
          },
        },
      ]
    );
  }, [entryId, deleteEntry, navigation]);

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case SENTIMENT_TYPES.POSITIVE:
        return { name: 'sentiment-satisfied', color: theme.colors.success };
      case SENTIMENT_TYPES.NEGATIVE:
        return { name: 'sentiment-dissatisfied', color: theme.colors.error };
      case SENTIMENT_TYPES.MIXED:
        return { name: 'sentiment-neutral', color: theme.colors.warning };
      default:
        return { name: 'sentiment-neutral', color: theme.colors.textSecondary };
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case SENTIMENT_TYPES.POSITIVE:
        return theme.colors.success;
      case SENTIMENT_TYPES.NEGATIVE:
        return theme.colors.error;
      case SENTIMENT_TYPES.MIXED:
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <Loading message="Loading entry..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={loadEntry} />;
  }

  if (!currentEntry) {
    return (
      <ErrorView
        message="Entry not found"
        onRetry={() => navigation.goBack()}
        retryText="Go Back"
      />
    );
  }

  const hasAnalysis = currentEntry.aiAnalysis;
  const sentimentIcon = hasAnalysis
    ? getSentimentIcon(currentEntry.aiAnalysis.sentiment)
    : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Entry Header */}
      <Card containerStyle={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>{currentEntry.title || 'Untitled Entry'}</Text>
            <Text style={styles.date}>{formatDate(currentEntry.createdAt)}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Entry Content */}
        <View style={styles.contentSection}>
          <Text style={styles.contentLabel}>Entry</Text>
          <Text style={styles.content}>{currentEntry.content}</Text>
        </View>

        {/* Tags */}
        {currentEntry.tags && currentEntry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {currentEntry.tags.map((tag, index) => (
              <Chip
                key={index}
                title={tag}
                type="outline"
                containerStyle={styles.chip}
                buttonStyle={styles.chipButton}
              />
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Analyze with AI"
            onPress={handleAnalyze}
            loading={analyzingEntry}
            disabled={analyzingEntry}
            buttonStyle={[styles.button, styles.analyzeButton]}
            containerStyle={styles.buttonContainer}
            icon={{
              name: 'psychology',
              type: 'material',
              size: 20,
              color: 'white',
            }}
          />
          <Button
            title="Delete"
            onPress={handleDelete}
            disabled={analyzingEntry}
            buttonStyle={[styles.button, styles.deleteButton]}
            containerStyle={styles.buttonContainer}
            icon={{
              name: 'delete',
              type: 'material',
              size: 20,
              color: 'white',
            }}
          />
        </View>
      </Card>

      {/* Analysis Error */}
      {analysisError && (
        <Card containerStyle={[styles.card, styles.errorCard]}>
          <View style={styles.errorContent}>
            <Icon
              name="error-outline"
              type="material"
              size={24}
              color={theme.colors.error}
            />
            <Text style={styles.errorText}>{analysisError}</Text>
          </View>
        </Card>
      )}

      {/* AI Analysis Results */}
      {hasAnalysis && (
        <Card containerStyle={styles.card}>
          <View style={styles.analysisHeader}>
            <Icon
              name="psychology"
              type="material"
              size={28}
              color={theme.colors.secondary}
            />
            <Text style={styles.analysisTitle}>AI Analysis</Text>
          </View>

          <Text style={styles.analysisDate}>
            Generated: {formatDate(currentEntry.aiAnalysis.generatedAt)}
          </Text>

          <Divider style={styles.divider} />

          {/* Sentiment */}
          <View style={styles.analysisSection}>
            <Text style={styles.sectionTitle}>Sentiment</Text>
            <View style={styles.sentimentContainer}>
              <Icon
                name={sentimentIcon.name}
                type="material"
                size={32}
                color={sentimentIcon.color}
              />
              <Chip
                title={currentEntry.aiAnalysis.sentiment.toUpperCase()}
                buttonStyle={{
                  backgroundColor: getSentimentColor(currentEntry.aiAnalysis.sentiment),
                }}
                containerStyle={styles.sentimentChip}
              />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Summary */}
          <View style={styles.analysisSection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.sectionContent}>
              {currentEntry.aiAnalysis.summary}
            </Text>
          </View>

          <Divider style={styles.divider} />

          {/* Insights */}
          <View style={styles.analysisSection}>
            <Text style={styles.sectionTitle}>Insights</Text>
            {currentEntry.aiAnalysis.insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Icon
                  name="lightbulb"
                  type="material"
                  size={20}
                  color={theme.colors.warning}
                  containerStyle={styles.insightIcon}
                />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>

          <Divider style={styles.divider} />

          {/* Recommendations */}
          <View style={styles.analysisSection}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {currentEntry.aiAnalysis.recommendations.map((recommendation, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Icon
                  name="check-circle"
                  type="material"
                  size={20}
                  color={theme.colors.primary}
                  containerStyle={styles.recommendationIcon}
                />
                <Text style={styles.recommendationText}>{recommendation}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Empty State for No Analysis */}
      {!hasAnalysis && !analyzingEntry && !analysisError && (
        <Card containerStyle={styles.card}>
          <View style={styles.emptyStateContainer}>
            <Icon
              name="psychology"
              type="material"
              size={60}
              color={theme.colors.placeholder}
            />
            <Text style={styles.emptyStateText}>
              No AI analysis yet. Tap "Analyze with AI" to get insights about this entry.
            </Text>
          </View>
        </Card>
      )}

      {/* Loading State for Analysis */}
      {analyzingEntry && (
        <Card containerStyle={styles.card}>
          <Loading
            message="Analyzing entry with AI..."
            fullScreen={false}
          />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
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
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderColor: theme.colors.error,
    borderWidth: 1,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.error,
    fontSize: theme.fontSize.md,
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  contentSection: {
    marginBottom: theme.spacing.md,
  },
  contentLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  content: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  chip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  chipButton: {
    borderColor: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
  },
  analyzeButton: {
    backgroundColor: theme.colors.secondary,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  analysisTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  analysisDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  analysisSection: {
    marginVertical: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  sentimentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sentimentChip: {
    marginLeft: theme.spacing.sm,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  insightIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  recommendationIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyStateText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
