import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, IconButton, Stack } from '@mui/material';
import { Edit, Delete, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import AddNewRoles from './AddNewRoles';
import ProfileHeader from './ProfileHeader';

const columns = [
  { 
    field: 'verified', 
    headerName: 'VERIFIED', 
    width: 100, 
    renderCell: () => <CheckCircle color="success" />
  },
  { field: 'userRoles', headerName: 'USER ROLES', width: 150 },
  { field: 'users', headerName: 'USERS', width: 200 },
  { field: 'createdOn', headerName: 'CREATED ON', width: 130 },
  { field: 'updatedOn', headerName: 'UPDATED ON', width: 150 },
  { field: 'addedOn', headerName: 'ADDED ON', width: 150 },
  {
    field: 'action',
    headerName: 'ACTION',
    width: 130,
    sortable: false,
    renderCell: () => (
      <Stack direction="row" spacing={1}>
        <IconButton color="primary" size="small">
          <Edit fontSize="small" />
        </IconButton>
        <IconButton color="warning" size="small">
          <Delete fontSize="small" />
        </IconButton>
      </Stack>
    ),
  },
];

export default function RolesPermissions() {
  const [result, setResult] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/secure/getAllRoles`, { schemaName: "wa_expert" });
        setResult(res.data.result);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  const rows = result.map((role, index) => ({
    id: role.id,
    verified: true,
    userRoles: role.name,
    users: (index + 2).toString(),
    createdOn: formatDate(role.created_at),
    updatedOn: formatDate(role.updated_at),
    addedOn: "24 April, 2024" // hardcoded
  }));

  return (
    <div style={{ height: 500, width: '100%' }}>
      <ProfileHeader/>
      {showAddRole ? (
        <AddNewRoles />
      ) : (
        <>
          <Stack direction="row" spacing={2} mb={2}>
            <TextField
              label="Search Team Member..."
              variant="outlined"
              size="small"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={() => setShowAddRole(true)}>
              + Add New User Roles
            </Button>
          </Stack>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </>
      )}
    </div>
  );
}
