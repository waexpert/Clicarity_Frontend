import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/SchemaDashboard.css';
import { useNavigate } from 'react-router-dom';
import NewDataStore from '../components/NewDataStore';
import TaskDataStore from '../components/TaskDataStore';


const SchemaDashboard = () => {
  // const [schemas, setSchemas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [showDialog,setShowDialog] = useState(0);

  const componentMap = {
    1: <NewDataStore setShowDialog={setShowDialog} />,
    2: <TaskDataStore setShowDialog={setShowDialog} />,
    // 3: <EditExpenseTracker />,
  };

  // useEffect(() => {
  //   const fetchSchemas = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/secure/schemas`);
  //       setSchemas(response.data);
  //     } catch (error) {
  //       console.error('Error fetching schemas:', error);
  //     }
  //   };

  //   fetchSchemas();
  // }, []);

  const schemas = [
    {
      "id": "2",
      "title": "Task Management",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "3",
      "title": "Expense Tracker",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "4",
      "title": "Lead Managemnet",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "5",
      "title": "Project Managemnet",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "6",
      "title": "Support Ticket",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "7",
      "title": "Birthday Reminder",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    }
    
  ]
  

  const filteredSchemas = schemas.filter(schema =>
    schema.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="schema-dashboard">
      <h2>All Products</h2>
      <div className="header">
      <input
        type="text"
        placeholder="Search data store with title ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    {componentMap[showDialog] || null}
      <button className="submit-btn" onClick={()=>setShowDialog(1)}> Custom Table </button>

      </div>

      <table className="schema-table">
        <thead>
          <tr>
            <th>Schema Title</th>
            <th>Number of Fields</th>
            <th>Created at</th>
            <th>Last Updated at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchemas.map((schema) => (
            <tr key={schema.id}>
              <td>{schema.title}</td>
              <td>{schema.fieldsCount}</td>
              <td>{formatDate(schema.createdAt)}</td>
              <td>{formatDate(schema.updatedAt)}</td>
              <td>
                <button className="btn browse" >Browse</button>
                <button className="btn edit" onClick={()=>setShowDialog(schema.id)}>Edit</button>
                <button className="btn delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const formatDate = (iso) => {
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

export default SchemaDashboard;
