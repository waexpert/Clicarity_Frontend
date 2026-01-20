import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import FormInputRenderer from './FormInputRenderer';
import { getFormColumns, sortColumnsByOrder } from '../utils/tableHelpers';
import { AUTO_FILLED_FIELDS } from '../constants/tableConstants';

/**
 * Record Form Modal Component
 * Modal for adding/editing records
 */
const RecordFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFieldChange,
  columns,
  metaData = [],
  dropdownSetup = {},
  columnOrder = {},
  processName = null,
  isSubmitting = false,
  mode = 'create' // 'create' or 'edit'
}) => {
  /**
   * Get ordered form columns
   */
  const orderedFormColumns = useMemo(() => {
    const filteredColumns = getFormColumns(columns, processName);
    return sortColumnsByOrder(filteredColumns, columnOrder);
  }, [columns, processName, columnOrder]);

  /**
   * Check if field is required
   */
  const isFieldRequired = (columnId) => {
    const columnMetadata = metaData.find(col => col.column_name === columnId);
    return columnMetadata?.is_nullable === "NO";
  };

  /**
   * Check if field is auto-filled
   */
  const isAutoFilled = (columnId) => {
    return columnId === AUTO_FILLED_FIELDS.PA_ID;
  };

  /**
   * Get dropdown options for column
   */
  const getDropdownOptions = (columnId) => {
    const options = dropdownSetup[columnId];
    return Array.isArray(options) ? options : [];
  };

  /**
   * Check if field is quantity (for balance calculation hint)
   */
  const isQuantityField = (column) => {
    return processName && (
      column.id.toLowerCase().includes('quantity') ||
      column.name.toLowerCase().includes('quantity')
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[80vh] overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New Record' : 'Edit Record'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Fill in the details to create a new record in the database.'
              : 'Update the record details.'}
            {processName && (
              <span className="block mt-1 text-blue-600">
                Note: The {processName}_balance field will be automatically set to match the quantity value.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {orderedFormColumns.map((column) => {
            const orderNumber = columnOrder[column.id];
            const hasDropdown = getDropdownOptions(column.id).length > 0;
            const autoFilled = isAutoFilled(column.id);
            const required = isFieldRequired(column.id);
            const quantityField = isQuantityField(column);

            return (
              <div 
                key={column.id} 
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
              >
                {/* Label */}
                <Label 
                  htmlFor={column.id} 
                  className="font-medium text-sm sm:w-48 sm:text-right sm:flex-shrink-0 flex items-center gap-1 justify-start sm:justify-end"
                >
                  {/* Order number badge */}
                  {orderNumber && (
                    <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
                      {orderNumber}
                    </Badge>
                  )}
                  
                  <span className="flex-1 sm:flex-initial">{column.name}</span>
                  
                  {/* Required indicator */}
                  {required && (
                    <Badge variant="default" className="text-xs h-4 px-1 text-red-100">
                      *
                    </Badge>
                  )}
                  
                  {/* Auto-fill indicator */}
                  {autoFilled && (
                    <Badge variant="default" className="text-xs h-4 px-1 bg-green-500 ml-1">
                      auto
                    </Badge>
                  )}
                </Label>

                {/* Input */}
                <div className="flex-1 min-w-0">
                  <FormInputRenderer
                    column={column}
                    value={formData[column.id]}
                    onChange={onFieldChange}
                    dropdownOptions={getDropdownOptions(column.id)}
                    isAutoFilled={autoFilled}
                    disabled={isSubmitting}
                  />
                  
                  {/* Helper text for auto-filled fields */}
                  {autoFilled && (
                    <p className="text-xs text-gray-500 mt-1">
                      {column.id === AUTO_FILLED_FIELDS.PA_ID
                        ? 'Automatically filled from URL parameter'
                        : 'Automatically generated unique identifier'}
                    </p>
                  )}
                  
                  {/* Helper text for quantity field when used for balance */}
                  {quantityField && (
                    <p className="text-xs text-blue-600 mt-1">
                      This value will be used to set {processName}_balance
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {isSubmitting 
              ? (mode === 'create' ? 'Creating...' : 'Updating...') 
              : (mode === 'create' ? 'Create Record' : 'Update Record')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordFormModal;