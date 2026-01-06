import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const PERMISSION_API = `${BASE_URL}/permissions`;

/**
 * Enable Row Level Security on a table
 */
export const enableRLS = async (schemaName, tableName, force = true) => {
  try {
    const response = await axios.post(`${PERMISSION_API}/enable-rls`, {
      schemaName,
      tableName,
      force
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Disable Row Level Security on a table
 */
export const disableRLS = async (schemaName, tableName) => {
  try {
    const response = await axios.post(`${PERMISSION_API}/disable-rls`, {
      schemaName,
      tableName
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create dynamic RLS policy based on roles
 */
export const createDynamicPolicy = async (schemaName, tableName, condition, policyName, policyType = "combined") => {
  try {
    const response = await axios.post(`${PERMISSION_API}/create-policy`, {
      schemaName,
      tableName,
      condition,
      policyName,
      policyType
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Create operation-specific policy (SELECT, INSERT, UPDATE, DELETE)
 */
export const createOperationPolicy = async (schemaName, tableName, operation, condition, policyName) => {
  try {
    const response = await axios.post(`${PERMISSION_API}/create-operation-policy`, {
      schemaName,
      tableName,
      operation,
      condition,
      policyName
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Complete RLS setup (enable RLS + create policy in one go)
 */
export const setupCompleteRLS = async (schemaName, tableName, condition, policyName, force = true) => {
  try {
    const response = await axios.post(`${PERMISSION_API}/setup-complete-rls`, {
      schemaName,
      tableName,
      condition,
      policyName,
      force
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Drop a specific policy
 */
export const dropPolicy = async (schemaName, tableName, policyName) => {
  try {
    const response = await axios.delete(`${PERMISSION_API}/drop-policy`, {
      data: {
        schemaName,
        tableName,
        policyName
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * List all policies on a table
 */
export const listTablePolicies = async (schemaName, tableName) => {
  try {
    const response = await axios.get(`${PERMISSION_API}/list-policies`, {
      params: {
        schemaName,
        tableName
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Check RLS status for a specific table
 */
export const checkRLSStatus = async (schemaName, tableName) => {
  try {
    const response = await axios.get(`${PERMISSION_API}/check-rls-status`, {
      params: {
        schemaName,
        tableName
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get RLS status for all tables in a schema
 */
export const getSchemaRLSStatus = async (schemaName) => {
  try {
    const response = await axios.get(`${PERMISSION_API}/schema-rls-status`, {
      params: {
        schemaName
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
