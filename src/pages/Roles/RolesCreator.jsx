import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Loader2 } from 'lucide-react';

const OPERATORS = {
  string: ['=', '!=', 'LIKE', 'NOT LIKE', 'IN', 'NOT IN'],
  number: ['=', '!=', '>', '<', '>=', '<=', 'IN', 'NOT IN'],
  date: ['=', '!=', '>', '<', '>=', '<=', 'BETWEEN'],
  boolean: ['=', '!=']
};

const LOGICAL_OPERATORS = ['AND', 'OR'];

// Helper function to map PostgreSQL types to operator categories
const getOperatorCategory = (dataType) => {
  const type = dataType.toLowerCase();
  if (type.includes('char') || type.includes('text')) return 'string';
  if (type.includes('int') || type.includes('numeric') || type.includes('decimal') || type.includes('float') || type.includes('double')) return 'number';
  if (type.includes('date') || type.includes('time')) return 'date';
  if (type.includes('bool')) return 'boolean';
  return 'string'; // default
};

export default function RolesCreator() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const schemaName = user?.schema_name;

  const [filterName, setFilterName] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [conditions, setConditions] = useState([
    { id: 1, column: '', operator: '', value: '', logicalOp: 'AND' }
  ]);
  
  // New state for API data
  const [tables, setTables] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingColumns, setLoadingColumns] = useState(false);

  // Fetch all tables on component mount
  useEffect(() => {
    if (schemaName) {
      getAllTables();
    }
  }, [schemaName]);

  const getAllTables = async () => {
    try {
      setLoading(true);
      const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
      const { data } = await axios.get(route);
      setTables(data.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert("Failed to fetch tables. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTableColumns = async (tableName) => {
    try {
      setLoadingColumns(true);
      const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getTableColumns?schemaName=${schemaName}&tableName=${tableName}`;
      const { data } = await axios.get(route);
      setTableColumns(data.data);
    } catch (error) {
      console.error("Error fetching table columns:", error);
      alert("Failed to fetch columns. Please try again.");
    } finally {
      setLoadingColumns(false);
    }
  };

  const handleTableChange = async (tableName) => {
    setSelectedTable(tableName);
    setSelectedColumns([]);
    setConditions([{ id: 1, column: '', operator: '', value: '', logicalOp: 'AND' }]);
    await getTableColumns(tableName);
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const addCondition = () => {
    const newId = Math.max(...conditions.map(c => c.id), 0) + 1;
    setConditions([...conditions, { id: newId, column: '', operator: '', value: '', logicalOp: 'AND' }]);
  };

  const removeCondition = (id) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const updateCondition = (id, field, value) => {
    setConditions(conditions.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        // Reset operator when column changes
        if (field === 'column') {
          updated.operator = '';
        }
        return updated;
      }
      return c;
    }));
  };

  // Get appropriate operators for a selected column
  const getOperatorsForColumn = (columnName) => {
    const column = tableColumns.find(col => col.name === columnName);
    if (!column) return OPERATORS.string;
    const category = getOperatorCategory(column.type);
    return OPERATORS[category];
  };

  const generateJSON = () => {
    const filterConfig = {
      name: filterName,
      table: selectedTable,
      columns: selectedColumns,
      conditions: conditions.map((cond, index) => ({
        column: cond.column,
        operator: cond.operator,
        value: cond.value,
        ...(index < conditions.length - 1 && { logicalOperator: cond.logicalOp })
      }))
    };

    return JSON.stringify(filterConfig, null, 2);
  };

const handleSave = async () => {
  // Validate inputs
  if (!filterName.trim()) {
    alert('Please enter a filter name');
    return;
  }
  if (!selectedTable) {
    alert('Please select a table');
    return;
  }
  if (selectedColumns.length === 0) {
    alert('Please select at least one column');
    return;
  }

  // Generate the role config
  const roleConfig = {
    filterName: filterName,
    table: selectedTable,
    columns: selectedColumns,
    conditions: conditions.map((cond, index) => ({
      column: cond.column,
      operator: cond.operator,
      value: cond.value,
      ...(index < conditions.length - 1 && { logicalOperator: cond.logicalOp })
    }))
  };

  console.log('Sending role config:', roleConfig);
  
  try {
    const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/createRole`;
    const response = await axios.post(route, {
      ownerId: user.id,              // ✅ User's ID
      schemaName: schemaName,         // ✅ User's schema (from Redux)
      roleName: filterName,           // ✅ Role name
      tableName: selectedTable,       // ✅ Table name
      roleConfig: roleConfig,         // ✅ The config object (not JSON string)
      createdBy: user.email || user.name || `User ${user.id}`  // ✅ Who created it
    });

    console.log('Role created:', response.data);
    alert('Role configuration saved successfully!');
    
    // Reset form
    setFilterName('');
    setSelectedTable('');
    setSelectedColumns([]);
    setTableColumns([]);
    setConditions([{ id: 1, column: '', operator: '', value: '', logicalOp: 'AND' }]);
    
  } catch (error) {
    console.error('Error saving role:', error);
    if (error.response?.data?.message) {
      alert(`Failed to save: ${error.response.data.message}`);
    } else {
      alert('Failed to save role configuration. Please try again.');
    }
  }
};

  const availableColumns = tableColumns;

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="w-full px-[6rem] space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium ">Data Access Filter Configuration</h1>
          <p className="text-slate-600">Configure data access permissions for non-privileged team members</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Filter Details</CardTitle>
            <CardDescription>Define the basic properties of your data filter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="filter-name">Filter Name</Label>
              <Input
                id="filter-name"
                placeholder="e.g., Sales Team Filter"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="table-select">Select Table</Label>
              <Select value={selectedTable} onValueChange={handleTableChange} disabled={loading}>
                <SelectTrigger id="table-select">
                  <SelectValue placeholder={loading ? "Loading tables..." : "Choose a table"} />
                </SelectTrigger>
                <SelectContent>
                  {tables.map(table => (
                    <SelectItem key={table.id} value={table.title}>
                      {table.title} ({table.fieldsCount} fields)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedTable && (
          <>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Accessible Columns</CardTitle>
                <CardDescription>Select which columns should be visible to users with this filter</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingColumns ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
                    <span className="ml-2 text-slate-600">Loading columns...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableColumns.map(column => (
                      <div key={column.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`col-${column.name}`}
                          checked={selectedColumns.includes(column.name)}
                          onCheckedChange={() => handleColumnToggle(column.name)}
                        />
                        <label
                          htmlFor={`col-${column.name}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {column.name}
                          <span className="text-xs text-slate-500 ml-1">({column.type})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Row-Level Conditions</CardTitle>
                <CardDescription>Define conditions to filter which rows users can access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conditions.map((condition, index) => (
                  <div key={condition.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Column</Label>
                          <Select
                            value={condition.column}
                            onValueChange={(value) => updateCondition(condition.id, 'column', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableColumns.map(col => (
                                <SelectItem key={col.id} value={col.name}>
                                  {col.name} ({col.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Operator</Label>
                          <Select
                            value={condition.operator}
                            onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                            disabled={!condition.column}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {(condition.column ? getOperatorsForColumn(condition.column) : OPERATORS.string).map(op => (
                                <SelectItem key={op} value={op}>{op}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Value</Label>
                          <Input
                            placeholder="e.g., pending"
                            value={condition.value}
                            onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCondition(condition.id)}
                        disabled={conditions.length === 1}
                        className="mt-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {index < conditions.length - 1 && (
                      <div className="flex items-center gap-2">
                        <div className="h-px bg-slate-200 flex-1" />
                        <Select
                          value={condition.logicalOp}
                          onValueChange={(value) => updateCondition(condition.id, 'logicalOp', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LOGICAL_OPERATORS.map(op => (
                              <SelectItem key={op} value={op}>{op}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="h-px bg-slate-200 flex-1" />
                      </div>
                    )}
                  </div>
                ))}

                <Button onClick={addCondition} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-slate-50">
              <CardHeader>
                <CardTitle>Generated JSON Configuration</CardTitle>
                <CardDescription>This JSON will be stored in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {generateJSON()}
                </pre>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setFilterName('');
                setSelectedTable('');
                setSelectedColumns([]);
                setConditions([{ id: 1, column: '', operator: '', value: '', logicalOp: 'AND' }]);
              }}>
                Reset
              </Button>
              <Button onClick={handleSave}>
                Save Filter Configuration
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}



