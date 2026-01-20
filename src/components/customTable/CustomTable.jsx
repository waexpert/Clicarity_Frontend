// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
// import Papa from 'papaparse';

// // Shadcn UI components
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";

// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
//   DropdownMenuCheckboxItem,
// } from "@/components/ui/dropdown-menu";

// // Lucide React icons
// import {
//   Search,
//   FileText,
//   Upload,
//   MoreHorizontal,
//   ChevronDown,
//   Eye,
//   Edit,
//   Trash2,
//   Filter,
//   FileSpreadsheet,
//   FileDown,
//   RefreshCw,
//   SlidersHorizontal,
//   Check,
//   Plus,
//   X,
//   ArrowUpDown
// } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';

// // Api Calls Route
// import { getAllRecords, updateRecord, createRecord, getAllPayments } from '../api/apiConfig';
// import { useSelector } from 'react-redux';
// import { showText } from 'pdf-lib';
// import "../css/components/CustomTable.css";
// import ResponsivePagination from './customTable/Pagination';



// const CustomTable = ({ type = "normal" }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [originalRecords, setOriginalRecords] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRecords, setSelectedRecords] = useState([]);
//   const [pageSize, setPageSize] = useState(20);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [columns, setColumns] = useState([]);
//   const [sortColumn, setSortColumn] = useState(null);
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [statusFilter, setStatusFilter] = useState([]);
//   const [priorityFilter, setPriorityFilter] = useState([]);
//   const [editingRowId, setEditingRowId] = useState(null);
//   const [editingValues, setEditingValues] = useState({});
//   const [editEnabled, setEditEnabled] = useState(false);
//   const [currentEditingRecord, setCurrentEditingRecord] = useState({});
//   const [metaData, setMetaData] = useState({});

//   // Add Record Modal States
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newRecordData, setNewRecordData] = useState({});
//   const [isCreating, setIsCreating] = useState(false);

//   // ENHANCED: Dropdown setup state with column ordering
//   const [dropdownSetup, setDropdownSetup] = useState({});
//   const [columnOrder, setColumnOrder] = useState({});
//   const [dropdownSetupExists, setDropdownSetupExists] = useState(false);

//   // Delete Record States
//   const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
//   const [recordToDelete, setRecordToDelete] = useState(null);
//   const [deleteUsIdInput, setDeleteUsIdInput] = useState('');
//   const [isDeleting, setIsDeleting] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const userData = useSelector((state) => state.user);
//   const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;
//   const [isDataReady, setIsDataReady] = useState(false);

//   // Get URL parameters
//   const pa_id = searchParams.get('pa_id');
//   const us_id = searchParams.get('us_id')
//   const show = searchParams.get('show');
//   const status = searchParams.get('status');
//   const process_name = searchParams.get('process_name');

//   // Log URL params for debugging
//   useEffect(() => {
//     console.log('URL Params:', { process_name, pa_id, us_id, show, status });
//     if (process_name) {
//       console.log(`Balance field to hide: ${process_name}_balance`);
//     }
//   }, [process_name, pa_id, us_id, show, status]);

//   // Generate unique us_id using Unix timestamp
//   const generateUsId = () => {
//     return Date.now().toString();
//   };

//   const { tableName1 } = useParams();
//   const apiParams = {
//     schemaName: userData.schema_name,
//     tableName: tableName1

//     // schemaName:"public",
//     // tableName:"testing_table"
//   }

//   // Add Delete Function
//   const handleDeleteClick = (record) => {
//     setRecordToDelete(record);
//     setDeleteUsIdInput('');
//     setDeleteConfirmOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!recordToDelete || !deleteUsIdInput.trim()) {
//       toast.error("Please enter the us_id to confirm deletion");
//       return;
//     }

//     if (deleteUsIdInput.trim() !== recordToDelete.us_id) {
//       toast.error("Entered us_id does not match. Deletion cancelled.");
//       return;
//     }

//     try {
//       setIsDeleting(true);

//       const params = new URLSearchParams({
//         id: recordToDelete.id,
//         schemaName: apiParams.schemaName,
//         tableName: apiParams.tableName
//       });

//       const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/data/deleteRecord?${params.toString()}`);

//       toast.success("Record deleted successfully");
//       setDeleteConfirmOpen(false);
//       setRecordToDelete(null);
//       setDeleteUsIdInput('');
//       handleRefresh();

//     } catch (error) {
//       console.error('Delete error:', error);
//       if (error.response) {
//         toast.error(`Failed to delete record: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
//       } else {
//         toast.error("Failed to delete record. Please try again.");
//       }
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteConfirmOpen(false);
//     setRecordToDelete(null);
//     setDeleteUsIdInput('');
//   };


// // Function to fetch record data by us_id
// const fetchRecordByUsId = async (usId) => {
//   try {
//     const decodedUsId = decodeURIComponent(usId);

//     const response = await axios.post(
//       `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordById`,
//       {
//         schemaName: apiParams.schemaName,
//         tableName: apiParams.tableName,
//         id: decodedUsId
//       }
//     );

//     console.log("Full response:", response);
//     console.log("response.data:", response.data);

//     // FIX: The data is directly in response.data, not response.data.data
//     if (response.data) {
//       console.log('Returning record:', response.data);
//       return response.data;  // Changed from response.data.data
//     }
//     return null;
//   } catch (error) {
//     console.error('Error fetching record by us_id:', error);
//     if (error.response) {
//       console.error('Error response:', error.response.data);
//       toast.error(`Failed to fetch record: ${error.response.data.message || 'Unknown error'}`);
//     } else {
//       toast.error('Failed to fetch record data');
//     }
//     return null;
//   }
// };

//   // ENHANCED: Function to fetch dropdown setup with column ordering
//   const fetchDropdownSetup = async () => {
//     try {
//       const tableName = apiParams.tableName;
//       const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
//       const { data } = await axios.get(route);

//       if (data.exists && data.setup) {
//         // Set dropdown values
//         if (data.setup.mapping) {
//           setDropdownSetup(data.setup.mapping);
//         }

//         // ENHANCED: Set column order
//         if (data.setup.columnOrder) {
//           setColumnOrder(data.setup.columnOrder);
//           console.log('Column order loaded:', data.setup.columnOrder);
//         }

//         setDropdownSetupExists(true);
//         console.log('Dropdown setup loaded:', data.setup.mapping);
//       } else {
//         setDropdownSetup({});
//         setColumnOrder({});
//         setDropdownSetupExists(false);
//         console.log('No dropdown setup found');
//       }
//     } catch (error) {
//       console.error('Error fetching dropdown setup:', error);
//       setDropdownSetup({});
//       setColumnOrder({});
//       setDropdownSetupExists(false);
//     }
//   };

//   // ENHANCED: Function to get ordered columns for form display with process_name balance filtering
//   const getOrderedFormColumns = () => {
//     // ENHANCED: Debug logging for process_name
//     if (process_name) {
//       console.log('=== BALANCE FIELD FILTERING ===');
//       console.log('process_name from URL:', process_name);
//       console.log('Will hide ALL balance fields when process_name is present');
//       console.log('All column IDs:', columns.map(c => c.id));
//       console.log('All column names (display):', columns.map(c => c.name));
//     }

//     const filteredColumns = columns.filter(column => {
//       // Standard exclusions
//       if (column.id === 'id' ||
//           column.id.includes('_comment') ||
//           column.id.includes('created_at') ||
//           column.id.includes('updated_at')) {
//         return false;
//       }

//       // ENHANCED: Hide ALL balance fields when process_name exists
//       if (process_name) {
//         const columnIdLower = column.id.toLowerCase();
//         const columnNameLower = column.name.toLowerCase();

//         // Check if this column is ANY balance field
//         const isBalanceField = columnIdLower.includes('balance') || columnNameLower.includes('balance');

//         if (isBalanceField) {
//           console.log(`✓ HIDING balance field: ${column.id} (name: ${column.name})`);
//           return false;
//         }
//       }

//       return true;
//     });

//     // Log filtered columns for debugging
//     if (process_name) {
//       console.log('Columns after filtering:', filteredColumns.map(c => ({ id: c.id, name: c.name })));
//       console.log('=== END BALANCE FIELD FILTERING ===');
//     }

//     // Sort columns by order number, then alphabetically for columns without order
//     return filteredColumns
//       .filter(column => {
//         const order = columnOrder[column.id];
//         return order !== 0; // Skip fields with order = 0
//       }).sort((a, b) => {
//         const orderA = columnOrder[a.id] || 999;
//         const orderB = columnOrder[b.id] || 999;

//         if (orderA !== orderB) {
//           return orderA - orderB;
//         }

//         // If orders are the same, sort alphabetically
//         return a.name.localeCompare(b.name);
//       });
//   };

//   // Fetch data from API
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       console.log("apiParams", apiParams);
//       console.log("type", type);

//       let fetchedData;

//       if (type === "normal") {
//         const response = await axios.post(getAllRecords, apiParams);
//         fetchedData = response.data.data;
//         console.log(response.data.columns)

//         setMetaData(response.data.columns)
//       } else if (type === "payment") {
//         // Use the correct payment endpoint
//         const response = await axios.get(
//           `${import.meta.env.VITE_APP_BASE_URL}/payment-reminders/list?owner_id=${owner_id}`
//         );
//         fetchedData = response.data.data || response.data;
//       } else {
//         // Fallback for other types
//         const response = await axios.get(
//           `${import.meta.env.VITE_APP_BASE_URL}/data/getAllPayments?owner_id=${owner_id}`
//         );
//         fetchedData = response.data.data;
//       }

//       console.log("Raw fetched data:", fetchedData);

//       // Filter data based on type
//       let filteredData = fetchedData;

//       if (type === "payment") {
//         // Only show records with type = 'original' for payment reminders
//         filteredData = fetchedData.filter(item =>
//           item.type === 'original' || item.type === 'Original'
//         );
//         console.log("Filtered payment data (original only):", filteredData);
//       }

//       // Set the filtered data
//       setOriginalRecords(filteredData);
//       setRecords(filteredData);
//       setTotalRecords(filteredData.length);
//       setTotalPages(Math.ceil(filteredData.length / pageSize));

//       // Generate columns from the first available record
//       let recordForColumns = null;

//       if (filteredData.length > 0) {
//         if (type === "payment") {
//           // For payment type, find the first 'original' record for column structure
//           recordForColumns = filteredData.find(item =>
//             item.type === 'original' || item.type === 'Original'
//           ) || filteredData[0]; // Fallback to first record if no 'original' found
//         } else {
//           // For normal type, use first record directly
//           recordForColumns = filteredData[0];
//         }
//       }

//       if (recordForColumns) {
//         const dynamicColumns = Object.keys(recordForColumns).map(key => ({
//           id: key,
//           name: formatColumnName(key),
//           accessor: key,
//           sortable: true,
//           visible: true,
//           type: getColumnType(recordForColumns[key], key)
//         }));
//         setColumns(dynamicColumns);
//         console.log("Generated columns:", dynamicColumns);
//       } else {
//         console.warn("No records found to generate columns from");
//         setColumns([]);
//       }

//     } catch (error) {
//       console.error("Error fetching data:", error);

//       // More detailed error logging
//       if (error.response) {
//         console.error("Response status:", error.response.status);
//         console.error("Response data:", error.response.data);
//       }

//       toast.error("Failed to fetch records");

//       // Set empty state on error
//       setOriginalRecords([]);
//       setRecords([]);
//       setTotalRecords(0);
//       setTotalPages(1);
//       setColumns([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize data and columns on component mount
//   useEffect(() => {
//     fetchData();
//     fetchDropdownSetup(); // Fetch dropdown setup
//   }, []);

//   // ENHANCED: Check URL params and auto-open modal
//   useEffect(() => {
//     // Auto-open modal if show=true in URL params
//     if (show === 'true') {
//       handleOpenAddModal();
//     }
//   }, [show, pa_id, columns]); // Re-run when columns are loaded

//   // Apply filters and search when they change
//   useEffect(() => {
//     applyFiltersAndSearch();
//   }, [searchTerm, statusFilter, priorityFilter, originalRecords]);

//   useEffect(() => {
//   if (isDataReady) {
//     console.log('Data ready, opening modal with:', newRecordData);
//     setIsAddModalOpen(true);
//     setIsDataReady(false); // Reset for next time
//   }
// }, [isDataReady, newRecordData]);

//   // Helper function to format column names
//   const formatColumnName = (key) => {
//     return key
//       .split('_')
//       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//       .join(' ');
//   };

//   // Helper function to determine column type
//   const getColumnType = (value, columnName) => {
//     const lowerColumnName = columnName.toLowerCase();

//     // Specific checks first
//     if (lowerColumnName.includes('email')) return 'email';
//     if (lowerColumnName.includes('phone')) return 'tel';
//     if (lowerColumnName.includes('url') || lowerColumnName.includes('link') || lowerColumnName.includes('invoice_url')) return 'url';
//     if (lowerColumnName === 'status') return 'url';
//     if (lowerColumnName === 'priority') return 'select-priority';
//     if (lowerColumnName.includes('description') || lowerColumnName.includes('notes') || lowerColumnName.includes('comment')) return 'textarea';
//     if (lowerColumnName.includes('date') || lowerColumnName.includes('created') || lowerColumnName.includes('updated') || lowerColumnName === 'invoice') return 'date';

//     // Fallback based on value type
//     if (typeof value === 'number') return 'number';
//     if (typeof value === 'boolean') return 'checkbox';
//     if (value && value.length > 100) return 'textarea';

//     return 'text';
//   };

//   // Function to apply filters and search
//   const applyFiltersAndSearch = () => {
//     if (!originalRecords.length) return;

//     let filteredResults = [...originalRecords];

//     if (searchTerm.trim() !== '') {
//       const term = searchTerm.toLowerCase();
//       filteredResults = filteredResults.filter(item =>
//         Object.values(item).some(value =>
//           String(value).toLowerCase().includes(term)
//         )
//       );
//     }

//     if (statusFilter.length > 0) {
//       filteredResults = filteredResults.filter(item =>
//         statusFilter.includes(item.status)
//       );
//     }

//     if (priorityFilter.length > 0) {
//       filteredResults = filteredResults.filter(item =>
//         priorityFilter.includes(item.priority)
//       );
//     }

//     setRecords(filteredResults);
//     setTotalRecords(filteredResults.length);
//     setTotalPages(Math.ceil(filteredResults.length / pageSize));
//     setCurrentPage(1);
//   };

//   // Handle search input
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Handle refresh button
//   const handleRefresh = () => {
//     fetchData();
//     fetchDropdownSetup(); // Also refresh dropdown setup
//     setSearchTerm('');
//     setStatusFilter([]);
//     setPriorityFilter([]);
//   };

//   const handleOpenAddModal = async () => {
//   if (columns.length === 0) {
//     console.log('Columns not loaded yet, waiting...');
//     return;
//   }

//   const currentUrlParams = Object.fromEntries(searchParams.entries());
//   const initialData = {};
//   const orderedColumns = getOrderedFormColumns();

//   if (currentUrlParams.us_id) {
//     console.log('Fetching record for us_id:', currentUrlParams.us_id);
//     const fetchedRecord = await fetchRecordByUsId(currentUrlParams.us_id);

//     console.log('=== DEBUG INFO ===');
//     console.log('fetchedRecord:', fetchedRecord);
//     console.log('typeof fetchedRecord:', typeof fetchedRecord);
//     console.log('Is array?:', Array.isArray(fetchedRecord));

//     if (fetchedRecord) {
//       // Record exists - populate from database
//       console.log('fetchedRecord keys:', Object.keys(fetchedRecord));
//       console.log('orderedColumns (first 5):', orderedColumns.slice(0, 5).map(c => c.id));

//       orderedColumns.forEach(column => {
//         console.log(`\nChecking column: ${column.id}`);
//         console.log(`  - has property?: ${fetchedRecord.hasOwnProperty(column.id)}`);
//         console.log(`  - value in fetchedRecord: ${fetchedRecord[column.id]}`);

//         if (column.id === 'quantity') {
//           initialData[column.id] = '';
//           console.log(`  - Set to empty (quantity)`);
//         } else if (fetchedRecord.hasOwnProperty(column.id)) {
//           const value = fetchedRecord[column.id];
//           initialData[column.id] = value === null ? '' : String(value);
//           console.log(`  - Set to: ${initialData[column.id]}`);
//         } else if (currentUrlParams[column.id]) {
//           initialData[column.id] = currentUrlParams[column.id];
//           console.log(`  - Set from URL param: ${initialData[column.id]}`);
//         } else {
//           initialData[column.id] = '';
//           console.log(`  - Set to empty (no match)`);
//         }
//       });

//       console.log('=== FINAL initialData ===');
//       console.log(initialData);
//     } else {
//       // Record doesn't exist - populate from URL params
//       console.log('Record not found, populating from URL params');
//       orderedColumns.forEach(column => {
//         if (currentUrlParams[column.id]) {
//           // Use value from URL parameter (including us_id)
//           initialData[column.id] = currentUrlParams[column.id];
//           console.log(`  - ${column.id} set from URL: ${initialData[column.id]}`);
//         } else if (column.id === 'us_id') {
//           // Generate new us_id if not in URL
//           initialData[column.id] = generateUsId();
//           console.log(`  - ${column.id} generated: ${initialData[column.id]}`);
//         } else {
//           initialData[column.id] = '';
//           console.log(`  - ${column.id} set to empty`);
//         }
//       });
//     }
//   } else {
//     // No us_id in URL - normal flow
//     orderedColumns.forEach(column => {
//       if (currentUrlParams[column.id]) {
//         initialData[column.id] = currentUrlParams[column.id];
//       } else if (column.id === 'us_id') {
//         initialData[column.id] = generateUsId();
//       } else {
//         initialData[column.id] = '';
//       }
//     });
//   }

//   setNewRecordData(initialData);
//   setIsDataReady(true);

//   if (currentUrlParams.show === 'true') {
//     const newSearchParams = new URLSearchParams(searchParams);
//     newSearchParams.delete('show');
//     setSearchParams(newSearchParams, { replace: true });
//   }
// };


//   const handleNewRecordChange = (columnId, value) => {
//     setNewRecordData(prev => ({
//       ...prev,
//       [columnId]: value
//     }));
//   };

//   // ENHANCED: Handle create new record with process_name balance logic
//   const handleCreateRecord = async () => {
//     try {
//       setIsCreating(true);

//       // Add owner_id to the record data
//       const recordWithOwnerId = {
//         ...newRecordData,
//         // owner_id: owner_id // Make sure owner_id is included
//       };

//       // ENHANCED: Add balance calculation when process_name exists
//       if (process_name) {
//         // Find the actual balance field column from the columns array
//         const processNameLower = process_name.trim().toLowerCase();
//         const balanceColumn = columns.find(col => {
//           const colIdLower = col.id.toLowerCase();
//           const colNameLower = col.name.toLowerCase();

//           // Check if this column is the balance field for this process
//           return colIdLower.includes(processNameLower) && 
//                  (colIdLower.includes('balance') || colNameLower.includes('balance'));
//         });

//         if (balanceColumn) {
//           const balanceFieldName = balanceColumn.id; // Use the actual column ID from database

//           // Find quantity field - check multiple possible names
//           const quantityColumn = columns.find(col => {
//             const colIdLower = col.id.toLowerCase();
//             const colNameLower = col.name.toLowerCase();
//             return colIdLower.includes('quantity') || colNameLower.includes('quantity');
//           });

//           const quantityFieldId = quantityColumn ? quantityColumn.id : 'quantity';
//           const quantity = newRecordData[quantityFieldId];

//           console.log(`Found balance column: ${balanceFieldName} (display name: ${balanceColumn.name})`);
//           console.log(`Using quantity field: ${quantityFieldId} with value: ${quantity}`);

//           // Validate that quantity exists
//           if (!quantity || quantity === '') {
//             toast.error('Quantity is required when process_name is specified');
//             setIsCreating(false);
//             return;
//           }

//           // Optional: Validate quantity is a valid number
//           const quantityNum = parseFloat(quantity);
//           if (isNaN(quantityNum)) {
//             toast.error('Quantity must be a valid number');
//             setIsCreating(false);
//             return;
//           }

//           // Optional: Validate quantity is greater than 0
//           if (quantityNum <= 0) {
//             toast.error('Quantity must be greater than 0');
//             setIsCreating(false);
//             return;
//           }

//           // Set balance = quantity using the actual column ID
//           recordWithOwnerId[balanceFieldName] = quantity;
//           console.log(`✓ Setting ${balanceFieldName} = ${quantity}`);
//         } else {
//           console.warn(`⚠ Balance field for process "${process_name}" not found in columns`);
//         }      }

//       const dateFields = [
//         'invoice',
//         'date',
//         'due_date',
//         'final_due_date',
//         'last_overdue_reminder_date',
//         'sent_at',
//         'created_at',
//         'updated_at'
//       ];

//       const arrayFields = ['out_webhooks', 'emails'];

//       const sanitizedRecord = Object.fromEntries(
//         Object.entries(recordWithOwnerId).map(([key, value]) => {
//           // Handle date fields
//           if (dateFields.includes(key)) {
//             return [key, value === '' ? null : value];
//           }

//           // Handle array fields
//           if (arrayFields.includes(key)) {
//             if (value === '') return [key, null];
//             return [key, value];
//           }

//           // Default case - ensure empty strings are handled properly
//           return [key, value === '' ? null : value];
//         })
//       );

//       // Remove null/undefined values and unnecessary fields for payment endpoint
//       const cleanedRecord = Object.fromEntries(
//         Object.entries(sanitizedRecord).filter(([key, value]) => {
//           if (type === "payment") {
//             const excludeFields = [
//               'id', 'created_at', 'updated_at', 'sent_at',
//               'due_date', 'final_due_date', 'last_overdue_reminder_date'
//             ];
//             if (excludeFields.includes(key)) {
//               return false;
//             }
//           }

//           // Keep all non-null values
//           if (value !== null && value !== undefined && value !== '') {
//             return true;
//           }

//           // Keep specific fields even if empty (backend will handle defaults)
//           const allowEmpty = ['status', 'type'];
//           return allowEmpty.includes(key);
//         })
//       );

//       console.log("Cleaned record data:", cleanedRecord);

//       // Log the balance field if process_name exists
//       if (process_name) {
//         const balanceFieldName = `${process_name}_balance`;
//         console.log(`Final record includes ${balanceFieldName}:`, cleanedRecord[balanceFieldName]);
//       }

//       if (type === "payment") {
//         console.log("Sending to payment endpoint:", cleanedRecord);

//         const response = await axios.post(
//           `${import.meta.env.VITE_APP_BASE_URL}/payment-reminders/add`,
//           cleanedRecord,
//           {
//             headers: {
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//         console.log("Payment reminder response:", response.data);
//       } else {
//         // For regular records, use the wrapper format
//         const recordData = {
//           schemaName: apiParams.schemaName,
//           tableName: apiParams.tableName,
//           record: cleanedRecord
//         };

//         if((status && pa_id) || (process_name && pa_id)){
//           cleanedRecord.us_id = pa_id + " -S- " + cleanedRecord.us_id; 
//         }

//         console.log("Sending to regular endpoint:", recordData);

//         const response = await axios.post(createRecord, recordData);
//         console.log("Regular record response:", response.data);
//       }

//       toast.success("Record created successfully!");
//       setIsAddModalOpen(false);
//       setNewRecordData({});
//       handleRefresh();
//       setSearchParams({})

//     } catch (error) {
//       console.error("Error creating record:", error);

//       // More detailed error logging
//       if (error.response) {
//         console.error("Response data:", error.response.data);
//         console.error("Response status:", error.response.status);
//         toast.error(`Failed to create record: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
//       } else if (error.request) {
//         console.error("No response received:", error.request);
//         toast.error("No response from server. Please check your connection.");
//       } else {
//         console.error("Error:", error.message);
//         toast.error(`Failed to create record: ${error.message}`);
//       }
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   // ENHANCED: Enhanced render form input function with dropdown support and auto-fill handling
//   const renderFormInput = (column, value, onChange) => {
//     const { id, type, name } = column;

//     // Check if this is an auto-filled field (pa_id or us_id)
//     const isAutoFilled = id === 'pa_id';

//     // Check if this column has dropdown configuration
//     const hasDropdownConfig = dropdownSetup[id] && Array.isArray(dropdownSetup[id]) && dropdownSetup[id].length > 0;

//     if (hasDropdownConfig && !isAutoFilled) {
//       // Render dropdown for configured columns (except auto-filled ones)
//       return (
//         <Select value={value || ''} onValueChange={(val) => onChange(id, val)}>
//           <SelectTrigger>
//             <SelectValue placeholder={`Select ${name.toLowerCase()}`} />
//           </SelectTrigger>
//           <SelectContent>
//             {dropdownSetup[id].map((option, index) => (
//               <SelectItem key={index} value={option}>
//                 {option}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       );
//     }

//     // Auto-filled fields (pa_id and us_id) - render as disabled inputs
//     if (isAutoFilled) {
//       return (
//         <Input
//           id={id}
//           type="text"
//           value={value || ''}
//           disabled={true}
//           className="bg-gray-50 cursor-not-allowed text-gray-600"
//           placeholder={
//             id === 'pa_id'
//               ? 'Auto-filled from URL'
//               : id === 'us_id'
//                 ? 'Auto-generated ID'
//                 : `Auto-filled ${name.toLowerCase()}`
//           }
//         />
//       );
//     }

//     // Original input rendering logic for non-dropdown, non-auto-filled fields
//     switch (type) {
//       case 'textarea':
//         return (
//           <Textarea
//             id={id}
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//             placeholder={`Enter ${name.toLowerCase()}`}
//             rows={3}
//           />
//         );

//       case 'select-status':
//         return (
//           <Select value={value || ''} onValueChange={(val) => onChange(id, val)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="pending">Pending</SelectItem>
//               <SelectItem value="in progress">In Progress</SelectItem>
//               <SelectItem value="completed">Completed</SelectItem>
//             </SelectContent>
//           </Select>
//         );

//       case 'select-priority':
//         return (
//           <Select value={value || ''} onValueChange={(val) => onChange(id, val)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Select priority" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="low">Low</SelectItem>
//               <SelectItem value="medium">Medium</SelectItem>
//               <SelectItem value="high">High</SelectItem>
//             </SelectContent>
//           </Select>
//         );

//       case 'number':
//         return (
//           <Input
//             id={id}
//             type="number"
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//             placeholder={`Enter ${name.toLowerCase()}`}
//           />
//         );

//       case 'email':
//         return (
//           <Input
//             id={id}
//             type="email"
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//             placeholder={`Enter ${name.toLowerCase()}`}
//           />
//         );

//       case 'tel':
//         return (
//           <Input
//             id={id}
//             type="tel"
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//             placeholder={`Enter ${name.toLowerCase()}`}
//           />
//         );

//       case 'date':
//         return (
//           <Input
//             id={id}
//             type="date"
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//           />
//         );

//       case 'url':
//         return (
//           <Input
//             id={id}
//             type="url"
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//             placeholder={`Enter ${name.toLowerCase()}`}
//           />
//         );

//       case 'checkbox':
//         return (
//           <Checkbox
//             id={id}
//             checked={value || false}
//             onCheckedChange={(checked) => onChange(id, checked)}
//           />
//         );

//       default:
//         return (
//           <Input
//             id={id}
//             type="text"
//             value={value || ''}
//             onChange={(e) => onChange(id, e.target.value)}
//             placeholder={`Enter ${name.toLowerCase()}`}
//           />
//         );
//     }
//   };

//   // Toggle status filter
//   const toggleStatusFilter = (status) => {
//     setStatusFilter(prev => {
//       if (prev.includes(status)) {
//         return prev.filter(s => s !== status);
//       } else {
//         return [...prev, status];
//       }
//     });
//   };

//   // Toggle priority filter
//   const togglePriorityFilter = (priority) => {
//     setPriorityFilter(prev => {
//       if (prev.includes(priority)) {
//         return prev.filter(p => p !== priority);
//       } else {
//         return [...prev, priority];
//       }
//     });
//   };

//   // Handle record selection
//   const handleSelectRecord = (id) => {
//     if (selectedRecords.includes(id)) {
//       setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
//     } else {
//       setSelectedRecords([...selectedRecords, id]);
//     }
//   };

//   // Handle select all records
//   const handleSelectAll = () => {
//     if (selectedRecords.length === records.length) {
//       setSelectedRecords([]);
//     } else {
//       setSelectedRecords(records.map(record => record.id));
//     }
//   };

//   // Handle sorting
//   const handleSort = (column) => {
//     if (sortColumn === column) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortColumn(column);
//       setSortDirection('asc');
//     }

//     const sortedRecords = [...records].sort((a, b) => {
//       const valueA = a[column] || '';
//       const valueB = b[column] || '';

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

//     setRecords(sortedRecords);
//   };

//   // Export to CSV function
//   const exportToCSV = () => {
//     if (!records.length) {
//       toast.error('No records to export');
//       return;
//     }

//     try {
//       const dataToExport = records;
//       const exportData = dataToExport.map(record => {
//         const filteredRecord = {};
//         visibleColumns.forEach(column => {
//           filteredRecord[column.name] = record[column.id];
//         });
//         return filteredRecord;
//       });

//       const csv = Papa.unparse(exportData, {
//         quotes: true,
//         quoteChar: '"',
//         escapeChar: '"',
//         delimiter: ",",
//         header: true,
//         newline: "\n"
//       });

//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       const date = new Date().toISOString().slice(0, 10);
//       const filename = `records_export_${date}.csv`;

//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.display = 'none';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       toast.success(`Exported ${exportData.length} records to CSV`);
//     } catch (error) {
//       console.error('Error exporting to CSV:', error);
//       toast.error('Failed to export CSV. Please try again.');
//     }
//   };

//   // Handle column visibility toggle
//   const toggleColumnVisibility = (columnId) => {
//     setColumns(columns.map(column =>
//       column.id === columnId
//         ? { ...column, visible: !column.visible }
//         : column
//     ));
//   };

//   // Get status badge color
//   const getStatusBadgeColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//       case 'in progress':
//         return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'completed':
//         return 'bg-green-100 text-green-700 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   // Get priority badge color
//   const getPriorityBadgeColor = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//         return 'bg-red-100 text-red-700 border-red-200';
//       case 'medium':
//         return 'bg-orange-100 text-orange-700 border-orange-200';
//       case 'low':
//         return 'bg-green-100 text-green-700 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

// const handleSave = async (originalId) => {
//   const schemaName = apiParams.schemaName;
//   const tableName = apiParams.tableName;

//   const updates = {};

//   Object.entries(editingValues).forEach(([key, val]) => {
//     if (val === undefined) return;

//     // Get original value for comparison
//     const originalValue = currentEditingRecord[key];

//     // Skip if value hasn't changed
//     if ((val === originalValue) || (key === 'pa_id') || (key === 'us_id') || (key === 'id')) {
//       console.log(`Skipping ${key} - no change`);
//       return;
//     }


//     console.log(`Field ${key} changed from "${originalValue}" to "${val}"`);

//     // Handle date fields
//     if (key.toLowerCase().includes('date') || key.toLowerCase().endsWith('_date')) {
//       if (val === null || val === 'null' || val === '') {
//         updates[key] = null;
//         return;
//       }

//       const dateValue = new Date(val);
//       if (isNaN(dateValue.getTime())) {
//         console.warn(`Invalid date format for ${key}:`, val);
//         toast.error(`Invalid date format for ${key}`);
//         return;
//       }

//       updates[key] = dateValue.toISOString().split('T')[0];
//       return;
//     }

//     // ENHANCED: Preserve original data type
//     const originalType = typeof currentEditingRecord[key];

//     if (val === null || val === 'null' || val === '') {
//       updates[key] = null;
//       return;
//     }

//     // Convert back to original type
//     switch (originalType) {
//       case 'number':
//         const numValue = Number(val);
//         if (isNaN(numValue)) {
//           toast.error(`${key} must be a number`);
//           return;
//         }
//         updates[key] = numValue;
//         break;

//       case 'boolean':
//         updates[key] = val === 'true' || val === true;
//         break;

//       case 'object':
//         // Handle arrays or JSON objects
//         if (Array.isArray(currentEditingRecord[key])) {
//           try {
//             updates[key] = typeof val === 'string' ? JSON.parse(val) : val;
//           } catch (e) {
//             console.error('Failed to parse array:', e);
//             updates[key] = val;
//           }
//         } else {
//           updates[key] = val;
//         }
//         break;

//       default:
//         // String or unknown type
//         updates[key] = val;
//     }
//   });

//   if (Object.keys(updates).length === 0) {
//     toast.warning("No changes to save");
//     return;
//   }

//   console.log('Fields to update:', updates);

//   const requestBody = {
//     schemaName,
//     tableName,
//     recordId: originalId,
//     ownerId: owner_id,
//     updates
//   };

//   console.log('Update request body:', requestBody);

//   try {
//     const result = await axios.post(updateRecord, requestBody, {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     toast.success("Record updated successfully");
//     setEditingRowId(null);
//     setEditingValues({});
//     setCurrentEditingRecord(null);
//     handleRefresh();

//     console.log('Update response:', result.data);

//     if (result.data.updatedColumns) {
//       console.log('Updated columns:', result.data.updatedColumns.join(', '));
//     }
//   } catch (err) {
//     console.error('Update error:', err);

//     if (err.response?.data?.error) {
//       toast.error(err.response.data.error);
//     } else if (err.response?.data?.details) {
//       toast.error(`Update failed: ${err.response.data.details}`);
//     } else {
//       toast.error("Update failed");
//     }
//   }
// };


//   // Get unique statuses for filters
//   const uniqueStatuses = Array.from(new Set(originalRecords.map(record => record.status))).filter(Boolean);
//   const uniquePriorities = Array.from(new Set(originalRecords.map(record => record.priority))).filter(Boolean);
//   const visibleColumns = columns.filter(column => column.visible);
//   const indexOfLastRecord = currentPage * pageSize;
//   const indexOfFirstRecord = indexOfLastRecord - pageSize;
//   const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

//   // ENHANCED: Get ordered columns for form display
//   const orderedFormColumns = getOrderedFormColumns();


//   return show ? "" : (
//     <Card className="tableCard shadow-sm border-slate-200 mx-[6rem]"

//     // {
//     //   "tableCard" + (pa_id ? "shadow-sm border-slate-200 mx-[6rem] hidden" : "shadow-sm border-slate-200 mx-[6rem]")
//     // }

//       >
//       <CardHeader className="pb-3">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-semibold text-slate-700">All Records</CardTitle>
//             <CardDescription className="mt-1">
//               View and manage all database records
//               {/* Show URL params info */}
//               {pa_id && (
//                 <div className="flex gap-2 mt-1">
//                   <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
//                     PA ID: {pa_id}
//                   </Badge>
//                 </div>
//               )}
//               {/* Show process_name if present */}
//               {process_name && (
//                 <div className="flex gap-2 mt-1">
//                   <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
//                     Process: {process_name}
//                   </Badge>
//                   <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
//                     {process_name}_balance
//                   </Badge>
//                 </div>
//               )}
//               {/* Show dropdown setup status and column ordering status */}
//               {dropdownSetupExists && (
//                 <div className="flex gap-2 mt-1">
//                   <Badge variant="outline" className="text-xs">
//                     Dropdown Configured
//                   </Badge>
//                   {Object.keys(columnOrder).length > 0 && (
//                     <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
//                       <ArrowUpDown className="h-3 w-3 mr-1" />
//                       Custom Order
//                     </Badge>
//                   )}
//                 </div>
//               )}
//             </CardDescription>
//           </div>


//           <div className="flex flex-wrap items-center gap-2">
//             <div className="relative flex-1 min-w-[200px]">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//               <Input
//                 type="text"
//                 placeholder="Search records..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="pl-9"
//               />
//             </div>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent>
//         {/* Toolbar */}
//         <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
//           <div className="flex flex-wrap items-center gap-2">
//             {/* ENHANCED: Add Record Button with Ordered Modal */}
// <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//   <DialogTrigger asChild>
//     <Button
//       className="flex items-center gap-2"
//       onClick={handleOpenAddModal}
//     >
//       <Plus className="h-4 w-4" />
//       <span className="hidden sm:inline">Add Record</span>
//     </Button>
//   </DialogTrigger>
//   <DialogContent 
//     className="max-w-3xl max-h-[80vh] overflow-y-auto"
//     onInteractOutside={(e) => e.preventDefault()}  // <-- Add this line
//   >
//                 <DialogHeader>
//                   <DialogTitle>Add New Record</DialogTitle>
//                   <DialogDescription>
//                     Fill in the details to create a new record in the database.
//                     {process_name && (
//                       <span className="block mt-1 text-blue-600">
//                         Note: The {process_name}_balance field will be automatically set to match the quantity value.
//                       </span>
//                     )}
//                   </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-6 py-4">
//                   {/* ENHANCED: Use ordered columns for form display with auto-fill indicators */}
//                   {(() => {
//                     // Debug: Log which columns will be displayed in the form
//                     if (process_name) {
//                       console.log('=== FORM RENDERING ===');
//                       console.log('process_name:', process_name);
//                       console.log('orderedFormColumns to display:', orderedFormColumns.map(c => c.id));
//                       console.log('Checking if balance field is in list:', 
//                         orderedFormColumns.some(c => c.id === `${process_name}_balance`));
//                     }
//                     return orderedFormColumns;
//                   })().map((column, index) => {
//                     // Show indicator for dropdown fields, order, and auto-fill
//                     const hasDropdown = dropdownSetup[column.id] && Array.isArray(dropdownSetup[column.id]) && dropdownSetup[column.id].length > 0;
//                     const orderNumber = columnOrder[column.id];
//                     const isAutoFilled = column.id === 'pa_id';

//                     // ENHANCED: Check if this is the quantity field and process_name exists
//                     const isQuantityForBalance = process_name && (
//                       column.id.toLowerCase().includes('quantity') || 
//                       column.name.toLowerCase().includes('quantity')
//                     );

//                     return (
//                       <div key={column.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//                         <Label htmlFor={column.id} className="font-medium text-sm sm:w-48 sm:text-right sm:flex-shrink-0 flex items-center gap-1 justify-start sm:justify-end">
//                           {/* Show order number if available */}
//                           {orderNumber && (
//                             <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
//                               {orderNumber}
//                             </Badge>
//                           )}
//                           <span className="flex-1 sm:flex-initial">{column.name}</span>

//                           {(() => {
//                             const columnMetadata = metaData.find(col => col.column_name === column.id);
//                             // console.log("column Meta Data:", columnMetadata);
//                             return columnMetadata?.is_nullable === "NO" && (
//                               <Badge variant="default" className="text-xs h-4 px-1 text-red-100">
//                                 *
//                               </Badge>
//                             );
//                           })()}
//                           {isAutoFilled && (
//                             <Badge variant="default" className="text-xs h-4 px-1 bg-green-500 ml-1">
//                               auto
//                             </Badge>
//                           )}
//                           {/* ENHANCED: Show indicator for quantity when it's used for balance */}
//                           {/* {isQuantityForBalance && (
//                             <Badge variant="default" className="text-xs h-4 px-1 bg-blue-500 ml-1">
//                               →balance
//                             </Badge>
//                           )} */}
//                         </Label>
//                         <div className="flex-1 min-w-0">
//                           {renderFormInput(
//                             column,
//                             newRecordData[column.id],
//                             handleNewRecordChange
//                           )}
//                           {/* Show helper text for auto-filled fields */}
//                           {isAutoFilled && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               {column.id === 'pa_id'
//                                 ? 'Automatically filled from URL parameter'
//                                 : 'Automatically generated unique identifier'}
//                             </p>
//                           )}
//                           {/* ENHANCED: Show helper text for quantity when used for balance */}
//                           {isQuantityForBalance && (
//                             <p className="text-xs text-blue-600 mt-1">
//                               This value will be used to set {process_name}_balance
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => setIsAddModalOpen(false)}
//                     disabled={isCreating}
//                     className="w-full sm:w-auto order-2 sm:order-1"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={handleCreateRecord}
//                     disabled={isCreating}
//                     className="w-full sm:w-auto order-1 sm:order-2"
//                   >
//                     {isCreating ? 'Creating...' : 'Create Record'}
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//             <Button
//               variant="outline"
//               size="sm"
//               className="flex items-center gap-2"
//               onClick={handleRefresh}
//             >
//               <RefreshCw className="h-4 w-4" />
//               <span className="hidden sm:inline">Refresh</span>
//             </Button>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="flex items-center gap-2">
//                   <Filter className="h-4 w-4" />
//                   <span className="hidden sm:inline">Filters</span>
//                   {(statusFilter.length > 0 || priorityFilter.length > 0) && (
//                     <Badge className="ml-1 py-0 px-1.5 h-5 min-w-5 bg-blue-500 text-white rounded-full">
//                       {statusFilter.length + priorityFilter.length}
//                     </Badge>
//                   )}
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-56">
//                 <DropdownMenuLabel className="flex justify-between items-center">
//                   <span>Filter by Status</span>
//                   {statusFilter.length > 0 && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-6 px-2 text-xs"
//                       onClick={() => setStatusFilter([])}
//                     >
//                       Clear
//                     </Button>
//                   )}
//                 </DropdownMenuLabel>
//                 {uniqueStatuses.map(status => (
//                   <DropdownMenuCheckboxItem
//                     key={status}
//                     checked={statusFilter.includes(status)}
//                     onCheckedChange={() => toggleStatusFilter(status)}
//                   >
//                     <Badge className={`font-medium mr-2 ${getStatusBadgeColor(status)}`}>
//                       {status}
//                     </Badge>
//                     <span>{status}</span>
//                   </DropdownMenuCheckboxItem>
//                 ))}

//                 <DropdownMenuSeparator />

//                 <DropdownMenuLabel className="flex justify-between items-center">
//                   <span>Filter by Priority</span>
//                   {priorityFilter.length > 0 && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-6 px-2 text-xs"
//                       onClick={() => setPriorityFilter([])}
//                     >
//                       Clear
//                     </Button>
//                   )}
//                 </DropdownMenuLabel>
//                 {uniquePriorities.map(priority => (
//                   <DropdownMenuCheckboxItem
//                     key={priority}
//                     checked={priorityFilter.includes(priority)}
//                     onCheckedChange={() => togglePriorityFilter(priority)}
//                   >
//                     <Badge className={`font-medium mr-2 ${getPriorityBadgeColor(priority)}`}>
//                       {priority}
//                     </Badge>
//                     <span>{priority}</span>
//                   </DropdownMenuCheckboxItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="sm" className="flex items-center gap-2">
//                   <SlidersHorizontal className="h-4 w-4" />
//                   <span className="hidden sm:inline">Columns</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-56">
//                 <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
//                 {columns.map(column => (
//                   <DropdownMenuItem key={column.id} onSelect={(e) => {
//                     e.preventDefault();
//                     toggleColumnVisibility(column.id);
//                   }}>
//                     <div className="flex items-center gap-2">
//                       <Checkbox
//                         checked={column.visible}
//                         onCheckedChange={() => toggleColumnVisibility(column.id)}
//                       />
//                       <span>{column.name}</span>
//                     </div>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="flex items-center gap-2"
//               onClick={exportToCSV}
//             >
//               <FileSpreadsheet className="h-4 w-4" />
//               <span className="hidden sm:inline">Export CSV</span>
//             </Button>

//             <Button
//               variant="outline"
//               size="sm"
//               className="flex items-center gap-2"
//               onClick={() => setEditEnabled(!editEnabled)}
//             >
//               <Edit className="h-4 w-4" />
//               <span className="hidden sm:inline">Edit</span>
//             </Button>

//             {editingRowId && currentEditingRecord && editEnabled ? (
//               <div className="flex gap-2">
//                 <Button size="sm" onClick={() => handleSave(currentEditingRecord.id)}>
//                   Save
//                 </Button>
//                 <Button size="sm" variant="ghost" onClick={() => {
//                   setEditingRowId(null);
//                   setCurrentEditingRecord(null);
//                 }}>
//                   Cancel
//                 </Button>
//               </div>
//             ) : null}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="rounded-md border mt-4 overflow-hidden">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-slate-50">
//                      { userData.owner_id === null ? (  
//                   <TableHead className="w-[60px] text-center">Delete</TableHead>
//                   ):""}
//                   {visibleColumns.map(column => (
//                     <TableHead
//                       key={column.id}
//                       className="cursor-pointer hover:bg-slate-100"
//                       onClick={() => handleSort(column.id)}
//                     >
//                       <div className="flex items-center gap-1">
//                         <span>{column.name}</span>
//                         {sortColumn === column.id && (
//                           <ChevronDown
//                             className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
//                           />
//                         )}
//                       </div>
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
//                       Loading records...
//                     </TableCell>
//                   </TableRow>
//                 ) : records.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
//                       No records found. {searchTerm || statusFilter.length > 0 || priorityFilter.length > 0 ?
//                         <Button variant="link" onClick={handleRefresh}>Clear filters?</Button> : ''}
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   currentRecords.map((record, index) => (
//                     <TableRow key={record.id || index} className="hover:bg-slate-50"
//                       onClick={() => {
//                         setEditingRowId(record.id);
//                         // if (editEnabled === false) {
//                           setEditingValues(record);
//                         // }
//                         setCurrentEditingRecord(record);
//                       }}>

//                       { userData.owner_id === null ? (  
//                       <TableCell className="w-[60px] text-center">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteClick(record);
//                           }}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </TableCell>
// ):""}
//                       {visibleColumns.map(column => (
//                         <TableCell key={column.id}>
//                           {editingRowId === record.id && column.id !== 'id' && editEnabled ? (
//                             <input
//                               type="text"
//                               value={editingValues[column.id] || ''}
//                               onChange={(e) =>
//                                 setEditingValues(prev => ({ ...prev, [column.id]: e.target.value }))
//                               }
//                               className="border rounded px-2 py-1 w-full"
//                             />
//                           ) : column.id === 'status' ? (
//                             <Badge className={`font-medium ${getStatusBadgeColor(record[column.id])}`}>
//                               {record[column.id]}
//                             </Badge>
//                           ) : column.id === 'priority' ? (
//                             <Badge className={`font-medium ${getPriorityBadgeColor(record[column.id])}`}>
//                               {record[column.id]}
//                             </Badge>
//                           ) : column.id === 'task_file' && record[column.id] ? (
//                             <div className="flex items-center gap-1">
//                               <FileText className="h-4 w-4 text-slate-400" />
//                               <span>{record[column.id]}</span>
//                             </div>
//                           ) : (
//                             <span>{record[column.id] || '—'}</span>
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//         </div>

//         {/* Pagination */}
//         <ResponsivePagination
//           currentPage={currentPage}
//           setCurrentPage={setCurrentPage}
//           totalPages={totalPages}
//         />

//         <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
//   <DialogContent className="max-w-md">
//     <DialogHeader>
//       <DialogTitle className=" flex items-center gap-2">
//         <Trash2 className="h-5 w-5" />
//         Confirm Deletion
//       </DialogTitle>
//       <DialogDescription>
//         This action cannot be undone. Please type the <strong>us_id</strong> to confirm deletion.
//       </DialogDescription>
//     </DialogHeader>

//     <div className="space-y-4 py-4">
//       {recordToDelete && (
//         <div className="bg-gray-50 p-3 rounded border">
//           <p className="text-sm font-medium">Record to delete:</p>
//           <p className="text-sm text-gray-600">ID: {recordToDelete.id}</p>
//           <p className="text-sm text-gray-600">US_ID: <span className="font-mono bg-yellow-100 px-1 rounded">{recordToDelete.us_id}</span></p>
//         </div>
//       )}

//       <div>
//         <Label htmlFor="confirm-us-id" className="text-sm font-medium">
//           Enter us_id to confirm:
//         </Label>
//         <Input
//           id="confirm-us-id"
//           type="text"
//           placeholder="Type us_id here"
//           value={deleteUsIdInput}
//           onChange={(e) => setDeleteUsIdInput(e.target.value)}
//           className="mt-1"
//           autoFocus
//         />
//       </div>
//     </div>

//     <DialogFooter className="flex flex-col sm:flex-row gap-2">
//       <Button
//         variant="outline"
//         onClick={handleDeleteCancel}
//         disabled={isDeleting}
//         className="w-full sm:w-auto"
//       >
//         Cancel
//       </Button>
//       <Button
//         variant="destructive"
//         onClick={handleDeleteConfirm}
//         disabled={isDeleting || !deleteUsIdInput.trim()}
//         className="w-full sm:w-auto"
//       >
//         {isDeleting ? 'Deleting...' : 'Delete Record'}
//       </Button>
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
//       </CardContent>
//     </Card>
//   );
// };

// export default CustomTable;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import Papa from 'papaparse';

// Shadcn UI components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// Lucide React icons
import {
  Search,
  FileText,
  Upload,
  MoreHorizontal,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Filter,
  FileSpreadsheet,
  FileDown,
  RefreshCw,
  SlidersHorizontal,
  Check,
  Plus,
  X,
  ArrowUpDown
} from 'lucide-react';
import axios from '../../utils/axiosConfig';
import { toast } from 'sonner';

// Api Calls Route
import { getAllRecords, updateRecord, createRecord, getAllPayments } from '../../api/apiConfig';
import { useSelector } from 'react-redux';
import { showText } from 'pdf-lib';
import "../../css/components/CustomTable.css";
import ResponsivePagination from './Pagination';
import WorkflowCounter from './WorkFlowCounter';
import { columnPreferencesService } from '../services/columnPreferencesService';



const CustomTable = ({ type = "normal" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [originalRecords, setOriginalRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [columns, setColumns] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [statusFilter, setStatusFilter] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingValues, setEditingValues] = useState({});
  const [editEnabled, setEditEnabled] = useState(false);
  const [currentEditingRecord, setCurrentEditingRecord] = useState({});
  const [metaData, setMetaData] = useState({});
  const [columnPreferencesLoaded, setColumnPreferencesLoaded] = useState(false);

  // Add Record Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecordData, setNewRecordData] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  // ENHANCED: Dropdown setup state with column ordering
  const [dropdownSetup, setDropdownSetup] = useState({});
  const [columnOrder, setColumnOrder] = useState({});
  const [dropdownSetupExists, setDropdownSetupExists] = useState(false);

  // Delete Record States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteUsIdInput, setDeleteUsIdInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Counter Config State
  const [counterConfig, setCounterConfig] = useState({
    counter: 0,
    prefix: "",
    isActive: false,
    recordId: null
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const userData = useSelector((state) => state.user);
  const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;
  const [isDataReady, setIsDataReady] = useState(false);

  // Get URL parameters
  const pa_id = searchParams.get('pa_id');
  const us_id = searchParams.get('us_id')
  const show = searchParams.get('show');
  const status = searchParams.get('status');
  const process_name = searchParams.get('process_name');

  // Log URL params for debugging
  useEffect(() => {
    console.log('URL Params:', { process_name, pa_id, us_id, show, status });
    if (process_name) {
      console.log(`Balance field to hide: ${process_name}_balance`);
    }
  }, [process_name, pa_id, us_id, show, status]);

  // Handle search query parameter
  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchParams]);

  // Generate unique us_id using Unix timestamp
  const generateUsId = () => {
    return Date.now().toString();
  };

  const { tableName1 } = useParams();
  const apiParams = {
    schemaName: userData.schema_name,
    tableName: tableName1,
    userId: userData.id,
    userEmail : userData.email
  }

  // Load column preferences from database
const loadColumnPreferences = async () => {
  try {
    const preferences = await columnPreferencesService.fetch(owner_id, apiParams.tableName);
    
    if (preferences && preferences.column_visibility) {
      console.log('Loaded column preferences:', preferences.column_visibility);
      return preferences.column_visibility;
    }
    return null;
  } catch (error) {
    console.error('Error loading column preferences:', error);
    return null;
  }
};

// Apply column preferences to columns
const applyColumnPreferences = (columns, preferences) => {
  if (!preferences) return columns;
  
  return columns.map(column => {
    // If preference exists for this column, use it; otherwise default to visible
    const isVisible = preferences[column.id] !== undefined 
      ? preferences[column.id] 
      : true;
    
    return {
      ...column,
      visible: isVisible
    };
  });
};

// Save column preferences to database
const saveColumnPreferences = async (columns) => {
  try {
    // Create visibility map
    const visibilityMap = {};
    columns.forEach(column => {
      visibilityMap[column.id] = column.visible;
    });
    
    const result = await columnPreferencesService.save(
      owner_id, 
      apiParams.tableName, 
      visibilityMap,
      userData.schema_name
    );
    
    if (result.success) {
      console.log('Column preferences saved successfully');
    }
  } catch (error) {
    console.error('Error saving column preferences:', error);
  }
};

  // Counter update handler
  const handleCounterUpdate = (config) => {
    setCounterConfig(config);
    console.log('Counter config updated:', config);
  };

  // Add Delete Function
  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setDeleteUsIdInput('');
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!recordToDelete || !deleteUsIdInput.trim()) {
      toast.error("Please enter the us_id to confirm deletion");
      return;
    }

    if (deleteUsIdInput.trim() !== recordToDelete.us_id) {
      toast.error("Entered us_id does not match. Deletion cancelled.");
      return;
    }

    try {
      setIsDeleting(true);

      const params = new URLSearchParams({
        id: recordToDelete.id,
        schemaName: apiParams.schemaName,
        tableName: apiParams.tableName
      });

      const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}/data/deleteRecord?${params.toString()}`);

      toast.success("Record deleted successfully");
      setDeleteConfirmOpen(false);
      setRecordToDelete(null);
      setDeleteUsIdInput('');
      handleRefresh();

    } catch (error) {
      console.error('Delete error:', error);
      if (error.response) {
        toast.error(`Failed to delete record: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
      } else {
        toast.error("Failed to delete record. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setRecordToDelete(null);
    setDeleteUsIdInput('');
  };


  // Function to fetch record data by us_id
  const fetchRecordByUsId = async (usId) => {
    try {
      const decodedUsId = decodeURIComponent(usId);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BASE_URL}/data/getRecordById`,
        {
          schemaName: apiParams.schemaName,
          tableName: apiParams.tableName,
          id: decodedUsId
        }
      );

      console.log("Full response:", response);
      console.log("response.data:", response.data);

      if (response.data) {
        console.log('Returning record:', response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching record by us_id:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to fetch record: ${error.response.data.message || 'Unknown error'}`);
      } else {
        toast.error('Failed to fetch record data');
      }
      return null;
    }
  };

  // ENHANCED: Function to fetch dropdown setup with column ordering
  const fetchDropdownSetup = async () => {
    try {
      const tableName = apiParams.tableName;
      const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
      const { data } = await axios.get(route);

      if (data.exists && data.setup) {
        // Set dropdown values
        if (data.setup.mapping) {
          setDropdownSetup(data.setup.mapping);
        }

        // ENHANCED: Set column order
        if (data.setup.columnOrder) {
          setColumnOrder(data.setup.columnOrder);
          console.log('Column order loaded:', data.setup.columnOrder);
        }

        setDropdownSetupExists(true);
        console.log('Dropdown setup loaded:', data.setup.mapping);
      } else {
        setDropdownSetup({});
        setColumnOrder({});
        setDropdownSetupExists(false);
        console.log('No dropdown setup found');
      }
    } catch (error) {
      console.error('Error fetching dropdown setup:', error);
      setDropdownSetup({});
      setColumnOrder({});
      setDropdownSetupExists(false);
    }
  };

  // ENHANCED: Function to get ordered columns for form display with process_name balance filtering
  const getOrderedFormColumns = () => {
    // ENHANCED: Debug logging for process_name
    if (process_name) {
      console.log('=== BALANCE FIELD FILTERING ===');
      console.log('process_name from URL:', process_name);
      console.log('Will hide ALL balance fields when process_name is present');
      console.log('All column IDs:', columns.map(c => c.id));
      console.log('All column names (display):', columns.map(c => c.name));
    }

    const filteredColumns = columns.filter(column => {
      // Standard exclusions
      if (column.id === 'id' ||
        column.id.includes('_comment') ||
        column.id.includes('created_at') ||
        column.id.includes('updated_at')) {
        return false;
      }

      // ENHANCED: Hide ALL balance fields when process_name exists
      if (process_name) {
        const columnIdLower = column.id.toLowerCase();
        const columnNameLower = column.name.toLowerCase();

        // Check if this column is ANY balance field
        const isBalanceField = columnIdLower.includes('balance') || columnNameLower.includes('balance');

        if (isBalanceField) {
          console.log(`✓ HIDING balance field: ${column.id} (name: ${column.name})`);
          return false;
        }
      }

      return true;
    });

    // Log filtered columns for debugging
    if (process_name) {
      console.log('Columns after filtering:', filteredColumns.map(c => ({ id: c.id, name: c.name })));
      console.log('=== END BALANCE FIELD FILTERING ===');
    }

    // Sort columns by order number, then alphabetically for columns without order
    return filteredColumns
      .filter(column => {
        const order = columnOrder[column.id];
        return order !== 0; // Skip fields with order = 0
      }).sort((a, b) => {
        const orderA = columnOrder[a.id] || 999;
        const orderB = columnOrder[b.id] || 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        // If orders are the same, sort alphabetically
        return a.name.localeCompare(b.name);
      });
  };

  // Fetch data from API
const fetchData = async () => {
  try {
    setLoading(true);
    console.log("apiParams", apiParams);
    console.log("type", type);

    let fetchedData;

    if (type === "normal") {
      const response = await axios.post(getAllRecords, apiParams);
      fetchedData = response.data.data;
      console.log(response.data.columns)

      setMetaData(response.data.columns)
    } else if (type === "payment") {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/payment-reminders/list?owner_id=${owner_id}`
      );
      fetchedData = response.data.data || response.data;
    } else {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/data/getAllPayments?owner_id=${owner_id}`
      );
      fetchedData = response.data.data;
    }

    console.log("Raw fetched data:", fetchedData);

    let filteredData = fetchedData;

    if (type === "payment") {
      filteredData = fetchedData.filter(item =>
        item.type === 'original' || item.type === 'Original'
      );
      console.log("Filtered payment data (original only):", filteredData);
    }

    setOriginalRecords(filteredData);
    console.log(originalRecords)
    setRecords(filteredData);
    setTotalRecords(filteredData.length);
    setTotalPages(Math.ceil(filteredData.length / pageSize));

    let recordForColumns = null;

    if (filteredData.length > 0) {
      if (type === "payment") {
        recordForColumns = filteredData.find(item =>
          item.type === 'original' || item.type === 'Original'
        ) || filteredData[0];
      } else {
        recordForColumns = filteredData[0];
      }
    }

    if (recordForColumns) {
      const dynamicColumns = Object.keys(recordForColumns).map(key => ({
        id: key,
        name: formatColumnName(key),
        accessor: key,
        sortable: true,
        visible: true, // Default to visible
        type: getColumnType(recordForColumns[key], key)
      }));
      
      // ENHANCED: Load and apply column preferences
      if (!columnPreferencesLoaded) {
        const preferences = await loadColumnPreferences();
        const columnsWithPreferences = applyColumnPreferences(dynamicColumns, preferences);
        setColumns(columnsWithPreferences);
        setColumnPreferencesLoaded(true);
        console.log("Columns with preferences applied:", columnsWithPreferences);
      } else {
        setColumns(dynamicColumns);
        console.log("Generated columns:", dynamicColumns);
      }
    } else {
      console.warn("No records found to generate columns from");
      setColumns([]);
    }

  } catch (error) {
    console.error("Error fetching data:", error);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }

    toast.error("Failed to fetch records");

    setOriginalRecords([]);
    setRecords([]);
    setTotalRecords(0);
    setTotalPages(1);
    setColumns([]);
  } finally {
    setLoading(false);
  }
};

  // Initialize data and columns on component mount
  useEffect(() => {
    fetchData();
    fetchDropdownSetup(); // Fetch dropdown setup
  }, []);

  // ENHANCED: Check URL params and auto-open modal
  useEffect(() => {
    // Auto-open modal if show=true in URL params
    if (show === 'true') {
      handleOpenAddModal();
    }
  }, [show, pa_id, columns]); // Re-run when columns are loaded

  // Apply filters and search when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, statusFilter, priorityFilter, originalRecords]);

  useEffect(() => {
    if (isDataReady) {
      console.log('Data ready, opening modal with:', newRecordData);
      setIsAddModalOpen(true);
      setIsDataReady(false); // Reset for next time
    }
  }, [isDataReady, newRecordData]);

  // Helper function to format column names
  const formatColumnName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to determine column type
  const getColumnType = (value, columnName) => {
    const lowerColumnName = columnName.toLowerCase();

    // Specific checks first
    if (lowerColumnName.includes('email')) return 'email';
    if (lowerColumnName.includes('phone')) return 'tel';
    if (lowerColumnName.includes('url') || lowerColumnName.includes('link') || lowerColumnName.includes('invoice_url')) return 'url';
    if (lowerColumnName === 'status') return 'url';
    if (lowerColumnName === 'priority') return 'select-priority';
    if (lowerColumnName.includes('description') || lowerColumnName.includes('notes') || lowerColumnName.includes('comment')) return 'textarea';
    if (lowerColumnName.includes('date') || lowerColumnName.includes('created') || lowerColumnName.includes('updated') || lowerColumnName === 'invoice') return 'date';

    // Fallback based on value type
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'checkbox';
    if (value && value.length > 100) return 'textarea';

    return 'text';
  };

  // Function to apply filters and search
  const applyFiltersAndSearch = () => {
    if (!originalRecords.length) return;

    let filteredResults = [...originalRecords];

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filteredResults = filteredResults.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    if (statusFilter.length > 0) {
      filteredResults = filteredResults.filter(item =>
        statusFilter.includes(item.status)
      );
    }

    if (priorityFilter.length > 0) {
      filteredResults = filteredResults.filter(item =>
        priorityFilter.includes(item.priority)
      );
    }

    setRecords(filteredResults);
    setTotalRecords(filteredResults.length);
    setTotalPages(Math.ceil(filteredResults.length / pageSize));
    setCurrentPage(1);
  };

  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle refresh button
  const handleRefresh = () => {
    fetchData();
    fetchDropdownSetup(); // Also refresh dropdown setup
    setSearchTerm('');
    setStatusFilter([]);
    setPriorityFilter([]);
  };

  const handleOpenAddModal = async () => {
    if (columns.length === 0) {
      console.log('Columns not loaded yet, waiting...');
      return;
    }

    const currentUrlParams = Object.fromEntries(searchParams.entries());
    const initialData = {};
    const orderedColumns = getOrderedFormColumns();

    if (currentUrlParams.us_id) {
      console.log('Fetching record for us_id:', currentUrlParams.us_id);
      const fetchedRecord = await fetchRecordByUsId(currentUrlParams.us_id);

      console.log('=== DEBUG INFO ===');
      console.log('fetchedRecord:', fetchedRecord);
      console.log('typeof fetchedRecord:', typeof fetchedRecord);
      console.log('Is array?:', Array.isArray(fetchedRecord));

      if (fetchedRecord) {
        // Record exists - populate from database
        console.log('fetchedRecord keys:', Object.keys(fetchedRecord));
        console.log('orderedColumns (first 5):', orderedColumns.slice(0, 5).map(c => c.id));

        orderedColumns.forEach(column => {
          console.log(`\nChecking column: ${column.id}`);
          console.log(`  - has property?: ${fetchedRecord.hasOwnProperty(column.id)}`);
          console.log(`  - value in fetchedRecord: ${fetchedRecord[column.id]}`);

          if (column.id === 'quantity') {
            initialData[column.id] = '';
            console.log(`  - Set to empty (quantity)`);
          } else if (fetchedRecord.hasOwnProperty(column.id)) {
            const value = fetchedRecord[column.id];
            initialData[column.id] = value === null ? '' : String(value);
            console.log(`  - Set to: ${initialData[column.id]}`);
          } else if (currentUrlParams[column.id]) {
            initialData[column.id] = currentUrlParams[column.id];
            console.log(`  - Set from URL param: ${initialData[column.id]}`);
          } else {
            initialData[column.id] = '';
            console.log(`  - Set to empty (no match)`);
          }
        });

        console.log('=== FINAL initialData ===');
        console.log(initialData);
      } else {
        // Record doesn't exist - populate from URL params
        console.log('Record not found, populating from URL params');
        orderedColumns.forEach(column => {
          if (currentUrlParams[column.id]) {
            // Use value from URL parameter (including us_id)
            initialData[column.id] = currentUrlParams[column.id];
            console.log(`  - ${column.id} set from URL: ${initialData[column.id]}`);
          } else if (column.id === 'us_id') {
            // ENHANCED: Use counter if active, otherwise generate
            if (counterConfig.isActive) {
              initialData[column.id] = `${counterConfig.prefix}${counterConfig.counter}`;
              console.log(`  - ${column.id} set from counter: ${initialData[column.id]}`);
            } else {
              initialData[column.id] = generateUsId();
              console.log(`  - ${column.id} generated: ${initialData[column.id]}`);
            }
          } else {
            initialData[column.id] = '';
            console.log(`  - ${column.id} set to empty`);
          }
        });
      }
    } else {
      // No us_id in URL - normal flow
      orderedColumns.forEach(column => {
        if (currentUrlParams[column.id]) {
          initialData[column.id] = currentUrlParams[column.id];
        } else if (column.id === 'us_id') {
          // ENHANCED: Use counter if active, otherwise generate
          if (counterConfig.isActive) {
            initialData[column.id] = `${counterConfig.prefix}${counterConfig.counter}`;
          } else {
            initialData[column.id] = generateUsId();
          }
        } else {
          initialData[column.id] = '';
        }
      });
    }

    setNewRecordData(initialData);
    setIsDataReady(true);

    if (currentUrlParams.show === 'true') {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('show');
      setSearchParams(newSearchParams, { replace: true });
    }
  };


  const handleNewRecordChange = (columnId, value) => {
    setNewRecordData(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  // ENHANCED: Handle create new record with process_name balance logic and counter increment
  const handleCreateRecord = async () => {
    try {
      setIsCreating(true);

      // Add owner_id to the record data
      const recordWithOwnerId = {
        ...newRecordData,
      };

      // ENHANCED: Add balance calculation when process_name exists
      if (process_name) {
        // Find the actual balance field column from the columns array
        const processNameLower = process_name.trim().toLowerCase();
        const balanceColumn = columns.find(col => {
          const colIdLower = col.id.toLowerCase();
          const colNameLower = col.name.toLowerCase();

          // Check if this column is the balance field for this process
          return colIdLower.includes(processNameLower) &&
            (colIdLower.includes('balance') || colNameLower.includes('balance'));
        });

        if (balanceColumn) {
          const balanceFieldName = balanceColumn.id; // Use the actual column ID from database

          // Find quantity field - check multiple possible names
          const quantityColumn = columns.find(col => {
            const colIdLower = col.id.toLowerCase();
            const colNameLower = col.name.toLowerCase();
            return colIdLower.includes('quantity') || colNameLower.includes('quantity');
          });

          const quantityFieldId = quantityColumn ? quantityColumn.id : 'quantity';
          const quantity = newRecordData[quantityFieldId];

          console.log(`Found balance column: ${balanceFieldName} (display name: ${balanceColumn.name})`);
          console.log(`Using quantity field: ${quantityFieldId} with value: ${quantity}`);

          // Validate that quantity exists
          if (!quantity || quantity === '') {
            toast.error('Quantity is required when process_name is specified');
            setIsCreating(false);
            return;
          }

          // Optional: Validate quantity is a valid number
          const quantityNum = parseFloat(quantity);
          if (isNaN(quantityNum)) {
            toast.error('Quantity must be a valid number');
            setIsCreating(false);
            return;
          }

          // Optional: Validate quantity is greater than 0
          if (quantityNum <= 0) {
            toast.error('Quantity must be greater than 0');
            setIsCreating(false);
            return;
          }

          // Set balance = quantity using the actual column ID
          recordWithOwnerId[balanceFieldName] = quantity;
          console.log(`✓ Setting ${balanceFieldName} = ${quantity}`);
        } else {
          console.warn(`⚠ Balance field for process "${process_name}" not found in columns`);
        }
      }

      const dateFields = [
        'invoice',
        'date',
        'due_date',
        'final_due_date',
        'last_overdue_reminder_date',
        'sent_at',
        'created_at',
        'updated_at'
      ];

      const arrayFields = ['out_webhooks', 'emails'];

      const sanitizedRecord = Object.fromEntries(
        Object.entries(recordWithOwnerId).map(([key, value]) => {
          // Handle date fields
          if (dateFields.includes(key)) {
            return [key, value === '' ? null : value];
          }

          // Handle array fields
          if (arrayFields.includes(key)) {
            if (value === '') return [key, null];
            return [key, value];
          }

          // Default case - ensure empty strings are handled properly
          return [key, value === '' ? null : value];
        })
      );

      // Remove null/undefined values and unnecessary fields for payment endpoint
      const cleanedRecord = Object.fromEntries(
        Object.entries(sanitizedRecord).filter(([key, value]) => {
          if (type === "payment") {
            const excludeFields = [
              'id', 'created_at', 'updated_at', 'sent_at',
              'due_date', 'final_due_date', 'last_overdue_reminder_date'
            ];
            if (excludeFields.includes(key)) {
              return false;
            }
          }

          // Keep all non-null values
          if (value !== null && value !== undefined && value !== '') {
            return true;
          }

          // Keep specific fields even if empty (backend will handle defaults)
          const allowEmpty = ['status', 'type'];
          return allowEmpty.includes(key);
        })
      );

      console.log("Cleaned record data:", cleanedRecord);

      // Log the balance field if process_name exists
      if (process_name) {
        const balanceFieldName = `${process_name}_balance`;
        console.log(`Final record includes ${balanceFieldName}:`, cleanedRecord[balanceFieldName]);
      }

      if (type === "payment") {
        console.log("Sending to payment endpoint:", cleanedRecord);

        const response = await axios.post(
          `${import.meta.env.VITE_APP_BASE_URL}/payment-reminders/add`,
          cleanedRecord,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log("Payment reminder response:", response.data);
      } else {
        // For regular records, use the wrapper format
        const recordData = {
          schemaName: apiParams.schemaName,
          tableName: apiParams.tableName,
          record: cleanedRecord
        };

        if ((status && pa_id) || (process_name && pa_id)) {
          cleanedRecord.us_id = pa_id + " -S- " + cleanedRecord.us_id;
        }

        console.log("Sending to regular endpoint:", recordData);

        const response = await axios.post(createRecord, recordData);
        console.log("Regular record response:", response.data);
      }

      // ENHANCED: Increment counter if active using /data/updateMultiple
      if (counterConfig.isActive && counterConfig.recordId) {
        try {
          const incrementRoute = `${import.meta.env.VITE_APP_BASE_URL}/data/updateMultiple`;
          const incrementBody = {
            schemaName: "public",
            tableName: "counter_setup",
            recordId: counterConfig.recordId,
            ownerId: owner_id,
            updates: {
              counter: counterConfig.counter + 1
            }
          };

          await axios.post(incrementRoute, incrementBody);

          // Update local counter state
          setCounterConfig(prev => ({
            ...prev,
            counter: prev.counter + 1
          }));

          console.log('✓ Counter incremented successfully');
        } catch (counterError) {
          console.error('Error incrementing counter:', counterError);
          toast.warning('Record created but counter increment failed');
        }
      }

      toast.success("Record created successfully!");
      setIsAddModalOpen(false);
      setNewRecordData({});
      handleRefresh();
      setSearchParams({})

    } catch (error) {
      console.error("Error creating record:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error(`Failed to create record: ${error.response.data.error || error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        toast.error(`Failed to create record: ${error.message}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // ENHANCED: Enhanced render form input function with dropdown support and auto-fill handling
  const renderFormInput = (column, value, onChange) => {
    const { id, type, name } = column;

    // Check if this is an auto-filled field (pa_id or us_id)
    const isAutoFilled = id === 'pa_id';

    // Check if this column has dropdown configuration
    const hasDropdownConfig = dropdownSetup[id] && Array.isArray(dropdownSetup[id]) && dropdownSetup[id].length > 0;

    if (hasDropdownConfig && !isAutoFilled) {
      // Render dropdown for configured columns (except auto-filled ones)
      return (
        <Select value={value || ''} onValueChange={(val) => onChange(id, val)}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {dropdownSetup[id].map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Auto-filled fields (pa_id and us_id) - render as disabled inputs
    if (isAutoFilled) {
      return (
        <Input
          id={id}
          type="text"
          value={value || ''}
          disabled={true}
          className="bg-gray-50 cursor-not-allowed text-gray-600"
          placeholder={
            id === 'pa_id'
              ? 'Auto-filled from URL'
              : id === 'us_id'
                ? 'Auto-generated ID'
                : `Auto-filled ${name.toLowerCase()}`
          }
        />
      );
    }

    // Original input rendering logic for non-dropdown, non-auto-filled fields
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={`Enter ${name.toLowerCase()}`}
            rows={3}
          />
        );

      case 'select-status':
        return (
          <Select value={value || ''} onValueChange={(val) => onChange(id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'select-priority':
        return (
          <Select value={value || ''} onValueChange={(val) => onChange(id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        );

      case 'number':
        return (
          <Input
            id={id}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={`Enter ${name.toLowerCase()}`}
          />
        );

      case 'email':
        return (
          <Input
            id={id}
            type="email"
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={`Enter ${name.toLowerCase()}`}
          />
        );

      case 'tel':
        return (
          <Input
            id={id}
            type="tel"
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={`Enter ${name.toLowerCase()}`}
          />
        );

      case 'date':
        return (
          <Input
            id={id}
            type="date"
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
          />
        );

      case 'url':
        return (
          <Input
            id={id}
            type="url"
            value={value || ''}
            onChange={(e) => onChange(id, e.target.value)}
            placeholder={`Enter ${name.toLowerCase()}`}
          />
        );

      case 'checkbox':
        return (
          <Checkbox
            id={id}
            checked={value || false}
            onCheckedChange={(checked) => onChange(id, checked)}
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
          />
        );
    }
  };

  // Toggle status filter
  const toggleStatusFilter = (status) => {
    setStatusFilter(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  // Toggle priority filter
  const togglePriorityFilter = (priority) => {
    setPriorityFilter(prev => {
      if (prev.includes(priority)) {
        return prev.filter(p => p !== priority);
      } else {
        return [...prev, priority];
      }
    });
  };

  // Handle record selection
  const handleSelectRecord = (id) => {
    if (selectedRecords.includes(id)) {
      setSelectedRecords(selectedRecords.filter(recordId => recordId !== id));
    } else {
      setSelectedRecords([...selectedRecords, id]);
    }
  };

  // Handle select all records
  const handleSelectAll = () => {
    if (selectedRecords.length === records.length) {
      setSelectedRecords([]);
    } else {
      setSelectedRecords(records.map(record => record.id));
    }
  };

  // Handle sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    const sortedRecords = [...records].sort((a, b) => {
      const valueA = a[column] || '';
      const valueB = b[column] || '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        return sortDirection === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }
    });

    setRecords(sortedRecords);
  };

  // Export to CSV function
  const exportToCSV = () => {
    if (!records.length) {
      toast.error('No records to export');
      return;
    }

    try {
      const dataToExport = records;
      const exportData = dataToExport.map(record => {
        const filteredRecord = {};
        visibleColumns.forEach(column => {
          filteredRecord[column.name] = record[column.id];
        });
        return filteredRecord;
      });

      const csv = Papa.unparse(exportData, {
        quotes: true,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ",",
        header: true,
        newline: "\n"
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const date = new Date().toISOString().slice(0, 10);
      const filename = `records_export_${date}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Exported ${exportData.length} records to CSV`);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast.error('Failed to export CSV. Please try again.');
    }
  };

// Handle column visibility toggle with persistence
const toggleColumnVisibility = async (columnId) => {
  const updatedColumns = columns.map(column =>
    column.id === columnId
      ? { ...column, visible: !column.visible }
      : column
  );
  
  setColumns(updatedColumns);
  
  // Save to database
  const res = await saveColumnPreferences(updatedColumns);
  console.log(res)
  toast.success('Column preferences saved');
};

// Reset column visibility to default (all visible)
const resetColumnVisibility = async () => {
  const resetColumns = columns.map(column => ({
    ...column,
    visible: true
  }));
  
  setColumns(resetColumns);
  await saveColumnPreferences(resetColumns);
  toast.success('Column visibility reset to default');
};

// Hide all columns at once
const hideAllColumns = async () => {
  const hiddenColumns = columns.map(column => ({
    ...column,
    visible: false
  }));
  
  setColumns(hiddenColumns);
  await saveColumnPreferences(hiddenColumns);
  toast.success('All columns hidden');
};

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSave = async (originalId) => {
    const schemaName = apiParams.schemaName;
    const tableName = apiParams.tableName;

    const updates = {};

    Object.entries(editingValues).forEach(([key, val]) => {
      if (val === undefined) return;

      // Get original value for comparison
      const originalValue = currentEditingRecord[key];

      // Skip if value hasn't changed
      if ((val === originalValue) || (key === 'pa_id') || (key === 'us_id') || (key === 'id')) {
        console.log(`Skipping ${key} - no change`);
        return;
      }


      console.log(`Field ${key} changed from "${originalValue}" to "${val}"`);

      // Handle date fields
      if (key.toLowerCase().includes('date') || key.toLowerCase().endsWith('_date')) {
        if (val === null || val === 'null' || val === '') {
          updates[key] = null;
          return;
        }

        const dateValue = new Date(val);
        if (isNaN(dateValue.getTime())) {
          console.warn(`Invalid date format for ${key}:`, val);
          toast.error(`Invalid date format for ${key}`);
          return;
        }

        updates[key] = dateValue.toISOString().split('T')[0];
        return;
      }

      // ENHANCED: Preserve original data type
      const originalType = typeof currentEditingRecord[key];

      if (val === null || val === 'null' || val === '') {
        updates[key] = null;
        return;
      }

      // Convert back to original type
      switch (originalType) {
        case 'number':
          const numValue = Number(val);
          if (isNaN(numValue)) {
            toast.error(`${key} must be a number`);
            return;
          }
          updates[key] = numValue;
          break;

        case 'boolean':
          updates[key] = val === 'true' || val === true;
          break;

        case 'object':
          // Handle arrays or JSON objects
          if (Array.isArray(currentEditingRecord[key])) {
            try {
              updates[key] = typeof val === 'string' ? JSON.parse(val) : val;
            } catch (e) {
              console.error('Failed to parse array:', e);
              updates[key] = val;
            }
          } else {
            updates[key] = val;
          }
          break;

        default:
          // String or unknown type
          updates[key] = val;
      }
    });

    if (Object.keys(updates).length === 0) {
      toast.warning("No changes to save");
      return;
    }

    console.log('Fields to update:', updates);

    const requestBody = {
      schemaName,
      tableName,
      recordId: originalId,
      ownerId: owner_id,
      updates
    };

    console.log('Update request body:', requestBody);

    try {
      const result = await axios.post(updateRecord, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.success("Record updated successfully");
      setEditingRowId(null);
      setEditingValues({});
      setCurrentEditingRecord(null);
      handleRefresh();

      console.log('Update response:', result.data);

      if (result.data.updatedColumns) {
        console.log('Updated columns:', result.data.updatedColumns.join(', '));
      }
    } catch (err) {
      console.error('Update error:', err);

      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else if (err.response?.data?.details) {
        toast.error(`Update failed: ${err.response.data.details}`);
      } else {
        toast.error("Update failed");
      }
    }
  };


  // Get unique statuses for filters
  const uniqueStatuses = Array.from(new Set(originalRecords.map(record => record.status))).filter(Boolean);
  const uniquePriorities = Array.from(new Set(originalRecords.map(record => record.priority))).filter(Boolean);
  const visibleColumns = columns.filter(column => column.visible);
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  // ENHANCED: Get ordered columns for form display
  const orderedFormColumns = getOrderedFormColumns();


  return show ? "" : (
    <Card className="tableCard shadow-sm border-slate-200 mx-[6rem]">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4">
          {/* Title and Description Row */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className='w-[95%]'>
              <div className="flex md:flex-row md:items-center justify-between w-full bg-gray">
                <CardTitle className="text-2xl font-semibold text-slate-700">All Records</CardTitle>
                {/* WorkflowCounter - takes up space on the left */}
                <div className="lg:flex-1 lg:max-w-[500px]">
                  <WorkflowCounter
                    tableName={apiParams.tableName}
                    onCounterUpdate={handleCounterUpdate}
                  />
                </div>

              </div>

              <CardDescription className="mt-1">
                View and manage all database records
                {/* Show URL params info */}
                {pa_id && (
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                      PA ID: {pa_id}
                    </Badge>
                  </div>
                )}
                {/* Show process_name if present */}
                {process_name && (
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200">
                      Process: {process_name}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200">
                      {process_name}_balance
                    </Badge>
                  </div>
                )}
                {/* Show dropdown setup status and column ordering status */}
                {dropdownSetupExists && (
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      Dropdown Configured
                    </Badge>
                    {Object.keys(columnOrder).length > 0 && (
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

          {/* WorkflowCounter and Search Row */}

          <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-3">


            {/* Search Input - aligned to the right */}
            <div className="relative lg:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* ENHANCED: Add Record Button with Ordered Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button
                  className="flex items-center gap-2"
                  onClick={handleOpenAddModal}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Record</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-3xl max-h-[80vh] overflow-y-auto"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle>Add New Record</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new record in the database.
                    {process_name && (
                      <span className="block mt-1 text-blue-600">
                        Note: The {process_name}_balance field will be automatically set to match the quantity value.
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* ENHANCED: Use ordered columns for form display with auto-fill indicators */}
                  {(() => {
                    // Debug: Log which columns will be displayed in the form
                    if (process_name) {
                      console.log('=== FORM RENDERING ===');
                      console.log('process_name:', process_name);
                      console.log('orderedFormColumns to display:', orderedFormColumns.map(c => c.id));
                      console.log('Checking if balance field is in list:',
                        orderedFormColumns.some(c => c.id === `${process_name}_balance`));
                    }
                    return orderedFormColumns;
                  })().map((column, index) => {
                    // Show indicator for dropdown fields, order, and auto-fill
                    const hasDropdown = dropdownSetup[column.id] && Array.isArray(dropdownSetup[column.id]) && dropdownSetup[column.id].length > 0;
                    const orderNumber = columnOrder[column.id];
                    const isAutoFilled = column.id === 'pa_id';

                    // ENHANCED: Check if this is the quantity field and process_name exists
                    const isQuantityForBalance = process_name && (
                      column.id.toLowerCase().includes('quantity') ||
                      column.name.toLowerCase().includes('quantity')
                    );

                    return (
                      <div key={column.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor={column.id} className="font-medium text-sm sm:w-48 sm:text-right sm:flex-shrink-0 flex items-center gap-1 justify-start sm:justify-end">
                          {/* Show order number if available */}
                          {orderNumber && (
                            <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
                              {orderNumber}
                            </Badge>
                          )}
                          <span className="flex-1 sm:flex-initial">{column.name}</span>

                          {(() => {
                            const columnMetadata = metaData.find(col => col.column_name === column.id);
                            return columnMetadata?.is_nullable === "NO" && (
                              <Badge variant="default" className="text-xs h-4 px-1 text-red-100">
                                *
                              </Badge>
                            );
                          })()}
                          {isAutoFilled && (
                            <Badge variant="default" className="text-xs h-4 px-1 bg-green-500 ml-1">
                              auto
                            </Badge>
                          )}
                        </Label>
                        <div className="flex-1 min-w-0">
                          {renderFormInput(
                            column,
                            newRecordData[column.id],
                            handleNewRecordChange
                          )}
                          {/* Show helper text for auto-filled fields */}
                          {isAutoFilled && (
                            <p className="text-xs text-gray-500 mt-1">
                              {column.id === 'pa_id'
                                ? 'Automatically filled from URL parameter'
                                : 'Automatically generated unique identifier'}
                            </p>
                          )}
                          {/* ENHANCED: Show helper text for quantity when used for balance */}
                          {isQuantityForBalance && (
                            <p className="text-xs text-blue-600 mt-1">
                              This value will be used to set {process_name}_balance
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
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isCreating}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateRecord}
                    disabled={isCreating}
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isCreating ? 'Creating...' : 'Create Record'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {(statusFilter.length > 0 || priorityFilter.length > 0) && (
                    <Badge className="ml-1 py-0 px-1.5 h-5 min-w-5 bg-blue-500 text-white rounded-full">
                      {statusFilter.length + priorityFilter.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Filter by Status</span>
                  {statusFilter.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setStatusFilter([])}
                    >
                      Clear
                    </Button>
                  )}
                </DropdownMenuLabel>
                {uniqueStatuses.map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleStatusFilter(status)}
                  >
                    <Badge className={`font-medium mr-2 ${getStatusBadgeColor(status)}`}>
                      {status}
                    </Badge>
                    <span>{status}</span>
                  </DropdownMenuCheckboxItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="flex justify-between items-center">
                  <span>Filter by Priority</span>
                  {priorityFilter.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setPriorityFilter([])}
                    >
                      Clear
                    </Button>
                  )}
                </DropdownMenuLabel>
                {uniquePriorities.map(priority => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={() => togglePriorityFilter(priority)}
                  >
                    <Badge className={`font-medium mr-2 ${getPriorityBadgeColor(priority)}`}>
                      {priority}
                    </Badge>
                    <span>{priority}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <SlidersHorizontal className="h-4 w-4" />
      <span className="hidden sm:inline">Columns</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="start" className="w-56">
    <div className="flex items-center justify-between px-2 py-1.5">
      <DropdownMenuLabel className="p-0">Toggle Columns</DropdownMenuLabel>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            hideAllColumns();
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
            resetColumnVisibility();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
    <DropdownMenuSeparator />
    {columns.map(column => (
      <DropdownMenuItem 
        key={column.id} 
        onSelect={(e) => {
          e.preventDefault();
          toggleColumnVisibility(column.id);
        }}
      >
        <div className="flex items-center gap-2 w-full">
          <Checkbox
            checked={column.visible}
            onCheckedChange={() => toggleColumnVisibility(column.id)}
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
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={exportToCSV}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setEditEnabled(!editEnabled)}
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            {editingRowId && currentEditingRecord && editEnabled ? (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleSave(currentEditingRecord.id)}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  setEditingRowId(null);
                  setCurrentEditingRecord(null);
                }}>
                  Cancel
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {userData.owner_id === null ? (
                    <TableHead className="w-[60px] text-center">Delete</TableHead>
                  ) : ""}
                  {visibleColumns.map(column => (
                    <TableHead
                      key={column.id}
                      className="cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort(column.id)}
                    >
                      <div className="flex items-center gap-1">
                        <span>{column.name}</span>
                        {sortColumn === column.id && (
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
                      Loading records...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="h-24 text-center">
                      No records found. {searchTerm || statusFilter.length > 0 || priorityFilter.length > 0 ?
                        <Button variant="link" onClick={handleRefresh}>Clear filters?</Button> : ''}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentRecords.map((record, index) => (
                    <TableRow key={record.id || index} className="hover:bg-slate-50"
                      onClick={() => {
                        setEditingRowId(record.id);
                        setEditingValues(record);
                        setCurrentEditingRecord(record);
                      }}>

                      {userData.owner_id === null ? (
                        <TableCell className="w-[60px] text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(record);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      ) : ""}
                      {visibleColumns.map(column => (
                        <TableCell key={column.id}>
                          {editingRowId === record.id && column.id !== 'id' && editEnabled ? (
                            <input
                              type="text"
                              value={editingValues[column.id] || ''}
                              onChange={(e) =>
                                setEditingValues(prev => ({ ...prev, [column.id]: e.target.value }))
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : column.id === 'status' ? (
                            <Badge className={`font-medium ${getStatusBadgeColor(record[column.id])}`}>
                              {record[column.id]}
                            </Badge>
                          ) : column.id === 'priority' ? (
                            <Badge className={`font-medium ${getPriorityBadgeColor(record[column.id])}`}>
                              {record[column.id]}
                            </Badge>
                          ) : column.id === 'task_file' && record[column.id] ? (
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4 text-slate-400" />
                              <span>{record[column.id]}</span>
                            </div>
                          ) : (
                            <span>{record[column.id] || '—'}</span>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        <ResponsivePagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className=" flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Confirm Deletion
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. Please type the <strong>us_id</strong> to confirm deletion.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {recordToDelete && (
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm font-medium">Record to delete:</p>
                  <p className="text-sm text-gray-600">ID: {recordToDelete.id}</p>
                  <p className="text-sm text-gray-600">US_ID: <span className="font-mono bg-yellow-100 px-1 rounded">{recordToDelete.us_id}</span></p>
                </div>
              )}

              <div>
                <Label htmlFor="confirm-us-id" className="text-sm font-medium">
                  Enter us_id to confirm:
                </Label>
                <Input
                  id="confirm-us-id"
                  type="text"
                  placeholder="Type us_id here"
                  value={deleteUsIdInput}
                  onChange={(e) => setDeleteUsIdInput(e.target.value)}
                  className="mt-1"
                  autoFocus
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting || !deleteUsIdInput.trim()}
                className="w-full sm:w-auto"
              >
                {isDeleting ? 'Deleting...' : 'Delete Record'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CustomTable;


