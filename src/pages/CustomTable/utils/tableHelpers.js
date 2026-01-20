import { COLUMN_TYPES } from '../constants/tableConstants';

export const formatColumnName = (key) => {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


export const getColumnType = (value, columnName) => {
  const lowerColumnName = columnName.toLowerCase();

  // Specific checks first
  if (lowerColumnName.includes('email')) return COLUMN_TYPES.EMAIL;
  if (lowerColumnName.includes('phone')) return COLUMN_TYPES.PHONE;
  if (lowerColumnName.includes('url') || 
      lowerColumnName.includes('link') || 
      lowerColumnName.includes('invoice_url')) return COLUMN_TYPES.URL;
  if (lowerColumnName === 'status') return COLUMN_TYPES.SELECT_STATUS;
  if (lowerColumnName === 'priority') return COLUMN_TYPES.SELECT_PRIORITY;
  if (lowerColumnName.includes('description') || 
      lowerColumnName.includes('notes') || 
      lowerColumnName.includes('comment')) return COLUMN_TYPES.TEXTAREA;
  if (lowerColumnName.includes('date') || 
      lowerColumnName.includes('created') || 
      lowerColumnName.includes('updated') || 
      lowerColumnName === 'invoice') return COLUMN_TYPES.DATE;

  // Fallback based on value type
  if (typeof value === 'number') return COLUMN_TYPES.NUMBER;
  if (typeof value === 'boolean') return COLUMN_TYPES.CHECKBOX;
  if (value && value.length > 100) return COLUMN_TYPES.TEXTAREA;

  return COLUMN_TYPES.TEXT;
};


export const generateUsId = () => {
  return Date.now().toString();
};


export const getBadgeColor = (status, colorMap) => {
  return colorMap[status?.toLowerCase()] || colorMap.default;
};


export const getFormColumns = (columns, processName = null) => {
  return columns.filter(column => {
    // Standard exclusions
    if (column.id === 'id' ||
        column.id.includes('_comment') ||
        column.id.includes('created_at') ||
        column.id.includes('updated_at')) {
      return false;
    }

    // Hide ALL balance fields when process_name exists
    if (processName) {
      const columnIdLower = column.id.toLowerCase();
      const columnNameLower = column.name.toLowerCase();
      const isBalanceField = columnIdLower.includes('balance') || 
                           columnNameLower.includes('balance');
      
      if (isBalanceField) {
        return false;
      }
    }

    return true;
  });
};


export const sortColumnsByOrder = (columns, columnOrder = {}) => {
  return columns
    .filter(column => {
      const order = columnOrder[column.id];
      return order !== 0; // Skip fields with order = 0
    })
    .sort((a, b) => {
      const orderA = columnOrder[a.id] || 999;
      const orderB = columnOrder[b.id] || 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If orders are the same, sort alphabetically
      return a.name.localeCompare(b.name);
    });
};


export const sanitizeRecordData = (record, dateFields = [], arrayFields = []) => {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => {
      // Handle date fields
      if (dateFields.includes(key)) {
        return [key, value === '' ? null : value];
      }

      // Handle array fields
      if (arrayFields.includes(key)) {
        if (value === '') return [key, null];
        return [key, value];
      }

      // Default case
      return [key, value === '' ? null : value];
    })
  );
};


export const removeNullValues = (obj, allowEmpty = []) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        return true;
      }
      return allowEmpty.includes(key);
    })
  );
};