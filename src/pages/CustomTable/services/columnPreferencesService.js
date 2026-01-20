import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const columnPreferencesService = {
    
  // Fetch column preferences
  async fetch(owner_id, tableName) {
    try {
      console.log('Fetching column preferences for:', { owner_id, tableName });
      
      const recordId = `${owner_id}_${tableName}`;
      
      const response = await axios.post(`${BASE_URL}/data/getRecordById`, {
        id: recordId,
        schemaName: "public",
        tableName: "column_preferences"
      });
      
      console.log('Fetched column preferences:', response.data);
      
      // Parse column_visibility if it's a string
      let columnVisibility = response.data.column_visibility;
      if (typeof columnVisibility === 'string') {
        try {
          columnVisibility = JSON.parse(columnVisibility);
        } catch (e) {
          console.error('Error parsing column_visibility:', e);
          return null;
        }
      }
      
      return {
        ...response.data,
        column_visibility: columnVisibility
      };
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('No existing column preferences found');
        return null;
      }
      console.error('Error fetching column preferences:', error);
      return null;
    }
  },

  // Save column preferences (backend handles create/update automatically)
  async save(owner_id, tableName, columnVisibility, schema_name) {
    try {
      const recordId = `${owner_id}_${tableName}`;
      
      console.log('Saving column preferences:', {
        recordId,
        owner_id,
        tableName,
        columnVisibility
      });

      // Stringify the columnVisibility object for JSONB
      const stringifiedVisibility = JSON.stringify(columnVisibility);
      console.log('Stringified column_visibility:', stringifiedVisibility);

      // Always use createRecord - backend handles update if us_id exists
      const createRoute = `${BASE_URL}/data/createRecord`;
      const createBody = {
        schemaName: "public",
        tableName: "column_preferences",
        record: {
          us_id: recordId,
          owner_id: owner_id,
          table_name: tableName,
          schema_name: schema_name,
          column_visibility: stringifiedVisibility,
          updated_at: new Date().toISOString()
        }
      };

      console.log('Create/Update request body:', createBody);
      const response = await axios.post(createRoute, createBody);
      console.log('Create/Update response:', response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error saving column preferences:', error);
      console.error('Error response:', error.response?.data);
      return { success: false, error: error.response?.data || error.message };
    }
  }
};