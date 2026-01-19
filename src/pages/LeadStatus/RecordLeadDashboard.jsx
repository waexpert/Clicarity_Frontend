// Updated RecordsDashboard component with working refresh, search, and filter functionality

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
//   Download, 
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

// const RecordJobDashboard = () => {
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
//   const navigate = useNavigate();

//   // API data parameters
//   const apiParams = {
//     "schemaName": "wa_expert",
//     "tableName":"jobstatus"

//   };

//   // Fetch data from API
//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`, apiParams);
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
//       setSelectedRecords(records.map(record => record.us_id));
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
//     switch(status.toLowerCase()) {
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
//     switch(priority.toLowerCase()) {
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
//             <CardTitle className="text-2xl font-semibold text-slate-700">All Records</CardTitle>
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
//               onClick={exportToPDF}
//             >
//               <FileDown className="h-4 w-4" />
//               <span className="hidden sm:inline">Export PDF</span>
//             </Button>
            
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
//                             className={`h-4 w-4 transition-transform ${
//                               sortDirection === 'desc' ? 'rotate-180' : ''
//                             }`} 
//                           />
//                         )}
//                       </div>
//                     </TableHead>
//                   ))}
//                   <TableHead className="w-[80px] text-right">Actions</TableHead>
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
//                     <TableRow key={record.us_id || index} className="hover:bg-slate-50">
//                       <TableCell className="w-[40px]">
//                         <Checkbox 
//                           checked={selectedRecords.includes(record.us_id)}
//                           onCheckedChange={() => handleSelectRecord(record.us_id)}
//                         />
//                       </TableCell>
                      
//                       {visibleColumns.map(column => (
//                         <TableCell key={column.id}>
//                           {column.id === 'status' ? (
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
                      
//                       <TableCell className="text-right">
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="icon" className="h-8 w-8">
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem>
//                               <Eye className="h-4 w-4 mr-2" />
//                               <span>View Details</span>
//                             </DropdownMenuItem>
//                             <DropdownMenuItem>
//                               <Edit className="h-4 w-4 mr-2" />
//                               <span>Edit</span>
//                             </DropdownMenuItem>
//                             <DropdownMenuSeparator />
//                             <DropdownMenuItem className="text-red-600">
//                               <Trash2 className="h-4 w-4 mr-2" />
//                               <span>Delete</span>
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
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

// export default RecordJobDashboard;


import React from 'react'
import CustomTable from '../../components/customTable/CustomTable'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
const RecordLeadDashboard = () => {

 const userData = useSelector((state) => state.user)
const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const firstSegment = pathSegments[1]
  console.log(userData);
  return (
<CustomTable apiParams={{
  "schemaName":`${userData.schema_name}`,
  "tableName":`${firstSegment}`
}}/>
  )
}

export default RecordLeadDashboard