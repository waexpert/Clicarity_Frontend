// // Updated RecordsDashboard component with working refresh, search, and filter functionality

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
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
//   Check
// } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'sonner';


// // Api Calls Route
// import { getAllRecords,updateRecord } from '../api/apiConfig';



// // Things which needs to pass
// // apiParams

// const CustomTable = ({apiParams}) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [originalRecords, setOriginalRecords] = useState([]); // Store original data for filtering
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
//   // Add filter states
//   const [statusFilter, setStatusFilter] = useState([]);
//   const [priorityFilter, setPriorityFilter] = useState([]);
//   // Editing Row States
//   const [editingRowId, setEditingRowId] = useState(null);
//   const [editingValues, setEditingValues] = useState({});
//   const [editEnabled, setEditEnabled] = useState(false);
//   const [currentEditingRecord, setCurrentEditingRecord] = useState({});

//   const navigate = useNavigate();

//   // API data parameters
//   // const apiParams = {
//   //   "schemaName": "public",
//   //   "tableName": "users"
//   // };

//   // Fetch data from API
//   const fetchData = async () => {
//     try {
//       setLoading(true);

//       console.log("apiparms",apiParams)
//       const response = await axios.post(getAllRecords, apiParams);
//       const fetchedData = response.data;

//       // Store both original and filtered data
//       setOriginalRecords(fetchedData);
//       setRecords(fetchedData);

//       // Calculate pagination
//       setTotalRecords(fetchedData.length);
//       setTotalPages(Math.ceil(fetchedData.length / pageSize));

//       // Dynamically set columns
//       if (fetchedData.length > 0) {
//         const firstRecord = fetchedData[0];
//         const dynamicColumns = Object.keys(firstRecord).map(key => ({
//           id: key,
//           name: formatColumnName(key),
//           accessor: key,
//           sortable: true,
//           visible: true
//         }));
//         setColumns(dynamicColumns);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       // Optionally show an error notification
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initialize data and columns on component mount
//   useEffect(() => {
//     fetchData();
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

//   // Function to apply filters and search
//   const applyFiltersAndSearch = () => {
//     if (!originalRecords.length) return;

//     let filteredResults = [...originalRecords];

//     // Apply search filter
//     if (searchTerm.trim() !== '') {
//       const term = searchTerm.toLowerCase();
//       filteredResults = filteredResults.filter(item =>
//         Object.values(item).some(value =>
//           String(value).toLowerCase().includes(term)
//         )
//       );
//     }

//     // Apply status filter
//     if (statusFilter.length > 0) {
//       filteredResults = filteredResults.filter(item =>
//         statusFilter.includes(item.status)
//       );
//     }

//     // Apply priority filter
//     if (priorityFilter.length > 0) {
//       filteredResults = filteredResults.filter(item =>
//         priorityFilter.includes(item.priority)
//       );
//     }

//     // Update records and pagination
//     setRecords(filteredResults);
//     setTotalRecords(filteredResults.length);
//     setTotalPages(Math.ceil(filteredResults.length / pageSize));
//     // Reset to first page when filters change
//     setCurrentPage(1);
//   };

//   // Handle search input
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   // Handle refresh button
//   const handleRefresh = () => {
//     fetchData();
//     // Clear filters and search
//     setSearchTerm('');
//     setStatusFilter([]);
//     setPriorityFilter([]);
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

//     // Apply sorting to records
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
//       alert('No records to export');
//       return;
//     }

//     try {
//       // Determine which data to export (filtered records or all records)
//       const dataToExport = records;

//       // Optional: Only include visible columns
//       const exportData = dataToExport.map(record => {
//         const filteredRecord = {};
//         visibleColumns.forEach(column => {
//           filteredRecord[column.name] = record[column.id];
//         });
//         return filteredRecord;
//       });

//       // Convert JSON to CSV
//       const csv = Papa.unparse(exportData, {
//         quotes: true, // Use quotes around all fields
//         quoteChar: '"',
//         escapeChar: '"',
//         delimiter: ",",
//         header: true,
//         newline: "\n"
//       });

//       // Create a blob with the CSV data
//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

//       // Create a URL for the blob
//       const url = URL.createObjectURL(blob);

//       // Create a temporary link element to trigger the download
//       const link = document.createElement('a');

//       // Generate a filename with current date
//       const date = new Date().toISOString().slice(0, 10);
//       const filename = `records_export_${date}.csv`;

//       // Set link attributes
//       link.setAttribute('href', url);
//       link.setAttribute('download', filename);
//       link.style.display = 'none';

//       // Add to DOM, trigger download and clean up
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Release the blob URL
//       URL.revokeObjectURL(url);

//       console.log(`Exported ${exportData.length} records to CSV`);
//     } catch (error) {
//       console.error('Error exporting to CSV:', error);
//       alert('Failed to export CSV. Please try again.');
//     }
//   };

//   // Export to PDF function
//   const exportToPDF = () => {
//     // In a real app, this would generate and download a PDF file
//     alert('Exporting to PDF...');
//   };

//   // Upload CSV function
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       // In a real app, this would upload the CSV file to the server
//       alert(`Uploading file: ${file.name}`);
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
//     switch (status.toLowerCase()) {
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
//     switch (priority.toLowerCase()) {
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
//       ownerId: 'bde74e9b-ee21-4687-8040-9878b88593fb', // if required
//     });

//     let colIndex = 1;
//     Object.entries(editingValues).forEach(([key, val]) => {
//       // Don't include if undefined
//       if (val === undefined) return;

//       // Convert JS null or empty string to empty (let backend decide)
//       const sanitizedVal = val === null || val === 'null' ? '' : val;


//       params.append(`col${colIndex}`, key);
//       params.append(`val${colIndex}`, sanitizedVal);
//       colIndex++;
//     });

//     try {
//       const result = await axios.get(`${updateRecord}${params.toString()}`);
//       toast.success("Record updated");
//       console.log(result);
//       console.error(result)
//       setEditingRowId(null);
//       handleRefresh();
//     } catch (err) {
//       toast.error("Update failed");
//     }
//   };


//   // Get unique statuses for filters
//   const uniqueStatuses = Array.from(new Set(originalRecords.map(record => record.status))).filter(Boolean);

//   // Get unique priorities for filters
//   const uniquePriorities = Array.from(new Set(originalRecords.map(record => record.priority))).filter(Boolean);

//   // Filter visible columns
//   const visibleColumns = columns.filter(column => column.visible);

//   // Get current page data
//   const indexOfLastRecord = currentPage * pageSize;
//   const indexOfFirstRecord = indexOfLastRecord - pageSize;
//   const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

//   return (
//     <Card className="shadow-sm border-slate-200">
//       <CardHeader className="pb-3">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <CardTitle className="text-2xl font-semibold text-slate-800">All Records</CardTitle>
//             <CardDescription className="mt-1">
//               View and manage all database records
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
//               onClick={() => {
//                 setEditEnabled(!editEnabled);
//               }}
//             >
//               <Edit className="h-4 w-4" />
//               <span className="hidden sm:inline">Edit</span>
//             </Button>


//             {/* <TableCell className="text-right"> */}
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
//             {/* </TableCell> */}

//             <div className="relative">
//               {/* <input
//                 type="file"
//                 id="csvUpload"
//                 accept=".csv"
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                 onChange={handleFileUpload}
//               />
//               <Button 
//                 variant="outline" 
//                 size="sm"
//                 className="flex items-center gap-2"
//               >
//                 <Upload className="h-4 w-4" />
//                 <span className="hidden sm:inline">Upload CSV</span>
//               </Button> */}
//             </div>
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
//                             className={`h-4 w-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''
//                               }`}
//                           />
//                         )}
//                       </div>
//                     </TableHead>
//                   ))}
//                   {/* <TableHead className="w-[80px] text-right">Actions</TableHead> */}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {loading ? (
//                   <TableRow>
//                     <TableCell colSpan={visibleColumns.length + 2} className="h-24 text-center">
//                       Loading records...
//                     </TableCell>
//                   </TableRow>
//                 ) : records.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={visibleColumns.length + 2} className="h-24 text-center">
//                       No records found. {searchTerm || statusFilter.length > 0 || priorityFilter.length > 0 ?
//                         <Button variant="link" onClick={handleRefresh}>Clear filters?</Button> : ''}
//                     </TableCell>
//                   </TableRow>
//                 ) : (
//                   currentRecords.map((record, index) => (
//                     <TableRow key={record.id || index} className="hover:bg-slate-50"
//                       onClick={() => {
//                         setEditingRowId(record.id);
//                         if(editEnabled === false){
//                         setEditingValues(record);
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



// Enhanced CustomTable component with Add Record functionality

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

// Api Calls Route
import { getAllRecords, updateRecord, createRecord } from '../api/apiConfig';

const CustomTable = ({ apiParams }) => {
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

  const navigate = useNavigate();

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("apiParams", apiParams);
      const response = await axios.post(getAllRecords, apiParams);
      const fetchedData = response.data;

      setOriginalRecords(fetchedData);
      setRecords(fetchedData);
      setTotalRecords(fetchedData.length);
      setTotalPages(Math.ceil(fetchedData.length / pageSize));

      if (fetchedData.length > 0) {
        const firstRecord = fetchedData[0];
        const dynamicColumns = Object.keys(firstRecord).map(key => ({
          id: key,
          name: formatColumnName(key),
          accessor: key,
          sortable: true,
          visible: true,
          type: getColumnType(firstRecord[key], key)
        }));
        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch records");
    } finally {
      setLoading(false);
    }
  };

  // Initialize data and columns on component mount
  useEffect(() => {
    fetchData();
  }, []);

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

    // Check for specific column patterns
    if (lowerColumnName.includes('email')) return 'email';
    if (lowerColumnName.includes('phone')) return 'tel';
    if (lowerColumnName.includes('date') || lowerColumnName.includes('created') || lowerColumnName.includes('updated')) return 'date';
    if (lowerColumnName.includes('url') || lowerColumnName.includes('link')) return 'url';
    if (lowerColumnName === 'status') return 'select-status';
    if (lowerColumnName === 'priority') return 'select-priority';
    if (lowerColumnName.includes('description') || lowerColumnName.includes('notes') || lowerColumnName.includes('comment')) return 'textarea';

    // Check value type
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
    setSearchTerm('');
    setStatusFilter([]);
    setPriorityFilter([]);
  };

  // Handle Add Record Modal
  const handleOpenAddModal = () => {
    // Initialize new record data with empty values
    const initialData = {};
    columns.forEach(column => {
      if (column.id !== 'id') { // Don't include ID as it's usually auto-generated
        initialData[column.id] = '';
      }
    });
    setNewRecordData(initialData);
    setIsAddModalOpen(true);
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

      // Prepare the data for API call
      const recordData = {
        schemaName: apiParams.schemaName,
        tableName: apiParams.tableName,
        record: newRecordData
      };

      console.log(recordData);

      // You might need to adjust this based on your API structure
      const response = await axios.post(createRecord, recordData);
      console.log(response);
      toast.success("Record created successfully!");
      setIsAddModalOpen(false);
      setNewRecordData({});
      handleRefresh(); // Refresh the data

    } catch (error) {
      console.error("Error creating record:", error);
      toast.error("Failed to create record");
    } finally {
      setIsCreating(false);
    }
  };

  // Render form input based on column type
  const renderFormInput = (column, value, onChange) => {
    const { id, type, name } = column;

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

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-800">All Records</CardTitle>
            <CardDescription className="mt-1">
              View and manage all database records
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
            {/* Add Record Button */}
            {/* <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  {columns
                    .filter(column => column.id !== 'id') // Exclude ID field
                    .map(column => (
                      <div key={column.id} className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={column.id} className="text-right font-medium">
                          {column.name}
                        </Label>
                        <div className="col-span-3">
                          {renderFormInput(
                            column,
                            newRecordData[column.id],
                            handleNewRecordChange
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateRecord}
                    disabled={isCreating}
                    className=""
                  >
                    {isCreating ? 'Creating...' : 'Create Record'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}

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
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {columns
                    .filter(column => column.id !== 'id') // Exclude ID field
                    .map(column => (
                      <div key={column.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label htmlFor={column.id} className="font-medium text-sm sm:w-32 sm:text-right sm:flex-shrink-0">
                          {column.name}
                        </Label>
                        <div className="flex-1">
                          {renderFormInput(
                            column,
                            newRecordData[column.id],
                            handleNewRecordChange
                          )}
                        </div>
                      </div>
                    ))}
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