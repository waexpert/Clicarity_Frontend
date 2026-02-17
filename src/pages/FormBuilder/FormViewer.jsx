// import { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import FormPreview from './components/FormPreview';

// function FormViewer() {
//   const [formSchema, setFormSchema] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const [searchParams] = useSearchParams();

//   useEffect(() => {
//     const loadForm = async () => {
//       const form_id = searchParams.get('form_id');
      
//       if (!form_id) {
//         setError('No form ID provided in URL');
//         return;
//       }

//       try {
//         setLoading(true);
//         setError('');

//         const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordByTargetAll`;

//         const response = await axios.post(apiUrl, {
//           schemaName: "public",
//           tableName: 'form_setup',
//           targetColumn: 'us_id',
//           targetValue: form_id
//         });

//         console.log('Full Response:', response);
//         console.log('Response Data:', response.data);
//         const data = response.data;
//         console.log('All form data', data);
//         console.log('Form data length:', data?.length);
        
//         if (data && data.length > 0) {
//           setFormSchema(data[0].form_schema);
//         } else {
//           setError('No form found with the provided ID');
//         }
//       } catch (err) {
//         let errorMessage = 'Failed to load form. ';
//         if (err.response) {
//           errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
//         } else if (err.request) {
//           errorMessage += 'Please check if the server is running.';
//         } else {
//           errorMessage += err.message;
//         }
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadForm();
//   }, [searchParams]);

//   const handleFormSubmit = (formData) => {
//     console.log('Form submitted:', formData);
//     // Handle form submission here
//   };

//   if (loading) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <p>Loading form...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ padding: '20px', color: 'red' }}>
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   if (!formSchema) {
//     return (
//       <div style={{ padding: '20px', textAlign: 'center' }}>
//         <p>No form data available</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <FormPreview 
//         fields={formSchema.fields} 
//         onSubmit={handleFormSubmit}
//         formId={formSchema.form_id}
//       />
//     </div>
//   );
// }

// export default FormViewer;


import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FormPreview from './components/FormPreview';

function FormViewer({ prop_form_id,submit }) {
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tableName, setTableName] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadForm = async () => {
      const form_id = prop_form_id || searchParams.get('form_id');

      // ✅ Fix 1: Guard early if no form_id at all
      if (!form_id) {
        return;
      }

      console.log(form_id)

      try {
        setLoading(true);
        setError('');

        const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordByTargetAll`;

        const response = await axios.post(apiUrl, {
          schemaName: "public",
          tableName: 'form_setup',
          targetColumn: 'us_id',
          targetValue: form_id
        });

        console.log('Full Response:', response);
        console.log('Response Data:', response.data);

        const data = response.data;
        console.log('All form data', data);
        console.log('Form data length:', data?.length);

        // ✅ Fix 2: Check data exists and has items before accessing properties
        if (data && data.length > 0) {
          setTableName(data[0].table_name);
          setFormSchema(data[0].form_schema);
        } else {
          setError('No form found with the provided ID');
        }

      } catch (err) {
        let errorMessage = 'Failed to load form. ';
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

    loadForm();
  }, [prop_form_id, searchParams]); // ✅ Fix 3: Added prop_form_id as dependency

  const handleFormSubmit = (formData) => {
    console.log('Form submitted successfully:', formData);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!formSchema) {
    return null; // ✅ Cleaner than showing "No form data available" when prop_form_id is simply not passed
  }

  return (
    <div>
      <FormPreview
        fields={formSchema.fields}
        tableName={tableName}
        onSubmit={handleFormSubmit}
        formId={prop_form_id ? prop_form_id : formSchema.form_id}
        submit={submit}
      />
    </div>
  );
}

export default FormViewer;