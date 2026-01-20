import { useState, useCallback, useMemo } from 'react';
import { logger } from '../utils/logger';

/**
 * Custom hook for managing table filters
 * @param {Array} originalRecords - Original unfiltered records
 * @returns {Object} Filter state and methods
 */
export const useTableFilters = (originalRecords) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);

  /**
   * Apply all filters to records
   */
  const filteredRecords = useMemo(() => {
    if (!originalRecords.length) return [];

    let results = [...originalRecords];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      results = results.filter(item =>
        statusFilter.includes(item.status)
      );
    }

    // Apply priority filter
    if (priorityFilter.length > 0) {
      results = results.filter(item =>
        priorityFilter.includes(item.priority)
      );
    }

    logger.debug('Filtered records:', {
      original: originalRecords.length,
      filtered: results.length,
      searchTerm,
      statusFilter,
      priorityFilter
    });

    return results;
  }, [originalRecords, searchTerm, statusFilter, priorityFilter]);

  /**
   * Get unique values for filters
   */
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(originalRecords.map(record => record.status))).filter(Boolean);
  }, [originalRecords]);

  const uniquePriorities = useMemo(() => {
    return Array.from(new Set(originalRecords.map(record => record.priority))).filter(Boolean);
  }, [originalRecords]);

  /**
   * Toggle status filter
   */
  const toggleStatusFilter = useCallback((status) => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  }, []);

  /**
   * Toggle priority filter
   */
  const togglePriorityFilter = useCallback((priority) => {
    setPriorityFilter(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority);
      } else {
        return [...prev, priority];
      }
    });
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter([]);
    setPriorityFilter([]);
  }, []);

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = useMemo(() => {
    return searchTerm !== '' || statusFilter.length > 0 || priorityFilter.length > 0;
  }, [searchTerm, statusFilter, priorityFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    filteredRecords,
    uniqueStatuses,
    uniquePriorities,
    toggleStatusFilter,
    togglePriorityFilter,
    clearFilters,
    hasActiveFilters
  };
};