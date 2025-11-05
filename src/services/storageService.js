import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

class StorageService {
  /**
   * Save entries to AsyncStorage
   * @param {Array} entries - Array of journal entries
   * @returns {Promise<boolean>}
   */
  async saveEntries(entries) {
    try {
      const jsonValue = JSON.stringify(entries);
      await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, jsonValue);
      return true;
    } catch (error) {
      console.error('Error saving entries:', error);
      throw error;
    }
  }

  /**
   * Load entries from AsyncStorage
   * @returns {Promise<Array>}
   */
  async loadEntries() {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading entries:', error);
      throw error;
    }
  }

  /**
   * Save a single entry
   * @param {Object} entry - Journal entry object
   * @returns {Promise<Object>}
   */
  async saveEntry(entry) {
    try {
      const entries = await this.loadEntries();
      const existingIndex = entries.findIndex((e) => e.id === entry.id);

      if (existingIndex >= 0) {
        entries[existingIndex] = {
          ...entry,
          updatedAt: new Date().toISOString(),
        };
      } else {
        entries.unshift({
          ...entry,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      await this.saveEntries(entries);
      return entry;
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    }
  }

  /**
   * Get a single entry by ID
   * @param {string} entryId - Entry ID
   * @returns {Promise<Object|null>}
   */
  async getEntry(entryId) {
    try {
      const entries = await this.loadEntries();
      return entries.find((e) => e.id === entryId) || null;
    } catch (error) {
      console.error('Error getting entry:', error);
      throw error;
    }
  }

  /**
   * Delete an entry by ID
   * @param {string} entryId - Entry ID
   * @returns {Promise<boolean>}
   */
  async deleteEntry(entryId) {
    try {
      const entries = await this.loadEntries();
      const filteredEntries = entries.filter((e) => e.id !== entryId);
      await this.saveEntries(filteredEntries);
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  }

  /**
   * Update AI analysis for an entry
   * @param {string} entryId - Entry ID
   * @param {Object} analysis - AI analysis object
   * @returns {Promise<Object>}
   */
  async updateEntryAnalysis(entryId, analysis) {
    try {
      const entries = await this.loadEntries();
      const entryIndex = entries.findIndex((e) => e.id === entryId);

      if (entryIndex === -1) {
        throw new Error('Entry not found');
      }

      entries[entryIndex] = {
        ...entries[entryIndex],
        aiAnalysis: {
          ...analysis,
          generatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      await this.saveEntries(entries);
      return entries[entryIndex];
    } catch (error) {
      console.error('Error updating entry analysis:', error);
      throw error;
    }
  }

  /**
   * Clear all data
   * @returns {Promise<boolean>}
   */
  async clearAll() {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}

export default new StorageService();
