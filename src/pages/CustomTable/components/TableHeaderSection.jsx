import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Search, ArrowUpDown } from 'lucide-react';
import WorkflowCounter from './WorkflowCounter';

/**
 * Table Header Section Component
 * Title, description, search, and workflow counter
 */
const TableHeaderSection = ({
  title = 'All Records',
  description = 'View and manage all database records',
  searchTerm = '',
  onSearchChange,
  tableName,
  onCounterUpdate,
  urlParams = {},
  dropdownSetupExists = false,
  columnOrderExists = false
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Title and Description Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-[95%]">
          <div className="flex md:flex-row md:items-center justify-between w-full">
            <CardTitle className="text-2xl font-semibold text-slate-700">
              {title}
            </CardTitle>

            {/* Workflow Counter */}
            <div className="lg:flex-1 lg:max-w-[500px]">
              <WorkflowCounter
                tableName={tableName}
                onCounterUpdate={onCounterUpdate}
              />
            </div>
          </div>

          <CardDescription className="mt-1">
            {description}

            {/* URL Params Badges */}
            {urlParams.pa_id && (
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                  PA ID: {urlParams.pa_id}
                </Badge>
              </div>
            )}

            {/* Process Name Badge */}
            {urlParams.process_name && (
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
                  Process: {urlParams.process_name}
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                  {urlParams.process_name}_balance
                </Badge>
              </div>
            )}

            {/* Setup Status Badges */}
            {dropdownSetupExists && (
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  Dropdown Configured
                </Badge>
                {columnOrderExists && (
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    Custom Order
                  </Badge>
                )}
              </div>
            )}
          </CardDescription>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3">
        <div className="relative lg:w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );
};

export default TableHeaderSection;