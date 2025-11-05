export const STORAGE_KEYS = {
  ENTRIES: '@journal_entries',
  SETTINGS: '@journal_settings',
  THEME: '@journal_theme',
};

export const AI_ANALYSIS_TYPES = {
  SENTIMENT: 'sentiment',
  INSIGHTS: 'insights',
  SUMMARY: 'summary',
  RECOMMENDATIONS: 'recommendations',
};

export const SENTIMENT_TYPES = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative',
  MIXED: 'mixed',
};

export const ERROR_MESSAGES = {
  LOAD_ENTRIES_FAILED: 'Failed to load journal entries',
  SAVE_ENTRY_FAILED: 'Failed to save journal entry',
  DELETE_ENTRY_FAILED: 'Failed to delete journal entry',
  AI_ANALYSIS_FAILED: 'Failed to generate AI analysis',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_ENTRY: 'Invalid entry data',
};

export const SUCCESS_MESSAGES = {
  ENTRY_SAVED: 'Entry saved successfully',
  ENTRY_DELETED: 'Entry deleted successfully',
  ANALYSIS_GENERATED: 'AI analysis generated successfully',
};
