import React, { useState } from 'react';
import "../css/DbConnection.css"
import { HiDatabase } from "react-icons/hi";
import { HiEye } from "react-icons/hi2";
import SchemaCreation from '../components/SchemaCreation';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const DbConnection = () => {

    const [addConnection,setAddConnection] = useState(false);
    const user = useSelector((state) => state.user);
    const id = user.id;
    const navigate = useNavigate();
  

    const connections = [
        {
          name: `${user.schema_name}`,
          createdDate: '22 Aug, 2023',
          createdTime: '05:59 PM',
          updatedDate: '20 Sep, 2024',
          updatedTime: '08:19 PM'
        }
      ];
  return (
    <div className='dbWrapper'>
        <div className="header">
            <h2>DB Connection</h2>
            <button onClick={()=>setAddConnection(true)}>Add Connection</button>
        </div>

        <div>
      <div className="connection-header">
        <div>Type</div>
        <div>DB Connection Name</div>
        <div>Created at</div>
        <div>Last Updated at</div>
        <div>Action</div>
      </div>

      {addConnection ? <SchemaCreation setAddConnection={setAddConnection}/> : ""} 
      {connections.map((conn, index) => (
        <div className="connection-row" key={index}>
          <div className="connection-type">
          <HiDatabase />
          </div>
          <div className="connection-name">{conn.name}</div>
          <div className="created-at">
            <div>{conn.createdDate}</div>
            <div className="subtext">{conn.createdTime}</div>
          </div>
          <div className="updated-at">
            <div>{conn.updatedDate}</div>
            <div className="subtext">{conn.updatedTime}</div>
          </div>
          <div className="action-buttons">
            <button title="View" onClick={()=>navigate(`/db/${id}`)} ><HiEye /></button>
            <button title="More Options">⋯</button>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default DbConnection