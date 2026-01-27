import React, { useMemo, useState } from 'react';
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
import SplitComponent from './SplitComponent';

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

  const [isSplitClicked, setIsSplitClicked] = useState(false);

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

        {/* Conditionally render form OR split component */}
        {!isSplitClicked ? (
          <>
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
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                {isSubmitting 
                  ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                  : (mode === 'create' ? 'Create Record' : 'Update Record')}
              </Button>
              
              <Button
                onClick={() => {
                  console.log("clicked");
                  setIsSplitClicked(true);
                }}
                disabled={isSubmitting}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Add Details
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4">
              <SplitComponent />
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <Button
                onClick={() => setIsSplitClicked(false)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back to Form
              </Button>
              
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit All'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecordFormModal;


// import React, { useMemo, useState } from 'react';
// // Added option to create and add details option but getting error while clicking on create and add details off so need to check it 
// // Error Inserting the Record: error: syntax error at or near "0"
// //     at C:\Users\Owner\Downloads\Clicarity_Backend\node_modules\pg-pool\index.js:45:11
// //     at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
// //     at async exports.createRecord (C:\Users\Owner\Downloads\Clicarity_Backend\controllers\dataController.js:169:20) {
// //   length: 90,
// //   severity: 'ERROR',
// //   code: '42601',
// //   detail: undefined,
// //   hint: undefined,
// //   position: '40',
// //   internalPosition: undefined,
// //   internalQuery: undefined,
// //   where: undefined,
// //   schema: undefined,
// //   table: undefined,
// //   column: undefined,
// //   dataType: undefined,
// //   constraint: undefined,
// //   file: 'scan.l',
// //   line: '1245',
// //   routine: 'scanner_yyerror'
// // }

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import FormInputRenderer from './FormInputRenderer';
// import { getFormColumns, sortColumnsByOrder } from '../utils/tableHelpers';
// import { AUTO_FILLED_FIELDS } from '../constants/tableConstants';
// import { tableApi } from '../services/tableApi';
// import { toast } from 'sonner';
// import { generateUsId } from '../utils/tableHelpers';
// import { useSelector } from 'react-redux';
// import { useSearchParams } from 'react-router-dom';

// /**
//  * Record Form Modal Component
//  * Modal for adding/editing records with nested child record creation
//  */

// const RecordFormModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   formData,
//   onFieldChange,
//   columns,
//   metaData = [],
//   dropdownSetup = {},
//   columnOrder = {},
//   processName = null,
//   isSubmitting = false,
//   mode = 'create'
// }) => {

//   const userData = useSelector((state) => state.user);
//   const owner_id = userData?.owner_id ?? userData?.id;
//   const [searchParams, setSearchParams] = useSearchParams();

//   const [showTableSelector, setShowTableSelector] = useState(false);
//   const [selectedTable, setSelectedTable] = useState('');
//   const [detailFormData, setDetailFormData] = useState({});
//   const [detailColumns, setDetailColumns] = useState([]);
//   const [detailMetaData, setDetailMetaData] = useState([]);
//   const [detailDropdownSetup, setDetailDropdownSetup] = useState({});
//   const [detailColumnOrder, setDetailColumnOrder] = useState({});
//   const [detailProcessName, setDetailProcessName] = useState(null);
//   const [currentParentUsId, setCurrentParentUsId] = useState(null);
//   const [isLoadingTable, setIsLoadingTable] = useState(false);
//   const [isDetailSubmitting, setIsDetailSubmitting] = useState(false);
//   const [isMainSubmitting, setIsMainSubmitting] = useState(false);
  
//   // Available tables for detail records
//   const availableTables = ['books', 'box'];

//   /**
//    * Get ordered form columns
//    */
//   const orderedFormColumns = useMemo(() => {
//     const filteredColumns = getFormColumns(columns, processName);
//     return sortColumnsByOrder(filteredColumns, columnOrder);
//   }, [columns, processName, columnOrder]);

//   /**
//    * Check if field is required
//    */
//   const isFieldRequired = (columnId) => {
//     const columnMetadata = metaData.find(col => col.column_name === columnId);
//     return columnMetadata?.is_nullable === "NO";
//   };

//   /**
//    * Check if field is auto-filled
//    */
//   const isAutoFilled = (columnId) => {
//     return columnId === AUTO_FILLED_FIELDS.PA_ID;
//   };

//   /**
//    * Get dropdown options for column
//    */
//   const getDropdownOptions = (columnId) => {
//     const options = dropdownSetup[columnId];
//     return Array.isArray(options) ? options : [];
//   };

//   /**
//    * Check if field is quantity (for balance calculation hint)
//    */
//   const isQuantityField = (column) => {
//     return processName && (
//       column.id.toLowerCase().includes('quantity') ||
//       column.name.toLowerCase().includes('quantity')
//     );
//   };

//   /**
//    * Get current table name from parent component
//    */
//   const getCurrentTableName = () => {
//     const urlParts = window.location.pathname.split('/');
//     return urlParts[urlParts.length - 1];
//   };

//   /**
//    * Clean data before submission - remove empty values and convert types
//    */
//   const cleanFormData = (data, metadata) => {
//     const cleanData = {};
    
//     Object.entries(data).forEach(([key, value]) => {
//       // Skip completely empty values
//       if (value === '' || value === null || value === undefined) {
//         return;
//       }
      
//       // Find the column metadata to check data type
//       const columnMeta = metadata.find(col => col.column_name === key);
      
//       if (columnMeta) {
//         const dataType = columnMeta.data_type.toLowerCase();
        
//         // Convert to appropriate type based on column type
//         if (dataType.includes('int') || dataType.includes('serial')) {
//           const parsed = parseInt(value, 10);
//           if (!isNaN(parsed)) {
//             cleanData[key] = parsed;
//           }
//         } else if (dataType.includes('numeric') || dataType.includes('decimal') || dataType.includes('float') || dataType.includes('double')) {
//           const parsed = parseFloat(value);
//           if (!isNaN(parsed)) {
//             cleanData[key] = parsed;
//           }
//         } else if (dataType.includes('bool')) {
//           cleanData[key] = value === true || value === 'true' || value === '1';
//         } else if (dataType.includes('date') || dataType.includes('time')) {
//           cleanData[key] = value;
//         } else {
//           // String types
//           cleanData[key] = value;
//         }
//       } else {
//         // If no metadata found, just include the value as-is
//         cleanData[key] = value;
//       }
//     });

//     return cleanData;
//   };

//   /**
//    * Fetch table structure from backend
//    */
//   const fetchTableStructure = async (tableName) => {
//     try {
//       const apiParams = {
//         schemaName: userData.schema_name,
//         tableName: tableName,
//         userId: userData.id,
//         userEmail: userData.email
//       };
      
      
//       // Fetch columns
//       const columnsResponse = await tableApi.getColumns(apiParams);
      
//       // Fetch metadata
//       const metaDataResponse = await tableApi.getMetaData(apiParams);
      
//       // Fetch dropdown setup
//       const dropdownResponse = await tableApi.getDropdownSetup(owner_id, tableName);
      
//       return {
//         columns: columnsResponse || [],
//         metaData: metaDataResponse || [],
//         dropdownSetup: dropdownResponse?.dropdown_setup || {},
//         columnOrder: dropdownResponse?.column_order || {},
//         processName: null
//       };
//     } catch (error) {
//       console.error('Error fetching table structure:', error);
//       throw error;
//     }
//   };

//   /**
//    * Submit main record directly to backend
//    */
//   const submitMainRecord = async (data) => {
//     try {
//       const tableName = getCurrentTableName();
//       const apiParams = {
//         schemaName: userData.schema_name,
//         tableName: tableName,
//         userId: userData.id,
//         userEmail: userData.email
//       };

//       // Clean the data first
//       let cleanData = cleanFormData(data, metaData);

//       // Add balance calculation if process_name exists
//       const urlParams = {
//         process_name: searchParams.get('process_name'),
//         pa_id: searchParams.get('pa_id'),
//         status: searchParams.get('status')
//       };

//       if (urlParams.process_name) {
//         const balanceFieldName = `${urlParams.process_name}_balance`;
//         const quantityField = columns.find(col =>
//           col.id.toLowerCase().includes('quantity')
//         );

//         if (quantityField) {
//           const quantity = cleanData[quantityField.id];
//           if (quantity) {
//             cleanData[balanceFieldName] = quantity;
//           }
//         }
//       }

//       // Add PA_ID separator if needed
//       if ((urlParams.status && urlParams.pa_id) || (urlParams.process_name && urlParams.pa_id)) {
//         cleanData.us_id = `${urlParams.pa_id} -S- ${cleanData.us_id}`;
//       }

//       console.log('Submitting clean data:', cleanData);

//       const response = await tableApi.createRecord(apiParams, owner_id, cleanData);
//       return response;
//     } catch (error) {
//       console.error('Error submitting main record:', error);
//       throw error;
//     }
//   };

//   /**
//    * Submit detail record to backend
//    */
//   const submitDetailRecord = async (data, tableName) => {
//     try {
//       const apiParams = {
//         schemaName: userData.schema_name,
//         tableName: tableName,
//         userId: userData.id,
//         userEmail: userData.email
//       };

//       // Clean the data first
//       const cleanData = cleanFormData(data, detailMetaData);

//       console.log('Submitting detail clean data:', cleanData);

//       const response = await tableApi.createRecord(apiParams, owner_id, cleanData);
//       return response;
//     } catch (error) {
//       console.error('Error submitting detail record:', error);
//       throw error;
//     }
//   };

//   /**
//    * Handle main form submission (without adding details)
//    */
//   const handleSubmitOnly = async () => {
//     // Call parent's onSubmit which handles everything and closes modal
//     await onSubmit();
//   };

//   /**
//    * Handle form submission with "Add Details" flow
//    */
//   const handleSubmitAndAddDetails = async () => {
//     setIsMainSubmitting(true);
//     try {
//       // Submit directly to backend (NOT through parent's onSubmit)
//       const result = await submitMainRecord(formData);
      
//       console.log('Main record created:', result);
      
//       // Extract us_id from formData (the one user entered/generated)
//       const usId = formData.us_id;
      
//       if (usId) {
//         setCurrentParentUsId(usId);
//         toast.success('Record created successfully');
//         setShowTableSelector(true);
//       } else {
//         toast.error('Could not get us_id from created record');
//       }
      
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       toast.error('Failed to create record');
//     } finally {
//       setIsMainSubmitting(false);
//     }
//   };

//   /**
//    * Handle table selection for detail form
//    */
//   const handleTableSelection = async () => {
//     if (!selectedTable) return;

//     setIsLoadingTable(true);
    
//     try {
//       // Fetch columns and metadata for selected table
//       const tableData = await fetchTableStructure(selectedTable);
      
//       console.log('Table data loaded:', tableData);
      
//       setDetailColumns(tableData.columns || []);
//       setDetailMetaData(tableData.metaData || []);
//       setDetailDropdownSetup(tableData.dropdownSetup || {});
//       setDetailColumnOrder(tableData.columnOrder || {});
//       setDetailProcessName(tableData.processName || null);
      
//       // Initialize detail form data with pa_id from parent
//       const initialDetailData = {
//         [AUTO_FILLED_FIELDS.PA_ID]: currentParentUsId,
//         us_id: generateUsId()
//       };
      
//       // Initialize other fields
//       tableData.columns.forEach(column => {
//         if (!initialDetailData[column.id]) {
//           initialDetailData[column.id] = '';
//         }
//       });
      
//       setDetailFormData(initialDetailData);
      
//       console.log('Detail form initialized with pa_id:', currentParentUsId);
      
//       // Hide table selector and show detail form
//       setShowTableSelector(false);
      
//     } catch (error) {
//       console.error('Error loading table data:', error);
//       toast.error('Failed to load table structure. Please try again.');
//     } finally {
//       setIsLoadingTable(false);
//     }
//   };

//   /**
//    * Handle detail form field change
//    */
//   const handleDetailFieldChange = (columnId, value) => {
//     setDetailFormData(prev => ({
//       ...prev,
//       [columnId]: value
//     }));
//   };

//   /**
//    * Handle detail form submission (without adding more details)
//    */
//   const handleDetailSubmitOnly = async () => {
//     setIsDetailSubmitting(true);
//     try {
//       // Submit detail form to the selected table
//       const result = await submitDetailRecord(detailFormData, selectedTable);
      
//       console.log('Detail record created:', result);
      
//       if (result) {
//         toast.success('Detail record created successfully');
//         // Close everything and reload to refresh parent table
//         handleCancel();
//         window.location.reload();
//       }
//     } catch (error) {
//       console.error('Error submitting detail form:', error);
//       toast.error('Failed to create detail record. Please try again.');
//     } finally {
//       setIsDetailSubmitting(false);
//     }
//   };

//   /**
//    * Handle detail form submission with "Add More Details" flow  
//    */
//   const handleDetailSubmitAndAddMore = async () => {
//     setIsDetailSubmitting(true);
//     try {
//       // Submit detail form to the selected table
//       const result = await submitDetailRecord(detailFormData, selectedTable);
      
//       console.log('Detail record created:', result);
      
//       if (result) {
//         toast.success('Detail record created successfully');
        
//         // Reset detail form state
//         setDetailFormData({});
//         setDetailColumns([]);
//         setDetailMetaData([]);
//         setDetailDropdownSetup({});
//         setDetailColumnOrder({});
//         setDetailProcessName(null);
//         setSelectedTable('');
        
//         // Show table selector again for next detail
//         setShowTableSelector(true);
//       }
//     } catch (error) {
//       console.error('Error submitting detail form:', error);
//       toast.error('Failed to create detail record. Please try again.');
//     } finally {
//       setIsDetailSubmitting(false);
//     }
//   };

//   /**
//    * Handle cancel - close everything
//    */
//   const handleCancel = () => {
//     setShowTableSelector(false);
//     setSelectedTable('');
//     setDetailFormData({});
//     setDetailColumns([]);
//     setDetailMetaData([]);
//     setDetailDropdownSetup({});
//     setDetailColumnOrder({});
//     setDetailProcessName(null);
//     setCurrentParentUsId(null);
//     onClose();
//   };

//   /**
//    * Render table selector
//    */
//   const renderTableSelector = () => (
//     <>
//       <DialogHeader>
//         <DialogTitle>Select Table for Details</DialogTitle>
//         <DialogDescription>
//           Choose a table to add detail records linked to the parent record (pa_id: {currentParentUsId})
//         </DialogDescription>
//       </DialogHeader>

//       <div className="py-6">
//         <Label htmlFor="table-select" className="text-sm font-medium mb-2 block">
//           Select Table
//         </Label>
//         <Select value={selectedTable} onValueChange={setSelectedTable}>
//           <SelectTrigger id="table-select" className="w-full">
//             <SelectValue placeholder="Choose a table..." />
//           </SelectTrigger>
//           <SelectContent>
//             {availableTables.map((table) => (
//               <SelectItem key={table} value={table}>
//                 {table.charAt(0).toUpperCase() + table.slice(1)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
//         <Button
//           variant="outline"
//           onClick={handleCancel}
//           className="w-full sm:w-auto"
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleTableSelection}
//           disabled={!selectedTable || isLoadingTable}
//           className="w-full sm:w-auto"
//         >
//           {isLoadingTable ? 'Loading...' : 'Load Form'}
//         </Button>
//       </DialogFooter>
//     </>
//   );

//   /**
//    * Render main form
//    */
//   const renderMainForm = () => (
//     <>
//       <DialogHeader>
//         <DialogTitle>
//           {mode === 'create' ? 'Add New Record' : 'Edit Record'}
//         </DialogTitle>
//         <DialogDescription>
//           {mode === 'create' 
//             ? 'Fill in the details to create a new record in the database.'
//             : 'Update the record details.'}
//           {processName && (
//             <span className="block mt-1 text-blue-600">
//               Note: The {processName}_balance field will be automatically set to match the quantity value.
//             </span>
//           )}
//         </DialogDescription>
//       </DialogHeader>

//       <div className="space-y-6 py-4">
//         {orderedFormColumns.map((column) => {
//           const orderNumber = columnOrder[column.id];
//           const autoFilled = isAutoFilled(column.id);
//           const required = isFieldRequired(column.id);
//           const quantityField = isQuantityField(column);

//           return (
//             <div 
//               key={column.id} 
//               className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
//             >
//               {/* Label */}
//               <Label 
//                 htmlFor={column.id} 
//                 className="font-medium text-sm sm:w-48 sm:text-right sm:flex-shrink-0 flex items-center gap-1 justify-start sm:justify-end"
//               >
//                 {/* Order number badge */}
//                 {orderNumber && (
//                   <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
//                     {orderNumber}
//                   </Badge>
//                 )}
                
//                 <span className="flex-1 sm:flex-initial">{column.name}</span>
                
//                 {/* Required indicator */}
//                 {required && (
//                   <Badge variant="default" className="text-xs h-4 px-1 text-red-100">
//                     *
//                   </Badge>
//                 )}
                
//                 {/* Auto-fill indicator */}
//                 {autoFilled && (
//                   <Badge variant="default" className="text-xs h-4 px-1 bg-green-500 ml-1">
//                     auto
//                   </Badge>
//                 )}
//               </Label>

//               {/* Input */}
//               <div className="flex-1 min-w-0">
//                 <FormInputRenderer
//                   column={column}
//                   value={formData[column.id]}
//                   onChange={onFieldChange}
//                   dropdownOptions={getDropdownOptions(column.id)}
//                   isAutoFilled={autoFilled}
//                   disabled={isSubmitting || isMainSubmitting}
//                 />
                
//                 {/* Helper text for auto-filled fields */}
//                 {autoFilled && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     {column.id === AUTO_FILLED_FIELDS.PA_ID
//                       ? 'Automatically filled from URL parameter'
//                       : 'Automatically generated unique identifier'}
//                   </p>
//                 )}
                
//                 {/* Helper text for quantity field when used for balance */}
//                 {quantityField && (
//                   <p className="text-xs text-blue-600 mt-1">
//                     This value will be used to set {processName}_balance
//                   </p>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
//         <Button
//           variant="outline"
//           onClick={handleCancel}
//           disabled={isSubmitting || isMainSubmitting}
//           className="w-full sm:w-auto"
//         >
//           Cancel
//         </Button>
        
//         <Button
//           onClick={handleSubmitOnly}
//           disabled={isSubmitting || isMainSubmitting}
//           className="w-full sm:w-auto"
//         >
//           {isSubmitting 
//             ? (mode === 'create' ? 'Creating...' : 'Updating...') 
//             : (mode === 'create' ? 'Create Record' : 'Update Record')}
//         </Button>
        
//         <Button
//           onClick={handleSubmitAndAddDetails}
//           disabled={isSubmitting || isMainSubmitting}
//           variant="secondary"
//           className="w-full sm:w-auto"
//         >
//           {isMainSubmitting ? 'Creating...' : 'Create & Add Details'}
//         </Button>
//       </DialogFooter>
//     </>
//   );

//   /**
//    * Render detail form 
//    */
//   const renderDetailForm = () => {
//     const detailOrderedColumns = useMemo(() => {
//       const filteredColumns = getFormColumns(detailColumns, detailProcessName);
//       return sortColumnsByOrder(filteredColumns, detailColumnOrder);
//     }, [detailColumns, detailProcessName, detailColumnOrder]);

//     return (
//       <>
//         <DialogHeader>
//           <DialogTitle>
//             Add Details - {selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}
//           </DialogTitle>
//           <DialogDescription>
//             Adding detail record linked to parent (pa_id: {currentParentUsId})
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-6 py-4">
//           {detailOrderedColumns.map((column) => {
//             const orderNumber = detailColumnOrder[column.id];
//             const autoFilled = column.id === AUTO_FILLED_FIELDS.PA_ID;
//             const required = detailMetaData.find(col => col.column_name === column.id)?.is_nullable === "NO";
//             const dropdownOptions = Array.isArray(detailDropdownSetup[column.id]) 
//               ? detailDropdownSetup[column.id] 
//               : [];

//             return (
//               <div 
//                 key={column.id} 
//                 className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
//               >
//                 <Label 
//                   htmlFor={column.id} 
//                   className="font-medium text-sm sm:w-48 sm:text-right sm:flex-shrink-0 flex items-center gap-1 justify-start sm:justify-end"
//                 >
//                   {orderNumber && (
//                     <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
//                       {orderNumber}
//                     </Badge>
//                   )}
                  
//                   <span className="flex-1 sm:flex-initial">{column.name}</span>
                  
//                   {required && (
//                     <Badge variant="default" className="text-xs h-4 px-1 text-red-100">
//                       *
//                     </Badge>
//                   )}
                  
//                   {autoFilled && (
//                     <Badge variant="default" className="text-xs h-4 px-1 bg-green-500 ml-1">
//                       auto
//                     </Badge>
//                   )}
//                 </Label>

//                 <div className="flex-1 min-w-0">
//                   <FormInputRenderer
//                     column={column}
//                     value={detailFormData[column.id]}
//                     onChange={handleDetailFieldChange}
//                     dropdownOptions={dropdownOptions}
//                     isAutoFilled={autoFilled}
//                     disabled={isDetailSubmitting}
//                   />
                  
//                   {autoFilled && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       Automatically filled from parent record: {currentParentUsId}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
//           <Button
//             variant="outline"
//             onClick={handleCancel}
//             disabled={isDetailSubmitting}
//             className="w-full sm:w-auto"
//           >
//             Cancel
//           </Button>
          
//           <Button
//             onClick={handleDetailSubmitOnly}
//             disabled={isDetailSubmitting}
//             className="w-full sm:w-auto"
//           >
//             {isDetailSubmitting ? 'Creating...' : 'Create Record'}
//           </Button>
          
//           <Button
//             onClick={handleDetailSubmitAndAddMore}
//             disabled={isDetailSubmitting}
//             variant="secondary"
//             className="w-full sm:w-auto"
//           >
//             {isDetailSubmitting ? 'Creating...' : 'Create & Add More Details'}
//           </Button>
//         </DialogFooter>
//       </>
//     );
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent
//         className="max-w-3xl max-h-[80vh] overflow-y-auto"
//         onInteractOutside={(e) => e.preventDefault()}
//       >
//         {showTableSelector 
//           ? renderTableSelector()
//           : detailColumns.length > 0
//             ? renderDetailForm()
//             : renderMainForm()
//         }
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default RecordFormModal;