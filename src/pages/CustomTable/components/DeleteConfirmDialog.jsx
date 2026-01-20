import React from 'react';
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
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

/**
 * Delete Confirmation Dialog Component
 * Modal for confirming record deletion
 */
const DeleteConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  record,
  confirmInput,
  onConfirmInputChange,
  isDeleting = false
}) => {
  const isConfirmValid = confirmInput.trim() === record?.us_id;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Please type the <strong>us_id</strong> to confirm deletion.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Record Information */}
          {record && (
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm font-medium">Record to delete:</p>
              <p className="text-sm text-gray-600">ID: {record.id}</p>
              <p className="text-sm text-gray-600">
                US_ID: <span className="font-mono bg-yellow-100 px-1 rounded">{record.us_id}</span>
              </p>
            </div>
          )}

          {/* Confirmation Input */}
          <div>
            <Label htmlFor="confirm-us-id" className="text-sm font-medium">
              Enter us_id to confirm:
            </Label>
            <Input
              id="confirm-us-id"
              type="text"
              placeholder="Type us_id here"
              value={confirmInput}
              onChange={(e) => onConfirmInputChange(e.target.value)}
              className="mt-1"
              autoFocus
              disabled={isDeleting}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting || !isConfirmValid}
            className="w-full sm:w-auto"
          >
            {isDeleting ? 'Deleting...' : 'Delete Record'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;