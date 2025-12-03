// import React, { useState, useMemo } from 'react'
// import RecordDetails from './RecordDetails'
// import { Button } from '../ui/button'
// import '../../css/components/fixedUpdateForm.css'
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const WastageUpdateForm = ({ data, loading, visibleColumns, setupData, tableName, schemaName, childRecords = [],selectedColumns }) => {
//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.user);
//   const [selectedChildId, setSelectedChildId] = useState('');
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Filter parent data to keep only keys that exist in visibleColumns
//   const filteredData = useMemo(() => {
//     if (!data || !visibleColumns || visibleColumns.length === 0) {
//       return data;
//     }

//     return Object.keys(data)
//       .filter(key => visibleColumns.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = data[key];
//         return obj;
//       }, {});
//   }, [data, visibleColumns]);

//   // Get available child processes grouped by which process they have balance in
//   const availableChildProcesses = useMemo(() => {
//     if (!childRecords || childRecords.length === 0 || !setupData?.process_steps) {
//       return [];
//     }

//     const processSteps = setupData.process_steps;
//     const available = [];

//     childRecords.forEach(child => {
//       // Check each process_step to see which ones have balance > 0
//       const processesWithBalance = [];

//       processSteps.forEach(process => {
//         const balanceColumnName = `${process}_balance`;
//         const balanceValue = child[balanceColumnName];

//         if (balanceValue !== undefined && balanceValue !== null && Number(balanceValue) > 0) {
//           processesWithBalance.push({
//             processName: process,
//             balance: balanceValue
//           });
//         }
//       });

//       // If this child has any processes with balance, add it to available list
//       if (processesWithBalance.length > 0) {
//         available.push({
//           childRecord: child,
//           processesWithBalance: processesWithBalance,
//           displayText: `${child.us_id || child.id} - Processes: ${processesWithBalance.map(p => `${p.processName}(${p.balance})`).join(', ')}`
//         });
//       }
//     });

//     console.log('Available child processes:', available);
//     return available;
//   }, [childRecords, setupData]);

//   // Get the selected child record full data
//   const selectedChildRecord = useMemo(() => {
//     if (!selectedChildId) return null;
//     const found = availableChildProcesses.find(item => item.childRecord.id === selectedChildId);
//     return found ? found.childRecord : null;
//   }, [selectedChildId, availableChildProcesses]);

//   // Filter selected child data to keep only keys that exist in visibleColumns
//   const filteredChildData = useMemo(() => {
//     if (!selectedChildRecord || !visibleColumns || visibleColumns.length === 0) {
//       return selectedChildRecord;
//     }

//     return Object.keys(selectedChildRecord)
//       .filter(key => visibleColumns.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = selectedChildRecord[key];
//         return obj;
//       }, {});
//   }, [selectedChildRecord, visibleColumns]);

//   const handleChildProcessChange = (e) => {
//     setSelectedChildId(e.target.value);
//     setError(null);
//     console.log('Selected child record ID:', e.target.value);
//   };

//   const handleMoveToWastage = () => {
//     if (!selectedChildId || !selectedChildRecord) {
//       setError('Please select a child process first');
//       alert('Please select a child process from the dropdown');
//       return;
//     }

//     // Navigate to wastage page with selected child record data
//     navigate('/wastage', { 
//       state: { 
//         childRecord: selectedChildRecord,
//         parentRecord: data,
//         tableName,
//         schemaName,
//         setupData
//       } 
//     });
//   };

//   console.log('=== WastageUpdateForm Debug ===');
//   console.log('Parent Data:', data);
//   console.log('Child Records:', childRecords);
//   console.log('Available Child Processes:', availableChildProcesses);
//   console.log('Selected Child ID:', selectedChildId);
//   console.log('Selected Child Record:', selectedChildRecord);
//   console.log('===============================');

//   return (
//     <div className="">
//       {/* Parent Record Details */}
//       <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
//         Original Record Details
//       </h3>
//       <RecordDetails data={filteredData} loading={loading} visibleColumns={visibleColumns} selectedColumns={selectedColumns}/>

//       {/* Child Process Selection Dropdown */}
//       {availableChildProcesses && availableChildProcesses.length > 0 ? (
//         <>
//           <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
//             Select Child Process for Wastage
//           </h3>
//           <div className="select-wrapper" style={{ marginBottom: '1rem' }}>
//             <select
//               id="child-process-selection"
//               value={selectedChildId}
//               onChange={handleChildProcessChange}
//               className={`select ${error && !selectedChildId ? 'select-error' : ''}`}
//               disabled={isSubmitting || loading}
//             >
//               <option value="" disabled className="placeholder-option">
//                 -- Select Process (with balance &gt; 0) --
//               </option>
//               {availableChildProcesses.map((item) => (
//                 <option key={item.childRecord.id} value={item.childRecord.id} className="option">
//                   {item.displayText}
//                 </option>
//               ))}
//             </select>
//             <div className="select-arrow">
//               <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//                 <path
//                   d="M1 1.5L6 6.5L11 1.5"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>
//             {error && (
//               <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
//                 {error}
//               </div>
//             )}
//           </div>

//           {/* Selected Child Record Details */}
//           {selectedChildRecord && (
//             <>
//               <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
//                 Selected Child Record Details
//               </h3>
//               <RecordDetails data={filteredChildData} loading={false} />
//             </>
//           )}
//         </>
//       ) : (
//         <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', marginTop: '1.5rem' }}>
//           <p style={{ margin: 0, color: '#6b7280' }}>
//             No child processes with balance &gt; 0 available for wastage.
//           </p>
//         </div>
//       )}

//       <div className="action-buttons" style={{ marginTop: '1.5rem' }}>
//         <Button
//           className="button"
//           onClick={handleMoveToWastage}
//           disabled={loading || !data || isSubmitting || !selectedChildId}
//           aria-label="Move to wastage page"
//         >
//           {isSubmitting ? 'Processing...' : 'Enter Wastage'}
//         </Button>
//         <Button
//           className="button"
//           onClick={() => console.log('Add Comment clicked')}
//           aria-label="Add comment"
//           disabled={loading || !data}
//         >
//           Add Comment
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default WastageUpdateForm


// https://click.wa.expert/wastage
// ?recordId=c05ade4b-d7cd-4c21-81d1-beaa7b2f6635
// &ownerId=acb1bb31-23fa-404c-b350-fd622aae3d59
// &schemaName=gp_28168587
// &tableName=jobstatus
// &us_id=10841/25
// &current_process=aqua_coating


import React, { useState, useMemo } from 'react'
import RecordDetails from './RecordDetails'
import { Button } from '../ui/button'
import '../../css/components/fixedUpdateForm.css'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const WastageUpdateForm = ({ data, loading, visibleColumns, setupData, tableName, schemaName, childRecords = [], selectedColumns }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter parent data to keep only keys that exist in visibleColumns
  const filteredData = useMemo(() => {
    if (!data || !visibleColumns || visibleColumns.length === 0) {
      return data;
    }

    return Object.keys(data)
      .filter(key => visibleColumns.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
  }, [data, visibleColumns]);

  // Get available processes based on PARENT record balance (not child)
  const availableProcesses = useMemo(() => {
    if (!data || !setupData?.process_steps) {
      return [];
    }

    const processSteps = setupData.process_steps;
    const available = [];

    // Check parent record for processes with balance > 0
    processSteps.forEach(process => {
      const balanceColumnName = `${process}_balance`;
      const balanceValue = data[balanceColumnName];

      console.log(`Checking PARENT ${balanceColumnName}:`, balanceValue);

      // If parent has balance > 0 for this process, add it to dropdown
      if (balanceValue !== undefined && balanceValue !== null && Number(balanceValue) > 0) {
        available.push({
          processName: process,
          balanceColumn: balanceColumnName,
          balance: balanceValue,
          displayText: `${process.charAt(0).toUpperCase() + process.slice(1)} (${balanceValue})`
        });
      }
    });

    console.log('Available processes from PARENT record:', available);
    return available;
  }, [data, setupData]);

  // Get the selected process details
  const selectedProcessData = useMemo(() => {
    if (!selectedChildId) return null;
    const found = availableProcesses.find(item => item.processName === selectedChildId);
    return found || null;
  }, [selectedChildId, availableProcesses]);

  const handleChildProcessChange = (e) => {
    setSelectedChildId(e.target.value);
    setError(null);
    console.log('Selected process:', e.target.value);
  };

  const handleMoveToWastage = () => {
    if (!selectedChildId || !selectedProcessData) {
      setError('Please select a process first');
      alert('Please select a process from the dropdown');
      return;
    }

    console.log('Moving to wastage with:', selectedProcessData);
    const params = new URLSearchParams({
      schemaName,
      tableName,
      recordId: data?.id,
      us_id: data?.us_id,
      ownerId: 'bde74e9b-ee21-4687-8040-9878b88593fb',
      current_process: selectedProcessData.processName,
    });

    // Navigate to wastage page with selected process data
    navigate(`/wastage?${params.toString()}`, {
      state: {
        parentRecord: data,
        childRecords: childRecords, // Pass all child records
        selectedProcess: selectedProcessData.processName,
        selectedBalance: selectedProcessData.balance,
        balanceColumn: selectedProcessData.balanceColumn,
        tableName,
        schemaName,
        setupData
      }
    });
  }; // ← Close the function here

  console.log('=== WastageUpdateForm Debug ===');
  console.log('Parent/Original Data:', data);
  console.log('Child Records:', childRecords);
  console.log('Available Processes (from PARENT):', availableProcesses);
  console.log('Selected Process Name:', selectedChildId);
  console.log('Selected Process Data:', selectedProcessData);
  console.log('===============================');

  return (
    <div className="">
      {/* Parent Record Details */}
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
        Original Record Details
      </h3>
      <RecordDetails data={filteredData} loading={loading} selectedColumns={selectedColumns} />

      {/* Process Selection Dropdown - Based on PARENT record balance */}
      {availableProcesses && availableProcesses.length > 0 ? (
        <>
          <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>
            Select Process for Wastage
          </h3>
          <div className="select-wrapper" style={{ marginBottom: '1rem' }}>
            <select
              id="process-selection"
              value={selectedChildId}
              onChange={handleChildProcessChange}
              className={`select ${error && !selectedChildId ? 'select-error' : ''}`}
              disabled={isSubmitting || loading}
            >
              <option value="" disabled className="placeholder-option">
                -- Select Process (with balance &gt; 0) --
              </option>
              {availableProcesses.map((item) => (
                <option key={item.processName} value={item.processName} className="option">
                  {item.displayText}
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
            {error && (
              <div className="error-message" style={{ color: 'red', marginTop: '0.5rem' }}>
                {error}
              </div>
            )}
          </div>

          {/* Show selected process info */}
          {selectedProcessData && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#e0f2fe',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              border: '2px solid #0284c7'
            }}>
              <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: '#0c4a6e' }}>
                Selected Process: <strong>{selectedProcessData.processName.toUpperCase()}</strong> - Balance: <strong>{selectedProcessData.balance}</strong>
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', marginTop: '1.5rem' }}>
          <p style={{ margin: 0, color: '#6b7280' }}>
            No processes with balance &gt; 0 available for wastage in the original record.
          </p>
        </div>
      )}

      <div className="action-buttons" style={{ marginTop: '1.5rem' }}>
        <Button
          className="button"
          onClick={handleMoveToWastage}
          disabled={loading || !data || isSubmitting || !selectedChildId}
          aria-label="Move to wastage page"
        >
          {isSubmitting ? 'Processing...' : 'Enter Wastage'}
        </Button>
        <Button
          className="button"
          onClick={() => console.log('Add Comment clicked')}
          aria-label="Add comment"
          disabled={loading || !data}
        >
          Add Comment
        </Button>
      </div>
    </div>
  )
}

export default WastageUpdateForm