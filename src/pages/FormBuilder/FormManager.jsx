import { useState } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Search,
  Grid,
  List,
  MoreVertical,
  Calendar,
  Database
} from 'lucide-react';

// Dummy data for forms
const DUMMY_FORMS = [
  {
    id: 1,
    us_id: 'form_abc123',
    name: 'Customer Feedback Form',
    description: 'Collect customer feedback and satisfaction data',
    schema_name: 'public',
    table_name: 'customer_feedback',
    status: 'PUBLISH',
    category: 'Customer Service',
    created_at: '2026-02-01T10:30:00Z',
    updated_at: '2026-02-08T14:20:00Z',
    fields_count: 8
  },
  {
    id: 2,
    us_id: 'form_def456',
    name: 'Lead Registration',
    description: 'Capture new lead information from website',
    schema_name: 'public',
    table_name: 'lead_submissions',
    status: 'DRAFT',
    category: 'Lead Generation',
    created_at: '2026-01-28T09:15:00Z',
    updated_at: '2026-02-09T11:45:00Z',
    fields_count: 12
  },
  {
    id: 3,
    us_id: 'form_ghi789',
    name: 'Employee Onboarding',
    description: 'New employee registration and documentation',
    schema_name: 'hr_schema',
    table_name: 'employee_onboarding',
    status: 'PUBLISH',
    category: 'HR',
    created_at: '2026-01-20T13:00:00Z',
    updated_at: '2026-02-05T16:30:00Z',
    fields_count: 15
  },
  {
    id: 4,
    us_id: 'form_jkl012',
    name: 'Product Survey',
    description: 'Gather user opinions on new product features',
    schema_name: 'public',
    table_name: 'product_surveys',
    status: 'PENDING',
    category: 'Product',
    created_at: '2026-02-03T08:45:00Z',
    updated_at: '2026-02-10T09:00:00Z',
    fields_count: 10
  },
  {
    id: 5,
    us_id: 'form_mno345',
    name: 'Support Ticket Form',
    description: 'Customer support ticket submission',
    schema_name: 'support_schema',
    table_name: 'support_tickets',
    status: 'PUBLISH',
    category: 'Support',
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-02-07T10:15:00Z',
    fields_count: 6
  },
  {
    id: 6,
    us_id: 'form_pqr678',
    name: 'Event Registration',
    description: 'Register attendees for company events',
    schema_name: 'events_schema',
    table_name: 'event_registrations',
    status: 'DRAFT',
    category: 'Events',
    created_at: '2026-02-06T14:30:00Z',
    updated_at: '2026-02-09T17:00:00Z',
    fields_count: 9
  }
];

const STATUS_COLORS = {
  PUBLISH: { bg: '#D4EDDA', text: '#155724', label: 'Published' },
  DRAFT: { bg: '#FFF3CD', text: '#856404', label: 'Draft' },
  PENDING: { bg: '#D1ECF1', text: '#0C5460', label: 'Pending' }
};

function FormsManagement() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredForms = DUMMY_FORMS.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || form.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div style={{background: '#FFFFFF', minHeight: '100vh' }} className='mx-[6rem]'>
      {/* Header */}
      <div style={{ marginBottom: '30px' }} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '600', color: '#2C3E50' }}>Forms</h1>
            <p style={{ margin: '5px 0 0 0', color: '#7F8C8D' }}>Manage and organize your forms</p>
          </div>
          <button
            onClick={() => window.location.href = '/forms/create'}
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
            Create New Form
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
              placeholder="Search forms by name..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
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
            <option value="all">All Status</option>
            <option value="PUBLISH">Published</option>
            <option value="DRAFT">Draft</option>
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

      {/* Content */}
      {viewMode === 'grid' ? (
        <GridView forms={filteredForms} formatDate={formatDate} />
      ) : (
        <TableView forms={filteredForms} formatDate={formatDate} />
      )}
    </div>
  );
}

// Grid View Component (Card Layout)
function GridView({ forms, formatDate }) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
      gap: '20px' 
    }}>
      {forms.map((form) => (
        <div
          key={form.id}
          style={{
            background: '#fff',
            borderLeft: `4px solid ${STATUS_COLORS[form.status].bg}`,
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
              <FileText size={24} color="#5B9BD5" />
            </div>
            <span style={{
              padding: '4px 12px',
              background: STATUS_COLORS[form.status].bg,
              color: STATUS_COLORS[form.status].text,
              fontSize: '11px',
              fontWeight: '600',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              {STATUS_COLORS[form.status].label}
            </span>
          </div>

          {/* Form Info */}
          <h3 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#2C3E50',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {form.name}
          </h3>
          <p style={{ 
            margin: '0 0 16px 0', 
            fontSize: '13px', 
            color: '#7F8C8D',
            lineHeight: '1.5',
            height: '40px',
            overflow: 'hidden'
          }}>
            {form.description}
          </p>

          {/* Meta Info */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Database size={14} color="#95A5A6" />
              <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                {form.schema_name}.{form.table_name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#95A5A6" />
              <span style={{ fontSize: '12px', color: '#7F8C8D' }}>
                Updated {formatDate(form.updated_at)}
              </span>
            </div>
          </div>

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
              {form.fields_count} fields
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Edit', form.us_id);
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
                Edit Form
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('More options', form.us_id);
                }}
                style={{
                  padding: '8px',
                  background: 'transparent',
                  color: '#7F8C8D',
                  border: '1px solid #D1D5DB',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Table View Component
function TableView({ forms, formatDate }) {
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
              Status
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Name
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Database
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Category
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Fields
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Updated
            </th>
            <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#495057', textTransform: 'uppercase' }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {forms.map((form, index) => (
            <tr 
              key={form.id}
              style={{ 
                borderBottom: '1px solid #E9ECEF',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F8F9FA'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <td style={{ padding: '16px 20px' }}>
                <span style={{
                  padding: '4px 12px',
                  background: STATUS_COLORS[form.status].bg,
                  color: STATUS_COLORS[form.status].text,
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  display: 'inline-block'
                }}>
                  {STATUS_COLORS[form.status].label}
                </span>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#2C3E50', marginBottom: '4px' }}>
                    {form.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#95A5A6' }}>
                    {form.us_id}
                  </div>
                </div>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '13px', color: '#495057' }}>
                  {form.schema_name}.{form.table_name}
                </div>
              </td>
              <td style={{ padding: '16px 20px', fontSize: '13px', color: '#495057' }}>
                {form.category}
              </td>
              <td style={{ padding: '16px 20px', fontSize: '13px', color: '#495057' }}>
                {form.fields_count}
              </td>
              <td style={{ padding: '16px 20px', fontSize: '13px', color: '#7F8C8D' }}>
                {formatDate(form.updated_at)}
              </td>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => console.log('Edit', form.us_id)}
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
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => console.log('More', form.us_id)}
                    style={{
                      padding: '8px',
                      background: 'transparent',
                      color: '#7F8C8D',
                      border: '1px solid #D1D5DB',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FormsManagement;