// import React, { useState, useCallback, useEffect, useMemo } from 'react';
// import { useParams, useSearchParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Card, CardContent, CardHeader } from '@/components/ui/card';
// import { toast } from 'sonner';
// import Papa from 'papaparse';

// // Hooks
// import { useTableData } from './hooks/useTableData';
// import { useColumnPreferences } from './hooks/useColumnPreferences';
// import { useTableFilters } from './hooks/useTableFilters';
// import { usePagination } from './hooks/usePagination';
// import { useRecordForm } from './hooks/useRecordForm';
// import { useDropdownSetup } from './hooks/useDropdownSetup';

// // Components
// import TableHeaderSection from './components/TableHeaderSection';
// import TableToolbar from './components/TableToolbar';
// import TableFilters from './components/TableFilters';
// import ColumnVisibilityMenu from './components/ColumnVisibilityMenu';
// import DataTable from './components/DataTable';
// import RecordFormModal from './components/RecordFormModal';
// import DeleteConfirmDialog from './components/DeleteConfirmDialog';
// import ResponsivePagination from './components/Pagination';

// // Services & Utils
// import { tableApi } from './services/tableApi';
// import { generateUsId } from './utils/tableHelpers';
// import { logger } from './utils/logger';

// // CSS
// import '../../css/components/CustomTable.css';
// import SplitModal from './components/SplitComponent';
// import axios from 'axios';

// /**
//  * Custom Table Component - Main Entry Point
//  * Professional, modular table component with full CRUD operations
//  */
// const CustomTable = ({ type = 'normal' }) => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const userData = useSelector((state) => state.user);

//   // URL Parameters
//   const urlParams = useMemo(() => ({
//     pa_id: searchParams.get('pa_id'),
//     us_id: searchParams.get('us_id'),
//     show: searchParams.get('show'),
//     status: searchParams.get('status'),
//     process_name: searchParams.get('process_name'),
//   }), [searchParams]);

//   // API Parameters

// // To this (more readable):
// const { tableName1: tableNameFromUrl } = useParams();

// // Then use it:
// const apiParams = useMemo(() => ({
//   schemaName: userData.schema_name,
//   tableName: tableNameFromUrl ,
//   userId: userData.id,
//   userEmail: userData.email
// }), [userData.schema_name, tableNameFromUrl, userData.id, userData.email]);

//   const owner_id = userData?.owner_id ?? userData?.id;

//   // State
//   const [editEnabled, setEditEnabled] = useState(false);
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [counterConfig, setCounterConfig] = useState({
//     counter: 0,
//     prefix: "",
//     isActive: false,
//     recordId: null
//   });

//   // Delete dialog state
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [recordToDelete, setRecordToDelete] = useState(null);
//   const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Custom Hooks
//   const {
//     records: allRecords,
//     setRecords: setAllRecords,
//     originalRecords,
//     columns: baseColumns,
//     setColumns: setBaseColumns,
//     metaData,
//     loading,
//     refreshData
//   } = useTableData(apiParams, type, owner_id);

//   const {
//     columns,
//     setColumns,
//     toggleColumnVisibility,
//     resetColumnVisibility,
//     hideAllColumns,
//     visibleColumns
//   } = useColumnPreferences(owner_id, apiParams.tableName, apiParams.schemaName, baseColumns);

//   const {
//     searchTerm,
//     setSearchTerm,
//     statusFilter,
//     priorityFilter,
//     filteredRecords,
//     uniqueStatuses,
//     uniquePriorities,
//     toggleStatusFilter,
//     togglePriorityFilter,
//     clearFilters,
//     hasActiveFilters
//   } = useTableFilters(originalRecords);

//   const {
//     currentPage,
//     pageSize,
//     totalRecords,
//     totalPages,
//     currentRecords,
//     setCurrentPage,
//     resetPagination
//   } = usePagination(filteredRecords);

//   const {
//     formData,
//     isSubmitting,
//     isOpen: isFormOpen,
//     handleFieldChange,
//     submitForm,
//     openForm,
//     closeForm
//   } = useRecordForm(apiParams, type, refreshData);

//   const {
//     dropdownSetup,
//     columnOrder,
//     setupExists: dropdownSetupExists,
//     getDropdownOptions,
//     hasDropdown
//   } = useDropdownSetup(owner_id, apiParams.tableName);
  
//   // Add new state for split form
// const [splitFormOpen, setSplitFormOpen] = useState(false);
// const [splitTableData, setSplitTableData] = useState({
//   tableName: '',
//   paId: '',
//   columns: [],
//   metaData: [],
//   dropdownSetup: {},
//   columnOrder: {},
//   formData: {}
// });

//  const fetchTableStructure = async (tableName) => {
//     try {
//       const apiParams = {
//         schemaName: userData.schema_name,
//         tableName: tableName,
//         userId: userData.id,
//         userEmail: userData.email
//       };

//       console.log('Fetching table structure for:', tableName);

//       // Fetch all data to extract columns (same as CustomTable does)
//       const response = await axios.post(
//         `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`,
//         apiParams
//       );

//       console.log('Response:', response.data);

//       const fetchedData = response.data.data || [];
//       const metaDataFromResponse = response.data.columns || [];

//       // Generate columns from first record (same logic as CustomTable)
//       let dynamicColumns = [];
//       if (fetchedData.length > 0) {
//         const recordForColumns = fetchedData[0];
//         dynamicColumns = Object.keys(recordForColumns).map(key => ({
//           id: key,
//           name: formatColumnName(key),
//           accessor: key,
//           sortable: true,
//           visible: true,
//           type: getColumnType(recordForColumns[key], key)
//         }));
//       }

//       // Fetch dropdown setup
//       const dropdownRoute = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
//       const dropdownResponse = await axios.get(dropdownRoute);

//       let dropdownSetup = {};
//       let columnOrder = {};

//       if (dropdownResponse.data.exists && dropdownResponse.data.setup) {
//         dropdownSetup = dropdownResponse.data.setup.mapping || {};
//         columnOrder = dropdownResponse.data.setup.columnOrder || {};
//       }

//       return {
//         columns: dynamicColumns,
//         metaData: metaDataFromResponse,
//         dropdownSetup: dropdownSetup,
//         columnOrder: columnOrder,
//         processName: null
//       };
//     } catch (error) {
//       console.error('Error fetching table structure:', error);
//       throw error;
//     }
//   };

//   /**
//    * Helper function to format column names
//    */
//   const formatColumnName = (key) => {
//     return key
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   /**
//    * Helper function to determine column type
//    */
//   const getColumnType = (value, columnName) => {
//     const lowerColumnName = columnName.toLowerCase();

//     if (lowerColumnName.includes('email')) return 'email';
//     if (lowerColumnName.includes('phone')) return 'tel';
//     if (lowerColumnName.includes('url') || lowerColumnName.includes('link')) return 'url';
//     if (lowerColumnName === 'status') return 'select-status';
//     if (lowerColumnName === 'priority') return 'select-priority';
//     if (lowerColumnName.includes('description') || lowerColumnName.includes('notes') || lowerColumnName.includes('comment')) return 'textarea';
//     if (lowerColumnName.includes('date') || lowerColumnName.includes('created') || lowerColumnName.includes('updated')) return 'date';

//     if (typeof value === 'number') return 'number';
//     if (typeof value === 'boolean') return 'checkbox';
//     if (value && value.length > 100) return 'textarea';

//     return 'text';
//   };

// /**
//  * Handle split load - fetch table structure and prepare form
//  */
// const handleSplitLoad = async (selectedTable, paId) => {
//   try {
//     console.log('Loading split form for table:', selectedTable, 'with pa_id:', paId);
    
//     // Fetch table structure
//     const tableData = await fetchTableStructure(selectedTable);
    
//     // Initialize form data with pa_id and us_id
//     const initialFormData = {
//       pa_id: paId,
//       us_id: generateUsId()
//     };

//     // Initialize other fields
//     tableData.columns.forEach(column => {
//       if (!initialFormData[column.id]) {
//         initialFormData[column.id] = '';
//       }
//     });

//     // Store table data and open split form
//     setSplitTableData({
//       tableName: selectedTable,
//       paId: paId,
//       columns: tableData.columns,
//       metaData: tableData.metaData,
//       dropdownSetup: tableData.dropdownSetup,
//       columnOrder: tableData.columnOrder,
//       formData: initialFormData
//     });

//     setSplitFormOpen(true);
//     toast.success('Form loaded successfully');
    
//   } catch (error) {
//     console.error('Failed to load split table:', error);
//     toast.error('Failed to load form');
//     throw error; // Re-throw to keep modal open
//   }
// };

// /**
//  * Handle split form field change
//  */
// const handleSplitFieldChange = (columnId, value) => {
//   setSplitTableData(prev => ({
//     ...prev,
//     formData: {
//       ...prev.formData,
//       [columnId]: value
//     }
//   }));
// };

// /**
//  * Handle split form submit
//  */
// const handleSplitFormSubmit = async () => {
//   try {
//     console.log('Submitting split record:', splitTableData);

//     // Clean the form data
//     const cleanData = {};
//     Object.entries(splitTableData.formData).forEach(([key, value]) => {
//       if (value !== '' && value !== null && value !== undefined) {
//         const columnMeta = splitTableData.metaData.find(col => col.column_name === key);
        
//         if (columnMeta) {
//           const dataType = columnMeta.data_type.toLowerCase();
          
//           if (dataType.includes('int') || dataType.includes('serial')) {
//             const parsed = parseInt(value, 10);
//             if (!isNaN(parsed)) cleanData[key] = parsed;
//           } else if (dataType.includes('numeric') || dataType.includes('decimal') || dataType.includes('float')) {
//             const parsed = parseFloat(value);
//             if (!isNaN(parsed)) cleanData[key] = parsed;
//           } else if (dataType.includes('bool')) {
//             cleanData[key] = value === true || value === 'true' || value === '1';
//           } else {
//             cleanData[key] = value;
//           }
//         } else {
//           cleanData[key] = value;
//         }
//       }
//     });

//     // Format us_id with pa_id separator
//     if (cleanData.us_id && cleanData.pa_id) {
//       cleanData.us_id = `${cleanData.pa_id} -S- ${cleanData.us_id}`;
//     }

//     console.log('Clean data:', cleanData);

//     // Submit to backend
//     const apiParams = {
//       schemaName: userData.schema_name,
//       tableName: splitTableData.tableName
//     };

//     await tableApi.createRecord(apiParams, cleanData);
    
//     toast.success('Split record created successfully');
//     setSplitFormOpen(false);
    
//     // Reset split table data
//     setSplitTableData({
//       tableName: '',
//       paId: '',
//       columns: [],
//       metaData: [],
//       dropdownSetup: {},
//       columnOrder: {},
//       formData: {}
//     });

//     // Optionally refresh the main table
//     refreshData();

//   } catch (error) {
//     console.error('Error creating split record:', error);
//     toast.error('Failed to create split record: ' + (error.response?.data?.details || error.message));
//     throw error;
//   }
// };

// /**
//  * Handle split form close
//  */
// const handleSplitFormClose = () => {
//   setSplitFormOpen(false);
//   setSplitTableData({
//     tableName: '',
//     paId: '',
//     columns: [],
//     metaData: [],
//     dropdownSetup: {},
//     columnOrder: {},
//     formData: {}
//   });
// };

//   /**
//    * Sync base columns with preference columns
//    */
// useEffect(() => {
//   if (
//     baseColumns.length > 0 &&
//     columns.length === 0
//   ) {
//     setColumns(baseColumns);
//   }
// }, [baseColumns]);

//   /**
//    * Handle search from URL params
//    */
//   useEffect(() => {
//     const searchQuery = searchParams.get('search');
//     if (searchQuery) {
//       setSearchTerm(decodeURIComponent(searchQuery));
//     }
//   }, [searchParams, setSearchTerm]);

//   /**
//    * Auto-open form modal if show=true
//    */
//   useEffect(() => {
//     if (urlParams.show === 'true' && columns.length > 0) {
//       handleOpenAddModal();
//     }
//   }, [urlParams.show, columns]);

//   /**
//    * Handle counter update from WorkflowCounter
//    */
//   const handleCounterUpdate = useCallback((config) => {
//     setCounterConfig(config);
//     logger.debug('Counter config updated:', config);
//   }, []);

//   /**
//    * Handle refresh
//    */
//   const handleRefresh = useCallback(() => {
//     refreshData();
//     clearFilters();
//     resetPagination();
//     toast.success('Data refreshed');
//   }, [refreshData, clearFilters, resetPagination]);

//   /**
//    * Handle search input
//    */
//   const handleSearchChange = useCallback((e) => {
//     setSearchTerm(e.target.value);
//     resetPagination();
//   }, [setSearchTerm, resetPagination]);

//   /**
//    * Handle sort
//    */
//   const handleSort = useCallback((columnId) => {
//     if (sortColumn === columnId) {
//       setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortColumn(columnId);
//       setSortDirection('asc');
//     }

//     const sortedRecords = [...filteredRecords].sort((a, b) => {
//       const valueA = a[columnId] || '';
//       const valueB = b[columnId] || '';

//       if (typeof valueA === 'string' && typeof valueB === 'string') {
//         return sortDirection === 'asc'
//           ? valueA.localeCompare(valueB)
//           : valueB.localeCompare(valueA);
//       } else {
//         return sortDirection === 'asc'
//           ? valueA - valueB
//           : valueB - valueA;
//       }
//     });

//     setAllRecords(sortedRecords);
//   }, [sortColumn, sortDirection, filteredRecords, setAllRecords]);

//   /**
//    * Export to CSV
//    */
//   const handleExportCSV = useCallback(() => {
//     if (!filteredRecords.length) {
//       toast.error('No records to export');
//       return;
//     }

//     try {
//       const exportData = filteredRecords.map(record => {
//         const filteredRecord = {};
//         visibleColumns.forEach(column => {
//           filteredRecord[column.name] = record[column.id];
//         });
//         return filteredRecord;
//       });

//       const csv = Papa.unparse(exportData, {
//         quotes: true,
//         quoteChar: '"',
//         delimiter: ",",
//         header: true
//       });

//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       const date = new Date().toISOString().slice(0, 10);
//       const filename = `${apiParams.tableName}_export_${date}.csv`;

//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.display = 'none';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       toast.success(`Exported ${exportData.length} records to CSV`);
//     } catch (error) {
//       logger.error('Error exporting CSV:', error);
//       toast.error('Failed to export CSV');
//     }
//   }, [filteredRecords, visibleColumns, apiParams.tableName]);

//   /**
//    * Handle open add modal
//    */
//   const handleOpenAddModal = useCallback(async () => {
//     const initialData = {};

//     // Pre-fill from URL params
//     columns.forEach(column => {
//       if (urlParams[column.id]) {
//         initialData[column.id] = urlParams[column.id];
//       } else if (column.id === 'us_id') {
//         initialData[column.id] = counterConfig.isActive
//           ? `${counterConfig.prefix}${counterConfig.counter}`
//           : generateUsId();
//       } else {
//         initialData[column.id] = '';
//       }
//     });

//     openForm(initialData);

//     // Clear show param
//     if (urlParams.show === 'true') {
//       const newParams = new URLSearchParams(searchParams);
//       newParams.delete('show');
//       setSearchParams(newParams, { replace: true });
//     }
//   }, [columns, urlParams, counterConfig, openForm, searchParams, setSearchParams]);

// //   const handleSplitLoad = async (selectedTable) => {
// //   try {
// //     // Similar to RecordFormModal's fetchTableStructure
// //     const tableData = await fetchTableStructure(selectedTable);
    
// //     // Open a form modal with the loaded table structure
// //     // or navigate to a new page, etc.
// //     console.log('Loaded table:', selectedTable, tableData);
    
// //   } catch (error) {
// //     console.error('Failed to load split table:', error);
// //     toast.error('Failed to load form');
// //     throw error; // Re-throw to keep modal open
// //   }
// // };


//   /**
//    * Handle create record
//    */
//   const handleCreateRecord = useCallback(async () => {
//     try {
//       // Add balance calculation if process_name exists
//       let additionalData = {};

//       if (urlParams.process_name) {
//         const balanceFieldName = `${urlParams.process_name}_balance`;
//         const quantityField = columns.find(col =>
//           col.id.toLowerCase().includes('quantity')
//         );

//         if (quantityField) {
//           const quantity = formData[quantityField.id];
//           if (quantity) {
//             additionalData[balanceFieldName] = quantity;
//           }
//         }
//       }

//       // Add PA_ID separator if needed
//       if ((urlParams.status && urlParams.pa_id) || (urlParams.process_name && urlParams.pa_id)) {
//         additionalData.us_id = `${urlParams.pa_id} -S- ${formData.us_id}`;
//       }

//       await submitForm(additionalData);

//       // Increment counter if active
//       if (counterConfig.isActive && counterConfig.recordId) {
//         try {
//           await tableApi.updateRecord(
//             { schemaName: 'public', tableName: 'counter_setup' },
//             counterConfig.recordId,
//             owner_id,
//             { counter: counterConfig.counter + 1 }
//           );

//           setCounterConfig(prev => ({
//             ...prev,
//             counter: prev.counter + 1
//           }));
//         } catch (error) {
//           logger.error('Counter increment failed:', error);
//           toast.warning('Record created but counter increment failed');
//         }
//       }

//       // Clear URL params
//       setSearchParams({});

//     } catch (error) {
//       logger.error('Create record failed:', error);
//     }
//   }, [formData, columns, urlParams, counterConfig, submitForm, owner_id, setSearchParams]);

//   /**
//    * Handle delete click
//    */
//   const handleDeleteClick = useCallback((record) => {
//     setRecordToDelete(record);
//     setDeleteConfirmInput('');
//     setDeleteDialogOpen(true);
//   }, []);

//   /**
//    * Handle delete confirm
//    */
//   const handleDeleteConfirm = useCallback(async () => {
//     if (!recordToDelete || deleteConfirmInput.trim() !== recordToDelete.us_id) {
//       toast.error('Entered us_id does not match');
//       return;
//     }

//     try {
//       setIsDeleting(true);
//       await tableApi.deleteRecord(apiParams, recordToDelete.id);
//       toast.success('Record deleted successfully');
//       setDeleteDialogOpen(false);
//       setRecordToDelete(null);
//       setDeleteConfirmInput('');
//       refreshData();
//     } catch (error) {
//       logger.error('Delete failed:', error);
//       toast.error('Failed to delete record');
//     } finally {
//       setIsDeleting(false);
//     }
//   }, [recordToDelete, deleteConfirmInput, apiParams, refreshData]);

//   /**
//    * Handle save record (inline edit)
//    */
//   const handleSaveRecord = useCallback(async (recordId, updates) => {
//     try {
//       // Filter out unchanged values
//       const originalRecord = originalRecords.find(r => r.id === recordId);
//       const changes = {};

//       Object.entries(updates).forEach(([key, val]) => {
//         if (val !== originalRecord[key] && key !== 'id' && key !== 'pa_id' && key !== 'us_id') {
//           changes[key] = val;
//         }
//       });

//       if (Object.keys(changes).length === 0) {
//         toast.warning('No changes to save');
//         return;
//       }

//       await tableApi.updateRecord(apiParams, recordId, owner_id, changes);
//       toast.success('Record updated successfully');
//       refreshData();
//     } catch (error) {
//       logger.error('Update failed:', error);
//       toast.error('Failed to update record');
//     }
//   }, [originalRecords, apiParams, owner_id, refreshData]);

//   // Don't render if show=true (modal will handle it)
//   if (urlParams.show === 'true') return null;

//   return (
//     <Card className="tableCard shadow-sm border-slate-200 mx-[6rem]">
//       <CardHeader className="pb-3">
//         <TableHeaderSection
//           title="All Records"
//           description="View and manage all database records"
//           searchTerm={searchTerm}
//           onSearchChange={handleSearchChange}
//           tableName={apiParams.tableName}
//           onCounterUpdate={handleCounterUpdate}
//           urlParams={urlParams}
//           dropdownSetupExists={dropdownSetupExists}
//           columnOrderExists={Object.keys(columnOrder).length > 0}
//         />
//       </CardHeader>

//       <CardContent>
//         {/* Toolbar */}
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex flex-wrap items-center gap-2">
//             <TableToolbar
//               onRefresh={handleRefresh}
//               onAddRecord={handleOpenAddModal}
//               onExportCSV={handleExportCSV}
//               onToggleEdit={() => setEditEnabled(!editEnabled)}
//               editEnabled={editEnabled}
//               canEdit={userData.owner_id === null}
//               isLoading={loading}
//               splitOptions={["box","product1"]}
//               onSplitLoad={handleSplitLoad}
              
//             />

//             <TableFilters
//               uniqueStatuses={uniqueStatuses}
//               uniquePriorities={uniquePriorities}
//               statusFilter={statusFilter}
//               priorityFilter={priorityFilter}
//               onToggleStatus={toggleStatusFilter}
//               onTogglePriority={togglePriorityFilter}
//               onClearStatusFilter={() => toggleStatusFilter([])}
//               onClearPriorityFilter={() => togglePriorityFilter([])}
//             />

//             <ColumnVisibilityMenu
//               columns={columns}
//               onToggleColumn={toggleColumnVisibility}
//               onResetVisibility={resetColumnVisibility}
//               onHideAll={hideAllColumns}
//             />
//           </div>
//         </div>

//         {/* Table */}
//         <DataTable
//           records={currentRecords}
//           columns={columns}
//           loading={loading}
//           editEnabled={editEnabled}
//           canDelete={userData.owner_id === null}
//           onSort={handleSort}
//           onDeleteRecord={handleDeleteClick}
//           onSaveRecord={handleSaveRecord}
//           sortColumn={sortColumn}
//           sortDirection={sortDirection}
//           emptyMessage={hasActiveFilters ? 'No records match filters' : 'No records found'}
//           onClearFilters={hasActiveFilters ? clearFilters : null}
//         />

//         {/* Pagination */}
//         <ResponsivePagination
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           totalPages={totalPages}
//         />
//       </CardContent>

//       {/* Add/Edit Record Modal */}
//       <RecordFormModal
//         isOpen={isFormOpen}
//         onClose={closeForm}
//         onSubmit={handleCreateRecord}
//         formData={formData}
//         onFieldChange={handleFieldChange}
//         columns={columns}
//         metaData={metaData}
//         dropdownSetup={dropdownSetup}
//         columnOrder={columnOrder}
//         processName={urlParams.process_name}
//         isSubmitting={isSubmitting}
//         counterConfig={counterConfig}
//         setCounterConfig={setCounterConfig}
//         mode="create"
//       />

//    {/* Split Record Modal */}
// <RecordFormModal
//   isOpen={splitFormOpen}
//   onClose={handleSplitFormClose}
//   onSubmit={handleSplitFormSubmit}
//   formData={splitTableData.formData}
//   onFieldChange={handleSplitFieldChange}
//   columns={splitTableData.columns}
//   metaData={splitTableData.metaData}
//   dropdownSetup={splitTableData.dropdownSetup}
//   columnOrder={splitTableData.columnOrder}
//   processName={null}
//   isSubmitting={isSubmitting}
//   counterConfig={counterConfig}
//   setCounterConfig={setCounterConfig}
//   mode="create"
// />

// {/* <RecordFormModal
//   isOpen={isFormOpen}
//   onClose={closeForm}
//   onSubmit={handleCreateRecord}
//   formData={formData}
//   onFieldChange={handleFieldChange}
//   columns={columns}
//   metaData={metaData}
//   dropdownSetup={dropdownSetup}
//   columnOrder={columnOrder}
//   processName={urlParams.process_name}
//   isSubmitting={isSubmitting}
//   mode="create"
// /> */}
//       {/* Delete Confirmation Dialog */}
//       <DeleteConfirmDialog
//         isOpen={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleDeleteConfirm}
//         record={recordToDelete}
//         confirmInput={deleteConfirmInput}
//         onConfirmInputChange={setDeleteConfirmInput}
//         isDeleting={isDeleting}
//       />
//     </Card>
//   );
// };

// export default CustomTable;



// 0.57 + 0.03 = 0.60 + 0.25 = 0.85 = 0.85 - 0.15 = 0.70 + 0.09 = 0.79


import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import Papa from 'papaparse';

// Hooks
import { useTableData } from './hooks/useTableData';
import { useColumnPreferences } from './hooks/useColumnPreferences';
import { useTableFilters } from './hooks/useTableFilters';
import { usePagination } from './hooks/usePagination';
import { useRecordForm } from './hooks/useRecordForm';
import { useDropdownSetup } from './hooks/useDropdownSetup';

// Components
import TableHeaderSection from './components/TableHeaderSection';
import TableToolbar from './components/TableToolbar';
import TableFilters from './components/TableFilters';
import ColumnVisibilityMenu from './components/ColumnVisibilityMenu';
import DataTable from './components/DataTable';
import RecordFormModal from './components/RecordFormModal';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import ResponsivePagination from './components/Pagination';

// Services & Utils
import { tableApi } from './services/tableApi';
import { generateUsId } from './utils/tableHelpers';
import { logger } from './utils/logger';

// CSS
import '../../css/components/CustomTable.css';
import axios from 'axios';

/**
 * Custom Table Component - Main Entry Point
 * Professional, modular table component with full CRUD operations
 */
const CustomTable = ({ type = 'normal' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const userData = useSelector((state) => state.user);

  // URL Parameters
  const urlParams = useMemo(() => ({
    pa_id: searchParams.get('pa_id'),
    us_id: searchParams.get('us_id'),
    show: searchParams.get('show'),
    status: searchParams.get('status'),
    process_name: searchParams.get('process_name'),
  }), [searchParams]);

  const [availableTables,setAvailableTables] = useState([]);

  useEffect(()=>{
    getAllTables();
    },[]);
    
    const schemaName = userData.schema_name;
   const getAllTables = async () => {
  const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllTables?schemaName=${schemaName}`;
  const { data } = await axios.get(route);

  const tables = data.data; 
  const titles = tables.map(table => table.title); 

  setAvailableTables(titles);   

};


  // API Parameters
  const { tableName1: tableNameFromUrl } = useParams();

  const apiParams = useMemo(() => ({
    schemaName: userData.schema_name,
    tableName: tableNameFromUrl,
    userId: userData.id,
    userEmail: userData.email
  }), [userData.schema_name, tableNameFromUrl, userData.id, userData.email]);

  const owner_id = userData?.owner_id ?? userData?.id;

  // State
  const [editEnabled, setEditEnabled] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [counterConfig, setCounterConfig] = useState({
    counter: 0,
    prefix: "",
    isActive: false,
    recordId: null
  });
  const [processSteps, setProcessSteps] = useState([]); // NEW: Add processSteps state

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Split form state
  const [splitFormOpen, setSplitFormOpen] = useState(false);
  const [splitTableData, setSplitTableData] = useState({
    tableName: '',
    paId: '',
    columns: [],
    metaData: [],
    dropdownSetup: {},
    columnOrder: {},
    formData: {},
    processSteps: [] // NEW: Add processSteps to split data
  });

  // Custom Hooks
  const {
    records: allRecords,
    setRecords: setAllRecords,
    originalRecords,
    columns: baseColumns,
    setColumns: setBaseColumns,
    metaData,
    loading,
    refreshData
  } = useTableData(apiParams, type, owner_id);

  const {
    columns,
    setColumns,
    toggleColumnVisibility,
    resetColumnVisibility,
    hideAllColumns,
    visibleColumns
  } = useColumnPreferences(owner_id, apiParams.tableName, apiParams.schemaName, baseColumns);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    priorityFilter,
    filteredRecords,
    uniqueStatuses,
    uniquePriorities,
    toggleStatusFilter,
    togglePriorityFilter,
    clearFilters,
    hasActiveFilters
  } = useTableFilters(originalRecords);
    /**
   * Handle sort
   */
const handleSort = useCallback((columnId) => {
  if (sortColumn === columnId) {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  } else {
    setSortColumn(columnId);
    setSortDirection('asc');
  }
}, [sortColumn]);

// Derive sorted records AFTER filtering, BEFORE pagination
const sortedRecords = useMemo(() => {
  if (!sortColumn) return filteredRecords;

  return [...filteredRecords].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    // ISO Date handling
    if (valueA && valueB && typeof valueA === 'string') {
      const timeA = Date.parse(valueA);
      const timeB = Date.parse(valueB);
      if (!isNaN(timeA) && !isNaN(timeB)) {
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
      }
    }

    // String sorting
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Number sorting
    return sortDirection === 'asc'
      ? (valueA ?? 0) - (valueB ?? 0)
      : (valueB ?? 0) - (valueA ?? 0);
  });
}, [filteredRecords, sortColumn, sortDirection]); 

  const {
    currentPage,
    pageSize,
    totalRecords,
    totalPages,
    currentRecords,
    setCurrentPage,
    resetPagination
  } = usePagination(sortedRecords);

  const {
    formData,
    isSubmitting,
    isOpen: isFormOpen,
    handleFieldChange,
    submitForm,
    openForm,
    closeForm
  } = useRecordForm(apiParams, type, refreshData);

  const {
    dropdownSetup,
    columnOrder,
    setupExists: dropdownSetupExists,
    getDropdownOptions,
    hasDropdown
  } = useDropdownSetup(owner_id, apiParams.tableName);

  // NEW: Fetch process_steps when component mounts or table changes
  useEffect(() => {
    const fetchProcessSteps = async () => {
      try {
        const dropdownRoute = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${apiParams.tableName}`;
        const { data } = await axios.get(dropdownRoute);
        
        if (data.exists && data.setup && data.setup.process_steps) {
          setProcessSteps(data.setup.process_steps);
          console.log('Process steps loaded for main table:', data.setup.process_steps);
        } else {
          setProcessSteps([]);
        }
      } catch (error) {
        console.error('Error fetching process steps:', error);
        setProcessSteps([]);
      }
    };

    if (owner_id && apiParams.tableName) {
      fetchProcessSteps();
    }
  }, [owner_id, apiParams.tableName]);

  /**
   * Fetch table structure from backend
   */
  const fetchTableStructure = async (tableName) => {
    try {
      const apiParams = {
        schemaName: userData.schema_name,
        tableName: tableName,
        userId: userData.id,
        userEmail: userData.email
      };

      console.log('Fetching table structure for:', tableName);

      // Fetch all data to extract columns
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`,
        apiParams
      );

      console.log('Response:', response.data);

      const fetchedData = response.data.data || [];
      const metaDataFromResponse = response.data.columns || [];

      // Generate columns from first record
      let dynamicColumns = [];
      if (fetchedData.length > 0) {
        const recordForColumns = fetchedData[0];
        dynamicColumns = Object.keys(recordForColumns).map(key => ({
          id: key,
          name: formatColumnName(key),
          accessor: key,
          sortable: true,
          visible: true,
          type: getColumnType(recordForColumns[key], key)
        }));
      }

      // Fetch dropdown setup
      const dropdownRoute = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
      const dropdownResponse = await axios.get(dropdownRoute);

      let dropdownSetup = {};
      let columnOrder = {};
      let fetchedProcessSteps = []; // NEW

      if (dropdownResponse.data.exists && dropdownResponse.data.setup) {
        dropdownSetup = dropdownResponse.data.setup.mapping || {};
        columnOrder = dropdownResponse.data.setup.columnOrder || {};
        fetchedProcessSteps = dropdownResponse.data.setup.process_steps || []; // NEW
        console.log('Fetched process_steps for split table:', fetchedProcessSteps);
      }

      return {
        columns: dynamicColumns,
        metaData: metaDataFromResponse,
        dropdownSetup: dropdownSetup,
        columnOrder: columnOrder,
        processName: null,
        processSteps: fetchedProcessSteps // NEW
      };
    } catch (error) {
      console.error('Error fetching table structure:', error);
      throw error;
    }
  };

  /**
   * Helper function to format column names
   */
  const formatColumnName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /**
   * Helper function to determine column type
   */
  const getColumnType = (value, columnName) => {
    const lowerColumnName = columnName.toLowerCase();

    if (lowerColumnName.includes('email')) return 'email';
    if (lowerColumnName.includes('phone')) return 'tel';
    if (lowerColumnName.includes('url') || lowerColumnName.includes('link')) return 'url';
    if (lowerColumnName === 'status') return 'select-status';
    if (lowerColumnName === 'priority') return 'select-priority';
    if (lowerColumnName.includes('description') || lowerColumnName.includes('notes') || lowerColumnName.includes('comment')) return 'textarea';
    if (lowerColumnName.includes('date') || lowerColumnName.includes('created') || lowerColumnName.includes('updated')) return 'date';

    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'checkbox';
    if (value && value.length > 100) return 'textarea';

    return 'text';
  };

  /**
   * Handle split load - fetch table structure and prepare form
   */
  const handleSplitLoad = async (selectedTable, paId) => {
    try {
      console.log('Loading split form for table:', selectedTable, 'with pa_id:', paId);
      
      // Fetch table structure
      const tableData = await fetchTableStructure(selectedTable);
      
      // Initialize form data with pa_id and us_id
      const initialFormData = {
        pa_id: paId,
        us_id: generateUsId()
      };

      // NEW: Set default status if status column exists and process_steps available
      const hasStatusColumn = tableData.columns.some(col => 
        col.id === 'status' || col.id.toLowerCase() === 'status'
      );
      
      if (hasStatusColumn && tableData.processSteps && tableData.processSteps.length > 0) {
        initialFormData.status = tableData.processSteps[0];
        console.log('Setting default split status:', tableData.processSteps[0]);
      }

      // Initialize other fields
      tableData.columns.forEach(column => {
        if (!initialFormData[column.id]) {
          initialFormData[column.id] = '';
        }
      });

      // Store table data and open split form
      setSplitTableData({
        tableName: selectedTable,
        paId: paId,
        columns: tableData.columns,
        metaData: tableData.metaData,
        dropdownSetup: tableData.dropdownSetup,
        columnOrder: tableData.columnOrder,
        formData: initialFormData,
        processSteps: tableData.processSteps || [] // NEW
      });

      setSplitFormOpen(true);
      toast.success('Form loaded successfully');
      
    } catch (error) {
      console.error('Failed to load split table:', error);
      toast.error('Failed to load form');
      throw error;
    }
  };

  /**
   * Handle split form field change
   */
  const handleSplitFieldChange = (columnId, value) => {
    setSplitTableData(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [columnId]: value
      }
    }));
  };

  /**
   * Handle split form submit
   */
  const handleSplitFormSubmit = async () => {
    try {
      console.log('Submitting split record:', splitTableData);

      // Clean the form data
      const cleanData = {};
      Object.entries(splitTableData.formData).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          const columnMeta = splitTableData.metaData.find(col => col.column_name === key);
          
          if (columnMeta) {
            const dataType = columnMeta.data_type.toLowerCase();
            
            if (dataType.includes('int') || dataType.includes('serial')) {
              const parsed = parseInt(value, 10);
              if (!isNaN(parsed)) cleanData[key] = parsed;
            } else if (dataType.includes('numeric') || dataType.includes('decimal') || dataType.includes('float')) {
              const parsed = parseFloat(value);
              if (!isNaN(parsed)) cleanData[key] = parsed;
            } else if (dataType.includes('bool')) {
              cleanData[key] = value === true || value === 'true' || value === '1';
            } else {
              cleanData[key] = value;
            }
          } else {
            cleanData[key] = value;
          }
        }
      });

      // Format us_id with pa_id separator
      if (cleanData.us_id && cleanData.pa_id) {
        cleanData.us_id = `${cleanData.pa_id} -S- ${cleanData.us_id}`;
      }

      console.log('Clean data:', cleanData);

      // Submit to backend
      const apiParams = {
        schemaName: userData.schema_name,
        tableName: splitTableData.tableName
      };

      await tableApi.createRecord(apiParams, cleanData);
      
      toast.success('Split record created successfully');
      setSplitFormOpen(false);
      
      // Reset split table data
      setSplitTableData({
        tableName: '',
        paId: '',
        columns: [],
        metaData: [],
        dropdownSetup: {},
        columnOrder: {},
        formData: {},
        processSteps: []
      });

      // Refresh the main table
      refreshData();

    } catch (error) {
      console.error('Error creating split record:', error);
      toast.error('Failed to create split record: ' + (error.response?.data?.details || error.message));
      throw error;
    }
  };

  /**
   * Handle split form close
   */
  const handleSplitFormClose = () => {
    setSplitFormOpen(false);
    setSplitTableData({
      tableName: '',
      paId: '',
      columns: [],
      metaData: [],
      dropdownSetup: {},
      columnOrder: {},
      formData: {},
      processSteps: []
    });
  };

  /**
   * Sync base columns with preference columns
   */
  useEffect(() => {
    if (baseColumns.length > 0 && columns.length === 0) {
      setColumns(baseColumns);
    }
  }, [baseColumns]);

  /**
   * Handle search from URL params
   */
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchParams, setSearchTerm]);

  /**
   * Auto-open form modal if show=true
   */
  useEffect(() => {
    if (urlParams.show === 'true' && columns.length > 0) {
      handleOpenAddModal();
    }
  }, [urlParams.show, columns]);

  /**
   * Handle counter update from WorkflowCounter
   */
  const handleCounterUpdate = useCallback((config) => {
    setCounterConfig(config);
    logger.debug('Counter config updated:', config);
  }, []);

  /**
   * Handle refresh
   */
  const handleRefresh = useCallback(() => {
    refreshData();
    clearFilters();
    resetPagination();
    toast.success('Data refreshed');
  }, [refreshData, clearFilters, resetPagination]);

  /**
   * Handle search input
   */
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    resetPagination();
  }, [setSearchTerm, resetPagination]);




  /**
   * Export to CSV
   */
  const handleExportCSV = useCallback(() => {
    if (!filteredRecords.length) {
      toast.error('No records to export');
      return;
    }

    try {
      const exportData = filteredRecords.map(record => {
        const filteredRecord = {};
        visibleColumns.forEach(column => {
          filteredRecord[column.name] = record[column.id];
        });
        return filteredRecord;
      });

      const csv = Papa.unparse(exportData, {
        quotes: true,
        quoteChar: '"',
        delimiter: ",",
        header: true
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      const filename = `${apiParams.tableName}_export_${date}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${exportData.length} records to CSV`);
    } catch (error) {
      logger.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  }, [filteredRecords, visibleColumns, apiParams.tableName]);

  /**
   * Handle open add modal
   */
  const handleOpenAddModal = useCallback(async () => {
    const initialData = {};

    // Pre-fill from URL params
    columns.forEach(column => {
      if (urlParams[column.id]) {
        initialData[column.id] = urlParams[column.id];
      } else if (column.id === 'us_id') {
        initialData[column.id] = counterConfig.isActive
          ? `${counterConfig.prefix}${counterConfig.counter}`
          : generateUsId();
      } 
      // NEW: Set default status if column is status and process_steps exist
      else if (column.id === 'status' && processSteps.length > 0) {
        initialData[column.id] = processSteps[0];
        console.log('Setting default main form status:', processSteps[0]);
      }
      else {
        initialData[column.id] = '';
      }
    });

    openForm(initialData);

    // Clear show param
    if (urlParams.show === 'true') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('show');
      setSearchParams(newParams, { replace: true });
    }
  }, [columns, urlParams, counterConfig, openForm, searchParams, setSearchParams, processSteps]); // NEW: Add processSteps dependency

  /**
   * Handle create record
   */
  const handleCreateRecord = useCallback(async () => {
    try {
      // Add balance calculation if process_name exists
      let additionalData = {};

      if (urlParams.process_name) {
        const balanceFieldName = `${urlParams.process_name}_balance`;
        const quantityField = columns.find(col =>
          col.id.toLowerCase().includes('quantity')
        );

        if (quantityField) {
          const quantity = formData[quantityField.id];
          if (quantity) {
            additionalData[balanceFieldName] = quantity;
          }
        }
      }

      // Add PA_ID separator if needed
      if ((urlParams.status && urlParams.pa_id) || (urlParams.process_name && urlParams.pa_id)) {
        additionalData.us_id = `${urlParams.pa_id} -S- ${formData.us_id}`;
      }

      await submitForm(additionalData);

      // Increment counter if active
      if (counterConfig.isActive && counterConfig.recordId) {
        try {
          await tableApi.updateRecord(
            { schemaName: 'public', tableName: 'counter_setup' },
            counterConfig.recordId,
            owner_id,
            { counter: counterConfig.counter + 1 }
          );

          setCounterConfig(prev => ({
            ...prev,
            counter: prev.counter + 1
          }));
        } catch (error) {
          logger.error('Counter increment failed:', error);
          toast.warning('Record created but counter increment failed');
        }
      }

      // Clear URL params
      setSearchParams({});

    } catch (error) {
      logger.error('Create record failed:', error);
    }
  }, [formData, columns, urlParams, counterConfig, submitForm, owner_id, setSearchParams]);

  /**
   * Handle delete click
   */
  const handleDeleteClick = useCallback((record) => {
    setRecordToDelete(record);
    setDeleteConfirmInput('');
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Handle delete confirm
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!recordToDelete || deleteConfirmInput.trim() !== recordToDelete.us_id) {
      toast.error('Entered us_id does not match');
      return;
    }

    try {
      setIsDeleting(true);
      await tableApi.deleteRecord(apiParams, recordToDelete.id);
      toast.success('Record deleted successfully');
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      setDeleteConfirmInput('');
      refreshData();
    } catch (error) {
      logger.error('Delete failed:', error);
      toast.error('Failed to delete record');
    } finally {
      setIsDeleting(false);
    }
  }, [recordToDelete, deleteConfirmInput, apiParams, refreshData]);

  /**
   * Handle save record (inline edit)
   */
  const handleSaveRecord = useCallback(async (recordId, updates) => {
    try {
      // Filter out unchanged values
      const originalRecord = originalRecords.find(r => r.id === recordId);
      const changes = {};

      Object.entries(updates).forEach(([key, val]) => {
        if (val !== originalRecord[key] && key !== 'id' && key !== 'pa_id' && key !== 'us_id') {
          changes[key] = val;
        }
      });

      if (Object.keys(changes).length === 0) {
        toast.warning('No changes to save');
        return;
      }

      await tableApi.updateRecord(apiParams, recordId, owner_id, changes);
      toast.success('Record updated successfully');
      refreshData();
    } catch (error) {
      logger.error('Update failed:', error);
      toast.error('Failed to update record');
    }
  }, [originalRecords, apiParams, owner_id, refreshData]);

  // Don't render if show=true (modal will handle it)
  if (urlParams.show === 'true') return null;

  return (
    <Card className="tableCard shadow-sm border-slate-200 mx-[6rem]">
      <CardHeader className="pb-3">
        <TableHeaderSection
          title={"All Records - "+apiParams.tableName}
          description="View and manage all database records"
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          tableName={apiParams.tableName}
          onCounterUpdate={handleCounterUpdate}
          urlParams={urlParams}
          dropdownSetupExists={dropdownSetupExists}
          columnOrderExists={Object.keys(columnOrder).length > 0}
        />
      </CardHeader>

      <CardContent>
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <TableToolbar
              onRefresh={handleRefresh}
              onAddRecord={handleOpenAddModal}
              onExportCSV={handleExportCSV}
              onToggleEdit={() => setEditEnabled(!editEnabled)}
              editEnabled={editEnabled}
              canEdit={userData.owner_id === null}
              isLoading={loading}
              splitOptions={availableTables}
              onSplitLoad={handleSplitLoad}
            />

            <TableFilters
              uniqueStatuses={uniqueStatuses}
              uniquePriorities={uniquePriorities}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onToggleStatus={toggleStatusFilter}
              onTogglePriority={togglePriorityFilter}
              onClearStatusFilter={() => toggleStatusFilter([])}
              onClearPriorityFilter={() => togglePriorityFilter([])}
            />

            <ColumnVisibilityMenu
              columns={columns}
              onToggleColumn={toggleColumnVisibility}
              onResetVisibility={resetColumnVisibility}
              onHideAll={hideAllColumns}
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          records={currentRecords}
          columns={columns}
          loading={loading}
          editEnabled={editEnabled}
          canDelete={userData.owner_id === null}
          onSort={handleSort}
          onDeleteRecord={handleDeleteClick}
          onSaveRecord={handleSaveRecord}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          emptyMessage={hasActiveFilters ? 'No records match filters' : 'No records found'}
          onClearFilters={hasActiveFilters ? clearFilters : null}
        />

        {/* Pagination */}
        <ResponsivePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </CardContent>

      {/* Add/Edit Record Modal */}
      <RecordFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleCreateRecord}
        formData={formData}
        onFieldChange={handleFieldChange}
        columns={columns}
        metaData={metaData}
        dropdownSetup={dropdownSetup}
        columnOrder={columnOrder}
        processName={urlParams.process_name}
        isSubmitting={isSubmitting}
        counterConfig={counterConfig}
        setCounterConfig={setCounterConfig}
        mode="create"
        processSteps={processSteps} // NEW: Pass processSteps
      />

      {/* Split Record Modal */}
      <RecordFormModal
        isOpen={splitFormOpen}
        onClose={handleSplitFormClose}
        onSubmit={handleSplitFormSubmit}
        formData={splitTableData.formData}
        onFieldChange={handleSplitFieldChange}
        columns={splitTableData.columns}
        metaData={splitTableData.metaData}
        dropdownSetup={splitTableData.dropdownSetup}
        columnOrder={splitTableData.columnOrder}
        processName={null}
        isSubmitting={isSubmitting}
        counterConfig={counterConfig}
        setCounterConfig={setCounterConfig}
        mode="create"
        itsSplit={true}
        processSteps={splitTableData.processSteps || []} // NEW: Pass processSteps for split form
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        record={recordToDelete}
        confirmInput={deleteConfirmInput}
        onConfirmInputChange={setDeleteConfirmInput}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default CustomTable;