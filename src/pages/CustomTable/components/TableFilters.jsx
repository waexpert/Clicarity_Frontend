import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { getBadgeColor } from '../utils/tableHelpers';
import { STATUS_BADGE_COLORS, PRIORITY_BADGE_COLORS } from '../constants/tableConstants';

/**
 * Table Filters Component
 * Dropdown menu for filtering by status and priority
 */
const TableFilters = ({
  uniqueStatuses = [],
  uniquePriorities = [],
  statusFilter = [],
  priorityFilter = [],
  onToggleStatus,
  onTogglePriority,
  onClearStatusFilter,
  onClearPriorityFilter
}) => {
  const totalActiveFilters = statusFilter.length + priorityFilter.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {totalActiveFilters > 0 && (
            <Badge className="ml-1 py-0 px-1.5 h-5 min-w-5 bg-blue-500 text-white rounded-full">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-56">
        {/* Status Filters */}
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Filter by Status</span>
          {statusFilter.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onClearStatusFilter}
            >
              Clear
            </Button>
          )}
        </DropdownMenuLabel>
        
        {uniqueStatuses.length > 0 ? (
          uniqueStatuses.map(status => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={statusFilter.includes(status)}
              onCheckedChange={() => onToggleStatus(status)}
            >
              <Badge className={`font-medium mr-2 ${getBadgeColor(status, STATUS_BADGE_COLORS)}`}>
                {status}
              </Badge>
              <span>{status}</span>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No statuses available
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Priority Filters */}
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Filter by Priority</span>
          {priorityFilter.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={onClearPriorityFilter}
            >
              Clear
            </Button>
          )}
        </DropdownMenuLabel>
        
        {uniquePriorities.length > 0 ? (
          uniquePriorities.map(priority => (
            <DropdownMenuCheckboxItem
              key={priority}
              checked={priorityFilter.includes(priority)}
              onCheckedChange={() => onTogglePriority(priority)}
            >
              <Badge className={`font-medium mr-2 ${getBadgeColor(priority, PRIORITY_BADGE_COLORS)}`}>
                {priority}
              </Badge>
              <span>{priority}</span>
            </DropdownMenuCheckboxItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No priorities available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableFilters;