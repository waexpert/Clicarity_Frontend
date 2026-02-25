import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const DEBOUNCE_DELAY = 250;
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const SearchBox = ({setRecordId,setUsId}) => {

    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestion, setSuggestion] = useState([]);
    const justSelectedSuggestion = useRef(false);
    const [error, setError] = useState(null);
    const [currentTable, setCurrentTable] = useState('');
    const [recordData, setRecordData] = useState(null);

    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const schemaName = userData?.schema_name || 'default_schema';
    const owner_id = userData?.owner_id ?? userData?.id;

    useEffect(() => {
        if (!searchId.trim()) {
            setSuggestion([]);
            setShowSuggestions(false);
            return;
        }

        if (justSelectedSuggestion.current) return;
        if (!showSuggestions) return;

        const controller = new AbortController();

        const timeout = setTimeout(async () => {
            try {
                const { data } = await axios.post(
                    `${BASE_URL}/additional/search`,
                    {
                        schemaName,
                        tableName: currentTable,
                        query: searchId,
                        userId: userData.id,
                        userEmail: userData.email
                    },
                    { signal: controller.signal }
                );

                const rows = data?.data || [];
                setSuggestion(rows);
                if (data.data?.table_name) {
                    setCurrentTable(data.data.table_name);
                }
                setShowSuggestions(rows.length > 0);
            } catch (err) {
                if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
                    console.error('Search error:', err);
                }
            }
        }, DEBOUNCE_DELAY);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [searchId, currentTable, schemaName, showSuggestions, userData.id, userData.email]);

    const fetchRecordByTarget = useCallback(async (targetColumn, targetValue) => {
        const { data } = await axios.post(`${BASE_URL}/data/getRecordByTarget`, {
            schemaName,
            tableName: currentTable,
            targetColumn,
            targetValue,
            userId: userData.id,
            userEmail: userData.email
        });
        return data;
    }, [schemaName, currentTable, userData.id, userData.email]);

    const fetchChildRecords = useCallback(async (targetValue) => {
        const { data } = await axios.post(`${BASE_URL}/data/getRecordByTargetAll`, {
            schemaName,
            tableName: currentTable,
            targetColumn: 'pa_id',
            targetValue,
            userId: userData.id,
            userEmail: userData.email
        });
        return Array.isArray(data) ? data : [data];
    }, [schemaName, currentTable, userData.id, userData.email]);

    const handleSuggestionInput = useCallback((e) => {
        justSelectedSuggestion.current = false;
        setSearchId(e.target.value);
        setUsId(e.target.value);
        setShowSuggestions(true);
        if (error) setError(null);
    }, [error]);

    const handleSearch = useCallback(async () => {
        if (!searchId.trim()) {
            setError('Please enter an ID');
            return;
        }

        setLoading(true);
        setError(null);
        setRecordData(null);

        try {
            const [parentData, childData] = await Promise.allSettled([
                fetchRecordByTarget('us_id', searchId),
                fetchChildRecords(searchId)
            ]);

            if (parentData.status === 'fulfilled') {
                const result = parentData.value;
                setRecordData(result);
                console.log(sea)
                setRecordId(searchId); // ✅ Set recordId when search finds a record
            } else {
                throw new Error('Failed to fetch parent record');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    }, [searchId, fetchRecordByTarget, fetchChildRecords]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') handleSearch();
    }, [handleSearch]);

    const handleSuggestionClick = useCallback((value, tableName) => {
        justSelectedSuggestion.current = true;
        setSearchId(value);
        setUsId(value);
        setCurrentTable(tableName);
        setSuggestion([]);
        setShowSuggestions(false);

    }, [setRecordId]);

    return (
        <div style={styles.wrapper}>
            {/* Input + Suggestions */}
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={searchId}
                    onChange={handleSuggestionInput}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter the ID"
                    aria-label="Search ID"
                    disabled={loading}
                    autoComplete="off"
                    style={{
                        ...styles.input,
                        ...(error ? styles.inputError : {}),
                        ...(loading ? styles.inputDisabled : {}),
                    }}
                    onFocus={e => {
                        e.target.style.borderColor = '#6b7280';
                        e.target.style.boxShadow = '0 0 0 3px rgba(107,114,128,0.15)';
                    }}
                    onBlur={e => {
                        e.target.style.borderColor = error ? '#ef4444' : '#d1d5db';
                        e.target.style.boxShadow = 'none';
                    }}
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestion.length > 0 && (
                    <ul style={styles.suggestionList}>
                        {suggestion.map((item, index) => (
                            <li
                                key={item.us_id || index}
                                style={styles.suggestionItem}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#ffffff'}
                                onClick={() => handleSuggestionClick(item.us_id, item.table_name)}
                            >
                                {item.us_id}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Error message */}
            {error && <p style={styles.errorText}>{error}</p>}
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
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        fontSize: '14px',
        color: '#374151',
        backgroundColor: '#f9fafb',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        lineHeight: '1.5',
    },
    inputError: {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
    },
    inputDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    suggestionList: {
        position: 'absolute',
        zIndex: 50,
        width: '100%',
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        marginTop: '4px',
        maxHeight: '192px',
        overflowY: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        padding: 0,
        listStyle: 'none',
    },
    suggestionItem: {
        padding: '9px 12px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#374151',
        backgroundColor: '#ffffff',
        transition: 'background-color 0.1s ease',
    },
    errorText: {
        fontSize: '12px',
        color: '#ef4444',
        marginTop: '2px',
    },
};

export default SearchBox;