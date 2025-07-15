import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Import shadcn/ui components - make sure these paths match your project structure
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateAndTimePicker({ selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    // Use a slight delay to avoid interfering with click events
    if (open) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3" ref={popoverRef}>
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto overflow-hidden p-0" 
            align="start"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={(date) => {
                onDateChange(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={selectedTime || "10:30:00"}
          onChange={(e) => onTimeChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}