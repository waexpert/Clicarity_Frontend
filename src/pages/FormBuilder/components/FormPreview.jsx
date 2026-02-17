import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

// ---------------- STYLED FORM PREVIEW COMPONENT (Clicarity Theme) ----------------
function FormPreview({ fields, onSubmit, formId ,tableName,submit}) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const userData = useSelector((state) => state.user);

  const [params,setParams] = useSearchParams();
  const recordId = params.get("recordId");

  console.log(submit)

    const formRef = useRef(null);

    useEffect(() => {
    if (submit) {
      formRef.current?.requestSubmit();
    }
  }, [submit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setSubmitStatus({ type: '', message: '' });

      // Build the updates object from formData
      // Map form field names to their columnNames
      const updates = {};
      
      fields.forEach(field => {
        // Only include fields that have a columnName and have data
        if (field.columnName && formData[field.name] !== undefined) {
          updates[field.columnName] = formData[field.name];
        }
      });

      console.log('Form data to submit:', formData);
      console.log('Mapped updates:', updates);

      // Check if there are any updates to send
      if (Object.keys(updates).length === 0) {
        setSubmitStatus({ 
          type: 'warning', 
          message: 'No data to submit. Please fill in at least one field.' 
        });
        setLoading(false);
        return;
      }

      const updateUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple`;
      console.log(tableName)
      
      const response = await axios.post(updateUrl, {
        schemaName: userData.schema_name, // Adjust as needed
        tableName: tableName,
        recordId: recordId, 
        updates: updates,
        // Optional fields:
        // ownerId: 'owner_id_if_needed',
        // wid: 'webhook_id_if_needed',
        // userTableName: 'user_table_name_if_needed',
        // userSchemaName: 'user_schema_name_if_needed'
      });

      console.log('Update response:', response.data);

      setSubmitStatus({ 
        type: 'success', 
        message: 'Form submitted successfully!' 
      });

      // Call the parent's onSubmit callback if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Optionally reset form after successful submission
      // setFormData({});

    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Failed to submit form. ';
      if (error.response) {
        errorMessage += error.response.data?.error || error.response.data?.details || error.response.statusText;
      } else if (error.request) {
        errorMessage += 'Please check if the server is running.';
      } else {
        errorMessage += error.message;
      }

      setSubmitStatus({ 
        type: 'error', 
        message: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '10px auto',
      padding: '30px',
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>

      {/* <p style={{ color: "gray", fontSize: "0.5rem" }}>form Id {formId}</p> */}

      {/* Status Message */}
      {submitStatus.message && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: submitStatus.type === 'success' ? '#D1FAE5' : 
                          submitStatus.type === 'error' ? '#FEE2E2' : '#FEF3C7',
          color: submitStatus.type === 'success' ? '#065F46' : 
                 submitStatus.type === 'error' ? '#991B1B' : '#92400E',
          border: `1px solid ${submitStatus.type === 'success' ? '#A7F3D0' : 
                               submitStatus.type === 'error' ? '#FECACA' : '#FDE68A'}`
        }}>
          {submitStatus.message}
        </div>
      )}


      <form onSubmit={handleSubmit} ref={formRef}>
        {fields.map((field) => (
          <div key={field.id} style={{ marginBottom: 8 }}>
            {renderClicaryField(field, formData, handleChange)}
          </div>
        ))}
        
        {/* Submit Button - Clicarity Green */}
        {/* <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: loading ? '#9CA3AF' : '#5B9BD5',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            marginTop: 10,
            transition: 'background 0.2s ease',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => !loading && (e.target.style.background = '#4A8BC2')}
          onMouseLeave={(e) => !loading && (e.target.style.background = '#5B9BD5')}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button> */}
      </form>
    </div>
  );
}

function renderClicaryField(field, formData, handleChange) {
  // Clicarity-themed input styles
  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151'
  };

  const requiredStar = {
    color: '#EF4444',
    marginLeft: '4px'
  };

  const value = formData[field.name] || '';

  switch (field.type) {
    case 'heading':
      return (
        <h1 style={{ 
          margin: 0, 
          fontSize: '28px', 
          fontWeight: '700',
          color: '#1F2937',
          lineHeight: 1
        }}>
          {field.content}
        </h1>
      );
    
    case 'subheading':
      return (
        <h2 style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#374151',
          lineHeight: 1.2
        }}>
          {field.content}
        </h2>
      );
    
    case 'body':
      return (
        <p style={{ 
          margin: 0, 
          lineHeight: 1.6,
          fontSize: '14px',
          color: '#6B7280'
        }}>
          {field.content}
        </p>
      );
    
    case 'caption':
      return (
        <small style={{ 
          color: '#9CA3AF',
          fontSize: '13px',
          fontStyle: 'italic'
        }}>
          {field.content}
        </small>
      );
    
    case 'image':
      return (
        <div style={{ 
          width: '100%', 
          height: 200, 
          background: '#F3F4F6', 
          borderRadius: 6, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#9CA3AF',
          border: '2px dashed #D1D5DB'
        }}>
          Image Placeholder
        </div>
      );
    
    case 'textarea':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </label>
          <textarea
            style={{
              ...inputStyle,
              minHeight: '100px',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            placeholder={field.placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#5B9BD5'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
      );
    
    case 'select':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </label>
          <select 
            style={{
              ...inputStyle,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: '36px'
            }}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#5B9BD5'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          >
            <option value="">Select an option...</option>
            {field.options.map((o, i) => (
              <option key={i} value={o}>{o}</option>
            ))}
          </select>
        </div>
      );
    
    case 'radio':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </label>
          <div style={{ marginTop: '8px' }}>
            {field.options.map((o, i) => (
              <label 
                key={i} 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151'
                }}
              >
                <input 
                  type="radio" 
                  name={field.name} 
                  value={o} 
                  required={field.required}
                  checked={value === o}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{ 
                    marginRight: '10px',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer',
                    accentColor: '#5B9BD5'
                  }}
                />
                {o}
              </label>
            ))}
          </div>
        </div>
      );
    
    case 'checkbox':
      return (
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151'
        }}>
          <input 
            type="checkbox" 
            style={{ 
              marginRight: '10px',
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: '#5B9BD5'
            }}
            required={field.required}
            checked={value === true}
            onChange={(e) => handleChange(field.name, e.target.checked)}
          />
          <span>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </span>
        </label>
      );
    
    case 'optin':
      return (
        <label style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          cursor: 'pointer',
          fontSize: '14px',
          color: '#374151',
          lineHeight: 1.5
        }}>
          <input 
            type="checkbox" 
            style={{ 
              marginRight: '10px',
              marginTop: '2px',
              width: '18px',
              height: '18px',
              cursor: 'pointer',
              accentColor: '#5B9BD5',
              flexShrink: 0
            }}
            required={field.required}
            checked={value === true}
            onChange={(e) => handleChange(field.name, e.target.checked)}
          />
          <span>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </span>
        </label>
      );
    
    case 'file':
    case 'file-image':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </label>
          <input 
            type="file" 
            style={{
              ...inputStyle,
              padding: '10px'
            }}
            accept={field.accept} 
            required={field.required}
            onChange={(e) => handleChange(field.name, e.target.files[0])}
          />
        </div>
      );
    
    case 'passcode':
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </label>
          <input
            type="text"
            maxLength={field.maxLength}
            style={inputStyle}
            placeholder={field.placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#5B9BD5'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
      );
    
    default:
      return (
        <div>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={requiredStar}>*</span>}
          </label>
          <input
            type={field.type}
            style={inputStyle}
            placeholder={field.placeholder}
            required={field.required}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#5B9BD5'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>
      );
  }
}

export default FormPreview;