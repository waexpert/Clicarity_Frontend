import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setDynamicData } from '../../features/dataMethod/tableStructureSlice';
import { SlidersHorizontal } from 'lucide-react';
import '../../css/element/icon.css';
import '../../css/pages/CustomViewForm.css';

// Lazy load heavy components
const DynamicUpdateForm = lazy(() => import('../../components/customUpdateForm/DynamicUpdateForm'));
const FixedUpdateForm = lazy(() => import('../../components/customUpdateForm/FixedUpdateForm'));
const WastageUpdateForm = lazy(() => import('../../components/customUpdateForm/WastageUpdateForm'));
const Filter = lazy(() => import('../../components/customUpdateForm/Filter'));

// Constants
const SYSTEM_TABLES = new Set([
  "contact",
  "team_member",
  "vendor",
  "schema_migrations",
  "reminders"
]);

const DEBOUNCE_DELAY = 300;
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

// Loading skeleton component
const FormSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
  </div>
);

const CustomUpdateForm = () => {
  // State management
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [recordData, setRecordData] = useState(null);
  const [currentTable, setCurrentTable] = useState('jobstatus');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [setupData, setSetupData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [processTypeMapping, setProcessTypeMapping] = useState({});
  const [childRecords, setChildRecords] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const schemaName = userData?.schema_name || 'default_schema';
  const owner_id = userData?.owner_id ?? userData?.id;

  // Memoized filtered tables
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const tableName = table?.title || table;
      return tableName && !SYSTEM_TABLES.has(tableName);
    });
  }, [tables]);

  // API Service Functions
  const fetchRecordByTarget = useCallback(async (targetColumn, targetValue) => {
    const { data } = await axios.post(`${BASE_URL}/data/getRecordByTarget`, {
      schemaName,
      tableName: currentTable,
      targetColumn,
      targetValue,
      userId: userData.id,
      userEmail: userData.email
    });
    return data;
  }, [schemaName, currentTable]);

  const fetchChildRecords = useCallback(async (targetValue) => {
    const { data } = await axios.post(`${BASE_URL}/data/getRecordByTargetAll`, {
      schemaName,
      tableName: currentTable,
      targetColumn: 'pa_id',
      targetValue,
      userId: userData.id,
      userEmail: userData.email
    });
    return Array.isArray(data) ? data : [data];
  }, [schemaName, currentTable, userData.id, userData.email]);

  // Parallel search with axios
  const handleSearch = useCallback(async () => {
    if (!searchId.trim()) {
      setError('Please enter an ID');
      return;
    }

    setLoading(true);
    setError(null);
    setRecordData(null);
    setChildRecords([]);

    try {
      // Parallel API calls for better performance
      const [parentData, childData] = await Promise.allSettled([
        fetchRecordByTarget('us_id', searchId),
        fetchChildRecords(searchId)
      ]);

      // Handle parent record
      if (parentData.status === 'fulfilled') {
        const result = parentData.value;
        setRecordData(result);

        // Extract columns
        const columnNames = Array.isArray(result) && result.length > 0
          ? Object.keys(result[0])
          : result && typeof result === 'object'
            ? Object.keys(result)
            : [];

        if (columnNames.length > 0) {
          setColumns(columnNames);
          setVisibleColumns(columnNames);
        }
      } else {
        throw new Error('Failed to fetch parent record');
      }

      // Handle child records
      if (childData.status === 'fulfilled') {
        setChildRecords(childData.value);
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchId, fetchRecordByTarget, fetchChildRecords]);

  // Fetch all tables on mount
  useEffect(() => {
    const getAllTables = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/data/getAllTables?schemaName=${schemaName}`);
        setTables(data.data || []);
        dispatch(setDynamicData({ tables: data.data || [] }));
      } catch (err) {
        console.error('Error fetching tables:', err);
      }
    };

    getAllTables();
  }, [schemaName, dispatch]);

// Debounced suggestion search
useEffect(() => {
  if (!searchId.trim()) {
    setSuggestion([]);
    setShowSuggestions(false);
    return;
  }

  const controller = new AbortController();

  const timeout = setTimeout(async () => {
    try {   
      console.log('🔍 [FRONTEND] Making search request:', {
        schemaName,
        tableName: currentTable,
        query: searchId
      });

      // ✅ CORRECT POST syntax
      const { data } = await axios.post(
        `${BASE_URL}/additional/search`,
        {
          schemaName: schemaName,
          tableName: currentTable,
          query: searchId,
          userId:userData.id,
          userEmail:userData.email
        },
        { signal: controller.signal } 
      );

      console.log('✅ [FRONTEND] Response:', data);
      
      const rows = data?.data || [];
      setSuggestion(rows);
      setShowSuggestions(rows.length > 0);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        console.error('❌ [FRONTEND] Error:', err);
        console.error('❌ [FRONTEND] Response:', err.response?.data);
      }
    }
  }, DEBOUNCE_DELAY);

  return () => {
    clearTimeout(timeout);
    controller.abort();
  };
}, [searchId, currentTable, schemaName]);

  // Fetch setup data when table changes
  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${currentTable}`
        );

        if (data.exists && data.setup) {
          setSetupData(data.setup);
          setSelectedColumns(data.setup.filter_form_columns || []);
          setProcessTypeMapping(data.setup.process_type_mapping || {});
        } else {
          setSetupData(null);
          setSelectedColumns(visibleColumns.length > 0 ? visibleColumns : columns);
        }
      } catch (err) {
        console.error('Error fetching setup:', err);
        setSetupData(null);
        setSelectedColumns(visibleColumns.length > 0 ? visibleColumns : columns);
      }
    };


    
    if (currentTable && owner_id) {
      fetchSetupData();
    }
  }, [owner_id, currentTable]);

  // Event handlers with useCallback
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleTableSelect = useCallback((e) => {
    const selectedTable = e.target.value;
    setCurrentTable(selectedTable);
    setColumns([]);
    setVisibleColumns([]);
    setRecordData(null);
    setChildRecords([]);
    setSearchId('');
    setSuggestion([]);
    setShowSuggestions(false);
  }, []);

  const handleSuggestionClick = useCallback((value) => {
    setSearchId(value);
    setShowSuggestions(false);
    setSuggestion([]);
  }, []);

  const handleSuggestionInput = useCallback((e) => {
    setSearchId(e.target.value);
    if (error) setError(null);
  }, [error]);

  const handleApplyFilter = useCallback((selectedCols) => {
    setVisibleColumns(selectedCols);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  // Memoize form component to prevent unnecessary re-renders
  const FormComponent = useMemo(() => {
    if (!recordData) return null;

    const status = recordData?.status;
    const processType = processTypeMapping[status];

    const commonProps = {
      data: recordData,
      loading,
      visibleColumns,
      setupData,
      tableName: currentTable,
      schemaName,
      selectedColumns
    };

    switch (processType) {
      case "Dynamic":
        return <DynamicUpdateForm {...commonProps} />;
      case "Fixed":
        return <FixedUpdateForm {...commonProps} />;
      case "Wastage":
        return <WastageUpdateForm {...commonProps} childRecords={childRecords} />;
      default:
        return <DynamicUpdateForm {...commonProps} />;
    }
  }, [
    recordData,
    loading,
    visibleColumns,
    setupData,
    currentTable,
    schemaName,
    selectedColumns,
    processTypeMapping,
    childRecords
  ]);

  return (
    <div className="container">
      {/* Search Section */}
      <div className="form-group-1">
        <div className="top-section">
          <h2 className="heading">Update Status</h2>
          <Button
            className="filter-section"
            onClick={toggleFilter}
            disabled={!recordData || columns.length === 0}
          >
            <p>Filter</p>
            <SlidersHorizontal className='icon-md' />
          </Button>
        </div>

        {/* Table Selection */}
        <div className="select-wrapper">
          <select
            id="table-select"
            value={currentTable}
            onChange={handleTableSelect}
            className={`select ${error && !currentTable ? 'select-error' : ''}`}
            disabled={loading}
          >
            <option value="" disabled className="placeholder-option">
              - Select Table -
            </option>
            {filteredTables.map((table) => {
              const title = table?.title || table;
              return (
                <option key={title} value={title} className="option">
                  {title.charAt(0).toUpperCase() + title.slice(1).replace(/_/g, ' ')}
                </option>
              );
            })}
          </select>
          <div className="select-arrow">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Search Input with Suggestions */}
        <div className="relative w-full">
          <Input
            type="text"
            value={searchId}
            onChange={handleSuggestionInput}
            onKeyDown={handleKeyPress}
            className="bg-gray-50 text-gray-700 mb-2"
            placeholder="Enter the ID"
            aria-label="Search ID"
            disabled={loading}
            autoComplete="off"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestion.length > 0 && (
            <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
              {suggestion.map((item, index) => (
                <li
                  key={item.us_id || index}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onClick={() => handleSuggestionClick(item.us_id)}
                >
                  {item.us_id}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <Button
          className="button"
          onClick={handleSearch}
          aria-label="Search for record"
          disabled={loading || !currentTable || !searchId.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
            {error}
          </div>
        )}
      </div>

      {/* Update Form Section */}
      <div className="form-group-2">
        <Suspense fallback={<FormSkeleton />}>
          {FormComponent}
        </Suspense>
      </div>

      {/* Filter Component */}
      <Suspense fallback={<div>Loading filter...</div>}>
        <Filter
          isOpen={isFilterOpen}
          onClose={toggleFilter}
          columns={columns}
          visibleColumns={visibleColumns}
          onApplyFilter={handleApplyFilter}
          tableName={currentTable}
          setSelectedColumns={setSelectedColumns}
          selectedColumns={selectedColumns}
        />
      </Suspense>
    </div>
  );
};

export default CustomUpdateForm;


