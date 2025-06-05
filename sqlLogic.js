function generateCreateTableQuery(fields, tableName, useUUID = true) {
  if (!fields || fields.length === 0) {
    throw new Error("Fields array cannot be empty or null.");
  }
  if (!tableName || tableName.trim() === "") {
    throw new Error("Table name cannot be empty or null.");
  }

  const columns = fields.map((field) => {
    let columnDefinition = `"${field.name}"`;

    // Determine SQL type
    switch (field.type.toLowerCase()) {
      case 'number':
        columnDefinition += ' INTEGER';
        break;
      case 'text':
        columnDefinition += ' TEXT';
        break;
      case 'date':
        columnDefinition += ' DATE';
        break;
      case 'boolean':
        columnDefinition += ' BOOLEAN';
        break;
      default:
        columnDefinition += ' TEXT'; // default fallback
    }

    // Special handling for 'id' field using UUID
    if (field.name === 'id' && useUUID) {
      columnDefinition = `"id" UUID PRIMARY KEY`;
      // Optional: Add default generator for PostgreSQL
      columnDefinition += ` DEFAULT uuid_generate_v4()`;
    } else {
      // Add default value if not UUID id
      if (field.defaultValue !== null && field.defaultValue !== undefined) {
        if (typeof field.defaultValue === 'string') {
          columnDefinition += ` DEFAULT '${field.defaultValue}'`;
        } else {
          columnDefinition += ` DEFAULT ${field.defaultValue}`;
        }
      }

      // Add NOT NULL constraint
      if (field.locked) {
        columnDefinition += ' NOT NULL';
      }
    }

    return columnDefinition;
  });

  const query = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columns.join(', ')})`;
  return query;
}

  
  /**
   * Example usage:
   */
  const fields = [
    { name: 'id', type: 'Number', label: 'ID', defaultValue: 'Auto', locked: true },
    { name: 'task_name', type: 'Text', label: 'Task Name', defaultValue: '-', locked: true },
    { name: 'description', type: 'Text', label: 'Description', defaultValue: null, locked: false },
    { name: 'due_date', type: 'Date', label: 'Due Date', defaultValue: null, locked: false },
    { name: 'completed', type: 'Boolean', label: 'Completed', defaultValue: 'false', locked: false}
  ];
  
  const tableName = 'tasks';
  
  try {
    const createTableQuery = generateCreateTableQuery(fields, tableName);
    console.log(createTableQuery);
    // In a real application, you would execute this query using your database connection.
    // For example, with SQLite:
    // db.run(createTableQuery, (err) => {
    //   if (err) {
    //     console.error("Error creating table:", err);
    //   } else {
    //     console.log("Table created successfully.");
    //   }
    // });
  } catch (error) {
    console.error("Error:", error.message);
  }