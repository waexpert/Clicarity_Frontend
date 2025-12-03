import { useState, useEffect, useRef } from 'react';

function AutocompleteInput() {
  const [inputValue, setInputValue] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const inputRef = useRef(null);
  
  // Your array of elements
  const items = [
    'Apple pie recipe',
    'Apple store location',
    'Banana smoothie',
    'Banana bread recipe',
    'Orange juice benefits',
    'Mango lassi recipe',
    'Pineapple pizza debate',
    'Strawberry shortcake',
    'Watermelon salad',
    'Grape varieties'
  ];

  useEffect(() => {
    if (inputValue.length > 0) {
      // Find first match that starts with the input
      const match = items.find(item =>
        item.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      
      if (match) {
        // Show the remaining part as suggestion
        setSuggestion(match.slice(inputValue.length));
      } else {
        setSuggestion('');
      }
    } else {
      setSuggestion('');
    }
  }, [inputValue]);

  const handleKeyDown = (e) => {
    // Accept suggestion with Tab or Right Arrow
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault();
      setInputValue(inputValue + suggestion);
      setSuggestion('');
    }
  };

  return (
    <div style={{ position: 'relative', width: '500px', fontFamily: 'monospace' }}>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Start typing..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #333',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 2,
            outline: 'none'
          }}
        />
        
        {/* Ghost text overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          padding: '12px',
          fontSize: '16px',
          color: 'transparent',
          pointerEvents: 'none',
          whiteSpace: 'pre',
          zIndex: 1
        }}>
          {inputValue}
          <span style={{ color: '#888' }}>{suggestion}</span>
        </div>
      </div>
      
      {suggestion &&  (
        <div style={{ 
          marginTop: '8px', 
          fontSize: '12px', 
          color: '#666' 
        }}>
          Press <kbd>Tab</kbd> or <kbd>→</kbd> to accept
        </div>
      )}
    </div>
  );
}

export default AutocompleteInput;