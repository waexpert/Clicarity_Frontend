    // import { useEffect, useState } from 'react';
    // import { Send } from 'lucide-react';
    // import { Label } from '@/components/ui/label';
    // import { useLocation } from 'react-router-dom';
    // import axios from 'axios';
    // import { getRecordById, createRecord } from '../api/apiConfig';
    // import { toast } from 'sonner';

    // // http://localhost:5173/wastage?schemaName=public&tableName=testing_table&recordId=010f953c-4c25-4075-854f-5c088a9c6e99&ownerId=1c17a5f5-6b0a-4300-9311-4701cb95abc4&us_id=10729/25&next_process=artwork


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
    //     const [nextStep, setNextStep] = useState('');
    //     const [balance, setBalance] = useState('');
    //     const [submitted, setSubmitted] = useState(false);
    //     const [isSubmitting, setIsSubmitting] = useState(false);
    //     const [error, setError] = useState('');
    //     const queryData = useQueryObject();
    //     const [responseData, setResponseData] = useState(null); 
    //     const basemultiupdate = `https://click.wa.expert/api/data/updateMultiple?`;

    //     const processSteps = ['artwork',
    // 'positives',
    // 'Printing',
    // 'aqua_coating',
    // 'lamination',
    // 'uv',
    // 'foiling',
    // 'gumming',
    // 'pasting',
    // 'punching',
    // 'binding'
    // ];

    //     console.log('Query Data:', queryData);

    //     const getRecordByIdData = async () => {
    //         try {
    //             // Get RecordbyId
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

    //             // Calculate values
    //             const nextProcessBase = queryData.next_process;
    //             const nextReceivedColumn = nextProcessBase + "_quantity_received";
    //             const nextWastageColumn = nextProcessBase + "_wastage";
    //             const nextBalanceColumn = nextProcessBase + "_balance";
    //             const nextBalance = Number(receivedValue) - Number(wastageValue);
                
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
    //             const updateUrl = `${basemultiupdate}${queryString}&col1=${nextWastageColumn}&val1=${updatedParentWastage}&col2=wastage&val2=${newTotalWastage}&col3=${nextReceivedColumn}&val3=${updatedParentReceived}&col4=${nextBalanceColumn}&val4=${updatedParentBalance}`;

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
    //             toast.success("Wastage submitted and new record created successfully!");
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
    //                     Please enter the wastage number below
    //                 </p>
    //             </div>
                
    //             <div style={styles.form}>
    //                 <div style={styles.inputGroup}>
    //                     <Label htmlFor="received-number" style={styles.inputLabel}>
    //                         Enter Received Quantity
    //                     </Label>
    //                     <div style={styles.inputContainer}>
    //                         <input
    //                             id="received-number"
    //                             type="number"
    //                             value={receivedValue}
    //                             onChange={handleReceivedInputChange}
    //                             onKeyDown={handleKeyDown}
    //                             placeholder="Enter received quantity..."
    //                             style={{marginBottom: '12px',
    //                                 ...styles.input,
    //                                 ...(error ? styles.inputError : {})
    //                             }}
    //                             disabled={isSubmitting}
    //                             min="0"
    //                             step="1"
    //                         />
    //                     <Label htmlFor="wastage-number" style={styles.inputLabel}>
    //                         Enter Wastage Quantity
    //                     </Label>
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
    //                         ...(wastageValue.trim() ? styles.buttonActive : {})
    //                     }}
    //                     disabled={isSubmitting || !wastageValue.trim()}
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
    //     heading: {
    //         fontSize: '24px',
    //         fontWeight: '700',
    //         color: '#2d3748',
    //         margin: '0 0 8px 0',
    //         lineHeight: '1.3',
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
    //     @keyframes spin {
    //         0% { transform: rotate(0deg); }
    //         100% { transform: rotate(360deg); }
    //     }
        
    //     @keyframes bounceIn {
    //         0% { 
    //         transform: scale(0.3);
    //         opacity: 0;
    //         }
    //         50% { 
    //         transform: scale(1.05);
    //         }
    //         70% { 
    //         transform: scale(0.9);
    //         }
    //         100% { 
    //         transform: scale(1);
    //         opacity: 1;
    //         }
    //     }
        
    //     input:focus {
    //         border-color: #4388c1 !important;
    //         background-color: #ffffff !important;
    //         box-shadow: 0 0 0 3px rgba(67, 136, 193, 0.1) !important;
    //     }
        
    //     button:not(:disabled):hover {
    //         transform: translateY(-2px) !important;
    //         box-shadow: 0 6px 20px rgba(67, 136, 193, 0.4) !important;
    //     }
    //     `;
    //     if (!document.getElementById('wastage-styles')) {
    //         styleSheet.id = 'wastage-styles';
    //         document.head.appendChild(styleSheet);
    //     }
    // }



import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { getRecordById, createRecord } from '../api/apiConfig';
import { toast } from 'sonner';

// http://localhost:5173/wastage?schemaName=public&tableName=testing_table&recordId=010f953c-4c25-4075-854f-5c088a9c6e99&ownerId=1c17a5f5-6b0a-4300-9311-4701cb95abc4&us_id=10729/25&current_process=artwork&in_pro=true

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
    const [wastageValue, setWastageValue] = useState('');
    const [receivedValue, setReceivedValue] = useState('');
    const [nextProcess, setNextProcess] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const queryData = useQueryObject();
    const [responseData, setResponseData] = useState(null); 
    const basemultiupdate = `https://click.wa.expert/api/data/updateMultiple?`;

    const in_pro = queryData.in_pro === 'true';

    const processSteps = [
        'artwork',
        'positives',
        'Printing',
        'aqua_coating',
        'lamination',
        'uv',
        'foiling',
        'gumming',
        'pasting',
        'punching',
        'binding'
    ];

    console.log('Query Data:', queryData);

    const getRecordByIdData = async () => {
        try {
            const { data } = await axios.post(getRecordById, {
                id: queryData.us_id,
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

    const handleSubmit = async () => {
        if (!receivedValue.trim() || isNaN(receivedValue) || Number(receivedValue) < 0 ||
            !wastageValue.trim() || isNaN(wastageValue) || Number(wastageValue) < 0
        ) {
            setError("Please enter a valid positive number.");
            return;
        }

        if (!nextProcess) {
            setError("Please select next process");
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


            if(in_pro){
            const currentProcessBase = "in_pro";
            const nextProcessBase = queryData.current_process;

              // Current process columns
            const currentBalanceColumn = currentProcessBase;
            
            // Next process columns
            const nextReceivedColumn = nextProcessBase + "_quantity_received";
            const nextWastageColumn = nextProcessBase + "_wastage";
            const nextBalanceColumn = nextProcessBase + "_balance";
            
            // Calculate balance for next process
            const nextBalance = Number(receivedValue) - Number(wastageValue);
            
            // Update current process balance: current_balance - received - wastage
            const currentBalance = responseData?.[currentBalanceColumn] || 0;
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

            // Step 1: Update parent record with ADDED values
            const queryString = new URLSearchParams(queryData).toString();
            const updateUrl = `${basemultiupdate}${queryString}&col1=${currentBalanceColumn}&val1=${updatedCurrentBalance}&col2=${nextWastageColumn}&val2=${updatedParentWastage}&col3=wastage&val3=${newTotalWastage}&col4=${nextReceivedColumn}&val4=${updatedParentReceived}&col5=${nextBalanceColumn}&val5=${updatedParentBalance}`;

            console.log('Update Parent URL:', updateUrl);
            const updateResponse = await axios.get(updateUrl);
            console.log('Parent Update Response:', updateResponse);

            // Step 2: Create new child record
            const newRecordUsId = Math.floor(Date.now() / 1000); // Unix timestamp
            
            // Copy all fields from parent record
            const newRecordData = {
                ...responseData, // Copy all parent fields
                us_id: newRecordUsId, // New unique ID (Unix timestamp)
                pa_id: queryData.us_id, // Link to parent record
                [nextReceivedColumn]: receivedValue, // Set NEW values (not added)
                [nextWastageColumn]: wastageValue,
                [nextBalanceColumn]: nextBalance,
                [currentBalanceColumn]: updatedCurrentBalance,
                wastage: wastageValue, // For new record, this is just the current wastage
            };

            // Remove fields that shouldn't be copied
            delete newRecordData.id; // Let DB generate new ID
            delete newRecordData.recordId; // Will be auto-generated

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
            setNextProcess("");
            toast.success("Wastage submitted and new record created successfully!");

            }else{
            const currentProcessBase = queryData.current_process;
            const nextProcessBase = nextProcess;

            // Current process columns
            const currentBalanceColumn = currentProcessBase + "_balance";
            
            // Next process columns
            const nextReceivedColumn = nextProcessBase + "_quantity_received";
            const nextWastageColumn = nextProcessBase + "_wastage";
            const nextBalanceColumn = nextProcessBase + "_balance";
            
            // Calculate balance for next process
            const nextBalance = Number(receivedValue) - Number(wastageValue);
            
            // Update current process balance: current_balance - received - wastage
            const currentBalance = responseData?.[currentBalanceColumn] || 0;
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

            // Step 1: Update parent record with ADDED values
            const queryString = new URLSearchParams(queryData).toString();
            const updateUrl = `${basemultiupdate}${queryString}&col1=${currentBalanceColumn}&val1=${updatedCurrentBalance}&col2=${nextWastageColumn}&val2=${updatedParentWastage}&col3=wastage&val3=${newTotalWastage}&col4=${nextReceivedColumn}&val4=${updatedParentReceived}&col5=${nextBalanceColumn}&val5=${updatedParentBalance}`;

            console.log('Update Parent URL:', updateUrl);
            const updateResponse = await axios.get(updateUrl);
            console.log('Parent Update Response:', updateResponse);

            // Step 2: Create new child record
            const newRecordUsId = Math.floor(Date.now() / 1000); // Unix timestamp
            
            // Copy all fields from parent record
            const newRecordData = {
                ...responseData, // Copy all parent fields
                us_id: newRecordUsId, // New unique ID (Unix timestamp)
                pa_id: queryData.us_id, // Link to parent record
                [nextReceivedColumn]: receivedValue, // Set NEW values (not added)
                [nextWastageColumn]: wastageValue,
                [nextBalanceColumn]: nextBalance,
                [currentBalanceColumn]: updatedCurrentBalance,
                wastage: wastageValue, // For new record, this is just the current wastage
            };

            // Remove fields that shouldn't be copied
            delete newRecordData.id; // Let DB generate new ID
            delete newRecordData.recordId; // Will be auto-generated

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
            setNextProcess("");
            toast.success("Wastage submitted and new record created successfully!");
        }

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
                    <button 
                        onClick={() => {
                            setSubmitted(false);
                            setWastageValue("");
                            setReceivedValue("");
                            setNextProcess("");
                        }}
                        style={styles.newCommentButton}
                    >
                        Submit Another Number
                    </button>
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
            </div>
            
            <div style={styles.form}>
                <div style={styles.inputGroup}>

                { in_pro ? "" : (
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
                        {processSteps.map((step) => (
                            <option key={step} value={step}>
                                {step.charAt(0).toUpperCase() + step.slice(1)}
                            </option>
                        ))}
                    </select>
                    </div>

                )
               }
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
                                <div>Balance: {receivedValue && wastageValue ? Number(receivedValue) - Number(wastageValue) : '0'}</div>
                            </div>
                        )}
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

// Enhanced styles matching the PostgreSQL comment component
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
    newCommentButton: {
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '600',
        border: '2px solid #4388c1',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        color: '#4388c1',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
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
      
      input:focus, select:focus {
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