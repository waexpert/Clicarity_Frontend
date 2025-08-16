// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
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
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
//   X
// } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';

// // Api Calls Route
// import { getAllRecords, updateRecord, createRecord, getAllPayments } from '../api/apiConfig';
// import { useSelector } from 'react-redux';


// const CustomTable = ({ apiParams, type = "normal" }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [originalRecords, setOriginalRecords] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRecords, setSelectedRecords] = useState([]);
//   const [pageSize, setPageSize] = useState(10);
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

//   // Add Record Modal States
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newRecordData, setNewRecordData] = useState({});
//   const [isCreating, setIsCreating] = useState(false);

//   // NEW: Dropdown setup state
//   const [dropdownSetup, setDropdownSetup] = useState({});
//   const [dropdownSetupExists, setDropdownSetupExists] = useState(false);

//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.user);
//   const owner_id = userData.id;


//   // NEW: Function to fetch dropdown setup
//   const fetchDropdownSetup = async () => {
//     try {
//         // const { tableName1 } = useParams();
//       const tableName = apiParams.tableName;
//       const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
//       const { data } = await axios.get(route);
      
//       if (data.exists && data.setup && data.setup.mapping) {
//         setDropdownSetup(data.setup.mapping);
//         setDropdownSetupExists(true);
//         console.log('Dropdown setup loaded:', data.setup.mapping);
//       } else {
//         setDropdownSetup({});
//         setDropdownSetupExists(false);
//         console.log('No dropdown setup found');
//       }
//     } catch (error) {
//       console.error('Error fetching dropdown setup:', error);
//       setDropdownSetup({});
//       setDropdownSetupExists(false);
//     }
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
//         fetchedData = response.data;
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
//     fetchDropdownSetup(); // NEW: Fetch dropdown setup
//   }, []);

//   // Apply filters and search when they change
//   useEffect(() => {
//     applyFiltersAndSearch();
//   }, [searchTerm, statusFilter, priorityFilter, originalRecords]);

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
//     if (lowerColumnName === 'status') return 'textarea';
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
//     fetchDropdownSetup(); // NEW: Also refresh dropdown setup
//     setSearchTerm('');
//     setStatusFilter([]);
//     setPriorityFilter([]);
//   };

//   // Handle Add Record Modal
//   const handleOpenAddModal = () => {
//     // Initialize new record data with empty values
//     const initialData = {};
//     columns.forEach(column => {
//       if (column.id !== 'id') { // Don't include ID as it's usually auto-generated
//         initialData[column.id] = '';
//       }
//     });
//     setNewRecordData(initialData);
//     setIsAddModalOpen(true);
//   };

//   // Handle input change in add modal
//   const handleNewRecordChange = (columnId, value) => {
//     setNewRecordData(prev => ({
//       ...prev,
//       [columnId]: value
//     }));
//   };

//   // Handle create new record
//   const handleCreateRecord = async () => {
//     try {
//       setIsCreating(true);

//       // Add owner_id to the record data
//       const recordWithOwnerId = {
//         ...newRecordData,
//         owner_id: owner_id // Make sure owner_id is included
//       };

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

//         console.log("Sending to regular endpoint:", recordData);

//         const response = await axios.post(createRecord, recordData);
//         console.log("Regular record response:", response.data);
//       }

//       toast.success("Record created successfully!");
//       setIsAddModalOpen(false);
//       setNewRecordData({});
//       handleRefresh();

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

//   // NEW: Enhanced render form input function with dropdown support
//   const renderFormInput = (column, value, onChange) => {
//     const { id, type, name } = column;

//     // NEW: Check if this column has dropdown configuration
//     const hasDropdownConfig = dropdownSetup[id] && Array.isArray(dropdownSetup[id]) && dropdownSetup[id].length > 0;
    
//     if (hasDropdownConfig) {
//       // Render dropdown for configured columns
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

//     // Original input rendering logic for non-dropdown fields
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
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'in progress':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Get priority badge color
//   const getPriorityBadgeColor = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'medium':
//         return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'low':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Editing Values Handle Save function
//   const handleSave = async (originalId) => {
//     const schemaName = apiParams.schemaName;
//     const tableName = apiParams.tableName;

//     const params = new URLSearchParams({
//       schemaName,
//       tableName,
//       recordId: originalId,
//       ownerId: 'bde74e9b-ee21-4687-8040-9878b88593fb',
//     });

//     let colIndex = 1;
//     Object.entries(editingValues).forEach(([key, val]) => {
//       if (val === undefined) return;
//       const sanitizedVal = val === null || val === 'null' ? '' : val;
//       params.append(`col${colIndex}`, key);
//       params.append(`val${colIndex}`, sanitizedVal);
//       colIndex++;
//     });

//     try {
//       const result = await axios.get(`${updateRecord}?${params.toString()}`);
//       toast.success("Record updated");
//       setEditingRowId(null);
//       handleRefresh();
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };

//   // Get unique statuses for filters
//   const uniqueStatuses = Array.from(new Set(originalRecords.map(record => record.status))).filter(Boolean);
//   const uniquePriorities = Array.from(new Set(originalRecords.map(record => record.priority))).filter(Boolean);
//   const visibleColumns = columns.filter(column => column.visible);
//   const indexOfLastRecord = currentPage * pageSize;
//   const indexOfFirstRecord = indexOfLastRecord - pageSize;
//   const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

//   return (
//     <Card className="shadow-sm border-slate-200 mx-[6rem] ">
//       <CardHeader className="pb-3">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-semibold text-slate-800">All Records</CardTitle>
//             <CardDescription className="mt-1">
//               View and manage all database records
//               {/* NEW: Show dropdown setup status */}
//               {dropdownSetupExists && (
//                 <Badge variant="outline" className="ml-2 text-xs">
//                   Dropdown Configured
//                 </Badge>
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
//             {/* Add Record Button with Enhanced Modal */}
//             <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   className="flex items-center gap-2"
//                   onClick={handleOpenAddModal}
//                 >
//                   <Plus className="h-4 w-4" />
//                   <span className="hidden sm:inline">Add Record</span>
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>Add New Record</DialogTitle>
//                   <DialogDescription>
//                     Fill in the details to create a new record in the database.
//                     {/* NEW: Show info about dropdowns */}
//                     {dropdownSetupExists && (
//                       <span className="block mt-1 text-blue-600">
//                         ✓ Dropdown values are configured for some fields
//                       </span>
//                     )}
//                   </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-6 py-4">
//                   {columns
//                     .filter(column =>
//                       column.id !== 'id' &&
//                       !column.id.includes('_comment') &&
//                       !column.id.includes('created_at') &&
//                       !column.id.includes('updated_at') &&
//                       !column.id.includes('_date')
//                     )
//                     .map(column => {
//                       // NEW: Show indicator for dropdown fields
//                       const hasDropdown = dropdownSetup[column.id] && Array.isArray(dropdownSetup[column.id]) && dropdownSetup[column.id].length > 0;
                      
//                       return (
//                         <div key={column.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//                           <Label htmlFor={column.id} className="font-medium text-sm sm:w-32 sm:text-right sm:flex-shrink-0 flex items-center gap-1">
//                             {column.name}
//                             {/* NEW: Show dropdown indicator */}
//                             {hasDropdown && (
//                               <Badge variant="outline" className="text-xs h-4 px-1">
//                                 dropdown
//                               </Badge>
//                             )}
//                           </Label>
//                           <div className="flex-1">
//                             {renderFormInput(
//                               column,
//                               newRecordData[column.id],
//                               handleNewRecordChange
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
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
//                   <TableHead className="w-[40px]">
//                     <Checkbox
//                       checked={selectedRecords.length === records.length && records.length > 0}
//                       onCheckedChange={handleSelectAll}
//                     />
//                   </TableHead>
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
//                         if (editEnabled === false) {
//                           setEditingValues(record);
//                         }
//                         setCurrentEditingRecord(record);
//                       }}>
//                       <TableCell className="w-[40px]">
//                         <Checkbox
//                           checked={selectedRecords.includes(record.id)}
//                           onCheckedChange={() => handleSelectRecord(record.id)}
//                         />
//                       </TableCell>

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
//         <div className="flex items-center justify-between mt-4">
//           <div className="text-sm text-slate-500">
//             Showing <span className="font-medium">{Math.min(records.length, pageSize)}</span> of <span className="font-medium">{totalRecords}</span> records
//           </div>

//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage > 1) setCurrentPage(currentPage - 1);
//                   }}
//                   className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
//                 />
//               </PaginationItem>

//               {[...Array(totalPages)].map((_, i) => (
//                 <PaginationItem key={i}>
//                   <PaginationLink
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentPage(i + 1);
//                     }}
//                     isActive={currentPage === i + 1}
//                   >
//                     {i + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}

//               <PaginationItem>
//                 <PaginationNext
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//                   }}
//                   className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default CustomTable;




// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
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
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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


// const CustomTable = ({apiParams, type = "normal" }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [originalRecords, setOriginalRecords] = useState([]);
//   const [records, setRecords] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRecords, setSelectedRecords] = useState([]);
//   const [pageSize, setPageSize] = useState(10);
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

//   // Add Record Modal States
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [newRecordData, setNewRecordData] = useState({});
//   const [isCreating, setIsCreating] = useState(false);

//   // ENHANCED: Dropdown setup state with column ordering
//   const [dropdownSetup, setDropdownSetup] = useState({});
//   const [columnOrder, setColumnOrder] = useState({});
//   const [dropdownSetupExists, setDropdownSetupExists] = useState(false);

//   const navigate = useNavigate();
//   const userData = useSelector((state) => state.user);
//   const owner_id = userData.id;
//   const {pa_id,show} = useParams();


//   //   const apiParams = {
//   //   schemaName:"lakshy_76190723",
//   //   tableName : "leadstatus"
//   // }

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

//   // ENHANCED: Function to get ordered columns for form display
//   const getOrderedFormColumns = () => {
//     const filteredColumns = columns.filter(column =>
//       column.id !== 'id' &&
//       !column.id.includes('_comment') &&
//       !column.id.includes('created_at') &&
//       !column.id.includes('updated_at') &&
//       !column.id.includes('_date')
//     );

//     // Sort columns by order number, then alphabetically for columns without order
//     return filteredColumns.sort((a, b) => {
//       const orderA = columnOrder[a.id] || 999;
//       const orderB = columnOrder[b.id] || 999;
      
//       if (orderA !== orderB) {
//         return orderA - orderB;
//       }
      
//       // If orders are the same, sort alphabetically
//       return a.name.localeCompare(b.name);
//     });
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
//         fetchedData = response.data;
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

//   // Apply filters and search when they change
//   useEffect(() => {
//     applyFiltersAndSearch();
//   }, [searchTerm, statusFilter, priorityFilter, originalRecords]);

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
//     if (lowerColumnName === 'status') return 'textarea';
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

//   // Handle Add Record Modal
//   const handleOpenAddModal = () => {
//     // ENHANCED: Initialize new record data with ordered columns
//     const initialData = {};
//     const orderedColumns = getOrderedFormColumns();
    
//     orderedColumns.forEach(column => {
//       initialData[column.id] = '';
//     });
    
//     setNewRecordData(initialData);
//     setIsAddModalOpen(true);
//   };

//   // Handle input change in add modal
//   const handleNewRecordChange = (columnId, value) => {
//     setNewRecordData(prev => ({
//       ...prev,
//       [columnId]: value
//     }));
//   };

//   // Handle create new record
//   const handleCreateRecord = async () => {
//     try {
//       setIsCreating(true);

//       // Add owner_id to the record data
//       const recordWithOwnerId = {
//         ...newRecordData,
//         owner_id: owner_id // Make sure owner_id is included
//       };

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

//         console.log("Sending to regular endpoint:", recordData);

//         const response = await axios.post(createRecord, recordData);
//         console.log("Regular record response:", response.data);
//       }

//       toast.success("Record created successfully!");
//       setIsAddModalOpen(false);
//       setNewRecordData({});
//       handleRefresh();

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

//   // ENHANCED: Enhanced render form input function with dropdown support
//   const renderFormInput = (column, value, onChange) => {
//     const { id, type, name } = column;

//     // Check if this column has dropdown configuration
//     const hasDropdownConfig = dropdownSetup[id] && Array.isArray(dropdownSetup[id]) && dropdownSetup[id].length > 0;
    
//     if (hasDropdownConfig) {
//       // Render dropdown for configured columns
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

//     // Original input rendering logic for non-dropdown fields
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
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'in progress':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   // Get priority badge color
//   const getPriorityBadgeColor = (priority) => {
//     switch (priority?.toLowerCase()) {
//       case 'high':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'medium':
//         return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'low':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };



//   // Editing Values Handle Save function
//   const handleSave = async (originalId) => {
//     const schemaName = apiParams.schemaName;
//     const tableName = apiParams.tableName;

//     const params = new URLSearchParams({
//       schemaName,
//       tableName,
//       recordId: originalId,
//       ownerId: 'bde74e9b-ee21-4687-8040-9878b88593fb',
//     });

//     let colIndex = 1;
//     Object.entries(editingValues).forEach(([key, val]) => {
//       if (val === undefined) return;
//       const sanitizedVal = val === null || val === 'null' ? '' : val;
//       params.append(`col${colIndex}`, key);
//       params.append(`val${colIndex}`, sanitizedVal);
//       colIndex++;
//     });

//     try {
//       const result = await axios.get(`${updateRecord}?${params.toString()}`);
//       toast.success("Record updated");
//       setEditingRowId(null);
//       handleRefresh();
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };

//   // Get unique statuses for filters
//   const uniqueStatuses = Array.from(new Set(originalRecords.map(record => record.status))).filter(Boolean);
//   const uniquePriorities = Array.from(new Set(originalRecords.map(record => record.priority))).filter(Boolean);
//   const visibleColumns = columns.filter(column => column.visible);
//   const indexOfLastRecord = currentPage * pageSize;
//   const indexOfFirstRecord = indexOfLastRecord - pageSize;
//   const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

//   // ENHANCED: Get ordered columns for form display
//   const orderedFormColumns = getOrderedFormColumns();

//   return (
//     <Card className="shadow-sm border-slate-200 mx-[6rem]">
//       <CardHeader className="pb-3">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-semibold text-slate-800">All Records</CardTitle>
//             <CardDescription className="mt-1">
//               View and manage all database records
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
//             <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//               <DialogTrigger asChild>
//                 <Button
//                   className="flex items-center gap-2"
//                   onClick={handleOpenAddModal}
//                 >
//                   <Plus className="h-4 w-4" />
//                   <span className="hidden sm:inline">Add Record</span>
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//                 <DialogHeader>
//                   <DialogTitle>Add New Record</DialogTitle>
//                   <DialogDescription>
//                     Fill in the details to create a new record in the database.
//                     {/* Show info about dropdowns and ordering */}
//                     {/* {dropdownSetupExists && (
//                       <div className="space-y-1 mt-2">
//                         <span className="block text-blue-600">
//                           ✓ Dropdown values are configured for some fields
//                         </span>
//                         {Object.keys(columnOrder).length > 0 && (
//                           <span className="block text-green-600">
//                             ✓ Fields are displayed in your custom order
//                           </span>
//                         )}
//                       </div>
//                     )} */}
//                   </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-6 py-4">
//                   {/* ENHANCED: Use ordered columns for form display */}
//                   {orderedFormColumns.map((column, index) => {
//                     // Show indicator for dropdown fields and order
//                     const hasDropdown = dropdownSetup[column.id] && Array.isArray(dropdownSetup[column.id]) && dropdownSetup[column.id].length > 0;
//                     const orderNumber = columnOrder[column.id];
                    
//                     return (
//                       <div key={column.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//                         <Label htmlFor={column.id} className="font-medium text-sm sm:w-32 sm:text-right sm:flex-shrink-0 flex items-center gap-1">
//                           {/* Show order number if available */}
//                           {orderNumber && (
//                             <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
//                               {orderNumber}
//                             </Badge>
//                           )}
//                           {column.name}
//                           {/* Show dropdown indicator */}
//                           {hasDropdown && (
//                             <Badge variant="outline" className="text-xs h-4 px-1">
//                               dropdown
//                             </Badge>
//                           )}
//                         </Label>
//                         <div className="flex-1">
//                           {renderFormInput(
//                             column,
//                             newRecordData[column.id],
//                             handleNewRecordChange
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
//                   <TableHead className="w-[40px]">
//                     <Checkbox
//                       checked={selectedRecords.length === records.length && records.length > 0}
//                       onCheckedChange={handleSelectAll}
//                     />
//                   </TableHead>
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
//                         if (editEnabled === false) {
//                           setEditingValues(record);
//                         }
//                         setCurrentEditingRecord(record);
//                       }}>
//                       <TableCell className="w-[40px]">
//                         <Checkbox
//                           checked={selectedRecords.includes(record.id)}
//                           onCheckedChange={() => handleSelectRecord(record.id)}
//                         />
//                       </TableCell>

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
//         <div className="flex items-center justify-between mt-4">
//           <div className="text-sm text-slate-500">
//             Showing <span className="font-medium">{Math.min(records.length, pageSize)}</span> of <span className="font-medium">{totalRecords}</span> records
//           </div>

//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage > 1) setCurrentPage(currentPage - 1);
//                   }}
//                   className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
//                 />
//               </PaginationItem>

//               {[...Array(totalPages)].map((_, i) => (
//                 <PaginationItem key={i}>
//                   <PaginationLink
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setCurrentPage(i + 1);
//                     }}
//                     isActive={currentPage === i + 1}
//                   >
//                     {i + 1}
//                   </PaginationLink>
//                 </PaginationItem>
//               ))}

//               <PaginationItem>
//                 <PaginationNext
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//                   }}
//                   className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
//                 />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
import axios from 'axios';
import { toast } from 'sonner';

// Api Calls Route
import { getAllRecords, updateRecord, createRecord, getAllPayments } from '../api/apiConfig';
import { useSelector } from 'react-redux';


const CustomTable = ({apiParams, type = "normal" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [originalRecords, setOriginalRecords] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [pageSize, setPageSize] = useState(10);
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

  // Add Record Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRecordData, setNewRecordData] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  // ENHANCED: Dropdown setup state with column ordering
  const [dropdownSetup, setDropdownSetup] = useState({});
  const [columnOrder, setColumnOrder] = useState({});
  const [dropdownSetupExists, setDropdownSetupExists] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const userData = useSelector((state) => state.user);
  const owner_id = userData.id;

  // Get URL parameters
  const pa_id = searchParams.get('pa_id');
  const show = searchParams.get('show');
  const status = searchParams.get('status');

  // Generate unique us_id using Unix timestamp
  const generateUsId = () => {
    return Date.now().toString();
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

  // ENHANCED: Function to get ordered columns for form display
  const getOrderedFormColumns = () => {
    const filteredColumns = columns.filter(column =>
      column.id !== 'id' &&
      !column.id.includes('_comment') &&
      !column.id.includes('created_at') &&
      !column.id.includes('updated_at') &&
      !column.id.includes('_date')
    );

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
        fetchedData = response.data;
      } else if (type === "payment") {
        // Use the correct payment endpoint
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/payment-reminders/list?owner_id=${owner_id}`
        );
        fetchedData = response.data.data || response.data;
      } else {
        // Fallback for other types
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/data/getAllPayments?owner_id=${owner_id}`
        );
        fetchedData = response.data.data;
      }

      console.log("Raw fetched data:", fetchedData);

      // Filter data based on type
      let filteredData = fetchedData;

      if (type === "payment") {
        // Only show records with type = 'original' for payment reminders
        filteredData = fetchedData.filter(item =>
          item.type === 'original' || item.type === 'Original'
        );
        console.log("Filtered payment data (original only):", filteredData);
      }

      // Set the filtered data
      setOriginalRecords(filteredData);
      setRecords(filteredData);
      setTotalRecords(filteredData.length);
      setTotalPages(Math.ceil(filteredData.length / pageSize));

      // Generate columns from the first available record
      let recordForColumns = null;

      if (filteredData.length > 0) {
        if (type === "payment") {
          // For payment type, find the first 'original' record for column structure
          recordForColumns = filteredData.find(item =>
            item.type === 'original' || item.type === 'Original'
          ) || filteredData[0]; // Fallback to first record if no 'original' found
        } else {
          // For normal type, use first record directly
          recordForColumns = filteredData[0];
        }
      }

      if (recordForColumns) {
        const dynamicColumns = Object.keys(recordForColumns).map(key => ({
          id: key,
          name: formatColumnName(key),
          accessor: key,
          sortable: true,
          visible: true,
          type: getColumnType(recordForColumns[key], key)
        }));
        setColumns(dynamicColumns);
        console.log("Generated columns:", dynamicColumns);
      } else {
        console.warn("No records found to generate columns from");
        setColumns([]);
      }

    } catch (error) {
      console.error("Error fetching data:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }

      toast.error("Failed to fetch records");

      // Set empty state on error
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
    if (lowerColumnName === 'status') return 'textarea';
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

  // ENHANCED: Handle Add Record Modal with auto-fill
  const handleOpenAddModal = () => {
    // Don't open if columns aren't loaded yet
    if (columns.length === 0) {
      console.log('Columns not loaded yet, waiting...');
      return;
    }

    // ENHANCED: Initialize new record data with ordered columns and auto-fill
    const initialData = {};
    const orderedColumns = getOrderedFormColumns();
    
    orderedColumns.forEach(column => {
      if (column.id === 'pa_id') {
        // Auto-fill pa_id from URL params
        initialData[column.id] = pa_id || '';
      } else if (column.id === 'us_id') {
        // Auto-generate us_id with Unix timestamp
        initialData[column.id] = generateUsId();
      } else if(column.id === 'status'){
        initialData[column.id] = status;
      } else {
        initialData[column.id] = '';
      }
    });
    
    console.log('Initialized form data with auto-fill:', initialData);
    setNewRecordData(initialData);
    setIsAddModalOpen(true);

    // Update URL to remove show parameter after opening modal
    if (show === 'true') {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('show');
      setSearchParams(newSearchParams, { replace: true });
    }
  };

  // Handle input change in add modal
  const handleNewRecordChange = (columnId, value) => {
    setNewRecordData(prev => ({
      ...prev,
      [columnId]: value
    }));
  };

  // Handle create new record
  const handleCreateRecord = async () => {
    try {
      setIsCreating(true);

      // Add owner_id to the record data
      const recordWithOwnerId = {
        ...newRecordData,
        // owner_id: owner_id // Make sure owner_id is included
      };

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

        console.log("Sending to regular endpoint:", recordData);

        const response = await axios.post(createRecord, recordData);
        console.log("Regular record response:", response.data);
      }

      toast.success("Record created successfully!");
      setIsAddModalOpen(false);
      setNewRecordData({});
      handleRefresh();

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
    const isAutoFilled = id === 'pa_id' || id === 'us_id';

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

  // Handle column visibility toggle
  const toggleColumnVisibility = (columnId) => {
    setColumns(columns.map(column =>
      column.id === columnId
        ? { ...column, visible: !column.visible }
        : column
    ));
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Editing Values Handle Save function
  const handleSave = async (originalId) => {
    const schemaName = apiParams.schemaName;
    const tableName = apiParams.tableName;

    const params = new URLSearchParams({
      schemaName,
      tableName,
      recordId: originalId,
      ownerId: 'bde74e9b-ee21-4687-8040-9878b88593fb',
    });

    let colIndex = 1;
    Object.entries(editingValues).forEach(([key, val]) => {
      if (val === undefined) return;
      const sanitizedVal = val === null || val === 'null' ? '' : val;
      params.append(`col${colIndex}`, key);
      params.append(`val${colIndex}`, sanitizedVal);
      colIndex++;
    });

    try {
      const result = await axios.get(`${updateRecord}?${params.toString()}`);
      toast.success("Record updated");
      setEditingRowId(null);
      handleRefresh();
    } catch (err) {
      toast.error("Update failed");
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

  return (
    <Card className="shadow-sm border-slate-200 mx-[6rem]">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-800">All Records</CardTitle>
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
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
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
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Record</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new record in the database.
                    {/* Show info about auto-filled fields */}
                    {/* {(pa_id || orderedFormColumns.some(col => col.id === 'us_id')) && (
                      <div className="space-y-1 mt-2">
                        {pa_id && (
                          <span className="block text-green-600">
                            ✓ PA ID is auto-filled from URL
                          </span>
                        )}
                        {orderedFormColumns.some(col => col.id === 'us_id') && (
                          <span className="block text-blue-600">
                            ✓ US ID is auto-generated
                          </span>
                        )}
                      </div>
                    )} */}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* ENHANCED: Use ordered columns for form display with auto-fill indicators */}
                  {orderedFormColumns.map((column, index) => {
                    // Show indicator for dropdown fields, order, and auto-fill
                    const hasDropdown = dropdownSetup[column.id] && Array.isArray(dropdownSetup[column.id]) && dropdownSetup[column.id].length > 0;
                    const orderNumber = columnOrder[column.id];
                    const isAutoFilled = column.id === 'pa_id' || column.id === 'us_id';
                    
                    return (
                      <div key={column.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor={column.id} className="font-medium text-sm sm:w-32 sm:text-right sm:flex-shrink-0 flex items-center gap-1">
                          {/* Show order number if available */}
                          {orderNumber && (
                            <Badge variant="secondary" className="text-xs h-4 px-1 mr-1">
                              {orderNumber}
                            </Badge>
                          )}
                          {column.name}
                          {/* Show indicators */}
                          {hasDropdown && !isAutoFilled && (
                            <Badge variant="outline" className="text-xs h-4 px-1">
                              dropdown
                            </Badge>
                          )}
                          {isAutoFilled && (
                            <Badge variant="default" className="text-xs h-4 px-1 bg-green-500">
                              auto
                            </Badge>
                          )}
                        </Label>
                        <div className="flex-1">
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
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                {columns.map(column => (
                  <DropdownMenuItem key={column.id} onSelect={(e) => {
                    e.preventDefault();
                    toggleColumnVisibility(column.id);
                  }}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={column.visible}
                        onCheckedChange={() => toggleColumnVisibility(column.id)}
                      />
                      <span>{column.name}</span>
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
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedRecords.length === records.length && records.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
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
                        if (editEnabled === false) {
                          setEditingValues(record);
                        }
                        setCurrentEditingRecord(record);
                      }}>
                      <TableCell className="w-[40px]">
                        <Checkbox
                          checked={selectedRecords.includes(record.id)}
                          onCheckedChange={() => handleSelectRecord(record.id)}
                        />
                      </TableCell>

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
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-slate-500">
            Showing <span className="font-medium">{Math.min(records.length, pageSize)}</span> of <span className="font-medium">{totalRecords}</span> records
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomTable;