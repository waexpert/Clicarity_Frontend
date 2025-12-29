/**
 * API Service for Views
 * Centralized API calls for view management
 */

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Helper function to get schema name (can be extended to get from Redux/Context)
const getSchemaName = () => {
  // TODO: Get from user context/Redux store
  return 'public';
};

/**
 * Fetch all available database tables with their columns
 */
export const fetchTables = async () => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/tables?schemaName=${schemaName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tables');
  }
  return response.json();
};

/**
 * Fetch all team members
 */
export const fetchTeamMembers = async () => {
  const schemaName = getSchemaName();
  try {
    const response = await fetch(`${BASE_URL}/views/team-members?schemaName=${schemaName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
};

/**
 * Fetch view folders with their views
 */
export const fetchFolders = async () => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/folders?schemaName=${schemaName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch folders');
  }
  return response.json();
};

/**
 * Fetch a specific view by ID
 */
export const fetchView = async (id: string) => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/${id}?schemaName=${schemaName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch view');
  }
  const data = await response.json();

  // Parse JSON fields if they're strings
  return {
    ...data,
    selected_tables: typeof data.selected_tables === 'string' ? JSON.parse(data.selected_tables) : data.selected_tables || [],
    selected_columns: typeof data.selected_columns === 'string' ? JSON.parse(data.selected_columns) : data.selected_columns || [],
    joins: typeof data.joins === 'string' ? JSON.parse(data.joins) : data.joins || [],
    where_conditions: typeof data.where_conditions === 'string' ? JSON.parse(data.where_conditions) : data.where_conditions || [],
    team_members: typeof data.team_members === 'string' ? JSON.parse(data.team_members) : data.team_members || [],
  };
};

/**
 * Create a new view
 */
export const createView = async (payload: any) => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views?schemaName=${schemaName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create view');
  }

  return data;
};

/**
 * Update an existing view
 */
export const updateView = async (id: string, payload: any) => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/${id}?schemaName=${schemaName}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update view');
  }

  return data;
};

/**
 * Delete a view
 */
export const deleteView = async (id: string) => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/${id}?schemaName=${schemaName}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete view');
  }

  return data;
};

/**
 * Preview view data
 */
export const previewView = async (sql: string) => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/preview?schemaName=${schemaName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to preview view');
  }

  return data;
};

/**
 * Get Looker Studio connection info
 */
export const getLookerStudioInfo = async (id: string) => {
  const schemaName = getSchemaName();
  const response = await fetch(`${BASE_URL}/views/${id}/looker-studio?schemaName=${schemaName}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to get Looker Studio info');
  }

  return data;
};
