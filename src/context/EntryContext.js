import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import storageService from '../services/storageService';
import aiService from '../services/aiService';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

const EntryContext = createContext();

const initialState = {
  entries: [],
  loading: false,
  error: null,
  currentEntry: null,
  analyzingEntry: false,
  analysisError: null,
};

const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ENTRIES: 'SET_ENTRIES',
  SET_ERROR: 'SET_ERROR',
  ADD_ENTRY: 'ADD_ENTRY',
  UPDATE_ENTRY: 'UPDATE_ENTRY',
  DELETE_ENTRY: 'DELETE_ENTRY',
  SET_CURRENT_ENTRY: 'SET_CURRENT_ENTRY',
  SET_ANALYZING: 'SET_ANALYZING',
  SET_ANALYSIS_ERROR: 'SET_ANALYSIS_ERROR',
  UPDATE_ENTRY_ANALYSIS: 'UPDATE_ENTRY_ANALYSIS',
};

function entryReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case actionTypes.SET_ENTRIES:
      return { ...state, entries: action.payload, loading: false, error: null };

    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case actionTypes.ADD_ENTRY:
      return {
        ...state,
        entries: [action.payload, ...state.entries],
        loading: false,
        error: null,
      };

    case actionTypes.UPDATE_ENTRY:
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
        currentEntry: action.payload.id === state.currentEntry?.id
          ? action.payload
          : state.currentEntry,
        loading: false,
        error: null,
      };

    case actionTypes.DELETE_ENTRY:
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload),
        currentEntry: state.currentEntry?.id === action.payload ? null : state.currentEntry,
        loading: false,
        error: null,
      };

    case actionTypes.SET_CURRENT_ENTRY:
      return { ...state, currentEntry: action.payload };

    case actionTypes.SET_ANALYZING:
      return { ...state, analyzingEntry: action.payload, analysisError: null };

    case actionTypes.SET_ANALYSIS_ERROR:
      return { ...state, analysisError: action.payload, analyzingEntry: false };

    case actionTypes.UPDATE_ENTRY_ANALYSIS:
      const updatedEntries = state.entries.map(entry =>
        entry.id === action.payload.id ? action.payload : entry
      );
      return {
        ...state,
        entries: updatedEntries,
        currentEntry: action.payload.id === state.currentEntry?.id
          ? action.payload
          : state.currentEntry,
        analyzingEntry: false,
        analysisError: null,
      };

    default:
      return state;
  }
}

export function EntryProvider({ children }) {
  const [state, dispatch] = useReducer(entryReducer, initialState);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const entries = await storageService.loadEntries();
      dispatch({ type: actionTypes.SET_ENTRIES, payload: entries });
    } catch (error) {
      console.error('Load entries error:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: ERROR_MESSAGES.LOAD_ENTRIES_FAILED });
    }
  }, []);

  const saveEntry = useCallback(async (entry) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      const savedEntry = await storageService.saveEntry(entry);

      if (entry.id) {
        dispatch({ type: actionTypes.UPDATE_ENTRY, payload: savedEntry });
      } else {
        dispatch({ type: actionTypes.ADD_ENTRY, payload: savedEntry });
      }

      return savedEntry;
    } catch (error) {
      console.error('Save entry error:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: ERROR_MESSAGES.SAVE_ENTRY_FAILED });
      throw error;
    }
  }, []);

  const deleteEntry = useCallback(async (entryId) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      await storageService.deleteEntry(entryId);
      dispatch({ type: actionTypes.DELETE_ENTRY, payload: entryId });
    } catch (error) {
      console.error('Delete entry error:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: ERROR_MESSAGES.DELETE_ENTRY_FAILED });
      throw error;
    }
  }, []);

  const getEntry = useCallback(async (entryId) => {
    try {
      const entry = await storageService.getEntry(entryId);
      dispatch({ type: actionTypes.SET_CURRENT_ENTRY, payload: entry });
      return entry;
    } catch (error) {
      console.error('Get entry error:', error);
      dispatch({ type: actionTypes.SET_ERROR, payload: ERROR_MESSAGES.LOAD_ENTRIES_FAILED });
      throw error;
    }
  }, []);

  const analyzeEntry = useCallback(async (entry) => {
    try {
      dispatch({ type: actionTypes.SET_ANALYZING, payload: true });

      const analysis = await aiService.analyzeEntry(entry);
      const updatedEntry = await storageService.updateEntryAnalysis(entry.id, analysis);

      dispatch({ type: actionTypes.UPDATE_ENTRY_ANALYSIS, payload: updatedEntry });
      return updatedEntry;
    } catch (error) {
      console.error('Analyze entry error:', error);
      dispatch({
        type: actionTypes.SET_ANALYSIS_ERROR,
        payload: ERROR_MESSAGES.AI_ANALYSIS_FAILED
      });
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: actionTypes.SET_ERROR, payload: null });
  }, []);

  const clearAnalysisError = useCallback(() => {
    dispatch({ type: actionTypes.SET_ANALYSIS_ERROR, payload: null });
  }, []);

  const value = {
    ...state,
    loadEntries,
    saveEntry,
    deleteEntry,
    getEntry,
    analyzeEntry,
    clearError,
    clearAnalysisError,
  };

  return <EntryContext.Provider value={value}>{children}</EntryContext.Provider>;
}

export function useEntries() {
  const context = useContext(EntryContext);
  if (!context) {
    throw new Error('useEntries must be used within an EntryProvider');
  }
  return context;
}
