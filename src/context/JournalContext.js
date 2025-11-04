import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JournalContext = createContext();

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

export const JournalProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load entries from AsyncStorage on mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Save entries to AsyncStorage whenever they change
  useEffect(() => {
    if (!loading) {
      saveEntries();
    }
  }, [entries]);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('journal_entries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveEntries = async () => {
    try {
      await AsyncStorage.setItem('journal_entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const addEntry = (entry) => {
    const newEntry = {
      id: Date.now().toString(),
      title: entry.title || 'Untitled',
      content: entry.content || '',
      mood: entry.mood || null,
      tags: entry.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEntries(prevEntries => [newEntry, ...prevEntries]);
    return newEntry;
  };

  const updateEntry = (id, updates) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
          : entry
      )
    );
  };

  const deleteEntry = (id) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const getEntryById = (id) => {
    return entries.find(entry => entry.id === id);
  };

  const value = {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};
