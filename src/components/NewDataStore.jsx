import React, { useState } from 'react';
import '../css/components/NewDataStore.css';
import { MdClose } from "react-icons/md";

const fieldTypes = ['Text (String)', 'Number', 'Date', 'Boolean'];

const NewDataStore = ({setShowDialog}) => {
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([
    { name: '', type: 'Text (String)', label: '', defaultValue: '' }
  ]);
  const [showInChat, setShowInChat] = useState(false);

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const addField = () => {
    setFields([...fields, { name: '', type: 'Text (String)', label: '', defaultValue: '' }]);
  };

  const removeField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSubmit = () => {
    const data = { title, fields, showInChat };
    console.log('Creating Data Store:', data);
  };

  return (
    <div className="wrapper">

   
    <div className="new-data-store">
     <div style={{display: 'flex',justifyContent:'space-between',alignItems:"center"}}>
     <h2>New Data Store</h2>
     <button style={{background:"pink",border:"none",width:"2.5rem",borderRadius:"1.25rem",height:"2.5rem",fontSize:"1.2rem"}} onClick={()=>setShowDialog(0)}><MdClose /></button>
     </div>
      

      <input
        type="text"
        placeholder="Enter Data Store Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input title-input"
      />

      <h4>Data Store Fields</h4>
      {fields.map((field, index) => (
        <div key={index} className="field-row">
          <input
            type="text"
            placeholder="Enter Field Name"
            value={field.name}
            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
            className="input"
          />
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
            className="select"
          >
            {fieldTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter Label"
            value={field.label}
            onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Enter Default Value"
            value={field.defaultValue}
            onChange={(e) => handleFieldChange(index, 'defaultValue', e.target.value)}
            className="input"
          />
          <button className="remove-btn" onClick={() => removeField(index)}>✕</button>
        </div>
      ))}

      <div className="add-field" onClick={addField}>Add Field</div>
      <button className="submit-btn" onClick={handleSubmit}>Create Data Store</button>
    </div>
    </div>
  );
};

export default NewDataStore;


// import React, { useState } from 'react';
// import '../css/components/NewDataStore.css';

// const fieldTypes = ['Text (String)', 'Number', 'Date', 'Boolean'];

// // Predefined system fields (locked)
// const predefinedFields = [
//   { name: 'id', type: 'Number', label: 'ID', defaultValue: 'auto', locked: true },
//   { name: 'created_at', type: 'Date', label: 'Created At', defaultValue: 'now()', locked: true },
//   { name: 'updated_at', type: 'Date', label: 'Updated At', defaultValue: 'now()', locked: true },
//   { name: 'created_by', type: 'Text (String)', label: 'Created By', defaultValue: '', locked: true },
//   { name: 'is_active', type: 'Boolean', label: 'Is Active', defaultValue: 'true', locked: true },
//   { name: 'status', type: 'Text (String)', label: 'Status', defaultValue: 'new', locked: true },
//   { name: 'owner', type: 'Text (String)', label: 'Owner', defaultValue: '', locked: true },
//   { name: 'remarks', type: 'Text (String)', label: 'Remarks', defaultValue: '', locked: true },
//   { name: 'priority', type: 'Text (String)', label: 'Priority', defaultValue: 'medium', locked: true },
//   { name: 'source', type: 'Text (String)', label: 'Source', defaultValue: 'web', locked: true },
// ];

// const NewDataStore = () => {
//   const [title, setTitle] = useState('');
//   const [customFields, setCustomFields] = useState([]);
//   const [showInChat, setShowInChat] = useState(false);

//   const handleCustomFieldChange = (index, key, value) => {
//     const updated = [...customFields];
//     updated[index][key] = value;
//     setCustomFields(updated);
//   };

//   const addField = () => {
//     setCustomFields([...customFields, { name: '', type: 'Text (String)', label: '', defaultValue: '' }]);
//   };

//   const removeField = (index) => {
//     const updated = customFields.filter((_, i) => i !== index);
//     setCustomFields(updated);
//   };

//   const handleSubmit = () => {
//     const allFields = [...predefinedFields, ...customFields];
//     const data = { title, fields: allFields, showInChat };
//     console.log('Creating Data Store:', data);

//     // Send this data to backend to create a table in PostgreSQL
//   };

//   return (
//     <div className="wrapper">
//       <div className="new-data-store">
//         <h2>New Data Store</h2>

//         <input
//           type="text"
//           placeholder="Enter Data Store Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="input title-input"
//         />

//         <h4>Predefined Fields (Locked)</h4>
//         {predefinedFields.map((field, index) => (
//           <div key={index} className="field-row locked">
//             <input type="text" value={field.name} readOnly className="input" />
//             <select value={field.type} disabled className="select">
//               <option>{field.type}</option>
//             </select>
//             <input type="text" value={field.label} readOnly className="input" />
//             <input type="text" value={field.defaultValue} readOnly className="input" />
//             <span className="locked-tag">Locked</span>
//           </div>
//         ))}

//         <h4>Custom Fields</h4>
//         {customFields.map((field, index) => (
//           <div key={index} className="field-row">
//             <input
//               type="text"
//               placeholder="Field Name"
//               value={field.name}
//               onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
//               className="input"
//             />
//             <select
//               value={field.type}
//               onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
//               className="select"
//             >
//               {fieldTypes.map((type) => (
//                 <option key={type}>{type}</option>
//               ))}
//             </select>
//             <input
//               type="text"
//               placeholder="Label"
//               value={field.label}
//               onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
//               className="input"
//             />
//             <input
//               type="text"
//               placeholder="Default Value"
//               value={field.defaultValue}
//               onChange={(e) => handleCustomFieldChange(index, 'defaultValue', e.target.value)}
//               className="input"
//             />
//             <button className="remove-btn" onClick={() => removeField(index)}>✕</button>
//           </div>
//         ))}

//         <div className="add-field" onClick={addField}>Add Field</div>
//         <button className="submit-btn" onClick={handleSubmit}>Create Data Store</button>
//       </div>
//     </div>
//   );
// };

// export default NewDataStore;
