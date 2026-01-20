import { useState, useEffect, useCallback } from 'react';
import { tableApi } from '../services/tableApi';
import { logger } from '../utils/logger';

/**
 * Custom hook for managing dropdown setup configuration
 * @param {number} ownerId - Owner ID
 * @param {string} tableName - Table name
 * @returns {Object} Dropdown setup state and methods
 */
export const useDropdownSetup = (ownerId, tableName) => {
  const [dropdownSetup, setDropdownSetup] = useState({});
  const [columnOrder, setColumnOrder] = useState({});
  const [setupExists, setSetupExists] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch dropdown setup from API
   */
  const fetchSetup = useCallback(async () => {
    try {
      setLoading(true);
      
      const result = await tableApi.fetchDropdownSetup(ownerId, tableName);
      
      if (result.exists) {
        setDropdownSetup(result.mapping);
        setColumnOrder(result.columnOrder);
        setSetupExists(true);
        
        logger.debug('Dropdown setup loaded:', {
          mapping: result.mapping,
          columnOrder: result.columnOrder
        });
      } else {
        setDropdownSetup({});
        setColumnOrder({});
        setSetupExists(false);
      }
    } catch (error) {
      logger.error('Error fetching dropdown setup:', error);
      setDropdownSetup({});
      setColumnOrder({});
      setSetupExists(false);
    } finally {
      setLoading(false);
    }
  }, [ownerId, tableName]);

  /**
   * Get dropdown options for a column
   */
  const getDropdownOptions = useCallback((columnId) => {
    return dropdownSetup[columnId] || [];
  }, [dropdownSetup]);

  /**
   * Check if column has dropdown
   */
  const hasDropdown = useCallback((columnId) => {
    const options = dropdownSetup[columnId];
    return Array.isArray(options) && options.length > 0;
  }, [dropdownSetup]);

  /**
   * Get column order number
   */
  const getColumnOrder = useCallback((columnId) => {
    return columnOrder[columnId] || 999;
  }, [columnOrder]);

  /**
   * Load setup on mount or when dependencies change
   */
  useEffect(() => {
    if (ownerId && tableName) {
      fetchSetup();
    }
  }, [ownerId, tableName, fetchSetup]);

  return {
    dropdownSetup,
    columnOrder,
    setupExists,
    loading,
    fetchSetup,
    getDropdownOptions,
    hasDropdown,
    getColumnOrder
  };
};