import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Edit
} from 'lucide-react';

const TableToolbar = ({
  onRefresh,
  onAddRecord,
  onExportCSV,
  onToggleEdit,
  editEnabled = false,
  canEdit = true,
  isLoading = false
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Add Record Button */}
      <Button
        className="flex items-center gap-2"
        onClick={onAddRecord}
        disabled={isLoading}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Record</span>
      </Button>

      {/* Refresh Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onRefresh}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Refresh</span>
      </Button>

      {/* Export CSV Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={onExportCSV}
        disabled={isLoading}
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span className="hidden sm:inline">Export CSV</span>
      </Button>

      {/* Toggle Edit Mode */}
      {canEdit && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={onToggleEdit}
          disabled={isLoading}
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">
            {editEnabled ? 'Editing' : 'Edit'}
          </span>
          {editEnabled && (
            <Badge className="ml-1 bg-blue-500">ON</Badge>
          )}
        </Button>
      )}
    </div>
  );
};

export default TableToolbar;