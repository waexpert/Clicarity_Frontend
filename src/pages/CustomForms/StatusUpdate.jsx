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
    const [error, setError] = useState('');
    const queryData = useQueryObject();
    
    const user = useSelector((state) => state.user);
    const tableName = queryData.tableName;
    const [processSteps, setProcessSteps] = useState([]);
    const currentProcess = queryData.current_process || '';
    const [finalProcessSteps, setFinalProcessSteps] = useState(processSteps.filter(step => step !== queryData.current_process));

// Fetch process steps
useEffect(() => {
    const fetchData = async () => {
        try {
            const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
            console.log('user.id:', user.id, 'tableName:', tableName);
            const { data } = await axios.get(route);
            console.log('Setup Data:', data);
            const steps = data.setup.process_steps || [];
            setProcessSteps(steps);
            
            const getRecordRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordByTarget`;
            const recordResponse = await axios.post(getRecordRoute, {
                schemaName: queryData.schemaName,
                tableName: queryData.tableName,
                targetColumn: queryData.targetColumn || 'id',
                targetValue: queryData.recordId
            });

            const recordData = recordResponse.data;
            
            // Filter out current process and steps marked as "Not Required"
            const filteredSteps = steps.filter(step => 
                step !== queryData.current_process && 
                recordData[step] !== "Not Required"
            );
            
            console.log('Filtered steps:', filteredSteps);
            setFinalProcessSteps(filteredSteps);
            
        } catch (error) {
            console.error('Error fetching process steps:', error);
            toast.error("Failed to load process steps");
        }
    };

    if (user.id && tableName) {
        fetchData();
    }
}, [user.id, tableName, queryData.schemaName, queryData.tableName, queryData.recordId, queryData.current_process]);

    // Set next process from URL if provided
    useEffect(() => {
        if (queryData.next_process && nextProcess === '') {
            setNextProcess(queryData.next_process);
        }
    }, [queryData.next_process]);

    const handleSubmit = async () => {
        if (!nextProcess) {
            setError("Please select a process");
            return;
        }

        if (!queryData.schemaName || !queryData.tableName || !queryData.recordId) {
            setError("Missing required query parameters");
            return;
        }

        // Check if column name is provided in query params
        const columnToUpdate = queryData.columnName || queryData.column || 'status';

        try {
            setIsSubmitting(true);
            setError("");

            // Build the update URL
            const updateUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple?` +
                `schemaName=${queryData.schemaName.toLowerCase()}` +
                `&tableName=${queryData.tableName.toLowerCase()}` +
                `&recordId=${queryData.recordId}` +
                `&col1=${columnToUpdate.toLowerCase()}` +
                `&val1=${nextProcess.toLowerCase()}`+
                `&col2=${currentProcess.toLowerCase()}_date`+
                `&val2=${new Date().toISOString()}`; 

            console.log('Update URL:', updateUrl);

            const response = await axios.get(updateUrl);
            
            console.log('Update Response:', response.data);

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
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    if (submitted) {
        setTimeout(() => navigate(-1), 2000); // Navigate back after 2 seconds
        
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
                {/* <h2 className="heading">Status Update</h2> */}
                <p className="subheading">
                    Select the next process
                </p>
            </div>

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
        </div>
    );
}