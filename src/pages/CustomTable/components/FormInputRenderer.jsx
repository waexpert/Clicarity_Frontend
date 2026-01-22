import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COLUMN_TYPES, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/tableConstants';

/**
 * Form Input Renderer Component
 * Renders appropriate input based on column type
 */
const FormInputRenderer = ({
  column,
  value,
  onChange,
  dropdownOptions = [],
  isAutoFilled = false,
  disabled = false
}) => {
  const { id, type, name } = column;

  // Auto-filled fields
  if (isAutoFilled) {
    return (
      <Input
        id={id}
        type="text"
        value={value || ''}
        disabled={true}
        className="bg-gray-50 cursor-not-allowed text-gray-600"
        placeholder={`Auto-filled ${name.toLowerCase()}`}
      />
    );
  }

  // Dropdown fields
  if (dropdownOptions.length > 0) {
    return (
      <Select 
        value={value || ''} 
        onValueChange={(val) => onChange(id, val)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${name.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {dropdownOptions.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Render based on column type
  switch (type) {
    case COLUMN_TYPES.TEXTAREA:
      return (
        <Textarea
          id={id}
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}`}
          rows={3}
          disabled={disabled}
        />
      );

    // case COLUMN_TYPES.SELECT_STATUS:
    //   return (
    //     <Select 
    //       value={value || ''} 
    //       onValueChange={(val) => onChange(id, val)}
    //       disabled={disabled}
    //     >
    //       <SelectTrigger>
    //         <SelectValue placeholder="Select status" />
    //       </SelectTrigger>
    //       <SelectContent>
    //         <SelectItem value={STATUS_OPTIONS.PENDING}>Pending</SelectItem>
    //         <SelectItem value={STATUS_OPTIONS.IN_PROGRESS}>In Progress</SelectItem>
    //         <SelectItem value={STATUS_OPTIONS.COMPLETED}>Completed</SelectItem>
    //       </SelectContent>
    //     </Select>
    //   );

    case COLUMN_TYPES.SELECT_PRIORITY:
      return (
        <Select 
          value={value || ''} 
          onValueChange={(val) => onChange(id, val)}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PRIORITY_OPTIONS.LOW}>Low</SelectItem>
            <SelectItem value={PRIORITY_OPTIONS.MEDIUM}>Medium</SelectItem>
            <SelectItem value={PRIORITY_OPTIONS.HIGH}>High</SelectItem>
          </SelectContent>
        </Select>
      );

    case COLUMN_TYPES.NUMBER:
      return (
        <Input
          id={id}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}`}
          disabled={disabled}
        />
      );

    case COLUMN_TYPES.EMAIL:
      return (
        <Input
          id={id}
          type="email"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}`}
          disabled={disabled}
        />
      );

    case COLUMN_TYPES.PHONE:
      return (
        <Input
          id={id}
          type="tel"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}`}
          disabled={disabled}
        />
      );

    case COLUMN_TYPES.DATE:
      return (
        <Input
          id={id}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          disabled={disabled}
        />
      );

    case COLUMN_TYPES.URL:
      return (
        <Input
          id={id}
          type="url"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}`}
          disabled={disabled}
        />
      );

    case COLUMN_TYPES.CHECKBOX:
      return (
        <Checkbox
          id={id}
          checked={value || false}
          onCheckedChange={(checked) => onChange(id, checked)}
          disabled={disabled}
        />
      );

    default:
      return (
        <Input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(id, e.target.value)}
          placeholder={`Enter ${name.toLowerCase()}`}
          disabled={disabled}
        />
      );
  }
};

export default FormInputRenderer;