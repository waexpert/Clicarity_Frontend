import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, IconButton, Stack } from '@mui/material';
import { Edit, Delete, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';


const columns = [
  { 
    field: 'verified', 
    headerName: 'VERIFIED', 
    width: 100, 
    renderCell: () => <CheckCircle color="success" />
  },
  { field: 'name', headerName: 'NAME', width: 150 },
  { field: 'email', headerName: 'EMAIL', width: 200 },
  { field: 'role', headerName: 'ROLE', width: 130 },
  { field: 'lastLogin', headerName: 'LAST LOGIN', width: 150 },
  { field: 'addedOn', headerName: 'ADDED ON', width: 150 },
  {
    field: 'action',
    headerName: 'ACTION',
    width: 130,
    sortable: false,
    renderCell: (params) => (
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

const rows = [
  { id: 1, verified: true, name: 'Shravani', email: 'Shravani@wa.expert', role: 'AUDITOR', lastLogin: '25 Jan, 2025', addedOn: '24 Apr, 2024' },
  { id: 2, verified: true, name: 'Kalpesh', email: 'kalpesh@wa.expert', role: 'ADMIN', lastLogin: '26 Aug, 2024', addedOn: '13 June, 2024' },
  { id: 3, verified: true, name: 'Zeyad', email: 'zeyad@wa.expert', role: 'AUDITOR', lastLogin: '1 Jan, 1970', addedOn: '13 June, 2024' },
  { id: 4, verified: true, name: 'Gaurav', email: 'gaurav@wa.expert', role: 'ADMIN', lastLogin: '26 Apr, 2025', addedOn: '13 June, 2024' },
  { id: 5, verified: true, name: 'Elizabeth', email: 'Elizabeth@wa.expert', role: 'AUDITOR', lastLogin: '1 Jan, 1970', addedOn: '13 June, 2024' },
];

export default function TeamMember() {
  const navigate = useNavigate();
  return (
    <div style={{ height: 500, width: '100%' }}>
      <ProfileHeader/>
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Search Team Member..."
          variant="outlined"
          size="small"
          fullWidth

       

        />
        <Button variant="contained" color="primary">
          + Add New Team Member
        </Button>
      </Stack>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
      />
    </div>
  );
}