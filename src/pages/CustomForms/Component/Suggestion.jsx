import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Input } from '../../../components/ui/input';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DEBOUNCE_DELAY = 250;
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

const Suggestion = ({ value, onChange, placeholder = "Enter the ID" }) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentTable, setCurrentTable] = useState('jobstatus');
  const [suggestion, setSuggestion] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const justSelectedSuggestion = useRef(false);

  const userData = useSelector((state) => state.user);
  const schemaName = userData?.schema_name || 'default_schema';

  // Debounced suggestion search
  useEffect(() => {
    if (!value || !value.trim()) {
      setSuggestion([]);
      setShowSuggestions(false);
      return;
    }

    if (justSelectedSuggestion.current) {
      justSelectedSuggestion.current = false;
      return;
    }

    if (!showSuggestions) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        console.log('🔍 Making search request:', {
          schemaName,
          tableName: currentTable,
          query: value
        });

        const { data } = await axios.post(
          `${BASE_URL}/additional/search`,
          {
            schemaName: schemaName,
            tableName: currentTable,
            query: value,
            userId: userData.id,
            userEmail: userData.email
          },
          { signal: controller.signal }
        );

        console.log('✅ Response:', data.data);

        const rows = data?.data || [];
        setSuggestion(rows);
        if (data.data?.table_name) {
          setCurrentTable(data.data.table_name);
        }
        setShowSuggestions(rows.length > 0);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('❌ Error:', err);
        }
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [value, currentTable, schemaName, showSuggestions, userData.id, userData.email]);

  const handleSuggestionClick = useCallback((selectedValue, tableName) => {
    justSelectedSuggestion.current = true;
    onChange(selectedValue); // Call parent's onChange
    setCurrentTable(tableName);
    setSuggestion([]);
    setShowSuggestions(false);
  }, [onChange]);

  const handleInputChange = useCallback((e) => {
    justSelectedSuggestion.current = false;
    onChange(e.target.value); // Call parent's onChange
    setShowSuggestions(true);
  }, [onChange]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="bg-gray-50 text-gray-700"
        placeholder={placeholder}
        aria-label="Search ID"
        disabled={loading}
        autoComplete="off"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestion.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-md">
          {suggestion.map((item, index) => (
            <li
              key={item.us_id || index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm"
              onClick={() => handleSuggestionClick(item.us_id, item.table_name)}
            >
              {item.us_id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Suggestion;