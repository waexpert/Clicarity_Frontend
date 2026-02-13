import { useState, useCallback, useEffect } from 'react';
import { tableApi } from '../services/tableApi';
import { formatColumnName, getColumnType } from '../utils/tableHelpers';
import { logger } from '../utils/logger';
import { toast } from 'sonner';
import { TABLE_CONFIG } from '../constants/tableConstants';

/**
 * Custom hook for managing table data with server-side pagination
 * @param {Object} apiParams - API parameters (schemaName, tableName, userId, userEmail)
 * @param {string} type - Table type ('normal' or 'payment')
 * @param {number} ownerId - Owner ID for payment records
 * @returns {Object} Table data and methods
 */
export const useTableData = (apiParams, type = 'normal', ownerId) => {
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [columns, setColumns] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [loading, setLoading] = useState(true);

  // Server-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(TABLE_CONFIG.DEFAULT_PAGE_SIZE);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 1,
    pageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchData = useCallback(async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true);
      logger.debug('Fetching table data', { apiParams, type, page, limit });

      let result;

      if (type === 'normal') {
        result = await tableApi.fetchRecords({
          ...apiParams,
          page,
          limit
        });
        setMetaData(result.columns);

        // Update pagination info from server response
        if (result.pagination) {
          setPaginationInfo(result.pagination);
        }
      } else {
        result = await tableApi.fetchPaymentRecords(ownerId);
      }

      let fetchedData = result.data || [];

      if (type === 'payment') {
        fetchedData = fetchedData.filter(item =>
          item.type === 'original' || item.type === 'Original'
        );
      }

      setOriginalRecords(fetchedData);
      setRecords(fetchedData);

      if (fetchedData.length > 0) {
        const sampleRecord = fetchedData[0];
        const dynamicColumns = Object.keys(sampleRecord).map(key => ({
          id: key,
          name: formatColumnName(key),
          sortable: true,
          visible: true,
          type: getColumnType(sampleRecord[key], key)
        }));
        setColumns(dynamicColumns);
      } else if (page === 1) {
        // Only clear columns on first page with no data
        setColumns([]);
      }

    } catch (error) {
      logger.error('Error fetching table data:', error);
      toast.error('Failed to fetch records');
      setOriginalRecords([]);
      setRecords([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  }, [apiParams.schemaName, apiParams.tableName, type, ownerId, currentPage, pageSize]);

  // Fetch when page or pageSize changes
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize, apiParams.schemaName, apiParams.tableName, type, ownerId]);

  // Go to a specific page
  const goToPage = useCallback((page) => {
    const pageNum = Math.max(1, Math.min(page, paginationInfo.totalPages || 1));
    setCurrentPage(pageNum);
  }, [paginationInfo.totalPages]);

  // Change page size (resets to page 1)
  const changePageSize = useCallback((newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  // Reset pagination to page 1
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setPageSize(TABLE_CONFIG.DEFAULT_PAGE_SIZE);
  }, []);

  return {
    records,
    setRecords,
    originalRecords,
    columns,
    setColumns,
    metaData,
    loading,
    fetchData,
    refreshData: () => fetchData(currentPage, pageSize),
    // Pagination
    currentPage,
    pageSize,
    paginationInfo,
    goToPage,
    changePageSize,
    resetPagination
  };
};
