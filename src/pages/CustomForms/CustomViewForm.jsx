// import RecordDetails from '../../components/customUpdateForm/RecordDetails';
// import '../../css/pages/CustomViewForm.css';
// import React, { useState, useEffect } from 'react';
// import { Input } from '../../components/ui/input';
// import { Button } from '../../components/ui/button';
// import { SlidersHorizontal, X } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';


// const CustomViewForm = () => {
//   const [currentTable, setCurrentTable] = useState('jobstatus');
//   const [error, setError] = useState(null);
//   const [tables, setTables] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [processTypeMapping, setProcessTypeMapping] = useState({});
//   const [processName, setProcessName] = useState('');
//   const [processSteps, setProcessSteps] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [setupData, setSetupData] = useState({});
  
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const schemaName = user?.schema_name || 'default_schema';
//   const navigate = useNavigate();

//   useEffect(() => {
//     getAllTables();
//   }, []);


//   const DynamicComponent =()=>{
//     return(
//              <div className="action-buttons">
//                 <Button 
//                   className="button" 
//                   onClick={() => {
//                     navigate(`/status-update?schemaName=${schemaName}&current_process=${data?.status}&tableName=${tableName}&recordId=` + data?.id);
//                   }}
//                   disabled={loading || !data}
//                   aria-label="Search for lead status"
//                 >
//                   Move to Next Stage Dynamic
//                 </Button>
//               </div>
//     )
//   }

//   useEffect(() => {
//     const fetchSetupData = async () => {
//       try {
//         const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${currentTable}`;
//         const { data } = await axios.get(route);
        
//         if (data.exists && data.setup) {
//           setSetupData(data.setup);
//           setSelectedColumns(data.setup.filter_form_columns || []);
//           setProcessTypeMapping(data.setup.process_type_mapping || {});
          
//           // Ensure processSteps is always an array with valid objects
//           const steps = data.setup.process_steps || [];
//           const validSteps = steps.filter(step => step && (step.title || typeof step === 'string'));
//           setProcessSteps(validSteps);
//         } else {
//           // Set defaults if no setup exists
//           setSelectedColumns([]);
//           setProcessSteps([]);
//         }
//       } catch (err) {
//         console.error('Error fetching setup:', err);
//         setProcessSteps([]);
//       }
//     };
    
//     if (currentTable && user?.id) {
//       fetchSetupData();
//     }
//   }, [user?.id, currentTable]);

//   const getAllTables = async () => {
//     try {
//       const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
//       const { data } = await axios.get(route);
//       setTables(data.data || []);
//     } catch (err) {
//       console.error('Error fetching tables:', err);
//       setError('Failed to fetch tables');
//     }
//   };

//   const handleSearch = async () => {
//     if (!currentTable) {
//       setError('Please select a table');
//       return;
//     }
//     if (!processName) {
//       setError('Please select a process');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setRecords([]);
//     setSelectedRecord(null);

//     try {
//       const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://click.wa.expert/api';
//       const response = await fetch(`${baseUrl}/data/getRecordByTargetAll`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           schemaName,
//           tableName: currentTable,
//           targetColumn: 'status',
//           targetValue: processName,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
      
//       // Ensure result is an array
//       const recordsArray = Array.isArray(result) ? result : [result];
//       setRecords(recordsArray);

//       // If no columns selected, use all columns from first record
//       if (recordsArray.length > 0 && selectedColumns.length === 0) {
//         const allColumns = Object.keys(recordsArray[0]);
//         setSelectedColumns(allColumns);
//       }

//     } catch (err) {
//       setError(err.message || 'Failed to fetch records');
//       console.error('Search error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTableSelect = (e) => {
//     const selectedTable = e.target.value;
//     setCurrentTable(selectedTable);
//     setProcessName('');
//     setRecords([]);
//     setSelectedRecord(null);
//   };

//   const handleSelectProcess = (e) => {
//     const selectedProcess = e.target.value;
//     setProcessName(selectedProcess);
//     setRecords([]);
//     setSelectedRecord(null);
//   };

//   const handleRecordClick = (record) => {
//     setSelectedRecord(record);
//   };

//   const handleCloseDetails = () => {
//     setSelectedRecord(null);
//   };

//   const handleSplitJob = () => {
//     // Implement your split job logic here
//     console.log('Split job clicked for record:', selectedRecord);
//     alert(`Split job functionality for record: ${selectedRecord?.us_id || 'N/A'}`);
//     navigate(`/${currentTable}/record?pa_id=${selectedRecord?.us_id}&show=true`);
    
//   };

//   return (
//     <div className="container">
//       {/* Search Section */}
//       <div className="form-group-1">
//         <div className="top-section">
//           <h2 className="heading">Check Process Status</h2>
//         </div>

//         {/* Table Selection */}
//         <div className="select-wrapper">
//           <select
//             id="table-select"
//             value={currentTable}
//             onChange={handleTableSelect}
//             className={`select ${error && !currentTable ? 'select-error' : ''}`}
//           >
//             <option value="" disabled className="placeholder-option">
//               - Select Table -
//             </option>
//             {tables.map((table, index) => {
//               const title = table?.title || table;
//               if (!title) return null;
//               return (
//                 <option key={title || index} value={title} className="option">
//                   {title.charAt(0).toUpperCase() + title.slice(1).replace(/_/g, ' ')}
//                 </option>
//               );
//             })}
//           </select>
//           <div className="select-arrow">
//             <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//               <path
//                 d="M1 1.5L6 6.5L11 1.5"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Process Selection */}
//         <div className="select-wrapper">
//           <select
//             id="process-name"
//             value={processName}
//             onChange={handleSelectProcess}
//             className={`select ${error && !processName ? 'select-error' : ''}`}
//             disabled={!currentTable}
//           >
//             <option value="" disabled className="placeholder-option">
//               - Select Process -
//             </option>
//             {processSteps.map((step, index) => {
//               const title = step?.title || step;
//               if (!title) return null;
//               return (
//                 <option key={title || index} value={title} className="option">
//                   {title.charAt(0).toUpperCase() + title.slice(1).replace(/_/g, ' ')}
//                 </option>
//               );
//             })}
//           </select>
//           <div className="select-arrow">
//             <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//               <path
//                 d="M1 1.5L6 6.5L11 1.5"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Search Button */}
//         <Button
//           className="button"
//           onClick={handleSearch}
//           aria-label="Search for process status"
//           disabled={loading || !currentTable || !processName}
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </Button>

//         {error && (
//           <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
//             Error: {error}
//           </div>
//         )}
//       </div>

//       {/* Records Display Section */}
//       {records.length > 0 && (
//         <div className="records-section" style={{ marginTop: '2rem' }}>
//           <h3 className="heading" style={{ marginBottom: '1rem' }}>
//             Found {records.length} Record{records.length !== 1 ? 's' : ''}
//           </h3>
          
//           <div className="records-grid" style={{ 
//             display: 'grid', 
//             gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
//             gap: '1rem',
//             marginBottom: '2rem'
//           }}>
//             {records.map((record, index) => (
//               <Button
//                 key={record.us_id || index}
//                 onClick={() => handleRecordClick(record)}
//                 className={`record-button ${selectedRecord?.us_id === record.us_id ? 'active' : ''}`}
//                 style={{
//                   padding: '1rem',
//                   textAlign: 'center',
//                   backgroundColor: selectedRecord?.us_id === record.us_id ? '#4388c1' : '#f8f9fa',
//                   color: selectedRecord?.us_id === record.us_id ? 'white' : 'black',
//                   border: '1px solid #dee2e6',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   transition: 'all 0.2s'
//                 }}
//               >
//                 <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
//                   {record.us_id || `Record ${index + 1}`}
//                 </div>
//                 {record.name && (
//                   <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8 }}>
//                     {record.name}
//                   </div>
//                 )}
//               </Button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Selected Record Details Card */}
//       {selectedRecord && (
//         <div className="record-details-card" style={{
//           backgroundColor: 'white',
//           border: '1px solid #dee2e6',
//           borderRadius: '12px',
//           padding: '1.5rem',
//           marginTop: '2rem',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//           position: 'relative'
//         }}>
//           {/* Close Button */}
//           <button
//             onClick={handleCloseDetails}
//             style={{
//               position: 'absolute',
//               top: '1rem',
//               right: '1rem',
//               background: 'none',
//               border: 'none',
//               cursor: 'pointer',
//               padding: '0.5rem',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//             aria-label="Close details"
//           >
//             <X size={20} />
//           </button>

//           <h3 className="heading" style={{ marginBottom: '1.5rem' }}>
//             Record Details - {selectedRecord.us_id}
//           </h3>

//           {/* Record Details Component */}
//           <RecordDetails 
//             data={selectedRecord} 
//             loading={loading} 
//             selectedColumns={selectedColumns}
//           />

//                   <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
//             <Button
//               onClick={handleSplitJob}
//               className="split-job-button"
//               style={{
//                 backgroundColor: '#4388c1',
//                 color: 'white',
//                 padding: '0.75rem 2rem',
//                 fontSize: '1rem',
//                 fontWeight: 'bold',
//                 borderRadius: '8px',
//                 border: 'none',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 width: '100%'
//               }}
//             >
//               Update Process Status
//             </Button>
//           </div>

//           {/* Split Job Button */}
//           <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
//             <Button
//               onClick={handleSplitJob}
//               className="split-job-button"
//               style={{
//                 backgroundColor: '#4388c1',
//                 color: 'white',
//                 padding: '0.75rem 2rem',
//                 fontSize: '1rem',
//                 fontWeight: 'bold',
//                 borderRadius: '8px',
//                 border: 'none',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 width: '100%'
//               }}
//             >
//               Split Job
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* No Records Message */}
//       {!loading && records.length === 0 && processName && (
//         <div style={{ 
//           textAlign: 'center', 
//           padding: '2rem', 
//           color: '#6c757d',
//           marginTop: '2rem'
//         }}>
//           No records found for the selected process.
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomViewForm;



import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RecordDetails from '../../components/customUpdateForm/RecordDetails';
import WastageUpdateForm from '../../components/customUpdateForm/WastageUpdateForm';
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
  
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const schemaName = user?.schema_name || 'default_schema';
  const navigate = useNavigate();

  useEffect(() => {
    getAllTables();
  }, []);

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${currentTable}`;
        const { data } = await axios.get(route);
        
        if (data.exists && data.setup) {
          setSetupData(data.setup);
          setSelectedColumns(data.setup.filter_form_columns || []);
          setProcessTypeMapping(data.setup.process_type_mapping || {});
          
          // Ensure processSteps is always an array with valid objects
          const steps = data.setup.process_steps || [];
          const validSteps = steps.filter(step => step && (step.title || typeof step === 'string'));
          setProcessSteps(validSteps);
        } else {
          // Set defaults if no setup exists
          setSelectedColumns([]);
          setProcessSteps([]);
        }
      } catch (err) {
        console.error('Error fetching setup:', err);
        setProcessSteps([]);
      }
    };
    
    if (currentTable && user?.id) {
      fetchSetupData();
    }
  }, [user?.id, currentTable]);

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
      const response = await fetch(`${baseUrl}/data/getRecordByTargetAll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schemaName,
          tableName: currentTable,
          targetColumn: 'status',
          targetValue: processName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Ensure result is an array
      const recordsArray = Array.isArray(result) ? result : [result];
      setRecords(recordsArray);

      // If no columns selected, use all columns from first record
      if (recordsArray.length > 0 && selectedColumns.length === 0) {
        const allColumns = Object.keys(recordsArray[0]);
        setSelectedColumns(allColumns);
      }

    } catch (err) {
      setError(err.message || 'Failed to fetch records');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch child records when a record is selected (for Wastage type)
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
        console.log('Child records fetched:', children);
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
    // Fetch child records for wastage processes
    if (record.us_id) {
      await fetchChildRecords(record.us_id);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRecord(null);
    setChildRecords([]);
  };

  const handleSplitJob = () => {
    console.log('Split job clicked for record:', selectedRecord);
    navigate(`/${currentTable}/record?pa_id=${selectedRecord?.us_id}&show=true`);
  };

  // Determine the process type for the selected record
  const currentProcessType = useMemo(() => {
    if (!selectedRecord || !processTypeMapping) return 'Dynamic';
    
    const status = selectedRecord.status;
    const processType = processTypeMapping[status];
    
    console.log('🔍 Current Status:', status);
    console.log('🔍 Process Type Mapping:', processTypeMapping);
    console.log('🔍 Determined Process Type:', processType);
    
    return processType || 'Dynamic'; // Default to Dynamic if not found
  }, [selectedRecord, processTypeMapping]);

  // Filter data based on visible columns
  const filteredData = useMemo(() => {
    if (!selectedRecord || !selectedColumns || selectedColumns.length === 0) {
      return selectedRecord;
    }

    return Object.keys(selectedRecord)
      .filter(key => selectedColumns.includes(key))
      .reduce((obj, key) => {
        obj[key] = selectedRecord[key];
        return obj;
      }, {});
  }, [selectedRecord, selectedColumns]);

  return (
    <div className="container">
      {/* Search Section */}
      <div className="form-group-1">
        <div className="top-section">
          <h2 className="heading">Check Process Status</h2>
        </div>

        {/* Table Selection */}
        <div className="select-wrapper">
          <select
            id="table-select"
            value={currentTable}
            onChange={handleTableSelect}
            className={`select ${error && !currentTable ? 'select-error' : ''}`}
          >
            <option value="" disabled className="placeholder-option">
              - Select Table -
            </option>
            {tables.map((table, index) => {
              const title = table?.title || table;
              if (!title) return null;
              return (
                <option key={title || index} value={title} className="option">
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
            value={processName}
            onChange={handleSelectProcess}
            className={`select ${error && !processName ? 'select-error' : ''}`}
            disabled={!currentTable}
          >
            <option value="" disabled className="placeholder-option">
              - Select Process -
            </option>
            {processSteps.map((step, index) => {
              const title = step?.title || step;
              if (!title) return null;
              return (
                <option key={title || index} value={title} className="option">
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
          className="button"
          onClick={handleSearch}
          aria-label="Search for process status"
          disabled={loading || !currentTable || !processName}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Records Display Section */}
      {records.length > 0 && (
        <div className="records-section" style={{ marginTop: '2rem' }}>
          <h3 className="heading" style={{ marginBottom: '1rem' }}>
            Found {records.length} Record{records.length !== 1 ? 's' : ''}
          </h3>
          
          <div className="records-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {records.map((record, index) => (
              <Button
                key={record.us_id || index}
                onClick={() => handleRecordClick(record)}
                className={`record-button ${selectedRecord?.us_id === record.us_id ? 'active' : ''}`}
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  backgroundColor: selectedRecord?.us_id === record.us_id ? '#4388c1' : '#f8f9fa',
                  color: selectedRecord?.us_id === record.us_id ? 'white' : 'black',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {record.us_id || `Record ${index + 1}`}
                </div>
                {record.name && (
                  <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.8 }}>
                    {record.name}
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Record Details Card - Renders based on Process Type */}
      {selectedRecord && (
        <div className="record-details-card" style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button
            onClick={handleCloseDetails}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10
            }}
            aria-label="Close details"
          >
            <X size={20} />
          </button>

          {/* Conditional Rendering based on Process Type */}
          {currentProcessType === 'Wastage' ? (
            // Render Wastage Content
            <WastageUpdateForm 
              data={selectedRecord}
              loading={loading}
              visibleColumns={selectedColumns}
              setupData={setupData}
              tableName={currentTable}
              schemaName={schemaName}
              childRecords={childRecords}
              selectedColumns={selectedColumns}
            />
          ) : (
            // Render Dynamic Content (Default)
            <>
              <h3 className="heading" style={{ marginBottom: '1.5rem' }}>
                Record Details - {selectedRecord.us_id}
              </h3>

              {/* Record Details Component */}
              <RecordDetails 
                data={filteredData} 
                loading={loading} 
                selectedColumns={selectedColumns}
              />

              {/* Dynamic Action Buttons */}
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                <Button
                  onClick={() => {
                    navigate(`/status-update?schemaName=${schemaName}&current_process=${selectedRecord?.status}&tableName=${currentTable}&recordId=${selectedRecord?.id}`);
                  }}
                  className="button"
                  style={{
                    backgroundColor: '#4388c1',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  Update Process Status
                </Button>

                <Button
                  onClick={handleSplitJob}
                  className="split-job-button"
                  style={{
                    backgroundColor: '#4388c1',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  Split Job
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* No Records Message */}
      {!loading && records.length === 0 && processName && (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#6c757d',
          marginTop: '2rem'
        }}>
          No records found for the selected process.
        </div>
      )}
    </div>
  );
};

export default CustomViewForm;  