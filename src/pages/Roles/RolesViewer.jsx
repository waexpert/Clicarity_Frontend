import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Grid,
  List,
  MoreVertical,
  Calendar,
  Database,
  Users,
  Filter,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLORS = {
  active: { bg: '#D4EDDA', text: '#155724', label: 'Active' },
  inactive: { bg: '#F8D7DA', text: '#721C24', label: 'Inactive' },
  draft: { bg: '#FFF3CD', text: '#856404', label: 'Draft' }
};

function RolesViewer() {
  const user = useSelector((state) => state.user);
  const schemaName = user?.schema_name;
  const ownerId = user?.id;

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState('all');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    if (schemaName && ownerId) {
      fetchRoles();
      fetchTables();
    }
  }, [schemaName, ownerId]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching roles for schema:', schemaName);
      
      const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/getAllRoles?schemaName=${schemaName}&ownerId=${ownerId}`;
      const { data } = await axios.get(route);
      
      console.log('✅ Roles fetched:', data.data);
      setRoles(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      toast.error('Failed to load roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
      const { data } = await axios.get(route);
      setTables(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching tables:', error);
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!confirm(`Are you sure you want to delete the role "${roleName}"?`)) return;

    try {
      const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/deleteRole/${roleId}`;
      await axios.delete(route);
      
      toast.success('Role deleted successfully!');
      fetchRoles(); // Refresh the list
    } catch (error) {
      console.error('❌ Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.role_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.table_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTable = selectedTable === 'all' || role.table_name === selectedTable;
    return matchesSearch && matchesTable;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get unique tables from roles
  const uniqueTables = [...new Set(roles.map(role => role.table_name))];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }} className='mx-[6rem] py-8'>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600', color: '#2C3E50' }}>
              Data Access Roles
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#7F8C8D' }}>
              Manage and view all configured data access roles
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/roles/create'}
            style={{
              padding: '12px 24px',
              background: '#5B9BD5',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(91, 155, 213, 0.3)'
            }}
          >
            <Plus size={20} />
            Create New Role
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#95A5A6'
              }} 
            />
            <input
              type="text"
              placeholder="Search roles by name or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 40px',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
              background: '#fff'
            }}
          >
            <option value="all">All Tables</option>
            {uniqueTables.map(table => (
              <option key={table} value={table}>{table}</option>
            ))}
          </select>

          <div style={{ 
            display: 'flex', 
            gap: '5px', 
            background: '#fff', 
            padding: '4px', 
            borderRadius: '6px',
            border: '1px solid #D1D5DB'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'grid' ? '#5B9BD5' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : '#7F8C8D',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '8px 12px',
                background: viewMode === 'table' ? '#5B9BD5' : 'transparent',
                color: viewMode === 'table' ? '#fff' : '#7F8C8D',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '60px',
          color: '#7F8C8D'
        }}>
          <Loader2 size={48} className="animate-spin" style={{ marginBottom: '16px' }} />
          <p>Loading roles...</p>
        </div>
      ) : filteredRoles.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px',
          background: '#F8F9FA',
          borderRadius: '8px'
        }}>
          <Shield size={64} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: '#2C3E50', marginBottom: '8px' }}>No roles found</h3>
          <p style={{ color: '#7F8C8D' }}>
            {searchQuery || selectedTable !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first role to get started'}
          </p>
        </div>
      ) : (
        /* Content */
        viewMode === 'grid' ? (
          <GridView roles={filteredRoles} formatDate={formatDate} onDelete={handleDeleteRole} />
        ) : (
          <TableView roles={filteredRoles} formatDate={formatDate} onDelete={handleDeleteRole} />
        )
      )}
    </div>
  );
}

// Grid View Component (Card Layout)
function GridView({ roles, formatDate, onDelete }) {
  const parseRoleConfig = (config) => {
    try {
      return typeof config === 'string' ? JSON.parse(config) : config;
    } catch (e) {
      return config;
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
      gap: '20px' 
    }}>
      {roles.map((role) => {
        const config = parseRoleConfig(role.role_config);
        const columnsCount = config?.columns?.length || 0;
        const conditionsCount = config?.conditions?.length || 0;

        return (
          <div
            key={role.id}
            style={{
              background: '#fff',
              borderLeft: `4px solid #5B9BD5`,
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            }}
          >
            {/* Icon and Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#E3F2FD',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={24} color="#5B9BD5" />
              </div>
              <span style={{
                padding: '4px 12px',
                background: '#D4EDDA',
                color: '#155724',
                fontSize: '11px',
                fontWeight: '600',
                borderRadius: '12px',
                textTransform: 'uppercase'
              }}>
                Active
              </span>
            </div>

            {/* Role Info */}
            <h3 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#2C3E50',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {role.role_name}
            </h3>
            <p style={{ 
              margin: '0 0 16px 0', 
              fontSize: '13px', 
              color: '#7F8C8D',
              lineHeight: '1.5',
              height: '40px',
              overflow: 'hidden'
            }}>
              Controls access to {columnsCount} columns with {conditionsCount} filter{conditionsCount !== 1 ? 's' : ''}
            </p>

            {/* Meta Info */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Database size={14} color="#95A5A6" />
                <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                  {role.table_name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Users size={14} color="#95A5A6" />
                <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                  Created by {role.created_by || 'Unknown'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#95A5A6" />
                <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                  Created {formatDate(role.created_at)}
                </span>
              </div>
            </div>

            {/* Columns Preview */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>
                ACCESSIBLE COLUMNS:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {config?.columns?.slice(0, 3).map((col, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 8px',
                      background: '#E9ECEF',
                      color: '#495057',
                      fontSize: '11px',
                      borderRadius: '4px'
                    }}
                  >
                    {col}
                  </span>
                ))}
                {columnsCount > 3 && (
                  <span style={{ fontSize: '11px', color: '#95A5A6' }}>
                    +{columnsCount - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #ECF0F1'
            }}>
              <span style={{
                fontSize: '12px',
                color: '#95A5A6',
                fontWeight: '500'
              }}>
                ID: {role.id}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to view/edit page
                    console.log('View role:', role.id);
                  }}
                  style={{
                    padding: '8px 16px',
                    background: '#5B9BD5',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(role.id, role.role_name);
                  }}
                  style={{
                    padding: '8px',
                    background: 'transparent',
                    color: '#DC3545',
                    border: '1px solid #DC3545',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Table View Component
function TableView({ roles, formatDate, onDelete }) {
  const parseRoleConfig = (config) => {
    try {
      return typeof config === 'string' ? JSON.parse(config) : config;
    } catch (e) {
      return config;
    }
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: '8px', 
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F8F9FA', borderBottom: '2px solid #E9ECEF' }}>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Role Name
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Table
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Columns
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Conditions
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Created By
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Created
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => {
            const config = parseRoleConfig(role.role_config);
            const columnsCount = config?.columns?.length || 0;
            const conditionsCount = config?.conditions?.length || 0;

            return (
              <tr 
                key={role.id}
                style={{ 
                  borderBottom: '1px solid #E9ECEF',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#F8F9FA'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
              >
                <td style={{ padding: '16px 20px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '4px' }}>
                      {role.role_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#95A5A6' }}>
                      ID: {role.id}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#495057' }}>
                  {role.table_name}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Filter size={14} color="#5B9BD5" />
                    <span style={{ fontSize: '13px', color: '#495057', fontWeight: '500' }}>
                      {columnsCount} columns
                    </span>
                  </div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#495057' }}>
                  {conditionsCount} filter{conditionsCount !== 1 ? 's' : ''}
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#7F8C8D' }}>
                  {role.created_by || 'Unknown'}
                </td>
                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#7F8C8D' }}>
                  {formatDate(role.created_at)}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => console.log('View role', role.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        color: '#5B9BD5',
                        border: '1px solid #5B9BD5',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                    <button
                      onClick={() => onDelete(role.id, role.role_name)}
                      style={{
                        padding: '8px',
                        background: 'transparent',
                        color: '#DC3545',
                        border: '1px solid #DC3545',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RolesViewer;