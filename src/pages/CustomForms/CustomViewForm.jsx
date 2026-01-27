import React, { useState, useEffect, useMemo, lazy } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RecordDetails from '../../components/customUpdateForm/RecordDetails';
const WastageUpdateForm = lazy(() => import('../../components/customUpdateForm/WastageUpdateForm'));
import Filter from '../../components/customUpdateForm/Filter';
import '../../css/pages/CustomViewForm.css';

const CustomViewForm = () => {
  const [currentTable, setCurrentTable] = useState('jobstatus');
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processTypeMapping, setProcessTypeMapping] = useState({});
  const [processName, setProcessName] = useState('');
  const [processSteps, setProcessSteps] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [setupData, setSetupData] = useState({});
  const [childRecords, setChildRecords] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);

  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const schemaName = userData?.schema_name || 'default_schema';
  const navigate = useNavigate();
  const systemTables = ["contact", "team_member", "vendor", "schema_migrations", "reminders"];
  const sTables = new Set(systemTables);
  const [searchParams] = useSearchParams();
  const searchTable = searchParams.get('search');

  const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;

  useEffect(() => {
    getAllTables();
    if (searchTable) {
      setCurrentTable(searchTable);
    }
  }, [searchTable]);

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${currentTable}`;
        const { data } = await axios.get(route);
        
        console.log('📦 Setup Data Response:', data);
        console.log('📦 Process Type Mapping:', data.setup?.process_type_mapping);

        if (data.exists && data.setup) {
          setSetupData(data.setup);
          setSelectedColumns(data.setup.filter_form_columns || []);
          setProcessTypeMapping(data.setup.process_type_mapping || {});

          const steps = data.setup.process_steps || [];
          const validSteps = steps.filter(step => step && (step.title || typeof step === 'string'));
          setProcessSteps(validSteps);
        } else {
          setSelectedColumns([]);
          setProcessSteps([]);
          setProcessTypeMapping({});
        }
      } catch (err) {
        console.error('Error fetching setup:', err);
        setProcessSteps([]);
        setProcessTypeMapping({});
      }
    };

    if (currentTable && userData?.id) {
      fetchSetupData();
    }
  }, [userData?.id, currentTable, owner_id]);

  const getAllTables = async () => {
    try {
      const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
      const { data } = await axios.get(route);
      setTables(data.data || []);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch tables');
    }
  };

  const handleSearch = async () => {
    if (!currentTable) {
      setError('Please select a table');
      return;
    }

    if (!processName) {
      setError('Please select a process');
      return;
    }

    setLoading(true);
    setError(null);
    setRecords([]);
    setSelectedRecord(null);

    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://click.wa.expert/api';

      // 🔍 DEBUG LOGGING
      console.log('=== SEARCH DEBUG INFO ===');
      console.log('Process Name:', processName);
      console.log('Full Process Type Mapping:', processTypeMapping);
      console.log('Process Type for this process:', processTypeMapping[processName]);
      console.log('========================');

      // ✅ ROBUST WASTAGE CHECK - handles case insensitivity and undefined
      const processType = processTypeMapping[processName];
      const isWastage = processType?.toLowerCase() === "wastage";
      
      console.log('🔍 Process Type:', processType);
      console.log('🔍 Is Wastage:', isWastage);

      // ✅ Build SQL condition based on type
      const condition = isWastage
        ? `${processName}_balance > 0 AND NOT (us_id ~ '^[0-9]+$' AND LENGTH(us_id::text) >= 10)`
        : `status = '${processName}' AND NOT (us_id ~ '^[0-9]+$' AND LENGTH(us_id::text) >= 10)`;

      console.log('✅ Final SQL CONDITION:', condition);

      const response = await fetch(`${baseUrl}/data/getRecordByCondition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schemaName,
          tableName: currentTable,
          targetWithCondition: condition.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 API Response:', result);
      
      const recordsArray = Array.isArray(result) ? result : [result];
      setRecords(recordsArray);

      // Extract columns safely
      if (recordsArray.length > 0 && recordsArray[0]) {
        const columnNames = Object.keys(recordsArray[0]);
        setColumns(columnNames);

        if (selectedColumns.length === 0) {
          setSelectedColumns(columnNames);
          setVisibleColumns(columnNames);
        } else {
          setVisibleColumns(selectedColumns);
        }
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildRecords = async (parentUsId) => {
    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://click.wa.expert/api';
      const childResponse = await fetch(`${baseUrl}/data/getRecordByTargetAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schemaName,
          tableName: currentTable,
          targetColumn: 'pa_id',
          targetValue: parentUsId,
        }),
      });

      if (childResponse.ok) {
        const childResult = await childResponse.json();
        const children = Array.isArray(childResult) ? childResult : [childResult];
        setChildRecords(children);
      }
    } catch (childErr) {
      console.warn('Could not fetch child records:', childErr);
      setChildRecords([]);
    }
  };

  const handleTableSelect = (e) => {
    const selectedTable = e.target.value;
    setCurrentTable(selectedTable);
    setProcessName('');
    setRecords([]);
    setSelectedRecord(null);
    setChildRecords([]);
  };

  const handleSelectProcess = (e) => {
    const selectedProcess = e.target.value;
    setProcessName(selectedProcess);
    setRecords([]);
    setSelectedRecord(null);
    setChildRecords([]);
  };

  const handleRecordClick = async (record) => {
    setSelectedRecord(record);
    if (record.us_id) {
      await fetchChildRecords(record.us_id);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
    setChildRecords([]);
  };

  const handleApplyFilter = (filteredColumns) => {
    console.log('Filter applied with columns:', filteredColumns);
    setVisibleColumns(filteredColumns);
    setSelectedColumns(filteredColumns);
  };

  const status = processName;

  const handleSplitJob = () => {
    navigate(`/${currentTable}/record?pa_id=${selectedRecord?.us_id}&status=${status}&show=true`);
  };

  const handleEnterJob = () => {
    navigate(`/${currentTable}/record?us_id=${selectedRecord?.us_id}&status=${'pending'}&show=true`);
  };

  // ✅ FIXED: Use lowercase comparison and proper fallback
  const currentProcessType = useMemo(() => {
    if (!processTypeMapping || !status) return 'dynamic';
    const processType = processTypeMapping[status];
    return processType ? processType.toLowerCase() : 'dynamic';
  }, [processTypeMapping, status]);

  const filteredData = useMemo(() => {
    if (!selectedRecord) {
      return selectedRecord;
    }

    const columnsToShow = visibleColumns.length > 0
      ? visibleColumns
      : (selectedColumns.length > 0 ? selectedColumns : Object.keys(selectedRecord));

    if (columnsToShow.length === 0) {
      return selectedRecord;
    }

    return Object.keys(selectedRecord)
      .filter(key => columnsToShow.includes(key))
      .reduce((obj, key) => {
        obj[key] = selectedRecord[key];
        return obj;
      }, {});
  }, [selectedRecord, selectedColumns, visibleColumns]);

  return (
    <div className="container">
      {/* Compact Search Section */}
      <div className="form-group-1">
        <div className="top-section">
          <h2 className="heading">Check Process Status</h2>
          <Button
            className="filter-section"
            onClick={() => setIsFilterOpen(true)}
            disabled={!selectedRecord || columns.length === 0}
          >
            <p>Filter</p>
            <SlidersHorizontal className='icon-md' />
          </Button>
        </div>

        {/* Table Selection */}
        <div className="select-wrapper">
          <select
            id="table-select"
            value={currentTable || ''}
            onChange={handleTableSelect}
            className={`select ${error && !currentTable ? 'select-error' : ''}`}
          >
            <option value="" disabled className="placeholder-option">
              Select Table
            </option>
            {tables.filter(table => {
              const originalTableName = table?.title || table;
              return !sTables.has(originalTableName);
            }).map((table, index) => {
              const title = table?.title || table;
              if (!title) return null;
              return (
                <option key={`table-${title}-${index}`} value={title} className="option">
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

        {/* Process Selection */}
        <div className="select-wrapper">
          <select
            id="process-name"
            value={processName || ''}
            onChange={handleSelectProcess}
            className={`select ${error && !processName ? 'select-error' : ''}`}
            disabled={!currentTable}
          >
            <option value="" disabled className="placeholder-option">
              Select Process
            </option>
            {processSteps.map((step, index) => {
              const title = step?.title || step;
              if (!title) return null;
              return (
                <option key={`process-${title}-${index}`} value={title} className="option">
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

        {/* Search Button */}
        <Button
          className={`button ${loading ? 'loading' : ''}`}
          onClick={handleSearch}
          aria-label="Search for process status"
          disabled={loading || !currentTable || !processName}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>

      {/* Compact Records Display Section */}
      {records.length > 0 && (
        <div className="records-section">
          <h3 className="heading">
            {records.length} Record{records.length !== 1 ? 's' : ''} Found
          </h3>

          <div className="records-grid">
            {records.map((record, index) => (
              <Button
                key={record.us_id || `record-${index}`}
                onClick={() => handleRecordClick(record)}
                className={`record-button ${selectedRecord?.us_id === record.us_id ? 'active' : ''}`}
                style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
              >
                <div>
                  {record.us_id || `Record ${index + 1}`}
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ FIXED: Separate rendering for Wastage vs Dynamic with lowercase comparison */}
      {selectedRecord && currentProcessType === 'wastage' ? (
        <div className="">
          <button onClick={handleCloseDetails} aria-label="Close details">
            <X size={20} />
          </button>

          <WastageUpdateForm
            data={selectedRecord}
            loading={loading}
            visibleColumns={visibleColumns.length > 0 ? visibleColumns : selectedColumns}
            setupData={setupData}
            tableName={currentTable}
            schemaName={schemaName}
            childRecords={childRecords}
            selectedColumns={visibleColumns.length > 0 ? visibleColumns : selectedColumns}
          />
        </div>
      ) : selectedRecord ? (
        <div className="">
          <button onClick={handleCloseDetails} aria-label="Close details">
            <X size={20} />
          </button>

          <h3 className="heading">
            Record Details - {selectedRecord.us_id}
          </h3>

          <RecordDetails
            data={filteredData}
            loading={loading}
            selectedColumns={visibleColumns.length > 0 ? visibleColumns : selectedColumns}
            visibleColumns={visibleColumns.length > 0 ? visibleColumns : selectedColumns}
          />

          <div>
            <Button
              onClick={() => {
                navigate(`/status-update?schemaName=${schemaName}&current_process=${selectedRecord?.status}&tableName=${currentTable}&recordId=${selectedRecord?.id}`);
              }}
              className="button"
            >
              Update Status
            </Button>

            <Button
              onClick={handleSplitJob}
              className="button"
            >
              Split Job
            </Button>
          </div>
        </div>
      ) : null}

      {/* No Records Message */}
      {!loading && records.length === 0 && processName && (
        <div className="no-records-message">
          No records found for the selected process.
        </div>
      )}

      {/* Filter Component */}
      <Filter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        columns={columns}
        visibleColumns={visibleColumns}
        onApplyFilter={handleApplyFilter}
        tableName={currentTable}
        setSelectedColumns={setSelectedColumns}
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export default CustomViewForm;