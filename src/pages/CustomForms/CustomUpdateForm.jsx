// import  { useEffect, useState } from 'react';
// import '../../css/pages/CustomUpdateForm.css';
// import { Input } from '../../components/ui/input';
// import { Button } from '../../components/ui/button';
// import { useDispatch, useSelector } from 'react-redux';
// import DynamicUpdateForm from '../../components/customUpdateForm/DynamicUpdateForm';
// import FixedUpdateForm from '../../components/customUpdateForm/FixedUpdateForm';
// import WastageUpdateForm from '../../components/customUpdateForm/WastageUpdateForm';
// import axios from 'axios';
// import { setDynamicData } from '../../features/dataMethod/tableStructureSlice';
// import { SlidersHorizontal } from 'lucide-react';
// import '../../css/element/icon.css';
// import Filter from '../../components/customUpdateForm/Filter';

// const CustomUpdateForm = () => {
//   const [searchId, setSearchId] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [tables, setTables] = useState([]);
//   const [error, setError] = useState(null);
//   const [recordData, setRecordData] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [currentTable, setCurrentTable] = useState('');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [columns, setColumns] = useState([]);
//   const [visibleColumns, setVisibleColumns] = useState([]);
//   const tableName = currentTable;
//   const [setupExists, setSetupExists] = useState(false);
//   const [setupData, setSetupData] = useState(null);
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [processTypeMapping, setProcessTypeMapping] = useState({});

//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const schemaName = user?.schema_name || 'default_schema';

//   const typemapping = {
//     "Dynamic": <DynamicUpdateForm 
//           data={recordData} 
//           loading={loading}
//           visibleColumns={visibleColumns}
//           setupData={setupData}
//           tableName={tableName}
//           schemaName={schemaName} />,
//     "Fixed": <FixedUpdateForm 
//           data={recordData} 
//           loading={loading}
//           visibleColumns={visibleColumns}
//           setupData={setupData}
//           tableName={tableName}
//           schemaName={schemaName}
//           />,
//     "Wastage": <WastageUpdateForm 
//           data={recordData} 
//           loading={loading}
//           visibleColumns={visibleColumns}
//           setupData={setupData}
//           tableName={tableName}
//           schemaName={schemaName} />
//   };

//   const handleSearch = async () => {
//     if (!searchId.trim()) {
//       setError('Please enter an ID');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setRecordData(null);

//     try {
//       const response = await fetch('https://click.wa.expert/api/data/getRecordByTarget', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           schemaName,
//           tableName: currentTable,
//           targetColumn: 'us_id',
//           targetValue: searchId,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       setRecordData(result);
      
//       let columnNames = [];
      
//       if (Array.isArray(result) && result.length > 0) {
//         columnNames = Object.keys(result[0]);
//       } else if (result && typeof result === 'object') {
//         columnNames = Object.keys(result);
//       }
      
//       if (columnNames.length > 0) {
//         setColumns(columnNames);
        
//         // IMPORTANT FIX: Always reset visible columns on new search
//         // Remove the if condition - always set to all columns on new search
//         console.log('🔵 Setting visible columns to all columns on search');
//         setVisibleColumns(columnNames);
//       }
      
//       console.log('Columns extracted:', columnNames);
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllTables();
//   }, []);

//   useEffect(() => {
//     const fetchSetupData = async () => {
//       try {
//         const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
//         const { data } = await axios.get(route);
        
//         if (data.exists && data.setup) {
//           setSetupExists(true);
//           setSetupData(data.setup);
//           setSelectedColumns(data.setup.filter_form_columns);
//           setProcessTypeMapping(data.setup.process_type_mapping || {});
//         } else {
//           setSetupExists(false);
//           // Set default columns if no setup exists
//           if (visibleColumns.length > 0) {
//             setSelectedColumns(visibleColumns);
//           } else if (columns.length > 0) {
//             setSelectedColumns(columns.map(col => col.name || col));
//           }
//         }
//         setIsInitialized(true);
//         console.log('Setup data fetched:', data);
//       } catch (err) {
//         console.error('Error fetching setup:', err);
//         setSetupExists(false);
//         // Set default on error
//         if (visibleColumns.length > 0) {
//           setSelectedColumns(visibleColumns);
//         } else if (columns.length > 0) {
//           setSelectedColumns(columns.map(col => col.name || col));
//         }
//         setIsInitialized(true);
//       }
//     };
    
//     if (tableName) {
//       fetchSetupData();
//     }
//   }, [user.id, tableName]);

//   const getAllTables = async () => {
//     const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
//     const { data } = await axios.get(route);
//     setTables(data.data);
//     dispatch(setDynamicData({
//       tables: data.data
//     }));
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch();
//     }
//   };

//   const handleTableSelect = (e) => {
//     const selectedTable = e.target.value;
//     setCurrentTable(selectedTable);
//     // Reset columns and visible columns when table changes
//     setColumns([]);
//     setVisibleColumns([]);
//     setRecordData(null);
//   };

//   const handleApplyFilter = (selectedColumns) => {
//     console.log('Filter applied with columns:', selectedColumns);
//     setVisibleColumns(selectedColumns);
//   };

//   // Add debug log to see state changes
//   useEffect(() => {
//     console.log('=== State Update ===');
//     console.log('Columns:', columns);
//     console.log('Visible Columns:', visibleColumns);
//     console.log('Data:', recordData);
//     console.log('===================');
//   }, [columns, visibleColumns, recordData]);

//   return (
//     <div className="container">
//       {/* Search Section */}
//       <div className="form-group-1">
//         <div className="top-section">
//           <h2 className="heading">Update Status</h2>
//           <Button 
//             className="filter-section"
//             onClick={() => setIsFilterOpen(true)}
//             disabled={!recordData || columns.length === 0}
//           >
//             <p>Filter</p>
//             <SlidersHorizontal className='icon-md' />
//           </Button>
//         </div>

//         <div className="select-wrapper">
//           <select
//             id="next-process"
//             value={currentTable}
//             onChange={handleTableSelect}
//             className={`select ${error && !currentTable ? 'select-error' : ''}`}
//             disabled={isSubmitting}
//           >
//             <option value="" disabled className="placeholder-option">
//               - Select Table -
//             </option>
//             {tables.map((step) => (
//               <option key={step.title} value={step.title} className="option">
//                 {step.title.charAt(0).toUpperCase() + step.title.slice(1).replace(/_/g, ' ')}
//               </option>
//             ))}
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

//         <Input
//           type="text"
//           value={searchId}
//           onChange={(e) => setSearchId(e.target.value)}
//           onKeyPress={handleKeyPress}
//           className="bg-gray-50 text-gray-900"
//           placeholder="Enter the ID"
//           aria-label="Search ID"
//           disabled={loading}
//         />

//         <Button
//           className="button"
//           onClick={handleSearch}
//           aria-label="Search for lead status"
//           disabled={loading || !currentTable}
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </Button>

//         {error && (
//           <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
//             Error: {error}
//           </div>
//         )}
//       </div>

//       {/* Update Form Section */}
//       {console.log("Data in CustomUpdateForm:", recordData)}
//       {console.log("Process Type Mapping:", processTypeMapping)}
//       {console.log("Record Status:", recordData?.status)}
      
//       <div className="form-group-2">
//         {recordData && (() => {
//           const status = recordData?.status;
//           const processType = processTypeMapping[status];
          
//           console.log('🔍 Current status:', status);
//           console.log('🔍 Process type mapping:', processTypeMapping);
//           console.log('🔍 Matched process type:', processType);
          
//           // If we have a valid process type mapping, render that component
//           if (processType && typemapping[processType]) {
//             console.log('✅ Rendering component:', processType);
//             return typemapping[processType];
//           }
          
//           // Fallback to DynamicUpdateForm if no mapping exists
//           console.log('⚠️ No mapping found, using default DynamicUpdateForm');
//           return (
//             <DynamicUpdateForm 
//               data={recordData} 
//               loading={loading} 
//               visibleColumns={visibleColumns}
//             />
//           );
//         })()}
//       </div>

//       {/* Filter Component */}
//       <Filter
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         columns={columns}
//         visibleColumns={visibleColumns}
//         onApplyFilter={handleApplyFilter}
//         tableName={currentTable}
//       />
//     </div>
//   );
// };

// export default CustomUpdateForm;



import  { useEffect, useState } from 'react';
import '../../css/pages/CustomUpdateForm.css';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import DynamicUpdateForm from '../../components/customUpdateForm/DynamicUpdateForm';
import FixedUpdateForm from '../../components/customUpdateForm/FixedUpdateForm';
import WastageUpdateForm from '../../components/customUpdateForm/WastageUpdateForm';
import axios from 'axios';
import { setDynamicData } from '../../features/dataMethod/tableStructureSlice';
import { SlidersHorizontal } from 'lucide-react';
import '../../css/element/icon.css';
import Filter from '../../components/customUpdateForm/Filter';

const CustomUpdateForm = () => {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [recordData, setRecordData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTable, setCurrentTable] = useState('jobstatus');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const tableName = currentTable;
  const [setupExists, setSetupExists] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [processTypeMapping, setProcessTypeMapping] = useState({});
  const [childRecords, setChildRecords] = useState([]); // Child records where pa_id matches

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const schemaName = user?.schema_name || 'default_schema';

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter an ID');
      return;
    }

    setLoading(true);
    setError(null);
    setRecordData(null);
    setChildRecords([]);

    try {
      // Fetch record where us_id matches (parent/original record)
      const response = await fetch('https://click.wa.expert/api/data/getRecordByTarget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schemaName,
          tableName: currentTable,
          targetColumn: 'us_id',
          targetValue: searchId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setRecordData(result);
      
      // Fetch child records where pa_id matches
      try {
        const childResponse = await fetch('https://click.wa.expert/api/data/getRecordByTargetAll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            schemaName,
            tableName: currentTable,
            targetColumn: 'pa_id',
            targetValue: searchId,
          }),
        });

        if (childResponse.ok) {
          const childResult = await childResponse.json();
          console.log('Raw child records:', childResult);
          
          // Store all child records (we'll filter in WastageUpdateForm)
          const children = Array.isArray(childResult) ? childResult : [childResult];
          setChildRecords(children);
          console.log('Child records set:', children);
        }
      } catch (childErr) {
        console.warn('Could not fetch child records:', childErr);
      }
      
      let columnNames = [];
      
      if (Array.isArray(result) && result.length > 0) {
        columnNames = Object.keys(result[0]);
      } else if (result && typeof result === 'object') {
        columnNames = Object.keys(result);
      }
      
      if (columnNames.length > 0) {
        setColumns(columnNames);
        
        // IMPORTANT FIX: Always reset visible columns on new search
        // Remove the if condition - always set to all columns on new search
        console.log('🔵 Setting visible columns to all columns on search');
        setVisibleColumns(columnNames);
      }
      
      console.log('Columns extracted:', columnNames);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTables();
  }, []);

  useEffect(() => {
    const fetchSetupData = async () => {
      try {
        const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
        const { data } = await axios.get(route);
        
        if (data.exists && data.setup) {
          setSetupExists(true);
          setSetupData(data.setup);
          setSelectedColumns(data.setup.filter_form_columns || []);
          setProcessTypeMapping(data.setup.process_type_mapping || {});
        } else {
          setSetupExists(false);
          // Set default columns if no setup exists
          if (visibleColumns.length > 0) {
            setSelectedColumns(visibleColumns);
          } else if (columns.length > 0) {
            setSelectedColumns(columns.map(col => col.name || col));
          }
        }
        setIsInitialized(true);
        console.log('Setup data fetched:', data);
      } catch (err) {
        console.error('Error fetching setup:', err);
        setSetupExists(false);
        // Set default on error
        if (visibleColumns.length > 0) {
          setSelectedColumns(visibleColumns);
        } else if (columns.length > 0) {
          setSelectedColumns(columns.map(col => col.name || col));
        }
        setIsInitialized(true);
      }
    };
    
    if (tableName) {
      fetchSetupData();
    }
  }, [user.id, tableName]);

  const getAllTables = async () => {
    const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
    const { data } = await axios.get(route);
    setTables(data.data);
    dispatch(setDynamicData({
      tables: data.data
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleTableSelect = (e) => {
    const selectedTable = e.target.value;
    setCurrentTable(selectedTable);
    // Reset columns and visible columns when table changes
    setColumns([]);
    setVisibleColumns([]);
    setRecordData(null);
    setChildRecords([]);
  };

  const handleApplyFilter = (selectedColumns) => {
    console.log('Filter applied with columns:', selectedColumns);
    setVisibleColumns(selectedColumns);
  };

  // Add debug log to see state changes
  useEffect(() => {
    console.log('=== State Update ===');
    console.log('Columns:', columns);
    console.log('Visible Columns:', visibleColumns);
    console.log('Data:', recordData);
    console.log('===================');
  }, [columns, visibleColumns, recordData]);

  return (
    <div className="container">
      {/* Search Section */}
      <div className="form-group-1">
        <div className="top-section">
          <h2 className="heading">Update Status</h2>
          <Button 
            className="filter-section"
            onClick={() => setIsFilterOpen(true)}
            disabled={!recordData || columns.length === 0}
          >
            <p>Filter</p>
            <SlidersHorizontal className='icon-md' />
          </Button>
        </div>

        <div className="select-wrapper">
          <select
            id="next-process"
            value={currentTable}
            onChange={handleTableSelect}
            className={`select ${error && !currentTable ? 'select-error' : ''}`}
            disabled={isSubmitting}
          >
            <option value="" disabled className="placeholder-option">
              - Select Table -
            </option>
            {tables.map((step) => (
              <option key={step.title} value={step.title} className="option">
                {step.title.charAt(0).toUpperCase() + step.title.slice(1).replace(/_/g, ' ')}
              </option>
            ))}
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

        <Input
          type="text"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-gray-50 text-gray-900"
          placeholder="Enter the ID"
          aria-label="Search ID"
          disabled={loading}
        />

        <Button
          className="button"
          onClick={handleSearch}
          aria-label="Search for lead status"
          disabled={loading || !currentTable}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>

        {error && (
          <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
            Error: {error}
          </div>
        )}
      </div>

      {/* Update Form Section */}
      {console.log("Data in CustomUpdateForm:", recordData)}
      {console.log("Process Type Mapping:", processTypeMapping)}
      {console.log("Record Status:", recordData?.status)}
      
      <div className="form-group-2">
        {recordData && (() => {
          const status = recordData?.status;
          const processType = processTypeMapping[status];
          
          console.log('🔍 Current status:', status);
          console.log('🔍 Process type mapping:', processTypeMapping);
          console.log('🔍 Matched process type:', processType);
          
          // Create typemapping with FRESH data each time
          const typemapping = {
            "Dynamic": <DynamicUpdateForm 
                  data={recordData} 
                  loading={loading}
                  visibleColumns={visibleColumns}
                  setupData={setupData}
                  tableName={tableName}
                  schemaName={schemaName}
                  selectedColumns={selectedColumns} />,
            "Fixed": <FixedUpdateForm 
                  data={recordData} 
                  loading={loading}
                  visibleColumns={visibleColumns}
                  setupData={setupData}
                  tableName={tableName}
                  schemaName={schemaName}
                  selectedColumns={selectedColumns}/>,
            "Wastage": <WastageUpdateForm 
                  data={recordData} 
                  loading={loading}
                  visibleColumns={visibleColumns}
                  setupData={setupData}
                  tableName={tableName}
                  schemaName={schemaName}
                  childRecords={childRecords}
                  selectedColumns={selectedColumns} />
          };
          
          // If we have a valid process type mapping, render that component
          if (processType && typemapping[processType]) {
            console.log('✅ Rendering component:', processType);
            return typemapping[processType];
          }
          
          // Fallback to DynamicUpdateForm if no mapping exists
          console.log('⚠️ No mapping found, using default DynamicUpdateForm');
          return (
            <DynamicUpdateForm 
              data={recordData} 
              loading={loading} 
              visibleColumns={visibleColumns}
              setupData={setupData}
              tableName={tableName}
              schemaName={schemaName}
            />
          );
        })()}
      </div>

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

export default CustomUpdateForm;