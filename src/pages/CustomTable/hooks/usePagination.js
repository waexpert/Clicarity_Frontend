import { useState, useMemo, useCallback } from 'react';
import { TABLE_CONFIG } from '../constants/tableConstants';
import { useSelector } from 'react-redux';

/**
 * Custom hook for managing table pagination
 * @param {Array} records - Records to paginate
 * @param {number} initialPageSize - Initial page size
 * @returns {Object} Pagination state and methods
 */


export const usePagination = (records, initialPageSize = TABLE_CONFIG.DEFAULT_PAGE_SIZE) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);


  

  

  /**
   * Calculate pagination values
   */
  const totalRecords = records.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  /**
   * Get current page records
   */
  const currentRecords = useMemo(() => {
    const indexOfLastRecord = currentPage * pageSize;
    const indexOfFirstRecord = indexOfLastRecord - pageSize;
    return records.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [records, currentPage, pageSize]);

  /**
   * Go to specific page
   */
  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  /**
   * Go to next page
   */
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      fetchTableStructure();
    }
  }, [currentPage, totalPages]);

  /**
   * Go to previous page
   */
  const previousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  /**
   * Change page size
   */
  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  /**
   * Reset pagination
   */
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setPageSize(initialPageSize);
  }, [initialPageSize]);

  return {
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    currentRecords,
    setCurrentPage: goToPage,
    nextPage,
    previousPage,
    changePageSize,
    resetPagination
  };
};


