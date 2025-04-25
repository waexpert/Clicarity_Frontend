import { MdLock } from "react-icons/md";

import React, { useState } from 'react';
import '../css/components/NewDataStore.css';
import { useSelector } from "react-redux";
import axios from "axios";

const fieldTypes = ['Text', 'Number', 'Date', 'Boolean'];

// Predefined system fields (locked)
const predefinedFields = [
  { name: 'id', type: 'Number', label: 'ID', defaultValue: 'Auto', locked: true },
  { name: 'task_name', type: 'Text', label: 'Task Name', defaultValue: '-', locked: true },
  { name: 'task_file', type: 'Text', label: 'Task File', defaultValue: '-', locked: true },
  { name: 'notes', type: 'Text', label: 'Notes', defaultValue: '-', locked: true },
  { name: 'assigned_to', type: 'Text', label: 'Assigned To', defaultValue: '-', locked: true },
  { name: 'assigned_by', type: 'Text', label: 'Assigned By', defaultValue: '-', locked: true },
  { name: 'department', type: 'Text', label: 'Department', defaultValue: '-', locked: true },
  { name: 'priority', type: 'Text', label: 'Priority', defaultValue: '-', locked: true },
  { name: 'status', type: 'Text', label: 'Status', defaultValue: 'Pending', locked: true },
  { name: 'due_date', type: 'Date', label: 'Due Date', locked: true },
  { name: 'auditor_date', type: 'Date', label: 'Auditor Date', locked: true },
  { name: 'completion_date', type: 'Date', label: 'Completion Date', locked: true },
  { name: 'rating', type: 'Text', label: 'Rating', defaultValue: '-', locked: true },
  { name: 'pending_to_auditor_remarks', type: 'Text', label: 'Auditor Remarks', defaultValue: '-', locked: true },
  { name: 'auditor_to_completed_remarks', type: 'Text', label: 'Completed Remarks', defaultValue: '-', locked: true },
];

const TaskDataStore = () => {
  const [title, setTitle] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [showInChat, setShowInChat] = useState(false);
  const user = useSelector((state) => state.user);
  const id = user.id;
  const schema_name = user.schema_name;

  const handleCustomFieldChange = (index, key, value) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };

  const addField = () => {
    setCustomFields([...customFields, { name: '', type: 'Text', label: '', defaultValue: '' }]);
  };

  const removeField = (index) => {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
  };

  const handleSubmit = async () => {
    const allFields = [...predefinedFields, ...customFields];
    const data = { table_name:title, fields: allFields,schema_name,id};
    console.log('Creating Data Store:', data);
    try {
      const res = await axios.post("http://localhost:3000/secure/createTable", data);
      // const userData = res.data.user;

      // dispatch(userRegistration(userData)); // Update state with backend response

      alert("Form submitted successfully!");
      // console.log("User after registration:", userData);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed! Please try again.");
    }

    // Send this data to backend to create a table in PostgreSQL
  };

  return (
    <div className="wrapper">
      <div className="new-data-store">
        <h2>New Data Store</h2>

        <input
          type="text"
          placeholder="Enter Data Store Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input title-input"
        />

        <h4>Predefined Fields (Locked)</h4>
        {predefinedFields.map((field, index) => (
          <div key={index} className="field-row locked">
            <input type="text" value={field.name} readOnly className="input" />
            <select value={field.type} disabled className="select">
              <option>{field.type}</option>
            </select>
            <input type="text" value={field.label} readOnly className="input" />
            <input type="text" value={field.defaultValue} readOnly className="input" />
            <span className="locked-tag"><MdLock /></span>
          </div>
        ))}

        <h4>Custom Fields</h4>
        {customFields.map((field, index) => (
          <div key={index} className="field-row">
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
              className="input"
            />
            <select
              value={field.type}
              onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
              className="select"
            >
              {fieldTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Label"
              value={field.label}
              onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
              className="input"
            />
            <input
              type="text"
              placeholder="Default Value"
              value={field.defaultValue}
              onChange={(e) => handleCustomFieldChange(index, 'defaultValue', e.target.value)}
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

export default TaskDataStore;
