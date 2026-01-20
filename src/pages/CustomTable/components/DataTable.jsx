import React, { useState, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, Trash2, FileText } from 'lucide-react';
import { getBadgeColor } from '../utils/tableHelpers';
import { STATUS_BADGE_COLORS, PRIORITY_BADGE_COLORS } from '../constants/tableConstants';

/**
 * Data Table Component
 * Main table rendering with inline editing
 */
const DataTable = ({
  records = [],
  columns = [],
  loading = false,
  editEnabled = false,
  canDelete = false,
  onSort,
  onDeleteRecord,
  onEditRecord,
  onSaveRecord,
  sortColumn = null,
  sortDirection = 'asc',
  emptyMessage = 'No records found',
  onClearFilters
}) => {
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingValues, setEditingValues] = useState({});

  /**
   * Handle row click for editing
   */
  const handleRowClick = useCallback((record) => {
    if (editEnabled) {
      setEditingRowId(record.id);
      setEditingValues(record);
      if (onEditRecord) {
        onEditRecord(record);
      }
    }
  }, [editEnabled, onEditRecord]);

  /**
   * Handle save
   */
  const handleSave = useCallback(() => {
    if (onSaveRecord) {
      onSaveRecord(editingRowId, editingValues);
    }
    setEditingRowId(null);
    setEditingValues({});
  }, [editingRowId, editingValues, onSaveRecord]);

  /**
   * Handle cancel
   */
  const handleCancel = useCallback(() => {
    setEditingRowId(null);
    setEditingValues({});
  }, []);

  /**
   * Handle field change during inline edit
   */
  const handleFieldChange = useCallback((columnId, value) => {
    setEditingValues(prev => ({
      ...prev,
      [columnId]: value
    }));
  }, []);

  /**
   * Render cell content
   */
  const renderCellContent = (record, column) => {
    const value = record[column.id];

    // Inline editing mode
    if (editingRowId === record.id && column.id !== 'id' && editEnabled) {
      return (
        <Input
          type="text"
          value={editingValues[column.id] || ''}
          onChange={(e) => handleFieldChange(column.id, e.target.value)}
          className="border rounded px-2 py-1 w-full"
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    // Status badge
    if (column.id === 'status') {
      return (
        <Badge className={`font-medium ${getBadgeColor(value, STATUS_BADGE_COLORS)}`}>
          {value}
        </Badge>
      );
    }

    // Priority badge
    if (column.id === 'priority') {
      return (
        <Badge className={`font-medium ${getBadgeColor(value, PRIORITY_BADGE_COLORS)}`}>
          {value}
        </Badge>
      );
    }

    // File indicator
    if (column.id === 'task_file' && value) {
      return (
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4 text-slate-400" />
          <span>{value}</span>
        </div>
      );
    }

    // Default text
    return <span>{value || '—'}</span>;
  };

  // Visible columns only
  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              {/* Delete column */}
              {canDelete && (
                <TableHead className="w-[60px] text-center">Delete</TableHead>
              )}

              {/* Data columns */}
              {visibleColumns.map(column => (
                <TableHead
                  key={column.id}
                  className={`${column.sortable ? 'cursor-pointer hover:bg-slate-100' : ''}`}
                  onClick={() => column.sortable && onSort && onSort(column.id)}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.name}</span>
                    {sortColumn === column.id && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          sortDirection === 'desc' ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading state */}
            {loading ? (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumns.length + (canDelete ? 1 : 0)} 
                  className="h-24 text-center"
                >
                  Loading records...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              /* Empty state */
              <TableRow>
                <TableCell 
                  colSpan={visibleColumns.length + (canDelete ? 1 : 0)} 
                  className="h-24 text-center"
                >
                  {emptyMessage}
                  {onClearFilters && (
                    <Button variant="link" onClick={onClearFilters} className="ml-2">
                      Clear filters?
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              /* Data rows */
              records.map((record, index) => (
                <TableRow
                  key={record.id || index}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => handleRowClick(record)}
                >
                  {/* Delete button */}
                  {canDelete && (
                    <TableCell className="w-[60px] text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteRecord && onDeleteRecord(record);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}

                  {/* Data cells */}
                  {visibleColumns.map(column => (
                    <TableCell key={column.id}>
                      {renderCellContent(record, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inline edit controls */}
      {editingRowId && editEnabled && (
        <div className="flex gap-2 p-3 bg-slate-50 border-t">
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataTable;