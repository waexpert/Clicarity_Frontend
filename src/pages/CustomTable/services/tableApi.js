import axios from '../../../utils/axiosConfig';
import { logger } from '../utils/logger';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

/**
 * Table API Service
 * Handles all API calls related to table operations
 */
export const tableApi = {
  /**
   * Fetch all records from a table
   */
  fetchRecords: async (apiParams) => {
    try {
      logger.debug('Fetching records with params:', apiParams);
      
      const response = await axios.post(
        `${BASE_URL}/data/getAllData`,
        apiParams
      );
      console.log(response)
      return {
        data: response.data.data || [],
        columns: response.data.columns || [],
        pagination: response.data.pagination || null,
        success: true
      };
    } catch (error) {
      logger.error('Error fetching records:', error);
      throw error;
    }
  },

  /**
   * Fetch payment records
   */
  fetchPaymentRecords: async (ownerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/payment-reminders/list?owner_id=${ownerId}`
      );
      
      return {
        data: response.data.data || response.data || [],
        success: true
      };
    } catch (error) {
      logger.error('Error fetching payment records:', error);
      throw error;
    }
  },

  /**
   * Fetch single record by ID
   */
  fetchRecordById: async (apiParams, recordId) => {
    try {
      const decodedId = decodeURIComponent(recordId);
      
      const response = await axios.post(
        `${BASE_URL}/data/getRecordById`,
        {
          schemaName: apiParams.schemaName,
          tableName: apiParams.tableName,
          id: decodedId
        }
      );
      
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      logger.error('Error fetching record by ID:', error);
      return {
        data: null,
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Create new record
   */
  createRecord: async (apiParams, recordData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/data/createRecord`,
        {
          schemaName: apiParams.schemaName,
          tableName: apiParams.tableName,
          record: recordData
        }
      );
      
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      logger.error('Error creating record:', error);
      throw error;
    }
  },

  /**
   * Create payment reminder
   */
  createPaymentReminder: async (recordData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/payment-reminders/add`,
        recordData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      logger.error('Error creating payment reminder:', error);
      throw error;
    }
  },

  /**
   * Update record
   */
  updateRecord: async (apiParams, recordId, ownerId, updates) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/data/updateMultiple`,
        {
          schemaName: apiParams.schemaName,
          tableName: apiParams.tableName,
          recordId,
          ownerId,
          updates
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      logger.error('Error updating record:', error);
      throw error;
    }
  },

  /**
   * Delete record
   */
  deleteRecord: async (apiParams, recordId) => {
    try {
      const params = new URLSearchParams({
        id: recordId,
        schemaName: apiParams.schemaName,
        tableName: apiParams.tableName
      });

      const response = await axios.get(
        `${BASE_URL}/data/deleteRecord?${params.toString()}`
      );
      
      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      logger.error('Error deleting record:', error);
      throw error;
    }
  },

  /**
   * Fetch dropdown setup configuration
   */
  fetchDropdownSetup: async (ownerId, tableName) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/reference/setup/check?owner_id=${ownerId}&product_name=${tableName}`
      );
      
      if (response.data.exists && response.data.setup) {
        return {
          mapping: response.data.setup.mapping || {},
          columnOrder: response.data.setup.columnOrder || {},
          exists: true,
          success: true
        };
      }
      
      return {
        mapping: {},
        columnOrder: {},
        exists: false,
        success: true
      };
    } catch (error) {
      logger.error('Error fetching dropdown setup:', error);
      return {
        mapping: {},
        columnOrder: {},
        exists: false,
        success: false
      };
    }
  }
};