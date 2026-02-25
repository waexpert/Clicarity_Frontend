import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const SelectForm = ({setFormId,setFormSchema}) => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState([]);
    const userData = useSelector((state) => state.user);
    const schemaName = userData.schema_name;
    const [currentForm, setCurrentForm] = useState('');

    useEffect(() => {
        const loadForms = async () => {
            try {
                setLoading(true);
                setError('');

                if (!userData || !schemaName) {
                    throw new Error('User schema not found. Please log in again.');
                }

                const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordByTargetAll`;

                const response = await axios.post(apiUrl, {
                    schemaName: "public",
                    tableName: 'form_setup',
                    targetColumn: 'schema_name',
                    targetValue: schemaName
                });

                const data = response.data;
                const formsArray = Array.isArray(data) ? data : [];
                setFormData(formsArray);

            } catch (err) {
                let errorMessage = 'Failed to load forms. ';
                if (err.response) {
                    errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
                } else if (err.request) {
                    errorMessage += 'Please check if the server is running.';
                } else {
                    errorMessage += err.message;
                }
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (userData?.schema_name) {
            loadForms();
        }
    }, [userData]);

const handleFormSelect = (e) => {
    const selectedName = e.target.value;
    setCurrentForm(selectedName);
    
    const selectedForm = formData.find(form => form.name === selectedName);
    if (selectedForm) {
        setFormSchema(selectedForm);
        setFormId(selectedForm.us_id);
    }
};
    return (
        <div style={styles.wrapper}>
            {/* Dropdown label */}
            {/* <label htmlFor="form-select" style={styles.label}>
                Select Form
            </label> */}

            {/* Select container */}
            <div style={styles.selectContainer}>
                <select
                    id="form-select"
                    value={currentForm}
                    onChange={handleFormSelect}
                    disabled={loading}
                    style={{
                        ...styles.select,
                        ...(error && !currentForm ? styles.selectError : {}),
                        ...(loading ? styles.selectDisabled : {}),
                    }}
                >
                    <option value="" disabled>
                        {loading ? 'Loading forms...' : 'Select Form'}
                    </option>
                    {formData
                        .filter(form => form?.name)
                        .map((form) => {
                            const title = form.name;
                            return (
                                <option key={title} value={title}>
                                    {title.charAt(0).toUpperCase() + title.slice(1).replace(/_/g, ' ')}
                                </option>
                            );
                        })}
                </select>

                {/* Chevron icon */}
                <div style={styles.chevron} pointerEvents="none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path
                            d="M1 1.5L6 6.5L11 1.5"
                            stroke="#555"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p style={styles.errorText}>{error}</p>
            )}
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#374151',
        marginBottom: '2px',
    },
    selectContainer: {
        position: 'relative',
        width: '100%',
    },
    select: {
        width: '100%',
        padding: '13px 36px 13px 12px',
        fontSize: '14px',
        color: '#374151',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        cursor: 'pointer',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        lineHeight: '1.5',
    },
    selectError: {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },
    selectDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    chevron: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
    },
    errorText: {
        fontSize: '12px',
        color: '#ef4444',
        marginTop: '2px',
    },
};

export default SelectForm;