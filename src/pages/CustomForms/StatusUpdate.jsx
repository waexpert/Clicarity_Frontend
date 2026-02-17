// import { useEffect, useState, useCallback, useMemo } from 'react';
// import { Send } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';
// import '../../css/pages/StatusUpdate.css';
// import useCrypto from '../Setup/hooks/useCrypto';
// import FormViewer from '../FormBuilder/FormViewer';

// // Constants
// const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
// const IN_HOUSE_VENDOR = { id: Date.now(), name: "In House" };

// // Custom hook for query parameters
// function useQueryObject() {
//     const location = useLocation();
//     return useMemo(() => {
//         const searchParams = new URLSearchParams(location.search);
//         const queryObj = {};
//         for (const [key, value] of searchParams.entries()) {
//             queryObj[key] = value;
//         }
//         return queryObj;
//     }, [location.search]);
// }

// export default function StatusUpdate() {
//     const navigate = useNavigate();
//     const queryData = useQueryObject();
//     const userData = useSelector((state) => state.user);
//     const {encrypt,decrypt} = useCrypto();

//     // State management
//     const [nextProcess, setNextProcess] = useState(queryData.next_process || '');
//     const [selectedVendor, setSelectedVendor] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const [comment, setComment] = useState('');
//     const [finalProcessSteps, setFinalProcessSteps] = useState([]);
//     const [allVendors, setAllVendors] = useState([]);
//     const [webhook, setWebhook] = useState('');

//     // Computed values
//     const tableName = queryData.tableName;
//     const currentProcess = queryData.current_process || '';
//     const owner_id = userData?.owner_id ?? userData?.id;

//     // Memoized filtered vendors based on selected process
//     const filteredVendors = useMemo(() => {
//         if (!nextProcess || allVendors.length === 0) return [];

//         return allVendors.filter(vendor => {
//             if (vendor.name === "In House") return true;
            
//             const vendorProcessName = vendor.process_name?.toLowerCase() || '';
//             const selectedProcessName = nextProcess.toLowerCase();
            
//             return vendorProcessName === selectedProcessName;
//         });
//     }, [nextProcess, allVendors]);

//     // API Service Functions
//     const fetchAllData = useCallback(async (tableName) => {
//         const { data } = await axios.post(`${BASE_URL}/data/getAllData`, {
//             schemaName: userData.schema_name,
//             tableName,
//             userId: userData.id,
//             userEmail: userData.email
//         });
//         return data.data || [];
//     }, [userData.schema_name, userData.id, userData.email]);

//     const fetchSetupData = useCallback(async () => {
//         const { data } = await axios.get(
//             `${BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`
//         );
//         return data;
//     }, [owner_id, tableName]);

//     const fetchRecordByTarget = useCallback(async () => {
//         const { data } = await axios.post(`${BASE_URL}/data/getRecordByTarget`, {
//             schemaName: queryData.schemaName,
//             tableName: queryData.tableName,
//             targetColumn: queryData.targetColumn || 'id',
//             targetValue: queryData.recordId
//         });
//         return data;
//     }, [queryData.schemaName, queryData.tableName, queryData.targetColumn, queryData.recordId]);

//     // Fetch all required data in parallel
//     useEffect(() => {
//         if (!userData.id || !tableName) return;

//         const controller = new AbortController();

//         const initializeData = async () => {
//             try {
//                 // Parallel API calls for better performance
//                 const [setupData, vendorsData, recordData] = await Promise.allSettled([
//                     fetchSetupData(),
//                     fetchAllData("vendor"),
//                     fetchRecordByTarget()
//                 ]);

//                 // Handle setup data
//                 if (setupData.status === 'fulfilled') {
//                     const setup = setupData.value;
//                     const steps = setup.setup?.process_steps || [];
//                     setWebhook(setup.setup?.webhook || '');

//                     const currentIdx = steps.indexOf(currentProcess);
//                     const record = recordData.status === 'fulfilled' ? recordData.value : {};

//                     // Role-based filtering logic
//                     if (userData.owner_id === null) {
//                         // If owner_id is null, show all process steps greater than current step
//                         const availableSteps = [];
//                         for (let i = currentIdx + 1; i < steps.length; i++) {
//                             const step = steps[i];
//                             if (record[step] !== "Not Required") {
//                                 availableSteps.push(step);
//                             }
//                         }
//                         setFinalProcessSteps(availableSteps);
//                     } else {
//                         // If owner_id is not null, apply role-based filtering (show only next valid process)
//                         let nextValidProcess = null;
//                         for (let i = currentIdx + 1; i < steps.length; i++) {
//                             const step = steps[i];
//                             if (record[step] !== "Not Required") {
//                                 nextValidProcess = step;
//                                 break;
//                             }
//                         }
//                         setFinalProcessSteps(nextValidProcess ? [nextValidProcess] : []);
//                     }
//                 } else {
//                     toast.error("Failed to load process steps");
//                 }

//                 // Handle vendors data
//                 if (vendorsData.status === 'fulfilled') {
//                     const vendors = vendorsData.value;
//                     setAllVendors([IN_HOUSE_VENDOR, ...vendors]);
//                 } else {
//                     toast.error("Failed to load vendors");
//                 }

//             } catch (error) {
//                 console.error('Initialization error:', error);
//                 toast.error("Failed to load data");
//             }
//         };

//         initializeData();

//         return () => controller.abort();
//     }, [
//         userData.id,
//         userData.owner_id,
//         tableName,
//         currentProcess,
//         fetchSetupData,
//         fetchAllData,
//         fetchRecordByTarget
//     ]);

//     // Event Handlers with useCallback
//     const handleInputChange = useCallback((e) => {
//         setComment(e.target.value);
//         if (error) setError("");
//     }, [error]);

//     const handleNextProcessChange = useCallback((e) => {
//         setNextProcess(e.target.value);
//         setSelectedVendor(''); // Reset vendor when process changes
//         if (error) setError("");
//     }, [error]);

//     const handleVendorChange = useCallback((e) => {
//         setSelectedVendor(e.target.value);
//     }, []);

//     const handleKeyDown = useCallback((e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSubmit();
//         }
//     }, [nextProcess, selectedVendor, comment]); // Dependencies needed for handleSubmit

//     const handleSubmit = useCallback(async () => {
//         if (!nextProcess) {
//             setError("Please select a process");
//             return;
//         }

//         if (!queryData.schemaName || !queryData.tableName || !queryData.recordId) {
//             setError("Missing required query parameters");
//             return;
//         }

//         try {
//             setIsSubmitting(true);
//             setError("");

//             const columnToUpdate = queryData.columnName || queryData.column || 'status';
//             // const webhookId = webhook ? webhook.split('/').pop() : null;
//             const webhookId = encrypt(webhook);

//             // Build update parameters
//             const params = new URLSearchParams({
//                 schemaName: queryData.schemaName.toLowerCase(),
//                 tableName: queryData.tableName.toLowerCase(),
//                 recordId: queryData.recordId,
//                 col1: columnToUpdate.toLowerCase(),
//                 val1: nextProcess.toLowerCase(),
//                 col2: `${currentProcess.toLowerCase()}_date`,
//                 val2: new Date().toISOString(),
//             });

//             // Add current process vendor and comment
//             params.append('col3', `${nextProcess.toLowerCase()}_vendor`);
//             params.append('val3', selectedVendor || '');
//             params.append('col4', `${nextProcess.toLowerCase()}_comment`);
//             params.append('val4', comment || '');

//             // Add webhook if available
//             if (webhookId) {
//                 params.append('wid', webhookId);
//             }

//             const updateUrl = `${BASE_URL}/data/updateMultiple?${params.toString()}`;

//             await axios.get(updateUrl);

//             setSubmitted(true);
//             toast.success("Status updated successfully!");

//         } catch (err) {
//             console.error('Submit Error:', err);
//             setError("Failed to submit. Please try again.");
//             toast.error("Failed to update status");
//         } finally {
//             setIsSubmitting(false);
//         }
//     }, [
//         nextProcess,
//         selectedVendor,
//         comment,
//         webhook,
//         currentProcess,
//         queryData.schemaName,
//         queryData.tableName,
//         queryData.recordId,
//         queryData.columnName,
//         queryData.column
//     ]);

//     // Success screen with auto-redirect
//     useEffect(() => {
//         if (submitted) {
//             const timer = setTimeout(() => navigate(-1), 2000);
//             return () => clearTimeout(timer);
//         }
//     }, [submitted, navigate]);

//     // Render success state
//     if (submitted) {
//         return (
//             <div className="status-update-container">
//                 <img
//                     src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                     alt="logo"
//                     className="logo"
//                 />
//                 <div className="success-container">
//                     <div className="success-icon">✓</div>
//                     <h2 className="success-heading">Success!</h2>
//                     <p className="success-message">
//                         Your status has been updated successfully.
//                     </p>
//                     <p className="redirect-message">Redirecting back...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Main form render
//     return (
//         <div className="status-update-container">
//             <img
//                 src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                 alt="logo"
//                 className="logo"
//             />

//             <div className=" mb-4">
//                 <p className="subheading">Select the next process</p>
//             </div>

           
            
//             <div className="form">
//                    <FormViewer/>
//                 <div className="input-group">
//                     {/* Next Process Dropdown */}
//                     <Label htmlFor="next-process" className="input-label">
//                         Next Process
//                     </Label>
//                     <div className="select-wrapper">
//                         <select
//                             id="next-process"
//                             value={nextProcess}
//                             onChange={handleNextProcessChange}
//                             onKeyDown={handleKeyDown}
//                             className={`select ${error && !nextProcess ? 'select-error' : ''}`}
//                             disabled={isSubmitting}
//                         >
//                             <option value="" disabled className="placeholder-option">
//                                 -- Select Next Process --
//                             </option>
//                             {finalProcessSteps.map((step) => (
//                                 <option key={step} value={step} className="option">
//                                     {step.charAt(0).toUpperCase() + step.slice(1).replace(/_/g, ' ')}
//                                 </option>
//                             ))}
//                         </select>
//                         <SelectArrow />
//                     </div>

//                     {/* Vendor Dropdown - Conditionally rendered */}
//                     {nextProcess && filteredVendors.length > 0 && (
//                         <>
//                             <Label htmlFor="vendor" className="input-label" style={{ marginTop: '16px' }}>
//                                 Select Vendor
//                             </Label>
//                             <div className="select-wrapper">
//                                 <select
//                                     id="vendor"
//                                     value={selectedVendor}
//                                     onChange={handleVendorChange}
//                                     onKeyDown={handleKeyDown}
//                                     className="select"
//                                     disabled={isSubmitting}
//                                 >
//                                     <option value="" className="placeholder-option">
//                                         -- Select Vendor --
//                                     </option>
//                                     {filteredVendors.map((vendor) => (
//                                         <option
//                                             key={vendor.id}
//                                             value={vendor.name || vendor.vendor_name || vendor.id}
//                                             className="option"
//                                         >
//                                             {vendor.name || vendor.vendor_name || `Vendor ${vendor.id}`}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <SelectArrow />
//                             </div>
//                         </>
//                     )}

//                     {/* No vendors warning */}
//                     {nextProcess && filteredVendors.length === 0 && allVendors.length > 0 && (
//                         <div className="warning-message">
//                             No vendors available for the selected process "{nextProcess}"
//                         </div>
//                     )}

//                     {/* Comment Textarea */}
//                     <Label htmlFor="comment" className="input-label" style={{ marginTop: '16px' }}>
//                         Comment (Optional)
//                     </Label>
//                     <div style={styles.textareaContainer}>
//                         <textarea
//                             id="comment"
//                             value={comment}
//                             onChange={handleInputChange}
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

//                     {/* Error Message */}
//                     {error && <div className="error-message">{error}</div>}
//                 </div>

              

//                 {/* Submit Button */}
//                 <button
//                     onClick={handleSubmit}
//                     className={`submit-button ${nextProcess ? 'active' : ''} ${isSubmitting ? 'disabled' : ''}`}
//                     disabled={isSubmitting || !nextProcess}
//                 >
//                     <div className="button-content">
//                         {isSubmitting ? (
//                             <>
//                                 <div className="spinner"></div>
//                                 Submitting...
//                             </>
//                         ) : (
//                             <>
//                                 <Send size={16} />
//                                 Update Status
//                             </>
//                         )}
//                     </div>
//                 </button>
//             </div>
//         </div>
//     );
// }

// // Extracted component to reduce inline JSX
// const SelectArrow = () => (
//     <div className="select-arrow">
//         <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//             <path
//                 d="M1 1.5L6 6.5L11 1.5"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//             />
//         </svg>
//     </div>
// );

// // Styles
// const styles = {
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
// };



import { useEffect, useState, useCallback, useMemo } from 'react';
import { Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import '../../css/pages/StatusUpdate.css';
import useCrypto from '../Setup/hooks/useCrypto';
import FormViewer from '../FormBuilder/FormViewer';

// Constants
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const IN_HOUSE_VENDOR = { id: Date.now(), name: "In House" };

// Custom hook for query parameters
function useQueryObject() {
    const location = useLocation();
    return useMemo(() => {
        const searchParams = new URLSearchParams(location.search);
        const queryObj = {};
        for (const [key, value] of searchParams.entries()) {
            queryObj[key] = value;
        }
        return queryObj;
    }, [location.search]);
}

export default function StatusUpdate() {
    const navigate = useNavigate();
    const queryData = useQueryObject();
    const userData = useSelector((state) => state.user);
    const { encrypt, decrypt } = useCrypto();

    // State management
    const [nextProcess, setNextProcess] = useState(queryData.next_process || '');
    const [selectedVendor, setSelectedVendor] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [finalProcessSteps, setFinalProcessSteps] = useState([]);
    const [allVendors, setAllVendors] = useState([]);
    const [webhook, setWebhook] = useState('');
    const [formId, setFormId] = useState(null); // ✅ Fix 1: declared missing state
    const [formSubmit, setFormSubmit] = useState(false);

    // Computed values
    const tableName = queryData.tableName;
    const currentProcess = queryData.current_process || '';
    const owner_id = userData?.owner_id ?? userData?.id;

    // Memoized filtered vendors based on selected process
    const filteredVendors = useMemo(() => {
        if (!nextProcess || allVendors.length === 0) return [];

        return allVendors.filter(vendor => {
            if (vendor.name === "In House") return true;

            const vendorProcessName = vendor.process_name?.toLowerCase() || '';
            const selectedProcessName = nextProcess.toLowerCase();

            return vendorProcessName === selectedProcessName;
        });
    }, [nextProcess, allVendors]);

    // API Service Functions
    const fetchAllData = useCallback(async (tableName) => {
        const { data } = await axios.post(`${BASE_URL}/data/getAllData`, {
            schemaName: userData.schema_name,
            tableName,
            userId: userData.id,
            userEmail: userData.email
        });
        return data.data || [];
    }, [userData.schema_name, userData.id, userData.email]);

    const fetchSetupData = useCallback(async () => {
        const { data } = await axios.get(
            `${BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`
        );
        return data;
    }, [owner_id, tableName]);

    const fetchRecordByTarget = useCallback(async () => {
        const { data } = await axios.post(`${BASE_URL}/data/getRecordByTarget`, {
            schemaName: queryData.schemaName,
            tableName: queryData.tableName,
            targetColumn: queryData.targetColumn || 'id',
            targetValue: queryData.recordId
        });
        return data;
    }, [queryData.schemaName, queryData.tableName, queryData.targetColumn, queryData.recordId]);

    // Fetch all required data in parallel
    useEffect(() => {
        if (!userData.id || !tableName) return;

        const controller = new AbortController();

        const initializeData = async () => {
            try {
                // Parallel API calls for better performance
                const [setupData, vendorsData, recordData] = await Promise.allSettled([
                    fetchSetupData(),
                    fetchAllData("vendor"),
                    fetchRecordByTarget()
                ]);

                // Handle setup data
                if (setupData.status === 'fulfilled') {
                    const setup = setupData.value;
                    const steps = setup.setup?.process_steps || [];
                    setWebhook(setup.setup?.webhook || '');

                    const currentIdx = steps.indexOf(currentProcess);
                    const record = recordData.status === 'fulfilled' ? recordData.value : {};

                    // ✅ Fix 2: Extract form_ id from first next step if it starts with form_
                    const firstStep = steps[currentIdx + 1];
                    if (firstStep?.startsWith('form_')) {
                        setFormId(firstStep);
                    } else {
                        setFormId(null);
                    }

                    // Role-based filtering logic
                    if (userData.owner_id === null) {
                        // If owner_id is null, show all process steps greater than current step
                        const availableSteps = [];
                        for (let i = currentIdx + 1; i < steps.length; i++) {
                            const step = steps[i];
                            // ✅ Fix 3: actually filter form_ steps in the loop
                            if (!step.startsWith('form_') && record[step] !== "Not Required") {
                                availableSteps.push(step);
                            }
                        }
                        setFinalProcessSteps(availableSteps);
                    } else {
                        // If owner_id is not null, apply role-based filtering (show only next valid process)
                        let nextValidProcess = null;
                        for (let i = currentIdx + 1; i < steps.length; i++) {
                            const step = steps[i];
                            // ✅ Fix 3: actually filter form_ steps in the loop
                            if (!step.startsWith('form_') && record[step] !== "Not Required") {
                                nextValidProcess = step;
                                break;
                            }
                        }
                        setFinalProcessSteps(nextValidProcess ? [nextValidProcess] : []);
                    }
                } else {
                    toast.error("Failed to load process steps");
                }

                // Handle vendors data
                if (vendorsData.status === 'fulfilled') {
                    const vendors = vendorsData.value;
                    setAllVendors([IN_HOUSE_VENDOR, ...vendors]);
                } else {
                    toast.error("Failed to load vendors");
                }

            } catch (error) {
                console.error('Initialization error:', error);
                toast.error("Failed to load data");
            }
        };

        initializeData();

        return () => controller.abort();
    }, [
        userData.id,
        userData.owner_id,
        tableName,
        currentProcess,
        fetchSetupData,
        fetchAllData,
        fetchRecordByTarget
    ]);

    // Event Handlers with useCallback
    const handleInputChange = useCallback((e) => {
        setComment(e.target.value);
        if (error) setError("");
    }, [error]);

    const handleNextProcessChange = useCallback((e) => {
        setNextProcess(e.target.value);
        setSelectedVendor(''); // Reset vendor when process changes
        if (error) setError("");
    }, [error]);

    const handleVendorChange = useCallback((e) => {
        setSelectedVendor(e.target.value);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }, [nextProcess, selectedVendor, comment]); // Dependencies needed for handleSubmit

    const handleSubmit = useCallback(async () => {
        if (!nextProcess) {
            setError("Please select a process");
            return;
        }

        if (!queryData.schemaName || !queryData.tableName || !queryData.recordId) {
            setError("Missing required query parameters");
            return;
        }

        try {
            setIsSubmitting(true);
            setFormSubmit(true);
            setError("");

            const columnToUpdate = queryData.columnName || queryData.column || 'status';
            const webhookId = encrypt(webhook);

            // Build update parameters
            const params = new URLSearchParams({
                schemaName: queryData.schemaName.toLowerCase(),
                tableName: queryData.tableName.toLowerCase(),
                recordId: queryData.recordId,
                col1: columnToUpdate.toLowerCase(),
                val1: nextProcess.toLowerCase(),
                col2: `${currentProcess.toLowerCase()}_date`,
                val2: new Date().toISOString(),
            });

            // Add current process vendor and comment
            params.append('col3', `${nextProcess.toLowerCase()}_vendor`);
            params.append('val3', selectedVendor || '');
            params.append('col4', `${nextProcess.toLowerCase()}_comment`);
            params.append('val4', comment || '');

            // Add webhook if available
            if (webhookId) {
                params.append('wid', webhookId);
            }

            const updateUrl = `${BASE_URL}/data/updateMultiple?${params.toString()}`;

            await axios.get(updateUrl);

            setSubmitted(true);
           
            toast.success("Status updated successfully!");

        } catch (err) {
            console.error('Submit Error:', err);
            setFormSubmit(false);
            setError("Failed to submit. Please try again.");
            toast.error("Failed to update status");
        } finally {
            setIsSubmitting(false);
        }
    }, [
        nextProcess,
        selectedVendor,
        comment,
        webhook,
        currentProcess,
        queryData.schemaName,
        queryData.tableName,
        queryData.recordId,
        queryData.columnName,
        queryData.column
    ]);

    // Success screen with auto-redirect
    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => navigate(-1), 2000);
            return () => clearTimeout(timer);
        }
    }, [submitted, navigate]);

    // Render success state
    if (submitted) {
        return (
            <div className="status-update-container">
                <img
                    src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                    alt="logo"
                    className="logo"
                />
                <div className="success-container">
                    <div className="success-icon">✓</div>
                    <h2 className="success-heading">Success!</h2>
                    <p className="success-message">
                        Your status has been updated successfully.
                    </p>
                    <p className="redirect-message">Redirecting back...</p>
                </div>
            </div>
        );
    }

    // Main form render
    return (
        <div className="status-update-container">
            <img
                src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                alt="logo"
                className="logo"
            />

            <div className="mb-4">
                <p className="subheading">Select the next process</p>
            </div>

            <div className="form">
                {/* ✅ Fix 4: Pass formId as prop_form_id, only render if formId exists */}
                {formId && <FormViewer prop_form_id={formId} submit={formSubmit}/>}

                <div className="input-group">
                    {/* Next Process Dropdown */}
                    <Label htmlFor="next-process" className="input-label">
                        Next Process
                    </Label>
                    <div className="select-wrapper">
                        <select
                            id="next-process"
                            value={nextProcess}
                            onChange={handleNextProcessChange}
                            onKeyDown={handleKeyDown}
                            className={`select ${error && !nextProcess ? 'select-error' : ''}`}
                            disabled={isSubmitting}
                        >
                            <option value="" disabled className="placeholder-option">
                                -- Select Next Process --
                            </option>
                            {finalProcessSteps.map((step) => (
                                <option key={step} value={step} className="option">
                                    {step.charAt(0).toUpperCase() + step.slice(1).replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                        <SelectArrow />
                    </div>

                    {/* Vendor Dropdown - Conditionally rendered */}
                    {nextProcess && filteredVendors.length > 0 && (
                        <>
                            <Label htmlFor="vendor" className="input-label" style={{ marginTop: '16px' }}>
                                Select Vendor
                            </Label>
                            <div className="select-wrapper">
                                <select
                                    id="vendor"
                                    value={selectedVendor}
                                    onChange={handleVendorChange}
                                    onKeyDown={handleKeyDown}
                                    className="select"
                                    disabled={isSubmitting}
                                >
                                    <option value="" className="placeholder-option">
                                        -- Select Vendor --
                                    </option>
                                    {filteredVendors.map((vendor) => (
                                        <option
                                            key={vendor.id}
                                            value={vendor.name || vendor.vendor_name || vendor.id}
                                            className="option"
                                        >
                                            {vendor.name || vendor.vendor_name || `Vendor ${vendor.id}`}
                                        </option>
                                    ))}
                                </select>
                                <SelectArrow />
                            </div>
                        </>
                    )}

                    {/* No vendors warning */}
                    {nextProcess && filteredVendors.length === 0 && allVendors.length > 0 && (
                        <div className="warning-message">
                            No vendors available for the selected process "{nextProcess}"
                        </div>
                    )}

                    {/* Comment Textarea */}
                    <Label htmlFor="comment" className="input-label" style={{ marginTop: '16px' }}>
                        Comment (Optional)
                    </Label>
                    <div style={styles.textareaContainer}>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={handleInputChange}
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

                    {/* Error Message */}
                    {error && <div className="error-message">{error}</div>}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className={`submit-button ${nextProcess ? 'active' : ''} ${isSubmitting ? 'disabled' : ''}`}
                    disabled={isSubmitting || !nextProcess}
                >
                    <div className="button-content">
                        {isSubmitting ? (
                            <>
                                <div className="spinner"></div>
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Update Status
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
}

// Extracted component to reduce inline JSX
const SelectArrow = () => (
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
);

// Styles
const styles = {
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
};