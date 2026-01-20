import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SlidersHorizontal } from 'lucide-react';

const ColumnVisibilityMenu = ({
  columns = [],
  onToggleColumn,
  onResetVisibility,
  onHideAll
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-56">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Toggle Columns</DropdownMenuLabel>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onHideAll();
              }}
            >
              Hide All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onResetVisibility();
              }}
            >
              Reset
            </Button>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Column checkboxes */}
        {columns.map(column => (
          <DropdownMenuItem 
            key={column.id} 
            onSelect={(e) => {
              e.preventDefault();
              onToggleColumn(column.id);
            }}
          >
            <div className="flex items-center gap-2 w-full">
              <Checkbox
                checked={column.visible}
                onCheckedChange={() => onToggleColumn(column.id)}
              />
              <span className="flex-1">{column.name}</span>
              {!column.visible && (
                <Badge variant="secondary" className="text-xs">
                  Hidden
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityMenu;