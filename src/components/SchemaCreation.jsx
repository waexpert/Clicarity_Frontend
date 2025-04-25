import React, { useEffect, useState } from 'react';
import '../css/components/SchemaCreation.css';
import { useSelector } from 'react-redux';
import axios from 'axios';


const SchemaCreation = ({setAddConnection}) => {
  const [schemaName, setSchemaName] = useState('');
  const [dbType, setDbType] = useState('Postgresql');
  const [paramType, setParamType] = useState('Mongo String');
  const [connString, setConnString] = useState('');
  const baseUrl = process.env.REACT_APP_BASE_URL

  const user = useSelector((state) => state.user);
  const id = user.id;
  


  const handleSave = async() => {
    const connectionData = { schemaName, dbType, paramType,id };
    const res =  await axios.post(`${baseUrl}/secure/createSchema`,connectionData);
    console.log("url",process.env.BASE_URL)
    console.log('Saving connection:', connectionData);
    console.log("Res Data",res)
  };

  return (
    <div className="wrapper">
    <div className="form-container">
      <div className="form-header">
        <h2>Add Database Connection</h2>
        <button className="close-btn" onClick={()=>setAddConnection(false)}>×</button>
      </div>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter Connection Title"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Database Type</label>
        <select value={dbType} onChange={(e) => setDbType(e.target.value)} disabled>
          <option>Postgresql</option>
        </select>
      </div>

      <div className="form-group">
        <label>Select Connection Parameters Type</label>
        <select value={paramType} onChange={(e) => setParamType(e.target.value)} disabled>
          <option>Postgres String</option>
        </select>
      </div>

      {/* <div className="form-group">
        <label>Connection String</label>
        <input
          type="text"
          placeholder="Enter Connection String"
          value={connString}
          onChange={(e) => setConnString(e.target.value)}
        />
      </div> */}

      <button className="save-btn" onClick={handleSave}>Save Connection</button>
    </div>
    </div>
  );
};

export default SchemaCreation;
