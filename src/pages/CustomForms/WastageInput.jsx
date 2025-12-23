// import { use, useEffect, useState } from 'react';
// import { Send } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { getRecordById, createRecord } from '../api/apiConfig';
// import { toast } from 'sonner';
// import { useDispatch, useSelector } from 'react-redux';
// import { set } from 'date-fns/set';

// // http://localhost:5173/wastage?schemaName=public&tableName=testing_table&recordId=010f953c-4c25-4075-854f-5c088a9c6e99&ownerId=1c17a5f5-6b0a-4300-9311-4701cb95abc4&us_id=10729/25&current_process=artwork&in_pro=true

// function useQueryObject() {
//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const queryObj = {};

//     for (const [key, value] of searchParams.entries()) {
//         queryObj[key] = value;
//     }

//     return queryObj;
// }

// export default function WastageInput() {
//     const [wastageValue, setWastageValue] = useState('');
//     const [receivedValue, setReceivedValue] = useState('');
//     const [nextProcess, setNextProcess] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const queryData = useQueryObject();
//     const [responseData, setResponseData] = useState(null); 
//     const basemultiupdate = `https://click.wa.expert/api/data/updateMultiple?`;

//     const in_pro = queryData.in_pro === 'true';
//     const tableName = queryData.tableName;
//     const isNextProcessProvided = !!queryData.next_process;
//     const user = useSelector((state) => state.user);
//     const [processSteps,setProcessSteps] = useState([]);

//     useEffect(() => {
//     const fetchData = async () => {
//         const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
//         const { data } = await axios.get(route);
//         setProcessSteps(data.setup.process_steps);
//         if(isNextProcessProvided){
//         setNextProcess(queryData.next_process);
//     }
//     };

//     fetchData();
//     }, [user.id, tableName,isNextProcessProvided]);


//     console.log('Query Data:', queryData);

//     const getRecordByIdData = async () => {
//         try {
//             const { data } = await axios.post(getRecordById, {
//                 id: queryData.us_id,
//                 schemaName: queryData.schemaName,
//                 tableName: queryData.tableName
//             });

//             setResponseData(data);
//             console.log('Record Data:', data);
//         } catch (e) {
//             console.log('Error fetching record:', e);
//             toast.error("Failed to find the record");
//         }
//     };

//     useEffect(() => {
//         if (queryData.recordId && queryData.schemaName && queryData.tableName) {
//             getRecordByIdData();
//         }
//     }, [queryData.recordId, queryData.schemaName, queryData.tableName]);

//     const handleSubmit = async () => {
//         if (!receivedValue.trim() || isNaN(receivedValue) || Number(receivedValue) < 0 ||
//             !wastageValue.trim() || isNaN(wastageValue) || Number(wastageValue) < 0
//         ) {
//             setError("Please enter a valid positive number.");
//             return;
//         }

//         if (!nextProcess) {
//             setError("Please select next process");
//             return;
//         }

//         if (!queryData.schemaName || !queryData.tableName || !queryData.recordId || !queryData.ownerId) {
//             setError("Please provide required details");
//             return;
//         }

//         if (!responseData) {
//             setError("Parent record data not loaded");
//             return;
//         }

//         try {
//             setIsSubmitting(true);
//             setError("");

//             const currentProcessBase = queryData.current_process;
//             let nextProcessBase = nextProcess;
//             // Current process columns
//             const currentBalanceColumn = currentProcessBase + "_balance";

//             // Next process columns
//             const nextReceivedColumn = nextProcessBase + "_quantity_received";
//             const nextWastageColumn = nextProcessBase + "_wastage";
//             const nextBalanceColumn = nextProcessBase + "_balance";

//             // Calculate balance for next process
//             // const nextBalance = Number(receivedValue) - Number(wastageValue);
//             const nextBalance = Number(receivedValue);

//             // Update current process balance: current_balance - received - wastage
//             const currentBalance = responseData?.[currentBalanceColumn] || 0;
//             const updatedCurrentBalance = Number(currentBalance) - Number(receivedValue) - Number(wastageValue);

//             // Get existing wastage from parent and ADD new wastage
//             const parentWastage = responseData?.wastage || 0;
//             const newTotalWastage = Number(parentWastage) + Number(wastageValue);

//             // Get existing values from parent for the next process columns
//             const parentReceivedQty = responseData?.[nextReceivedColumn] || 0;
//             const parentWastageQty = responseData?.[nextWastageColumn] || 0;
//             const parentBalanceQty = responseData?.[nextBalanceColumn] || 0;

//             // ADD to parent's existing values (not overwrite)
//             const updatedParentReceived = Number(parentReceivedQty) + Number(receivedValue);
//             const updatedParentWastage = Number(parentWastageQty) + Number(wastageValue);
//             const updatedParentBalance = Number(parentBalanceQty) + nextBalance;

//             // Step 1: Update parent record with ADDED values
//             const queryString = new URLSearchParams(queryData).toString();
//             const updateUrl = `${basemultiupdate}${queryString}&col1=${currentBalanceColumn}&val1=${updatedCurrentBalance}&col2=${nextWastageColumn}&val2=${updatedParentWastage}&col3=wastage&val3=${newTotalWastage}&col4=${nextReceivedColumn}&val4=${updatedParentReceived}&col5=${nextBalanceColumn}&val5=${updatedParentBalance}`;

//             console.log('Update Parent URL:', updateUrl);
//             const updateResponse = await axios.get(updateUrl);
//             console.log('Parent Update Response:', updateResponse);

//             // Step 2: Create new child record
//             const newRecordUsId = Math.floor(Date.now() / 1000); // Unix timestamp

//             // Copy all fields from parent record
//             const newRecordData = {
//                 ...responseData, // Copy all parent fields
//                 us_id: newRecordUsId, // New unique ID (Unix timestamp)
//                 pa_id: queryData.us_id, // Link to parent record
//                 [nextReceivedColumn]: receivedValue, // Set NEW values (not added)
//                 [nextWastageColumn]: wastageValue,
//                 [nextBalanceColumn]: nextBalance,
//                 [currentBalanceColumn]: updatedCurrentBalance,
//                 wastage: wastageValue, // For new record, this is just the current wastage
//             };

//             // Remove fields that shouldn't be copied
//             delete newRecordData.id; // Let DB generate new ID
//             delete newRecordData.recordId; // Will be auto-generated

//             console.log('Creating new child record:', newRecordData);

//             const createResponse = await axios.post(createRecord, {
//                 schemaName: queryData.schemaName,
//                 tableName: queryData.tableName,
//                 record: newRecordData
//             });

//             console.log('Child Record Created:', createResponse);

//             setSubmitted(true);
//             setWastageValue("");
//             setReceivedValue("");
//             setNextProcess("");
//             toast.success("Wastage submitted and new record created successfully!");
//         // }

//         } catch (err) {
//             console.error('Submit Error:', err);
//             setError("Failed to submit. Please try again.");
//             toast.error("Failed to submit wastage");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleWastageInputChange = (e) => {
//         setWastageValue(e.target.value);
//         if (error) setError("");
//     };

//     const handleReceivedInputChange = (e) => {
//         setReceivedValue(e.target.value);
//         if (error) setError("");
//     };

//     const handleNextProcessChange = (e) => {
//         setNextProcess(e.target.value);
//         if (error) setError("");
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSubmit();
//         }
//     };

//     if (submitted) {
//         return (
//             <div style={styles.container}>
//                 <img 
//                     src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" 
//                     alt="logo" 
//                     style={styles.logo}
//                 />

//                 <div style={styles.successContainer}>
//                     <div style={styles.successIcon}>✓</div>
//                     <h2 style={styles.successHeading}>Success!</h2>
//                     <p style={styles.successMessage}>
//                         Your wastage number has been submitted successfully.
//                     </p>
//                     <button 
//                         onClick={() => {
//                             setSubmitted(false);
//                             setWastageValue("");
//                             setReceivedValue("");
//                             setNextProcess("");
//                         }}
//                         style={styles.newCommentButton}
//                     >
//                         Submit Another Number
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <img 
//                 src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png" 
//                 alt="logo" 
//                 style={styles.logo}
//             />

//             <div style={styles.headerSection}>
//                 <p style={styles.subheading}>
//                     Please enter the wastage details below
//                 </p>
//             </div>

//             <div style={styles.form}>
//                 <div style={styles.inputGroup}>

//                 {/* { isNextProcessProvided ? "" : ( */}
//                     <div className="">

//                     <Label htmlFor="next-process" style={styles.inputLabel}>
//                         Select Next Process
//                     </Label>
//                     <select
//                         id="next-process"
//                         value={nextProcess}
//                         onChange={handleNextProcessChange}
//                         style={{
//                             ...styles.input,
//                             ...(error && !nextProcess ? styles.inputError : {}),
//                             marginBottom: '12px'
//                         }}
//                         disabled={isSubmitting}
//                     >
//                         <option value="">-- Select Next Process --</option>
//                         {processSteps.map((step) => (
//                             <option key={step} value={step}>
//                                 {step.charAt(0).toUpperCase() + step.slice(1)}
//                             </option>
//                         ))}
//                     </select>
//                     </div>

//             {/* //     )
//             //    } */}
//                     <Label htmlFor="received-number" style={styles.inputLabel}>
//                         Enter Received Quantity
//                     </Label>
//                     <input
//                         id="received-number"
//                         type="number"
//                         value={receivedValue}
//                         onChange={handleReceivedInputChange}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter received quantity..."
//                         style={{
//                             marginBottom: '12px',
//                             ...styles.input,
//                             ...(error ? styles.inputError : {})
//                         }}
//                         disabled={isSubmitting}
//                         min="0"
//                         step="1"
//                     />

//                     <Label htmlFor="wastage-number" style={styles.inputLabel}>
//                         Enter Wastage Quantity
//                     </Label>
//                     <div style={styles.inputContainer}>
//                         <input
//                             id="wastage-number"
//                             type="number"
//                             value={wastageValue}
//                             onChange={handleWastageInputChange}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Enter wastage number..."
//                             style={{
//                                 ...styles.input,
//                                 ...(error ? styles.inputError : {})
//                             }}
//                             disabled={isSubmitting}
//                             min="0"
//                             step="1"
//                         />
//                         {(wastageValue || receivedValue) && (
//                             <div style={styles.valueDisplay}>
//                                 <div>Received: {receivedValue || '0'}</div>
//                                 <div>Wastage: {wastageValue || '0'}</div>
//                                 <div>Balance: {receivedValue && wastageValue ? Number(receivedValue) + Number(wastageValue) : '0'}</div>
//                             </div>
//                         )}
//                     </div>

//                     {error && (
//                         <div style={styles.errorMessage}>
//                             {error}
//                         </div>
//                     )}
//                 </div>

//                 <button 
//                     onClick={handleSubmit}
//                     style={{
//                         ...styles.button,
//                         ...(isSubmitting ? styles.buttonDisabled : {}),
//                         ...(wastageValue.trim() && receivedValue.trim() && nextProcess ? styles.buttonActive : {})
//                     }}
//                     disabled={isSubmitting || !wastageValue.trim() || !receivedValue.trim() || (!isNextProcessProvided && !nextProcess)}
//                 >
//                     <div style={styles.buttonContent}>
//                         {isSubmitting ? (
//                             <>
//                                 <div style={styles.spinner}></div>
//                                 Submitting...
//                             </>
//                         ) : (
//                             <>
//                                 <Send size={16} />
//                                 Submit Wastage
//                             </>
//                         )}
//                     </div>
//                 </button>
//             </div>
//         </div>
//     );
// }

// // Enhanced styles matching the PostgreSQL comment component
// const styles = {
//     container: {
//         maxWidth: '500px',
//         margin: '50px auto',
//         padding: '32px',
//         border: '1px solid #e1e5e9',
//         borderRadius: '16px',
//         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         backgroundColor: '#ffffff',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         minHeight: '400px',
//     },
//     logo: {
//         width: '20rem',
//         height: 'auto',
//         marginBottom: '1.5rem',
//     },
//     headerSection: {
//         textAlign: 'center',
//         marginBottom: '32px',
//         width: '100%',
//     },
//     subheading: {
//         fontSize: '16px',
//         color: '#718096',
//         margin: 0,
//         lineHeight: '1.5',
//     },
//     form: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%',
//         gap: '24px',
//     },
//     inputGroup: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '8px',
//         width: '100%',
//     },
//     inputLabel: {
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#2d3748',
//         marginBottom: '4px',
//         textAlign: 'center'
//     },
//     inputContainer: {
//         position: 'relative',
//         width: '100%',
//     },
//     input: {
//         width: '100%',
//         padding: '16px',
//         fontSize: '16px',
//         borderRadius: '12px',
//         border: '2px solid #e2e8f0',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         minHeight: '56px',
//         fontFamily: 'inherit',
//         lineHeight: '1.5',
//         backgroundColor: '#fafafa',
//         boxSizing: 'border-box',
//     },
//     inputError: {
//         borderColor: '#e53e3e',
//         backgroundColor: '#fed7d7',
//     },
//     valueDisplay: {
//         marginTop: '8px',
//         fontSize: '14px',
//         color: '#4a5568',
//         backgroundColor: '#f7fafc',
//         padding: '12px',
//         borderRadius: '8px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '4px',
//     },
//     errorMessage: {
//         fontSize: '14px',
//         color: '#e53e3e',
//         backgroundColor: '#fed7d7',
//         padding: '8px 12px',
//         borderRadius: '6px',
//         border: '1px solid #feb2b2',
//         marginTop: '8px',
//     },
//     button: {
//         padding: '16px 24px',
//         fontSize: '16px',
//         fontWeight: '600',
//         border: 'none',
//         borderRadius: '12px',
//         backgroundColor: '#a0aec0',
//         color: '#ffffff',
//         cursor: 'not-allowed',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '56px',
//         transform: 'translateY(0)',
//     },
//     buttonActive: {
//         backgroundColor: '#4388c1',
//         cursor: 'pointer',
//         boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
//     },
//     buttonDisabled: {
//         backgroundColor: '#a0aec0',
//         cursor: 'not-allowed',
//         transform: 'none',
//         boxShadow: 'none',
//     },
//     buttonContent: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//     },
//     spinner: {
//         width: '16px',
//         height: '16px',
//         border: '2px solid transparent',
//         borderTop: '2px solid #ffffff',
//         borderRadius: '50%',
//         animation: 'spin 1s linear infinite',
//     },
//     successContainer: {
//         textAlign: 'center',
//         padding: '40px 20px',
//         width: '100%',
//     },
//     successIcon: {
//         width: '64px',
//         height: '64px',
//         backgroundColor: '#48bb78',
//         color: 'white',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: '32px',
//         fontWeight: 'bold',
//         margin: '0 auto 24px',
//         animation: 'bounceIn 0.6s ease-out',
//     },
//     successHeading: {
//         fontSize: '24px',
//         fontWeight: '700',
//         color: '#2d3748',
//         margin: '0 0 12px 0',
//     },
//     successMessage: {
//         fontSize: '16px',
//         color: '#718096',
//         margin: '0 0 32px 0',
//         lineHeight: '1.5',
//     },
//     newCommentButton: {
//         padding: '12px 24px',
//         fontSize: '14px',
//         fontWeight: '600',
//         border: '2px solid #4388c1',
//         borderRadius: '8px',
//         backgroundColor: 'transparent',
//         color: '#4388c1',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease',
//     },
// };

// // Add CSS animations
// if (typeof document !== 'undefined') {
//     const styleSheet = document.createElement("style");
//     styleSheet.type = "text/css";
//     styleSheet.innerText = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }

//       @keyframes bounceIn {
//         0% { 
//           transform: scale(0.3);
//           opacity: 0;
//         }
//         50% { 
//           transform: scale(1.05);
//         }
//         70% { 
//           transform: scale(0.9);
//         }
//         100% { 
//           transform: scale(1);
//           opacity: 1;
//         }
//       }

//       input:focus, select:focus {
//         border-color: #4388c1 !important;
//         background-color: #ffffff !important;
//         box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
//       }

//       button:not(:disabled):hover {
//         transform: translateY(-2px) !important;
//         box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
//       }
//     `;
//     if (!document.getElementById('wastage-styles')) {
//         styleSheet.id = 'wastage-styles';
//         document.head.appendChild(styleSheet);
//     }
// }




// Working Wastage Input form
// import { useEffect, useState } from 'react';
// import { Send } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { getRecordById, createRecord } from '../../api/apiConfig';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';
// import { Badge } from '@/components/ui/badge';



// // http://localhost:5173/wastage?schemaName=public&tableName=testing_table&recordId=010f953c-4c25-4075-854f-5c088a9c6e99&ownerId=1c17a5f5-6b0a-4300-9311-4701cb95abc4&us_id=10729/25&current_process=artwork&next_process=printing

// function useQueryObject() {
//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const queryObj = {};

//     for (const [key, value] of searchParams.entries()) {
//         queryObj[key] = value;
//     }

//     return queryObj;
// }

// export default function WastageInput() {
//     const navigate = useNavigate();
//     const [wastageValue, setWastageValue] = useState('');
//     const [receivedValue, setReceivedValue] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const queryData = useQueryObject();
//     const [nextProcess, setNextProcess] = useState(queryData.next_process || '');
//     const [responseData, setResponseData] = useState(null);
//     const basemultiupdate = `https://click.wa.expert/api/data/updateMultiple?`;

//     const tableName = queryData.tableName;
//     const isNextProcessProvided = !!queryData.next_process;
    
//     const user = useSelector((state) => state.user);
//     const [processSteps, setProcessSteps] = useState([]);
//     const [currentBalance, setCurrentBalance] = useState(0);
//     const finalProcessSteps = processSteps.filter(step => step !== queryData.current_process);

//     // Fixed: Move state update to useEffect
//     useEffect(() => {
//         if (isNextProcessProvided && nextProcess === '' && queryData.next_process) {
//             setNextProcess(queryData.next_process);
//         }
//     }, [isNextProcessProvided, queryData.next_process, nextProcess]);

//     useEffect(() => {
//          const index = processSteps.findIndex( p => p === queryData.current_process);
//          setNextProcess(index !== -1 && index < processSteps.length - 1? processSteps[index + 1]: '')
//          console.log("Next Process Set To:", nextProcess);
//     },[setNextProcess, processSteps]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
//             const { data } = await axios.get(route);
//             setProcessSteps(data.setup.process_steps);
//         };

//         if (user.id && tableName) {
//             fetchData();
//         }
//     }, [user.id, tableName]);

//     // Fixed: Update currentBalance when responseData changes
//     useEffect(() => {
//         if (responseData && queryData.current_process) {
//             const currentBalanceColumn = queryData.current_process + "_balance";
//             setCurrentBalance(responseData[currentBalanceColumn] || 0);
//         }
//     }, [responseData, queryData.current_process]);

//     console.log('Query Data:', queryData);

//     const getRecordByIdData = async () => {
//         try {
//             const { data } = await axios.post(getRecordById, {
//                 id: decodeURIComponent(queryData.us_id),
//                 schemaName: queryData.schemaName,
//                 tableName: queryData.tableName
//             });

//             setResponseData(data);
//             console.log('Record Data:', data);
//         } catch (e) {
//             console.log('Error fetching record:', e);
//             toast.error("Failed to find the record");
//         }
//     };

//     useEffect(() => {
//         if (queryData.recordId && queryData.schemaName && queryData.tableName) {
//             getRecordByIdData();
//         }
//     }, [queryData.recordId, queryData.schemaName, queryData.tableName]);

//         // Navigate back after successful submission
//     useEffect(() => {
//         if (submitted) {
//             const timer = setTimeout(() => {
//                 navigate(-1);
//             }, 2000);
            
//             return () => clearTimeout(timer); // Cleanup
//         }
//     }, [submitted, navigate]);

// const handleSubmit = async () => {
//     if (!receivedValue.trim() || isNaN(receivedValue) || Number(receivedValue) < 0 ||
//         !wastageValue.trim() || isNaN(wastageValue) || Number(wastageValue) < 0
//     ) {
//         setError("Please enter a valid positive number.");
//         return;
//     }

//     // NEW VALIDATION: Check if total exceeds current balance
//     const totalUsed = Number(receivedValue) + Number(wastageValue);
//     if (totalUsed > currentBalance) {
//         setError(`Total (Received + Wastage = ${totalUsed}) cannot exceed Current Balance (${currentBalance})`);
//         return;
//     }

//     // if (!nextProcess) {
//     //     setError("Please select next process");
//     //     return;
//     // }

//     if (!queryData.schemaName || !queryData.tableName || !queryData.recordId || !queryData.ownerId) {
//         setError("Please provide required details");
//         return;
//     }

//     if (!responseData) {
//         setError("Parent record data not loaded");
//         return;
//     }

//     try {
//         setIsSubmitting(true);
//         setError("");

//         const currentProcessBase = queryData.current_process;
//         const nextProcessBase = nextProcess;

//         // Current process columns
//         const currentBalanceColumn = currentProcessBase + "_balance";

//         // Next process columns
//         const nextReceivedColumn = nextProcessBase + "_quantity_received";
//         const nextWastageColumn = nextProcessBase + "_wastage";
//         const nextBalanceColumn = nextProcessBase + "_balance";

//         // Calculate balance for next process
//         const nextBalance = Number(receivedValue);

//         // Fixed: Use currentBalance state directly (already set in useEffect)
//         const updatedCurrentBalance = Number(currentBalance) - Number(receivedValue) - Number(wastageValue);

//         // Get existing wastage from parent and ADD new wastage
//         const parentWastage = responseData?.wastage || 0;
//         const newTotalWastage = Number(parentWastage) + Number(wastageValue);

//         // Get existing values from parent for the next process columns
//         const parentReceivedQty = responseData?.[nextReceivedColumn] || 0;
//         const parentWastageQty = responseData?.[nextWastageColumn] || 0;
//         const parentBalanceQty = responseData?.[nextBalanceColumn] || 0;

//         // ADD to parent's existing values (not overwrite)
//         const updatedParentReceived = Number(parentReceivedQty) + Number(receivedValue);
//         const updatedParentWastage = Number(parentWastageQty) + Number(wastageValue);
//         const updatedParentBalance = Number(parentBalanceQty) + nextBalance;

//         // Step 1: Update parent record with ADDED values
//         const queryString = new URLSearchParams(queryData).toString();
//         const updateUrl = `${basemultiupdate}${queryString}`
//             + `&col1=${currentBalanceColumn}&val1=${updatedCurrentBalance}`
//             + `&col2=${nextWastageColumn}&val2=${updatedParentWastage}`
//             + `&col3=wastage&val3=${newTotalWastage}`
//             + `&col4=${nextReceivedColumn}&val4=${updatedParentReceived}`
//             + `&col5=${nextBalanceColumn}&val5=${updatedParentBalance}`
//             + (Number(updatedCurrentBalance) <= 0
//                 ? `&col6=${currentProcessBase}&val6=Completed`
//                 : "")
//             + `&col7=${queryData.current_process}_date&val7=${new Date().toISOString()}`;


//         console.log('Update Parent URL:', updateUrl);
//         const updateResponse = await axios.get(updateUrl);
//         console.log('Parent Update Response:', updateResponse);

//         // Step 2: Create new child record
//         const newRecordUsId = Math.floor(Date.now() / 1000); // Unix timestamp

//         // Copy all fields from parent record
//         const newRecordData = {
//             ...responseData, // Copy all parent fields
//             us_id: newRecordUsId, // New unique ID (Unix timestamp)
//             pa_id: queryData.us_id, // Link to parent record
//             [nextReceivedColumn]: receivedValue, // Set NEW values (not added)
//             [nextWastageColumn]: wastageValue,
//             [nextBalanceColumn]: nextBalance,
//             [currentBalanceColumn]: updatedCurrentBalance,
//             wastage: wastageValue, // For new record, this is just the current wastage
//         };

//         // Remove fields that shouldn't be copied
//         delete newRecordData.id; // Let DB generate new ID
//         delete newRecordData.recordId; // Will be auto-generated

//         console.log('Creating new child record:', newRecordData);

//         const createResponse = await axios.post(createRecord, {
//             schemaName: queryData.schemaName,
//             tableName: queryData.tableName,
//             record: newRecordData
//         });

//         console.log('Child Record Created:', createResponse);

//         setSubmitted(true);
//         setWastageValue("");
//         setReceivedValue("");
//         // Only reset nextProcess if it wasn't from params
//         if (!isNextProcessProvided) {
//             setNextProcess("");
//         }
//         toast.success("Wastage submitted and new record created successfully!");

//     } catch (err) {
//         console.error('Submit Error:', err);
//         setError("Failed to submit. Please try again.");
//         toast.error("Failed to submit wastage");
//     } finally {
//         setIsSubmitting(false);
//     }
// };

//     const handleWastageInputChange = (e) => {
//         setWastageValue(e.target.value);
//         if (error) setError("");
//     };

//     const handleReceivedInputChange = (e) => {
//         setReceivedValue(e.target.value);
//         if (error) setError("");
//     };

//     const handleNextProcessChange = (e) => {
//         setNextProcess(e.target.value);
//         if (error) setError("");
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSubmit();
//         }
//     };

//     if (submitted) {
//         return (
//             <div style={styles.container}>
//                 <img
//                     src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                     alt="logo"
//                     style={styles.logo}
//                 />

//                 <div style={styles.successContainer}>
//                     <div style={styles.successIcon}>✓</div>
//                     <h2 style={styles.successHeading}>Success!</h2>
//                     <p style={styles.successMessage}>
//                         Your wastage number has been submitted successfully.
//                     </p>
//                     {/* <button
//                         onClick={() => {
//                             setSubmitted(false);
//                             setWastageValue("");
//                             setReceivedValue("");
//                             // Only reset nextProcess if it wasn't from params
//                             if (!isNextProcessProvided) {
//                                 setNextProcess("");
//                             }
//                         }}
//                         style={styles.newCommentButton}
//                     >
//                         Submit Another Number
//                     </button> */}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <img
//                 src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                 alt="logo"
//                 style={styles.logo}
//             />

//             <div style={styles.headerSection}>
//                 <p style={styles.subheading}>
//                     Please enter the wastage details below
//                 </p>
//                         <Badge className={`status-badge bg-blue-100 text-blue-700 mt-2`}>
//                           Current Process {"-> "+queryData.current_process.charAt(0).toUpperCase() + queryData.current_process.slice(1)}
//                         </Badge>
//             </div>

//             <div style={styles.form}>
//                 <div style={styles.inputGroup}>

//                     {/* Show dropdown only if next_process is NOT in URL params */}
//                     {!isNextProcessProvided ? (
//                         <div className="">
//                             <Label htmlFor="next-process" style={styles.inputLabel}>
//                                 Select Next Process
//                             </Label>
//                             <select
//                                 id="next-process"
//                                 value={nextProcess}
//                                 onChange={handleNextProcessChange}
//                                 style={{
//                                     ...styles.input,
//                                     ...(error && !nextProcess ? styles.inputError : {}),
//                                     marginBottom: '12px'
//                                 }}
//                                 disabled={isSubmitting}
//                             >
//                                 <option value="">-- Select Next Process --</option>
//                                 {finalProcessSteps.map((step) => (
//                                     <option key={step} value={step}>
//                                         {step.charAt(0).toUpperCase() + step.slice(1)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     ) : (
//                         // Show next process info when it's from URL params
//                         <div style={styles.infoBox}>
//                             <strong>Next Process:</strong> {nextProcess ? nextProcess.charAt(0).toUpperCase() + nextProcess.slice(1) : ''}
//                         </div>
//                     )}

//                     {/* Display current balance */}
//                     <div style={styles.infoBox}>
//                         <strong>Current Balance ({queryData.current_process}):</strong> {currentBalance}
//                     </div>

//                     <Label htmlFor="received-number" style={styles.inputLabel}>
//                         Enter Received Quantity
//                     </Label>
//                     <input
//                         id="received-number"
//                         type="number"
//                         value={receivedValue}
//                         onChange={handleReceivedInputChange}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter received quantity..."
//                         style={{
//                             marginBottom: '12px',
//                             ...styles.input,
//                             ...(error ? styles.inputError : {})
//                         }}
//                         disabled={isSubmitting}
//                         min="0"
//                         step="1"
//                     />

//                     <Label htmlFor="wastage-number" style={styles.inputLabel}>
//                         Enter Wastage Quantity
//                     </Label>
//                     <div style={styles.inputContainer}>
//                         <input
//                             id="wastage-number"
//                             type="number"
//                             value={wastageValue}
//                             onChange={handleWastageInputChange}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Enter wastage number..."
//                             style={{
//                                 ...styles.input,
//                                 ...(error ? styles.inputError : {})
//                             }}
//                             disabled={isSubmitting}
//                             min="0"
//                             step="1"
//                         />
//                         {(wastageValue || receivedValue) && (
//                             <div style={styles.valueDisplay}>
//                                 <div>Received: {receivedValue || '0'}</div>
//                                 <div>Wastage: {wastageValue || '0'}</div>
//                                 <div>Balance: {receivedValue && wastageValue ? Number(receivedValue) + Number(wastageValue) : '0'}</div>
//                             </div>
//                         )}
//                     </div>

//                     {error && (
//                         <div style={styles.errorMessage}>
//                             {error}
//                         </div>
//                     )}
//                 </div>

//                 <button
//                     onClick={handleSubmit}
//                     style={{
//                         ...styles.button,
//                         ...(isSubmitting ? styles.buttonDisabled : {}),
//                         ...(wastageValue.trim() && receivedValue.trim() && nextProcess ? styles.buttonActive : {})
//                     }}
//                 // disabled={isSubmitting || !wastageValue.trim() || !receivedValue.trim() || !nextProcess}
//                 >
//                     <div style={styles.buttonContent}>
//                         {isSubmitting ? (
//                             <>
//                                 <div style={styles.spinner}></div>
//                                 Submitting...
//                             </>
//                         ) : (
//                             <>
//                                 <Send size={16} />
//                                 Submit Wastage
//                             </>
//                         )}
//                     </div>
//                 </button>
//             </div>
//         </div>
//     );
// }

// // Enhanced styles matching the PostgreSQL comment component
// const styles = {
//     container: {
//         maxWidth: '500px',
//         margin: '50px auto',
//         padding: '32px',
//         border: '1px solid #e1e5e9',
//         borderRadius: '16px',
//         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         backgroundColor: '#ffffff',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         minHeight: '400px',
//     },
//     logo: {
//         width: '20rem',
//         height: 'auto',
//         marginBottom: '1.5rem',
//     },
//     headerSection: {
//         textAlign: 'center',
//         marginBottom: '32px',
//         width: '100%',
//     },
//     subheading: {
//         fontSize: '16px',
//         color: '#718096',
//         margin: 0,
//         lineHeight: '1.5',
//     },
//     form: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%',
//         gap: '24px',
//     },
//     inputGroup: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '8px',
//         width: '100%',
//     },
//     inputLabel: {
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#2d3748',
//         marginBottom: '4px',
//         textAlign: 'center'
//     },
//     inputContainer: {
//         position: 'relative',
//         width: '100%',
//     },
//     input: {
//         width: '100%',
//         padding: '16px',
//         fontSize: '16px',
//         borderRadius: '12px',
//         border: '2px solid #e2e8f0',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         minHeight: '56px',
//         fontFamily: 'inherit',
//         lineHeight: '1.5',
//         backgroundColor: '#fafafa',
//         boxSizing: 'border-box',
//     },
//     inputError: {
//         borderColor: '#e53e3e',
//         backgroundColor: '#fed7d7',
//     },
//     infoBox: {
//         backgroundColor: '#e6f7ff',
//         border: '1px solid #91d5ff',
//         borderRadius: '8px',
//         padding: '12px 16px',
//         marginBottom: '12px',
//         fontSize: '14px',
//         color: '#0050b3',
//         textAlign: 'center',
//     },
//     valueDisplay: {
//         marginTop: '8px',
//         fontSize: '14px',
//         color: '#4a5568',
//         backgroundColor: '#f7fafc',
//         padding: '12px',
//         borderRadius: '8px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '4px',
//     },
//     errorMessage: {
//         fontSize: '14px',
//         color: '#e53e3e',
//         backgroundColor: '#fed7d7',
//         padding: '8px 12px',
//         borderRadius: '6px',
//         border: '1px solid #feb2b2',
//         marginTop: '8px',
//     },
//     button: {
//         padding: '16px 24px',
//         fontSize: '16px',
//         fontWeight: '600',
//         border: 'none',
//         borderRadius: '12px',
//         backgroundColor: '#a0aec0',
//         color: '#ffffff',
//         cursor: 'not-allowed',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '56px',
//         transform: 'translateY(0)',
//     },
//     buttonActive: {
//         backgroundColor: '#4388c1',
//         cursor: 'pointer',
//         boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
//     },
//     buttonDisabled: {
//         backgroundColor: '#a0aec0',
//         cursor: 'not-allowed',
//         transform: 'none',
//         boxShadow: 'none',
//     },
//     buttonContent: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//     },
//     spinner: {
//         width: '16px',
//         height: '16px',
//         border: '2px solid transparent',
//         borderTop: '2px solid #ffffff',
//         borderRadius: '50%',
//         animation: 'spin 1s linear infinite',
//     },
//     successContainer: {
//         textAlign: 'center',
//         padding: '40px 20px',
//         width: '100%',
//     },
//     successIcon: {
//         width: '64px',
//         height: '64px',
//         backgroundColor: '#48bb78',
//         color: 'white',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: '32px',
//         fontWeight: 'bold',
//         margin: '0 auto 24px',
//         animation: 'bounceIn 0.6s ease-out',
//     },
//     successHeading: {
//         fontSize: '24px',
//         fontWeight: '700',
//         color: '#2d3748',
//         margin: '0 0 12px 0',
//     },
//     successMessage: {
//         fontSize: '16px',
//         color: '#718096',
//         margin: '0 0 32px 0',
//         lineHeight: '1.5',
//     },
//     newCommentButton: {
//         padding: '12px 24px',
//         fontSize: '14px',
//         fontWeight: '600',
//         border: '2px solid #4388c1',
//         borderRadius: '8px',
//         backgroundColor: 'transparent',
//         color: '#4388c1',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease',
//     },
// };

// // Add CSS animations
// if (typeof document !== 'undefined') {
//     const styleSheet = document.createElement("style");
//     styleSheet.type = "text/css";
//     styleSheet.innerText = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
      
//       @keyframes bounceIn {
//         0% { 
//           transform: scale(0.3);
//           opacity: 0;
//         }
//         50% { 
//           transform: scale(1.05);
//         }
//         70% { 
//           transform: scale(0.9);
//         }
//         100% { 
//           transform: scale(1);
//           opacity: 1;
//         }
//       }
      
//       input:focus, select:focus {
//         border-color: #4388c1 !important;
//         background-color: #ffffff !important;
//         box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
//       }
      
//       button:not(:disabled):hover {
//         transform: translateY(-2px) !important;
//         box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
//       }
//     `;
//     if (!document.getElementById('wastage-styles')) {
//         styleSheet.id = 'wastage-styles';
//         document.head.appendChild(styleSheet);
//     }
// }




// Comment Enabled Wastage Input form
// import { useEffect, useState } from 'react';
// import { Send } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { getRecordById, createRecord } from '../../api/apiConfig';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';
// import { Badge } from '@/components/ui/badge';



// // http://localhost:5173/wastage?schemaName=public&tableName=testing_table&recordId=010f953c-4c25-4075-854f-5c088a9c6e99&ownerId=1c17a5f5-6b0a-4300-9311-4701cb95abc4&us_id=10729/25&current_process=artwork&next_process=printing

// function useQueryObject() {
//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const queryObj = {};

//     for (const [key, value] of searchParams.entries()) {
//         queryObj[key] = value;
//     }

//     return queryObj;
// }

// export default function WastageInput() {
//     const navigate = useNavigate();
//     const [wastageValue, setWastageValue] = useState('');
//     const [receivedValue, setReceivedValue] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const queryData = useQueryObject();
//     const [nextProcess, setNextProcess] = useState(queryData.next_process || '');
//     const [responseData, setResponseData] = useState(null);
//     const [comment, setComment] = useState('');
//     const basemultiupdate = `https://click.wa.expert/api/data/updateMultiple?`;

//     // vendor 
//     const [selectedVendor, setSelectedVendor] = useState('');
//     // New state for vendors
//     const [allVendors, setAllVendors] = useState([]);
//     const [filteredVendors, setFilteredVendors] = useState([]);


//         // Fetch all vendors
// const fetchVendors = async () => {
//     try {
//         const apiParams = {
//             schemaName: userData.schema_name,
//             tableName: "vendor"
//         };

//         const response = await axios.post(
//             `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`,
//             apiParams
//         );

//         const vendors = response.data.data || [];
        
//         // Add "In House" option at the beginning
//         vendors.unshift({
//             "id": Date.now(),
//             "name": "In House"
//             // No need to set process_name - we handle it in the filter
//         });
        
//         console.log('Fetched vendors:', vendors);
//         setAllVendors(vendors);
//     } catch (error) {
//         console.error('Error fetching vendors:', error);
//         toast.error("Failed to load vendors");
//     }
// };


// // Filter vendors based on selected process - NEW LOGIC
// useEffect(() => {
//     if (nextProcess && allVendors.length > 0) {
//         // Filter vendors where process_name matches the selected process
//         const filtered = allVendors.filter(vendor => {
//             // Always include "In House"
//             if (vendor.name === "In House") {
//                 return true;
//             }
            
//             const vendorProcessName = vendor.process_name?.toLowerCase() || '';
//             const selectedProcessName = nextProcess.toLowerCase();

//             console.log('Checking vendor:', vendor.name, 'Process:', vendorProcessName, 'vs', selectedProcessName);

//             return vendorProcessName === selectedProcessName;
//         });

//         console.log('Selected process:', nextProcess);
//         console.log('Filtered vendors for process:', filtered);

//         setFilteredVendors(filtered);
//     } else {
//         setFilteredVendors([]);
//     }

//     // Reset selected vendor when process changes
//     setSelectedVendor('');
// }, [nextProcess, allVendors]);

//     const tableName = queryData.tableName;
//     const isNextProcessProvided = !!queryData.next_process;
    
//     const userData = useSelector((state) => state.user);
//     const [processSteps, setProcessSteps] = useState([]);
//     const [currentBalance, setCurrentBalance] = useState(0);
//     const finalProcessSteps = processSteps.filter(step => step !== queryData.current_process);
//     const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;

//     // Fixed: Move state update to useEffect
//     useEffect(() => {
//         if (isNextProcessProvided && nextProcess === '' && queryData.next_process) {
//             setNextProcess(queryData.next_process);
//         }
//     }, [isNextProcessProvided, queryData.next_process, nextProcess]);

//     useEffect(() => {
//          const index = processSteps.findIndex( p => p === queryData.current_process);
//          setNextProcess(index !== -1 && index < processSteps.length - 1? processSteps[index + 1]: '')
//          console.log("Next Process Set To:", nextProcess);
//          console.log("Process Steps",processSteps)
//     },[setNextProcess, processSteps]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
//             const { data } = await axios.get(route);
//             setProcessSteps(data.setup.process_steps);
//              console.log("Process Steps",processSteps)
//                              // Fetch vendors after process steps are loaded
//                 await fetchVendors();
//         };

//         if (owner_id && tableName) {
//             fetchData();
//         }
//     }, [owner_id, tableName]);

//     // Fixed: Update currentBalance when responseData changes
//     useEffect(() => {
//         if (responseData && queryData.current_process) {
//             const currentBalanceColumn = queryData.current_process + "_balance";
//             setCurrentBalance(responseData[currentBalanceColumn] || 0);
//         }
//     }, [responseData, queryData.current_process]);

//     console.log('Query Data:', queryData);

//     const getRecordByIdData = async () => {
//         try {
//             const { data } = await axios.post(getRecordById, {
//                 id: decodeURIComponent(queryData.us_id),
//                 schemaName: queryData.schemaName,
//                 tableName: queryData.tableName
//             });

//             setResponseData(data);
//             console.log('Record Data:', data);
//         } catch (e) {
//             console.log('Error fetching record:', e);
//             toast.error("Failed to find the record");
//         }
//     };

//     useEffect(() => {
//         if (queryData.recordId && queryData.schemaName && queryData.tableName) {
//             getRecordByIdData();
//         }
//     }, [queryData.recordId, queryData.schemaName, queryData.tableName]);

//         // Navigate back after successful submission
//     useEffect(() => {
//         if (submitted) {
//             const timer = setTimeout(() => {
//                 navigate(-1);
//             }, 2000);
            
//             return () => clearTimeout(timer); // Cleanup
//         }
//     }, [submitted, navigate]);

// const handleSubmit = async () => {
//     if (!receivedValue.trim() || isNaN(receivedValue) || Number(receivedValue) < 0 ||
//         !wastageValue.trim() || isNaN(wastageValue) || Number(wastageValue) < 0
//     ) {
//         setError("Please enter a valid positive number.");
//         return;
//     }

//     // NEW VALIDATION: Check if total exceeds current balance
//     const totalUsed = Number(receivedValue) + Number(wastageValue);
//     if (totalUsed > currentBalance) {
//         setError(`Total (Received + Wastage = ${totalUsed}) cannot exceed Current Balance (${currentBalance})`);
//         return;
//     }

//     // if (!nextProcess) {
//     //     setError("Please select next process");
//     //     return;
//     // }

//     if (!queryData.schemaName || !queryData.tableName || !queryData.recordId || !queryData.ownerId) {
//         setError("Please provide required details");
//         return;
//     }

//     if (!responseData) {
//         setError("Parent record data not loaded");
//         return;
//     }

//     try {
//         setIsSubmitting(true);
//         setError("");

//         const currentProcessBase = queryData.current_process;
//         const nextProcessBase = nextProcess;

//         // Current process columns
//         const currentBalanceColumn = currentProcessBase + "_balance";

//         // Next process columns
//         const nextReceivedColumn = nextProcessBase + "_quantity_received";
//         const nextWastageColumn = nextProcessBase + "_wastage";
//         const nextBalanceColumn = nextProcessBase + "_balance";

//         // Calculate balance for next process
//         const nextBalance = Number(receivedValue);

//         // Fixed: Use currentBalance state directly (already set in useEffect)
//         const updatedCurrentBalance = Number(currentBalance) - Number(receivedValue) - Number(wastageValue);

//         // Get existing wastage from parent and ADD new wastage
//         const parentWastage = responseData?.wastage || 0;
//         const newTotalWastage = Number(parentWastage) + Number(wastageValue);

//         // Get existing values from parent for the next process columns
//         const parentReceivedQty = responseData?.[nextReceivedColumn] || 0;
//         const parentWastageQty = responseData?.[nextWastageColumn] || 0;
//         const parentBalanceQty = responseData?.[nextBalanceColumn] || 0;

//         // ADD to parent's existing values (not overwrite)
//         const updatedParentReceived = Number(parentReceivedQty) + Number(receivedValue);
//         const updatedParentWastage = Number(parentWastageQty) + Number(wastageValue);
//         const updatedParentBalance = Number(parentBalanceQty) + nextBalance;

//         // Step 1: Update parent record with ADDED values
//         const queryString = new URLSearchParams(queryData).toString();
//         let colIndex = 7;
//         let updateUrl = `${basemultiupdate}${queryString}`
//             + `&col1=${currentBalanceColumn}&val1=${updatedCurrentBalance}`
//             + `&col2=${nextWastageColumn}&val2=${updatedParentWastage}`
//             + `&col3=wastage&val3=${newTotalWastage}`
//             + `&col4=${nextReceivedColumn}&val4=${updatedParentReceived}`
//             + `&col5=${nextBalanceColumn}&val5=${updatedParentBalance}`
//             + (Number(updatedCurrentBalance) <= 0
//                 ? `&col6=${currentProcessBase}&val6=Completed`
//                 : "")
//             + `&col7=${queryData.current_process}_date&val7=${new Date().toISOString()}`;

//         // Add comment if provided
//         if (comment) {
//             colIndex++;
//             updateUrl += `&col${colIndex}=${queryData.current_process}_comment&val${colIndex}=${encodeURIComponent(comment)}`;
//         }

//         console.log('Update Parent URL:', updateUrl);
//         const updateResponse = await axios.get(updateUrl);
//         console.log('Parent Update Response:', updateResponse);

//         // Step 2: Create new child record
//         const newRecordUsId = Math.floor(Date.now() / 1000); // Unix timestamp

//         // Copy all fields from parent record
//         const newRecordData = {
//             ...responseData, // Copy all parent fields
//             us_id: newRecordUsId, // New unique ID (Unix timestamp)
//             pa_id: queryData.us_id, // Link to parent record
//             [nextReceivedColumn]: receivedValue, // Set NEW values (not added)
//             [nextWastageColumn]: wastageValue,
//             [nextBalanceColumn]: nextBalance,
//             [currentBalanceColumn]: updatedCurrentBalance,
//             wastage: wastageValue, // For new record, this is just the current wastage
//         };

//         // Add comment to child record if provided
//         if (comment) {
//             newRecordData[`${queryData.current_process}_comment`] = comment;
//         }

//         // Remove fields that shouldn't be copied
//         delete newRecordData.id; // Let DB generate new ID
//         delete newRecordData.recordId; // Will be auto-generated

//         console.log('Creating new child record:', newRecordData);

//         const createResponse = await axios.post(createRecord, {
//             schemaName: queryData.schemaName,
//             tableName: queryData.tableName,
//             record: newRecordData
//         });

//         console.log('Child Record Created:', createResponse);

//         setSubmitted(true);
//         setWastageValue("");
//         setReceivedValue("");
//         setComment("");
//         // Only reset nextProcess if it wasn't from params
//         if (!isNextProcessProvided) {
//             setNextProcess("");
//         }
//         toast.success("Wastage submitted and new record created successfully!");

//     } catch (err) {
//         console.error('Submit Error:', err);
//         setError("Failed to submit. Please try again.");
//         toast.error("Failed to submit wastage");
//     } finally {
//         setIsSubmitting(false);
//     }
// };

//     const handleWastageInputChange = (e) => {
//         setWastageValue(e.target.value);
//         if (error) setError("");
//     };

//     const handleReceivedInputChange = (e) => {
//         setReceivedValue(e.target.value);
//         if (error) setError("");
//     };

//     const handleNextProcessChange = (e) => {
//         setNextProcess(e.target.value);
//         if (error) setError("");
//     };

//     const handleCommentChange = (e) => {
//         setComment(e.target.value);
//         if (error) setError("");
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSubmit();
//         }
//     };

//     if (submitted) {
//         return (
//             <div style={styles.container}>
//                 <img
//                     src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                     alt="logo"
//                     style={styles.logo}
//                 />

//                 <div style={styles.successContainer}>
//                     <div style={styles.successIcon}>✓</div>
//                     <h2 style={styles.successHeading}>Success!</h2>
//                     <p style={styles.successMessage}>
//                         Your wastage number has been submitted successfully.
//                     </p>
//                     {/* <button
//                         onClick={() => {
//                             setSubmitted(false);
//                             setWastageValue("");
//                             setReceivedValue("");
//                             setComment("");
//                             // Only reset nextProcess if it wasn't from params
//                             if (!isNextProcessProvided) {
//                                 setNextProcess("");
//                             }
//                         }}
//                         style={styles.newCommentButton}
//                     >
//                         Submit Another Number
//                     </button> */}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div style={styles.container}>
//             <img
//                 src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                 alt="logo"
//                 style={styles.logo}
//             />

//             <div style={styles.headerSection}>
//                 <p style={styles.subheading}>
//                     Please enter the wastage details below
//                 </p>
//                         <Badge className={`status-badge bg-blue-100 text-blue-700 mt-2`}>
//                           Current Process {"-> "+queryData.current_process.charAt(0).toUpperCase() + queryData.current_process.slice(1)}
//                         </Badge>
//             </div>

//             <div style={styles.form}>
//                 <div style={styles.inputGroup}>

//                     {/* Show dropdown only if next_process is NOT in URL params */}
//                     {!isNextProcessProvided ? (
//                         <div className="">
//                             <Label htmlFor="next-process" style={styles.inputLabel}>
//                                 Select Next Process
//                             </Label>
//                             <select
//                                 id="next-process"
//                                 value={nextProcess}
//                                 onChange={handleNextProcessChange}
//                                 style={{
//                                     ...styles.input,
//                                     ...(error && !nextProcess ? styles.inputError : {}),
//                                     marginBottom: '12px'
//                                 }}
//                                 disabled={isSubmitting}
//                             >
//                                 <option value="">-- Select Next Process --</option>
//                                 {console.log("finalProcessSteps:",finalProcessSteps)}
//                                 {finalProcessSteps.map((step) => (
//                                     <option key={step} value={step}>
//                                         {step.charAt(0).toUpperCase() + step.slice(1)}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     ) : (
//                         // Show next process info when it's from URL params
//                         <div style={styles.infoBox}>
//                             <strong>Next Process:</strong> {nextProcess ? nextProcess.charAt(0).toUpperCase() + nextProcess.slice(1) : ''}
//                         </div>
//                     )}

//                     {/* Display current balance */}
//                     <div style={styles.infoBox}>
//                         <strong>Current Balance ({queryData.current_process}):</strong> {currentBalance}
//                     </div>

//                     <Label htmlFor="received-number" style={styles.inputLabel}>
//                         Enter Received Quantity
//                     </Label>
//                     <input
//                         id="received-number"
//                         type="number"
//                         value={receivedValue}
//                         onChange={handleReceivedInputChange}
//                         onKeyDown={handleKeyDown}
//                         placeholder="Enter received quantity..."
//                         style={{
//                             marginBottom: '12px',
//                             ...styles.input,
//                             ...(error ? styles.inputError : {})
//                         }}
//                         disabled={isSubmitting}
//                         min="0"
//                         step="1"
//                     />

//                     <Label htmlFor="wastage-number" style={styles.inputLabel}>
//                         Enter Wastage Quantity
//                     </Label>
//                     <div style={styles.inputContainer}>
//                         <input
//                             id="wastage-number"
//                             type="number"
//                             value={wastageValue}
//                             onChange={handleWastageInputChange}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Enter wastage number..."
//                             style={{
//                                 ...styles.input,
//                                 ...(error ? styles.inputError : {})
//                             }}
//                             disabled={isSubmitting}
//                             min="0"
//                             step="1"
//                         />
//                         {(wastageValue || receivedValue) && (
//                             <div style={styles.valueDisplay}>
//                                 <div>Received: {receivedValue || '0'}</div>
//                                 <div>Wastage: {wastageValue || '0'}</div>
//                                 <div>Balance: {receivedValue && wastageValue ? Number(receivedValue) + Number(wastageValue) : '0'}</div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Comment Field */}
//                     <Label htmlFor="comment" style={{...styles.inputLabel, marginTop: '16px'}}>
//                         Comment (Optional)
//                     </Label>
//                     <div style={styles.textareaContainer}>
//                         <textarea
//                             id="comment"
//                             value={comment}
//                             onChange={handleCommentChange}
//                             placeholder="Type your comment or notes here..."
//                             style={{
//                                 ...styles.textarea,
//                                 ...(error ? styles.textareaError : {})
//                             }}
//                             rows={4}
//                             disabled={isSubmitting}
//                         />
//                         <div style={styles.characterCount}>
//                             {comment.length} characters
//                         </div>
//                     </div>

//                     {error && (
//                         <div style={styles.errorMessage}>
//                             {error}
//                         </div>
//                     )}
//                 </div>

//                 <button
//                     onClick={handleSubmit}
//                     style={{
//                         ...styles.button,
//                         ...(isSubmitting ? styles.buttonDisabled : {}),
//                         ...(wastageValue.trim() && receivedValue.trim() && nextProcess ? styles.buttonActive : {})
//                     }}
//                 // disabled={isSubmitting || !wastageValue.trim() || !receivedValue.trim() || !nextProcess}
//                 >
//                     <div style={styles.buttonContent}>
//                         {isSubmitting ? (
//                             <>
//                                 <div style={styles.spinner}></div>
//                                 Submitting...
//                             </>
//                         ) : (
//                             <>
//                                 <Send size={16} />
//                                 Submit Wastage
//                             </>
//                         )}
//                     </div>
//                 </button>
//             </div>
//         </div>
//     );
// }

// // Enhanced styles matching the PostgreSQL comment component
// const styles = {
//     container: {
//         maxWidth: '500px',
//         margin: '50px auto',
//         padding: '32px',
//         border: '1px solid #e1e5e9',
//         borderRadius: '16px',
//         boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         backgroundColor: '#ffffff',
//         fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//         minHeight: '400px',
//     },
//     logo: {
//         width: '20rem',
//         height: 'auto',
//         marginBottom: '1.5rem',
//     },
//     headerSection: {
//         textAlign: 'center',
//         marginBottom: '32px',
//         width: '100%',
//     },
//     subheading: {
//         fontSize: '16px',
//         color: '#718096',
//         margin: 0,
//         lineHeight: '1.5',
//     },
//     form: {
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%',
//         gap: '24px',
//     },
//     inputGroup: {
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '8px',
//         width: '100%',
//     },
//     inputLabel: {
//         fontSize: '14px',
//         fontWeight: '600',
//         color: '#2d3748',
//         marginBottom: '4px',
//         textAlign: 'center'
//     },
//     inputContainer: {
//         position: 'relative',
//         width: '100%',
//     },
//     input: {
//         width: '100%',
//         padding: '16px',
//         fontSize: '16px',
//         borderRadius: '12px',
//         border: '2px solid #e2e8f0',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         minHeight: '56px',
//         fontFamily: 'inherit',
//         lineHeight: '1.5',
//         backgroundColor: '#fafafa',
//         boxSizing: 'border-box',
//     },
//     inputError: {
//         borderColor: '#e53e3e',
//         backgroundColor: '#fed7d7',
//     },
//     infoBox: {
//         backgroundColor: '#e6f7ff',
//         border: '1px solid #91d5ff',
//         borderRadius: '8px',
//         padding: '12px 16px',
//         marginBottom: '12px',
//         fontSize: '14px',
//         color: '#0050b3',
//         textAlign: 'center',
//     },
//     valueDisplay: {
//         marginTop: '8px',
//         fontSize: '14px',
//         color: '#4a5568',
//         backgroundColor: '#f7fafc',
//         padding: '12px',
//         borderRadius: '8px',
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '4px',
//     },
//     textareaContainer: {
//         position: 'relative',
//         width: '100%',
//     },
//     textarea: {
//         width: '100%',
//         padding: '16px',
//         fontSize: '16px',
//         borderRadius: '12px',
//         border: '2px solid #e2e8f0',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         resize: 'vertical',
//         minHeight: '120px',
//         fontFamily: 'inherit',
//         lineHeight: '1.5',
//         backgroundColor: '#fafafa',
//         boxSizing: 'border-box',
//     },
//     textareaError: {
//         borderColor: '#e53e3e',
//         backgroundColor: '#fed7d7',
//     },
//     characterCount: {
//         position: 'absolute',
//         bottom: '8px',
//         right: '12px',
//         fontSize: '12px',
//         color: '#a0aec0',
//         backgroundColor: 'rgba(255, 255, 255, 0.9)',
//         padding: '2px 6px',
//         borderRadius: '4px',
//     },
//     errorMessage: {
//         fontSize: '14px',
//         color: '#e53e3e',
//         backgroundColor: '#fed7d7',
//         padding: '8px 12px',
//         borderRadius: '6px',
//         border: '1px solid #feb2b2',
//         marginTop: '8px',
//     },
//     button: {
//         padding: '16px 24px',
//         fontSize: '16px',
//         fontWeight: '600',
//         border: 'none',
//         borderRadius: '12px',
//         backgroundColor: '#a0aec0',
//         color: '#ffffff',
//         cursor: 'not-allowed',
//         transition: 'all 0.3s ease',
//         outline: 'none',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '56px',
//         transform: 'translateY(0)',
//     },
//     buttonActive: {
//         backgroundColor: '#4388c1',
//         cursor: 'pointer',
//         boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
//     },
//     buttonDisabled: {
//         backgroundColor: '#a0aec0',
//         cursor: 'not-allowed',
//         transform: 'none',
//         boxShadow: 'none',
//     },
//     buttonContent: {
//         display: 'flex',
//         alignItems: 'center',
//         gap: '8px',
//     },
//     spinner: {
//         width: '16px',
//         height: '16px',
//         border: '2px solid transparent',
//         borderTop: '2px solid #ffffff',
//         borderRadius: '50%',
//         animation: 'spin 1s linear infinite',
//     },
//     successContainer: {
//         textAlign: 'center',
//         padding: '40px 20px',
//         width: '100%',
//     },
//     successIcon: {
//         width: '64px',
//         height: '64px',
//         backgroundColor: '#48bb78',
//         color: 'white',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: '32px',
//         fontWeight: 'bold',
//         margin: '0 auto 24px',
//         animation: 'bounceIn 0.6s ease-out',
//     },
//     successHeading: {
//         fontSize: '24px',
//         fontWeight: '700',
//         color: '#2d3748',
//         margin: '0 0 12px 0',
//     },
//     successMessage: {
//         fontSize: '16px',
//         color: '#718096',
//         margin: '0 0 32px 0',
//         lineHeight: '1.5',
//     },
//     newCommentButton: {
//         padding: '12px 24px',
//         fontSize: '14px',
//         fontWeight: '600',
//         border: '2px solid #4388c1',
//         borderRadius: '8px',
//         backgroundColor: 'transparent',
//         color: '#4388c1',
//         cursor: 'pointer',
//         transition: 'all 0.3s ease',
//     },
// };

// // Add CSS animations
// if (typeof document !== 'undefined') {
//     const styleSheet = document.createElement("style");
//     styleSheet.type = "text/css";
//     styleSheet.innerText = `
//       @keyframes spin {
//         0% { transform: rotate(0deg); }
//         100% { transform: rotate(360deg); }
//       }
      
//       @keyframes bounceIn {
//         0% { 
//           transform: scale(0.3);
//           opacity: 0;
//         }
//         50% { 
//           transform: scale(1.05);
//         }
//         70% { 
//           transform: scale(0.9);
//         }
//         100% { 
//           transform: scale(1);
//           opacity: 1;
//         }
//       }
      
//       input:focus, select:focus, textarea:focus {
//         border-color: #4388c1 !important;
//         background-color: #ffffff !important;
//         box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
//       }
      
//       button:not(:disabled):hover {
//         transform: translateY(-2px) !important;
//         box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
//       }
//     `;
//     if (!document.getElementById('wastage-styles')) {
//         styleSheet.id = 'wastage-styles';
//         document.head.appendChild(styleSheet);
//     }
// }


import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getRecordById, createRecord } from '../../api/apiConfig';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';

function useQueryObject() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryObj = {};

    for (const [key, value] of searchParams.entries()) {
        queryObj[key] = value;
    }

    return queryObj;
}

export default function WastageInput() {
    const navigate = useNavigate();
    const [wastageValue, setWastageValue] = useState('');
    const [receivedValue, setReceivedValue] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const queryData = useQueryObject();
    const [nextProcess, setNextProcess] = useState(queryData.next_process || '');
    const [responseData, setResponseData] = useState(null);
    const [comment, setComment] = useState('');
    const basemultiupdate = `https://click.wa.expert/api/data/updateMultiple?`;

    // Vendor state
    const [selectedVendor, setSelectedVendor] = useState('');
    const [allVendors, setAllVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);

    const tableName = queryData.tableName;
    const isNextProcessProvided = !!queryData.next_process;
    
    const userData = useSelector((state) => state.user);
    const [processSteps, setProcessSteps] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const finalProcessSteps = processSteps.filter(step => step !== queryData.current_process);
    const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;

    // Fetch all vendors
    const fetchVendors = async () => {
        try {
            const apiParams = {
                schemaName: userData.schema_name,
                tableName: "vendor"
            };

            const response = await axios.post(
                `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`,
                apiParams
            );

            const vendors = response.data.data || [];
            
            // Add "In House" option at the beginning
            vendors.unshift({
                "id": Date.now(),
                "name": "In House"
            });
            
            console.log('Fetched vendors:', vendors);
            setAllVendors(vendors);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error("Failed to load vendors");
        }
    };

    // Filter vendors based on selected process
    useEffect(() => {
        if (nextProcess && allVendors.length > 0) {
            const filtered = allVendors.filter(vendor => {
                // Always include "In House"
                if (vendor.name === "In House") {
                    return true;
                }
                
                const vendorProcessName = vendor.process_name?.toLowerCase() || '';
                const selectedProcessName = nextProcess.toLowerCase();

                console.log('Checking vendor:', vendor.name, 'Process:', vendorProcessName, 'vs', selectedProcessName);

                return vendorProcessName === selectedProcessName;
            });

            console.log('Selected process:', nextProcess);
            console.log('Filtered vendors for process:', filtered);

            setFilteredVendors(filtered);
        } else {
            setFilteredVendors([]);
        }

        // Reset selected vendor when process changes
        setSelectedVendor('');
    }, [nextProcess, allVendors]);

    // Set next process from URL if provided
    useEffect(() => {
        if (isNextProcessProvided && nextProcess === '' && queryData.next_process) {
            setNextProcess(queryData.next_process);
        }
    }, [isNextProcessProvided, queryData.next_process, nextProcess]);

    // Auto-set next process based on current process
    useEffect(() => {
        const index = processSteps.findIndex(p => p === queryData.current_process);
        setNextProcess(index !== -1 && index < processSteps.length - 1 ? processSteps[index + 1] : '');
        console.log("Next Process Set To:", nextProcess);
        console.log("Process Steps", processSteps);
    }, [setNextProcess, processSteps]);

    // Fetch process steps and vendors
    useEffect(() => {
        const fetchData = async () => {
            const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
            const { data } = await axios.get(route);
            setProcessSteps(data.setup.process_steps);
            console.log("Process Steps", processSteps);
            
            // Fetch vendors after process steps are loaded
            await fetchVendors();
        };

        if (owner_id && tableName) {
            fetchData();
        }
    }, [owner_id, tableName]);

    // Update currentBalance when responseData changes
    useEffect(() => {
        if (responseData && queryData.current_process) {
            const currentBalanceColumn = queryData.current_process + "_balance";
            setCurrentBalance(responseData[currentBalanceColumn] || 0);
        }
    }, [responseData, queryData.current_process]);

    console.log('Query Data:', queryData);

    const getRecordByIdData = async () => {
        try {
            const { data } = await axios.post(getRecordById, {
                id: decodeURIComponent(queryData.us_id),
                schemaName: queryData.schemaName,
                tableName: queryData.tableName
            });

            setResponseData(data);
            console.log('Record Data:', data);
        } catch (e) {
            console.log('Error fetching record:', e);
            toast.error("Failed to find the record");
        }
    };

    useEffect(() => {
        if (queryData.recordId && queryData.schemaName && queryData.tableName) {
            getRecordByIdData();
        }
    }, [queryData.recordId, queryData.schemaName, queryData.tableName]);

    // Navigate back after successful submission
    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                navigate(-1);
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [submitted, navigate]);

    const handleSubmit = async () => {
        if (!receivedValue.trim() || isNaN(receivedValue) || Number(receivedValue) < 0 ||
            !wastageValue.trim() || isNaN(wastageValue) || Number(wastageValue) < 0
        ) {
            setError("Please enter a valid positive number.");
            return;
        }

        // Validation: Check if total exceeds current balance
        const totalUsed = Number(receivedValue) + Number(wastageValue);
        if (totalUsed > currentBalance) {
            setError(`Total (Received + Wastage = ${totalUsed}) cannot exceed Current Balance (${currentBalance})`);
            return;
        }

        if (!queryData.schemaName || !queryData.tableName || !queryData.recordId || !queryData.ownerId) {
            setError("Please provide required details");
            return;
        }

        if (!responseData) {
            setError("Parent record data not loaded");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            const currentProcessBase = queryData.current_process;
            const nextProcessBase = nextProcess;

            // Current process columns
            const currentBalanceColumn = currentProcessBase + "_balance";

            // Next process columns
            const nextReceivedColumn = nextProcessBase + "_quantity_received";
            const nextWastageColumn = nextProcessBase + "_wastage";
            const nextBalanceColumn = nextProcessBase + "_balance";

            // Calculate balance for next process
            const nextBalance = Number(receivedValue);

            // Use currentBalance state directly
            const updatedCurrentBalance = Number(currentBalance) - Number(receivedValue) - Number(wastageValue);

            // Get existing wastage from parent and ADD new wastage
            const parentWastage = responseData?.wastage || 0;
            const newTotalWastage = Number(parentWastage) + Number(wastageValue);

            // Get existing values from parent for the next process columns
            const parentReceivedQty = responseData?.[nextReceivedColumn] || 0;
            const parentWastageQty = responseData?.[nextWastageColumn] || 0;
            const parentBalanceQty = responseData?.[nextBalanceColumn] || 0;

            // ADD to parent's existing values (not overwrite)
            const updatedParentReceived = Number(parentReceivedQty) + Number(receivedValue);
            const updatedParentWastage = Number(parentWastageQty) + Number(wastageValue);
            const updatedParentBalance = Number(parentBalanceQty) + nextBalance;

            // Build the update URL
            const queryString = new URLSearchParams(queryData).toString();
            let colIndex = 7;
            let updateUrl = `${basemultiupdate}${queryString}`
                + `&col1=${currentBalanceColumn}&val1=${updatedCurrentBalance}`
                + `&col2=${nextWastageColumn}&val2=${updatedParentWastage}`
                + `&col3=wastage&val3=${newTotalWastage}`
                + `&col4=${nextReceivedColumn}&val4=${updatedParentReceived}`
                + `&col5=${nextBalanceColumn}&val5=${updatedParentBalance}`
                + (Number(updatedCurrentBalance) <= 0
                    ? `&col6=${currentProcessBase}&val6=Completed`
                    : "")
                + `&col7=${queryData.current_process}_date&val7=${new Date().toISOString()}`;

            // Add vendor if selected
            if (selectedVendor) {
                colIndex++;
                updateUrl += `&col${colIndex}=${currentProcessBase}_vendor&val${colIndex}=${encodeURIComponent(selectedVendor)}`;
            }

            // Add comment if provided
            if (comment) {
                colIndex++;
                updateUrl += `&col${colIndex}=${queryData.current_process}_comment&val${colIndex}=${encodeURIComponent(comment)}`;
            }

            console.log('Update Parent URL:', updateUrl);
            const updateResponse = await axios.get(updateUrl);
            console.log('Parent Update Response:', updateResponse);

            // Step 2: Create new child record
            const newRecordUsId = Math.floor(Date.now() / 1000);

            // Copy all fields from parent record
            const newRecordData = {
                ...responseData,
                us_id: newRecordUsId,
                pa_id: queryData.us_id,
                [nextReceivedColumn]: receivedValue,
                [nextWastageColumn]: wastageValue,
                [nextBalanceColumn]: nextBalance,
                [currentBalanceColumn]: updatedCurrentBalance,
                wastage: wastageValue,
            };

            // Add vendor to child record if selected
            if (selectedVendor) {
                newRecordData[`${currentProcessBase}_vendor`] = selectedVendor;
            }

            // Add comment to child record if provided
            if (comment) {
                newRecordData[`${queryData.current_process}_comment`] = comment;
            }

            // Remove fields that shouldn't be copied
            delete newRecordData.id;
            delete newRecordData.recordId;

            console.log('Creating new child record:', newRecordData);

            const createResponse = await axios.post(createRecord, {
                schemaName: queryData.schemaName,
                tableName: queryData.tableName,
                record: newRecordData
            });

            console.log('Child Record Created:', createResponse);

            setSubmitted(true);
            setWastageValue("");
            setReceivedValue("");
            setComment("");
            setSelectedVendor("");
            
            // Only reset nextProcess if it wasn't from params
            if (!isNextProcessProvided) {
                setNextProcess("");
            }
            
            toast.success("Wastage submitted and new record created successfully!");

        } catch (err) {
            console.error('Submit Error:', err);
            setError("Failed to submit. Please try again.");
            toast.error("Failed to submit wastage");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWastageInputChange = (e) => {
        setWastageValue(e.target.value);
        if (error) setError("");
    };

    const handleReceivedInputChange = (e) => {
        setReceivedValue(e.target.value);
        if (error) setError("");
    };

    const handleNextProcessChange = (e) => {
        setNextProcess(e.target.value);
        if (error) setError("");
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        if (error) setError("");
    };

    const handleVendorChange = (e) => {
        setSelectedVendor(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (submitted) {
        return (
            <div style={styles.container}>
                <img
                    src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                    alt="logo"
                    style={styles.logo}
                />

                <div style={styles.successContainer}>
                    <div style={styles.successIcon}>✓</div>
                    <h2 style={styles.successHeading}>Success!</h2>
                    <p style={styles.successMessage}>
                        Your wastage number has been submitted successfully.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <img
                src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                alt="logo"
                style={styles.logo}
            />

            <div style={styles.headerSection}>
                <p style={styles.subheading}>
                    Please enter the wastage details below
                </p>
                <Badge className={`status-badge bg-blue-100 text-blue-700 mt-2`}>
                    Current Process {"-> " + queryData.current_process.charAt(0).toUpperCase() + queryData.current_process.slice(1)}
                </Badge>
            </div>

            <div style={styles.form}>
                <div style={styles.inputGroup}>
                    {/* Show dropdown only if next_process is NOT in URL params */}
                    {!isNextProcessProvided ? (
                        <div className="">
                            <Label htmlFor="next-process" style={styles.inputLabel}>
                                Select Next Process
                            </Label>
                            <select
                                id="next-process"
                                value={nextProcess}
                                onChange={handleNextProcessChange}
                                style={{
                                    ...styles.input,
                                    ...(error && !nextProcess ? styles.inputError : {}),
                                    marginBottom: '12px'
                                }}
                                disabled={isSubmitting}
                            >
                                <option value="">-- Select Next Process --</option>
                                {finalProcessSteps.map((step) => (
                                    <option key={step} value={step}>
                                        {step.charAt(0).toUpperCase() + step.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        // Show next process info when it's from URL params
                        <div style={styles.infoBox}>
                            <strong>Next Process:</strong> {nextProcess ? nextProcess.charAt(0).toUpperCase() + nextProcess.slice(1) : ''}
                        </div>
                    )}

                    {/* Display current balance */}
                    <div style={styles.infoBox}>
                        <strong>Current Balance ({queryData.current_process}):</strong> {currentBalance}
                    </div>

                    <Label htmlFor="received-number" style={styles.inputLabel}>
                        Enter Received Quantity
                    </Label>
                    <input
                        id="received-number"
                        type="number"
                        value={receivedValue}
                        onChange={handleReceivedInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter received quantity..."
                        style={{
                            marginBottom: '12px',
                            ...styles.input,
                            ...(error ? styles.inputError : {})
                        }}
                        disabled={isSubmitting}
                        min="0"
                        step="1"
                    />

                    <Label htmlFor="wastage-number" style={styles.inputLabel}>
                        Enter Wastage Quantity
                    </Label>
                    <div style={styles.inputContainer}>
                        <input
                            id="wastage-number"
                            type="number"
                            value={wastageValue}
                            onChange={handleWastageInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter wastage number..."
                            style={{
                                ...styles.input,
                                ...(error ? styles.inputError : {})
                            }}
                            disabled={isSubmitting}
                            min="0"
                            step="1"
                        />
                        {(wastageValue || receivedValue) && (
                            <div style={styles.valueDisplay}>
                                <div>Received: {receivedValue || '0'}</div>
                                <div>Wastage: {wastageValue || '0'}</div>
                                <div>Total Used: {receivedValue && wastageValue ? Number(receivedValue) + Number(wastageValue) : '0'}</div>
                            </div>
                        )}
                    </div>

                    {/* Vendor Dropdown - Only shown when process is selected and vendors are available */}
                    {nextProcess && filteredVendors.length > 0 && (
                        <>
                            <Label htmlFor="vendor" style={{ ...styles.inputLabel, marginTop: '16px' }}>
                                Select Vendor (Optional)
                            </Label>
                            <select
                                id="vendor"
                                value={selectedVendor}
                                onChange={handleVendorChange}
                                onKeyDown={handleKeyDown}
                                style={{
                                    ...styles.input,
                                    marginBottom: '12px'
                                }}
                                disabled={isSubmitting}
                            >
                                <option value="">-- Select Vendor (Optional) --</option>
                                {filteredVendors.map((vendor) => (
                                    <option
                                        key={vendor.id}
                                        value={vendor.name || vendor.vendor_name || vendor.id}
                                    >
                                        {vendor.name || vendor.vendor_name || `Vendor ${vendor.id}`}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}

                    {/* Show message if process selected but no vendors available */}
                    {nextProcess && filteredVendors.length === 0 && allVendors.length > 0 && (
                        <div style={{
                            marginTop: '16px',
                            padding: '12px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffc107',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#856404'
                        }}>
                            No vendors available for the selected process "{nextProcess}"
                        </div>
                    )}

                    {/* Comment Field */}
                    <Label htmlFor="comment" style={{ ...styles.inputLabel, marginTop: '16px' }}>
                        Comment (Optional)
                    </Label>
                    <div style={styles.textareaContainer}>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Type your comment or notes here..."
                            style={{
                                ...styles.textarea,
                                ...(error ? styles.textareaError : {})
                            }}
                            rows={4}
                            disabled={isSubmitting}
                        />
                        <div style={styles.characterCount}>
                            {comment.length} characters
                        </div>
                    </div>

                    {error && (
                        <div style={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        ...styles.button,
                        ...(isSubmitting ? styles.buttonDisabled : {}),
                        ...(wastageValue.trim() && receivedValue.trim() && nextProcess ? styles.buttonActive : {})
                    }}
                    disabled={isSubmitting || !wastageValue.trim() || !receivedValue.trim() || !nextProcess}
                >
                    <div style={styles.buttonContent}>
                        {isSubmitting ? (
                            <>
                                <div style={styles.spinner}></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Submit Wastage
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}

// Enhanced styles
const styles = {
    container: {
        maxWidth: '500px',
        margin: '50px auto',
        padding: '32px',
        border: '1px solid #e1e5e9',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '400px',
    },
    logo: {
        width: '20rem',
        height: 'auto',
        marginBottom: '1.5rem',
    },
    headerSection: {
        textAlign: 'center',
        marginBottom: '32px',
        width: '100%',
    },
    subheading: {
        fontSize: '16px',
        color: '#718096',
        margin: 0,
        lineHeight: '1.5',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: '24px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
    },
    inputLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '4px',
        textAlign: 'center'
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s ease',
        outline: 'none',
        minHeight: '56px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
        backgroundColor: '#fafafa',
        boxSizing: 'border-box',
    },
    inputError: {
        borderColor: '#e53e3e',
        backgroundColor: '#fed7d7',
    },
    infoBox: {
        backgroundColor: '#e6f7ff',
        border: '1px solid #91d5ff',
        borderRadius: '8px',
        padding: '12px 16px',
        marginBottom: '12px',
        fontSize: '14px',
        color: '#0050b3',
        textAlign: 'center',
    },
    valueDisplay: {
        marginTop: '8px',
        fontSize: '14px',
        color: '#4a5568',
        backgroundColor: '#f7fafc',
        padding: '12px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    textareaContainer: {
        position: 'relative',
        width: '100%',
    },
    textarea: {
        width: '100%',
        padding: '16px',
        fontSize: '16px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s ease',
        outline: 'none',
        resize: 'vertical',
        minHeight: '120px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
        backgroundColor: '#fafafa',
        boxSizing: 'border-box',
    },
    textareaError: {
        borderColor: '#e53e3e',
        backgroundColor: '#fed7d7',
    },
    characterCount: {
        position: 'absolute',
        bottom: '8px',
        right: '12px',
        fontSize: '12px',
        color: '#a0aec0',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '2px 6px',
        borderRadius: '4px',
    },
    errorMessage: {
        fontSize: '14px',
        color: '#e53e3e',
        backgroundColor: '#fed7d7',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #feb2b2',
        marginTop: '8px',
    },
    button: {
        padding: '16px 24px',
        fontSize: '16px',
        fontWeight: '600',
        border: 'none',
        borderRadius: '12px',
        backgroundColor: '#a0aec0',
        color: '#ffffff',
        cursor: 'not-allowed',
        transition: 'all 0.3s ease',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '56px',
        transform: 'translateY(0)',
    },
    buttonActive: {
        backgroundColor: '#4388c1',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
    },
    buttonDisabled: {
        backgroundColor: '#a0aec0',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
    },
    buttonContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    successContainer: {
        textAlign: 'center',
        padding: '40px 20px',
        width: '100%',
    },
    successIcon: {
        width: '64px',
        height: '64px',
        backgroundColor: '#48bb78',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        margin: '0 auto 24px',
        animation: 'bounceIn 0.6s ease-out',
    },
    successHeading: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2d3748',
        margin: '0 0 12px 0',
    },
    successMessage: {
        fontSize: '16px',
        color: '#718096',
        margin: '0 0 32px 0',
        lineHeight: '1.5',
    },
};

// Add CSS animations
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes bounceIn {
        0% { 
          transform: scale(0.3);
          opacity: 0;
        }
        50% { 
          transform: scale(1.05);
        }
        70% { 
          transform: scale(0.9);
        }
        100% { 
          transform: scale(1);
          opacity: 1;
        }
      }
      
      input:focus, select:focus, textarea:focus {
        border-color: #4388c1 !important;
        background-color: #ffffff !important;
        box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
      }
      
      button:not(:disabled):hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
      }
    `;
    if (!document.getElementById('wastage-styles')) {
        styleSheet.id = 'wastage-styles';
        document.head.appendChild(styleSheet);
    }
}