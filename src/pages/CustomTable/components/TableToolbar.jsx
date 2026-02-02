// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import {
//   RefreshCw,
//   Plus,
//   FileSpreadsheet,
//   Edit
// } from 'lucide-react';

// const TableToolbar = ({
//   onRefresh,
//   onAddRecord,
//   onExportCSV,
//   onToggleEdit,
//   editEnabled = false,
//   canEdit = true,
//   isLoading = false
// }) => {

//   const handleSplit =()=>{
//     return (
//       <div className="" style={{width:"20rem" ,height:"10rem"}}>
//         <p>Test</p>

//       </div>
//     )
//   }
//   return (
//     <div className="flex flex-wrap items-center gap-2">
//       {/* Add Record Button */}
//       <Button
//         className="flex items-center gap-2"
//         onClick={onAddRecord}
//         disabled={isLoading}
//       >
//         <Plus className="h-4 w-4" />
//         <span className="hidden sm:inline">Add Record</span>
//       </Button>

//           {/* Add Record Button */}
//       <Button
//         className="flex items-center gap-2"
//         onClick={handleSplit}
//         disabled={isLoading}
//       >
//         <Plus className="h-4 w-4" />
//         <span className="hidden sm:inline">Add Split</span>
//       </Button>

//       {/* Refresh Button */}
//       <Button
//         variant="outline"
//         size="sm"
//         className="flex items-center gap-2"
//         onClick={onRefresh}
//         disabled={isLoading}
//       >
//         <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//         <span className="hidden sm:inline">Refresh</span>
//       </Button>

//       {/* Export CSV Button */}
//       <Button
//         variant="outline"
//         size="sm"
//         className="flex items-center gap-2"
//         onClick={onExportCSV}
//         disabled={isLoading}
//       >
//         <FileSpreadsheet className="h-4 w-4" />
//         <span className="hidden sm:inline">Export CSV</span>
//       </Button>

//       {/* Toggle Edit Mode */}
//       {canEdit && (
//         <Button
//           variant="outline"
//           size="sm"
//           className="flex items-center gap-2"
//           onClick={onToggleEdit}
//           disabled={isLoading}
//         >
//           <Edit className="h-4 w-4" />
//           <span className="hidden sm:inline">
//             {editEnabled ? 'Editing' : 'Edit'}
//           </span>
//           {editEnabled && (
//             <Badge className="ml-1 bg-blue-500">ON</Badge>
//           )}
//         </Button>
//       )}
//     </div>
//   );
// };

// export default TableToolbar;



// 15.5 - 1.5 = 14 - 1 = 13/12 = 1.08 - 0.03 = 1.05 - 0.05 = 1
// 8 = 0.66 - 0.06 = 0.60 + 0.30 = 0.90 


import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Edit,
  Split
} from 'lucide-react';
import Suggestion from '../../CustomForms/Component/Suggestion';

const TableToolbar = ({
  onRefresh,
  onAddRecord,
  onExportCSV,
  onToggleEdit,
  editEnabled = false,
  canEdit = true,
  isLoading = false,
  splitOptions = [],
  onSplitLoad
}) => {
  const [showSplitModal, setShowSplitModal] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [paId, setPaId] = React.useState('');
  const [isLoadingSplit, setIsLoadingSplit] = React.useState(false);

  const handleSplit = () => {
    setShowSplitModal(true);
  };

  const handleCancel = () => {
    setShowSplitModal(false);
    setSelectedOption('');
    setPaId('');
  };

  const handleLoad = async () => {
    if (selectedOption && paId.trim() && onSplitLoad) {
      setIsLoadingSplit(true);
      try {
        await onSplitLoad(selectedOption, paId.trim());
        setShowSplitModal(false);
        setSelectedOption('');
        setPaId('');
      } catch (error) {
        console.error('Error loading split:', error);
      } finally {
        setIsLoadingSplit(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          className="flex items-center gap-2"
          onClick={onAddRecord}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Record</span>
        </Button>

        <Button
          className="flex items-center gap-2"
          onClick={handleSplit}
          disabled={isLoading}
        >
          <Split className="h-4 w-4" />
          <span className="hidden sm:inline">Add Split</span>
        </Button>

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

      {/* Split Modal */}
      <Dialog open={showSplitModal} onOpenChange={setShowSplitModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Split Record</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* PA ID Input with Suggestion */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Parent ID (pa_id):</Label>
              <Suggestion
                value={paId}
                onChange={setPaId}
                placeholder="Enter parent ID"
              />
            </div>

            {/* Table Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Table:</Label>
              <Select
                value={selectedOption}
                onValueChange={setSelectedOption}
                disabled={isLoadingSplit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a table" />
                </SelectTrigger>
                <SelectContent>
                  {splitOptions.length > 0 ? (
                    splitOptions.map((option, index) => (
                      <SelectItem
                        key={option.value || index}
                        value={option.value || option}
                      >
                        {option.label || option}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-options" disabled>
                      No options available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoadingSplit}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLoad}
              disabled={!selectedOption || !paId.trim() || isLoadingSplit}
            >
              {isLoadingSplit ? 'Loading...' : 'Load Form'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableToolbar;