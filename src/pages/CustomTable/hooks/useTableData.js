import { useState, useCallback, useEffect } from 'react';
import { tableApi } from '../services/tableApi';
import { formatColumnName, getColumnType } from '../utils/tableHelpers';
import { logger } from '../utils/logger';
import { toast } from 'sonner';

/**
 * Custom hook for managing table data
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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      logger.debug('Fetching table data', { apiParams, type });

      let result;

      if (type === 'normal') {
        result = await tableApi.fetchRecords(apiParams);
        setMetaData(result.columns);
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
      } else {
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
  }, [apiParams.schemaName, apiParams.tableName, type, ownerId]);

  // ✅ THIS WAS MISSING
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    records,
    setRecords,
    originalRecords,
    columns,
    setColumns,
    metaData,
    loading,
    fetchData,
    refreshData: fetchData
  };
};
