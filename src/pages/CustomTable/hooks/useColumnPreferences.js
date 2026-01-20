import { useState, useCallback, useEffect } from 'react';
import { columnPreferencesService } from '../services/columnPreferencesService';
import { logger } from '../utils/logger';
import { toast } from 'sonner';

/**
 * Custom hook for managing column visibility preferences
 * @param {number} ownerId - Owner ID
 * @param {string} tableName - Table name
 * @param {string} schemaName - Schema name
 * @param {Array} initialColumns - Initial columns array
 * @returns {Object} Column preferences state and methods
 */
export const useColumnPreferences = (ownerId, tableName, schemaName, initialColumns) => {
  const [columns, setColumns] = useState(initialColumns);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  /**
   * Load column preferences from database
   */
  const loadPreferences = useCallback(async () => {
    try {
      const preferences = await columnPreferencesService.fetch(ownerId, tableName);
      
      if (preferences && preferences.column_visibility) {
        logger.debug('Loaded column preferences:', preferences.column_visibility);
        return preferences.column_visibility;
      }
      return null;
    } catch (error) {
      logger.error('Error loading column preferences:', error);
      return null;
    }
  }, [ownerId, tableName]);

  /**
   * Apply preferences to columns
   */
  const applyPreferences = useCallback((columns, preferences) => {
    if (!preferences) return columns;
    
    return columns.map(column => {
      const isVisible = preferences[column.id] !== undefined 
        ? preferences[column.id] 
        : true;
      
      return {
        ...column,
        visible: isVisible
      };
    });
  }, []);

  /**
   * Save column preferences to database
   */
  const savePreferences = useCallback(async (columns) => {
    try {
      const visibilityMap = {};
      columns.forEach(column => {
        visibilityMap[column.id] = column.visible;
      });
      
      const result = await columnPreferencesService.save(
        ownerId, 
        tableName, 
        visibilityMap,
        schemaName
      );
      
      if (result.success) {
        logger.debug('Column preferences saved successfully');
        toast.success('Column preferences saved');
      }
    } catch (error) {
      logger.error('Error saving column preferences:', error);
      toast.error('Failed to save column preferences');
    }
  }, [ownerId, tableName, schemaName]);

  /**
   * Toggle column visibility
   */
  const toggleColumnVisibility = useCallback(async (columnId) => {
    const updatedColumns = columns.map(column =>
      column.id === columnId
        ? { ...column, visible: !column.visible }
        : column
    );
    
    setColumns(updatedColumns);
    await savePreferences(updatedColumns);
  }, [columns, savePreferences]);

  /**
   * Reset all columns to visible
   */
  const resetColumnVisibility = useCallback(async () => {
    const resetColumns = columns.map(column => ({
      ...column,
      visible: true
    }));
    
    setColumns(resetColumns);
    await savePreferences(resetColumns);
    toast.success('Column visibility reset to default');
  }, [columns, savePreferences]);

  /**
   * Hide all columns
   */
  const hideAllColumns = useCallback(async () => {
    const hiddenColumns = columns.map(column => ({
      ...column,
      visible: false
    }));
    
    setColumns(hiddenColumns);
    await savePreferences(hiddenColumns);
    toast.success('All columns hidden');
  }, [columns, savePreferences]);

  /**
   * Load preferences on mount
   */
  useEffect(() => {
    const initializePreferences = async () => {
      if (!preferencesLoaded && initialColumns.length > 0) {
        const preferences = await loadPreferences();
        const columnsWithPreferences = applyPreferences(initialColumns, preferences);
        setColumns(columnsWithPreferences);
        setPreferencesLoaded(true);
      }
    };

    initializePreferences();
  }, [initialColumns, preferencesLoaded, loadPreferences, applyPreferences]);

  /**
   * Update columns when initialColumns change
   */
  useEffect(() => {
    if (initialColumns.length > 0 && !preferencesLoaded) {
      setColumns(initialColumns);
    }
  }, [initialColumns, preferencesLoaded]);

  return {
    columns,
    setColumns,
    toggleColumnVisibility,
    resetColumnVisibility,
    hideAllColumns,
    visibleColumns: columns.filter(col => col.visible)
  };
};