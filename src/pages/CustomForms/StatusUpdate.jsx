import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import '../../css/pages/StatusUpdate.css';

function useQueryObject() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const queryObj = {};

    for (const [key, value] of searchParams.entries()) {
        queryObj[key] = value;
    }

    return queryObj;
}

export default function StatusUpdate() {
    const navigate = useNavigate();
    const [nextProcess, setNextProcess] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const queryData = useQueryObject();

    const user = useSelector((state) => state.user);
    const tableName = queryData.tableName;
    const [processSteps, setProcessSteps] = useState([]);
    const currentProcess = queryData.current_process || '';
    const [webhook, setWebhook] = useState('');
    const [comment, setComment] = useState('');
    const [finalProcessSteps, setFinalProcessSteps] = useState([]);

    const handleInputChange = (e) => {
        setComment(e.target.value);
        if (error) setError("");
    };

    // Fetch process steps
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
                
                const { data } = await axios.get(route);
                const steps = data.setup.process_steps || [];
                setProcessSteps(steps);
                setWebhook(data.setup.webhook || '');

                const currentIdx = steps.indexOf(currentProcess);

                const getRecordRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordByTarget`;
                const recordResponse = await axios.post(getRecordRoute, {
                    schemaName: queryData.schemaName,
                    tableName: queryData.tableName,
                    targetColumn: queryData.targetColumn || 'id',
                    targetValue: queryData.recordId
                });

                const recordData = recordResponse.data;

                const filteredSteps = steps.filter((step, index) =>
                    index > currentIdx &&
                    recordData[step] !== "Not Required"
                );

                setFinalProcessSteps(filteredSteps);

            } catch (error) {
                console.error('Error fetching process steps:', error);
                toast.error("Failed to load process steps");
            } finally {
                setIsLoading(false);
            }
        };

        if (user.id && tableName) {
            fetchData();
        }
    }, [user.id, tableName, queryData.schemaName, queryData.tableName, queryData.recordId, currentProcess]);

    // Set next process from URL if provided
    useEffect(() => {
        if (queryData.next_process && nextProcess === '') {
            setNextProcess(queryData.next_process);
        }
    }, [queryData.next_process, nextProcess]);

    // Cleanup redirect timeout on unmount
    useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                navigate(-1);
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [submitted, navigate]);

    const handleSubmit = async () => {
        if (!nextProcess) {
            setError("Please select a process");
            return;
        }

        if (!queryData.schemaName || !queryData.tableName || !queryData.recordId) {
            setError("Missing required query parameters");
            return;
        }

        const columnToUpdate = queryData.columnName || queryData.column || 'status';

        try {
            setIsSubmitting(true);
            setError("");
            const webhookElements = webhook ? webhook.split('/') : [];
            const wid = webhook ? webhookElements[webhookElements.length - 1] : null;

            const updateUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple?` +
                `schemaName=${queryData.schemaName.toLowerCase()}` +
                `&tableName=${queryData.tableName.toLowerCase()}` +
                `&recordId=${queryData.recordId}` +
                `&col1=${columnToUpdate.toLowerCase()}` +
                `&val1=${nextProcess.toLowerCase()}` +
                `&col2=${currentProcess.toLowerCase()}_date` +
                `&val2=${new Date().toISOString()}` +
                (wid ? `&wid=${wid}` : '') +
                `&col3=${currentProcess}_comment` +
                `&val3=${encodeURIComponent(comment)}`;

            await axios.get(updateUrl);

            setSubmitted(true);
            toast.success("Status updated successfully!");

        } catch (err) {
            console.error('Submit Error:', err);
            setError("Failed to submit. Please try again.");
            toast.error("Failed to update status");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextProcessChange = (e) => {
        setNextProcess(e.target.value);
        if (error) setError("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

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
                    <p className="redirect-message">
                        Redirecting back...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="status-update-container">
            <img
                src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
                alt="logo"
                className="logo"
            />

            <div className="header-section">
                <p className="subheading">
                    Select the next process
                </p>
            </div>

            {isLoading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading process steps...</p>
                </div>
            ) : (
                <div className="form">
                    <div className="input-group">
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

                        <div style={styles.textareaContainer}>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
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
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                    </div>

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
            )}
        </div>
    );
}

const styles = {
    textareaContainer: {
        position: 'relative',
        width: '100%',
        marginTop: '16px',
    },
    textarea: {
        width: '100%',
        padding: '16px',
        paddingRight: '120px', // Space for character count
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
        bottom: '12px',
        right: '16px',
        fontSize: '12px',
        color: '#a0aec0',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '4px 8px',
        borderRadius: '4px',
        pointerEvents: 'none',
        userSelect: 'none',
    },
};












// Vendor Enabled form

// import { useEffect, useState } from 'react';
// import { Send } from 'lucide-react';
// import { Label } from '@/components/ui/label';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useSelector } from 'react-redux';
// import '../../css/pages/StatusUpdate.css';

// function useQueryObject() {
//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const queryObj = {};

//     for (const [key, value] of searchParams.entries()) {
//         queryObj[key] = value;
//     }

//     return queryObj;
// }

// export default function StatusUpdate() {
//     const navigate = useNavigate();
//     const [nextProcess, setNextProcess] = useState('');
//     const [selectedVendor, setSelectedVendor] = useState('');
//     const [submitted, setSubmitted] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState('');
//     const queryData = useQueryObject();

//     const user = useSelector((state) => state.user);
//     const tableName = queryData.tableName;
//     const [processSteps, setProcessSteps] = useState([]);
//     const currentProcess = queryData.current_process || '';
//     const [webhook, setWebhook] = useState('');
//     const [comment, setComment] = useState('');
//     const [finalProcessSteps, setFinalProcessSteps] = useState([]);
    
//     // New state for vendors
//     const [allVendors, setAllVendors] = useState([]);
//     const [filteredVendors, setFilteredVendors] = useState([]);

//     const handleInputChange = (e) => {
//         setComment(e.target.value);
//         if (error) setError("");
//     };

//     // Fetch all vendors
//     const fetchVendors = async () => {
//         try {
//             const apiParams = {
//                 schemaName: user.schema_name,
//                 tableName: "vendors"
//             };
            
//             const response = await axios.post(
//                 `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`,
//                 apiParams
//             );
            
//             const vendors = response.data.data || [];
//             console.log('Fetched vendors:', vendors);
//             setAllVendors(vendors);
//         } catch (error) {
//             console.error('Error fetching vendors:', error);
//             toast.error("Failed to load vendors");
//         }
//     };

//     // Filter vendors based on selected process - NEW LOGIC
//     useEffect(() => {
//         if (nextProcess && allVendors.length > 0) {
//             // Filter vendors where process_name matches the selected process
//             const filtered = allVendors.filter(vendor => {
//                 const vendorProcessName = vendor.process_name?.toLowerCase() || '';
//                 const selectedProcessName = nextProcess.toLowerCase();
                
//                 console.log('Checking vendor:', vendor.name, 'Process:', vendorProcessName, 'vs', selectedProcessName);
                
//                 return vendorProcessName === selectedProcessName;
//             });
            
//             console.log('Selected process:', nextProcess);
//             console.log('Filtered vendors for process:', filtered);
            
//             setFilteredVendors(filtered);
//         } else {
//             setFilteredVendors([]);
//         }
        
//         // Reset selected vendor when process changes
//         setSelectedVendor('');
//     }, [nextProcess, allVendors]);

//     // Fetch process steps and vendors
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
//                 console.log('user.id:', user.id, 'tableName:', tableName);
//                 const { data } = await axios.get(route);
//                 console.log('Setup Data:', data);
//                 const steps = data.setup.process_steps || [];
//                 setProcessSteps(steps);
//                 setWebhook(data.setup.webhook || '');

//                 const currentIdx = steps.indexOf(queryData.current_process);
//                 console.log('Current process:', queryData.current_process);
//                 console.log('Current index:', currentIdx);

//                 const getRecordRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordByTarget`;
//                 const recordResponse = await axios.post(getRecordRoute, {
//                     schemaName: queryData.schemaName,
//                     tableName: queryData.tableName,
//                     targetColumn: queryData.targetColumn || 'id',
//                     targetValue: queryData.recordId
//                 });

//                 const recordData = recordResponse.data;

//                 const filteredSteps = steps.filter((step, index) =>
//                     index > currentIdx &&
//                     recordData[step] !== "Not Required"
//                 );

//                 console.log('Filtered steps:', filteredSteps);
//                 setFinalProcessSteps(filteredSteps);

//                 // Fetch vendors after process steps are loaded
//                 await fetchVendors();

//             } catch (error) {
//                 console.error('Error fetching process steps:', error);
//                 toast.error("Failed to load process steps");
//             }
//         };

//         if (user.id && tableName) {
//             fetchData();
//         }
//     }, [user.id, tableName, queryData.schemaName, queryData.tableName, queryData.recordId, queryData.current_process]);

//     // Set next process from URL if provided
//     useEffect(() => {
//         if (queryData.next_process && nextProcess === '') {
//             setNextProcess(queryData.next_process);
//         }
//     }, [queryData.next_process]);

//     const handleSubmit = async () => {
//         if (!nextProcess) {
//             setError("Please select a process");
//             return;
//         }

//         if (!queryData.schemaName || !queryData.tableName || !queryData.recordId) {
//             setError("Missing required query parameters");
//             return;
//         }

//         const columnToUpdate = queryData.columnName || queryData.column || 'status';

//         try {
//             setIsSubmitting(true);
//             setError("");
//             const webhookElements = webhook ? webhook.split('/') : [];
//             const wid = webhook ? webhookElements[webhookElements.length - 1] : null;
//             console.log('Webhook ID:', wid);

//             // Build the update URL with vendor if selected
//             let updateUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple?` +
//                 `schemaName=${queryData.schemaName.toLowerCase()}` +
//                 `&tableName=${queryData.tableName.toLowerCase()}` +
//                 `&recordId=${queryData.recordId}` +
//                 `&col1=${columnToUpdate.toLowerCase()}` +
//                 `&val1=${nextProcess.toLowerCase()}` +
//                 `&col2=${currentProcess.toLowerCase()}_date` +
//                 `&val2=${new Date().toISOString()}`+
//                 `&col3=${currentProcess.toLowerCase()}_vendor` +
//                 `&val3=` + (selectedVendor ? encodeURIComponent(selectedVendor) : '') +
//                 `&col4=${currentProcess.toLowerCase()}_comment` +
//                 `&val4=` + (comment ? encodeURIComponent(comment) : '');

//             // Add vendor if selected
//             if (selectedVendor) {
//                 updateUrl += `&col3=${nextProcess.toLowerCase()}_vendor&val3=${encodeURIComponent(selectedVendor)}`;
//             }

//             // Add comment if provided
//             if (comment) {
//                 const colIndex = selectedVendor ? 4 : 3;
//                 updateUrl += `&col${colIndex}=${nextProcess.toLowerCase()}_comment&val${colIndex}=${encodeURIComponent(comment)}`;
//             }

//             if (wid) {
//                 updateUrl += `&wid=${wid}`;
//             }

//             console.log('Update URL:', updateUrl);

//             const response = await axios.get(updateUrl);

//             console.log('Update Response:', response.data);

//             setSubmitted(true);
//             toast.success("Status updated successfully!");

//         } catch (err) {
//             console.error('Submit Error:', err);
//             setError("Failed to submit. Please try again.");
//             toast.error("Failed to update status");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleNextProcessChange = (e) => {
//         setNextProcess(e.target.value);
//         if (error) setError("");
//     };

//     const handleVendorChange = (e) => {
//         setSelectedVendor(e.target.value);
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter') {
//             e.preventDefault();
//             handleSubmit();
//         }
//     };

//     if (submitted) {
//         setTimeout(() => navigate(-1), 2000);

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
//                     <p className="redirect-message">
//                         Redirecting back...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="status-update-container">
//             <img
//                 src="https://clicarity.s3.eu-north-1.amazonaws.com/logo.png"
//                 alt="logo"
//                 className="logo"
//             />

//             <div className="header-section">
//                 <p className="subheading">
//                     Select the next process
//                 </p>
//             </div>

//             <div className="form">
//                 <div className="input-group">
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
//                         <div className="select-arrow">
//                             <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//                                 <path
//                                     d="M1 1.5L6 6.5L11 1.5"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                 />
//                             </svg>
//                         </div>
//                     </div>

//                     {/* Vendor Dropdown - Only shown when process is selected and vendors are available */}
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
//                                 <div className="select-arrow">
//                                     <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
//                                         <path
//                                             d="M1 1.5L6 6.5L11 1.5"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                     {/* Show message if process selected but no vendors available */}
//                     {nextProcess && filteredVendors.length === 0 && allVendors.length > 0 && (
//                         <div style={{ 
//                             marginTop: '16px', 
//                             padding: '12px', 
//                             backgroundColor: '#fff3cd', 
//                             border: '1px solid #ffc107',
//                             borderRadius: '8px',
//                             fontSize: '14px',
//                             color: '#856404'
//                         }}>
//                             No vendors available for the selected process "{nextProcess}"
//                         </div>
//                     )}

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

//                     {error && (
//                         <div className="error-message">
//                             {error}
//                         </div>
//                     )}
//                 </div>

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

// const styles = {
//   container: {
//     maxWidth: '500px',
//     margin: '50px auto',
//     padding: '32px',
//     border: '1px solid #e1e5e9',
//     borderRadius: '16px',
//     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
//     minHeight: '400px',
//   },
//   logo: {
//     width: '20rem',
//     height: 'auto',
//     marginBottom: '1.5rem',
//   },
//   headerSection: {
//     textAlign: 'center',
//     marginBottom: '32px',
//     width: '100%',
//   },
//   headerIcon: {
//     color: '#4388c1',
//     marginBottom: '12px',
//   },
//   heading: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#2d3748',
//     margin: '0 0 8px 0',
//     lineHeight: '1.3',
//   },
//   subheading: {
//     fontSize: '16px',
//     color: '#718096',
//     margin: 0,
//     lineHeight: '1.5',
//   },
//   form: {
//     display: 'flex',
//     flexDirection: 'column',
//     width: '100%',
//     gap: '24px',
//   },
//   inputGroup: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px',
//     width: '100%',
//   },
//   inputLabel: {
//     fontSize: '14px',
//     fontWeight: '600',
//     color: '#2d3748',
//     marginBottom: '4px',
//   },
//   textareaContainer: {
//     position: 'relative',
//     width: '100%',
//   },
//   textarea: {
//     width: '100%',
//     padding: '16px',
//     fontSize: '16px',
//     borderRadius: '12px',
//     border: '2px solid #e2e8f0',
//     transition: 'all 0.3s ease',
//     outline: 'none',
//     resize: 'vertical',
//     minHeight: '120px',
//     fontFamily: 'inherit',
//     lineHeight: '1.5',
//     backgroundColor: '#fafafa',
//     boxSizing: 'border-box',
//   },
//   textareaError: {
//     borderColor: '#e53e3e',
//     backgroundColor: '#fed7d7',
//   },
//   characterCount: {
//     position: 'absolute',
//     bottom: '8px',
//     right: '12px',
//     fontSize: '12px',
//     color: '#a0aec0',
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     padding: '2px 6px',
//     borderRadius: '4px',
//   },
//   errorMessage: {
//     fontSize: '14px',
//     color: '#e53e3e',
//     backgroundColor: '#fed7d7',
//     padding: '8px 12px',
//     borderRadius: '6px',
//     border: '1px solid #feb2b2',
//   },
//   button: {
//     padding: '16px 24px',
//     fontSize: '16px',
//     fontWeight: '600',
//     border: 'none',
//     borderRadius: '12px',
//     backgroundColor: '#a0aec0',
//     color: '#ffffff',
//     cursor: 'not-allowed',
//     transition: 'all 0.3s ease',
//     outline: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '56px',
//     transform: 'translateY(0)',
//   },
//   buttonActive: {
//     backgroundColor: '#4388c1',
//     cursor: 'pointer',
//     boxShadow: '0 4px 12px rgba(67, 136, 193, 0.3)',
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0aec0',
//     cursor: 'not-allowed',
//     transform: 'none',
//     boxShadow: 'none',
//   },
//   buttonContent: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//   },
//   spinner: {
//     width: '16px',
//     height: '16px',
//     border: '2px solid transparent',
//     borderTop: '2px solid #ffffff',
//     borderRadius: '50%',
//     animation: 'spin 1s linear infinite',
//   },
//   successContainer: {
//     textAlign: 'center',
//     padding: '40px 20px',
//     width: '100%',
//   },
//   successIcon: {
//     width: '64px',
//     height: '64px',
//     backgroundColor: '#48bb78',
//     color: 'white',
//     borderRadius: '50%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: '32px',
//     fontWeight: 'bold',
//     margin: '0 auto 24px',
//     animation: 'bounceIn 0.6s ease-out',
//   },
//   successHeading: {
//     fontSize: '24px',
//     fontWeight: '700',
//     color: '#2d3748',
//     margin: '0 0 12px 0',
//   },
//   successMessage: {
//     fontSize: '16px',
//     color: '#718096',
//     margin: '0 0 32px 0',
//     lineHeight: '1.5',
//   },
//   redirectMessage: {
//     fontSize: '14px',
//     color: '#a0aec0',
//     fontStyle: 'italic',
//   },
//   newCommentButton: {
//     padding: '12px 24px',
//     fontSize: '14px',
//     fontWeight: '600',
//     border: '2px solid #4388c1',
//     borderRadius: '8px',
//     backgroundColor: 'transparent',
//     color: '#4388c1',
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//   },
// };