import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Lucide React icons
import { 
  Search, 
  Download, 
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
  SlidersHorizontal
} from 'lucide-react';

const RecordsDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockData = [
    {
      "task_name": "Review Quarterly Report",
      "task_file": "report_q1_2025.pdf",
      "notes": "Please prioritize this task.",
      "assigned_to": "john.doe@example.com",
      "assigned_by": "manager@example.com",
      "department": "Finance",
      "priority": "High",
      "status": "Pending",
      "due_date": "25-05-25",
      "auditor_date": "27-05-2025",
      "completion_date": "29-05-2025",
      "rating": "Excellent",
      "pending_to_auditor_remarks": "Waiting for approval",
      "auditor_to_completed_remarks": "Approved and closed",
      "us_id": "a002"
    },
    {
      "task_name": "Update Marketing Materials",
      "task_file": "marketing_materials.docx",
      "notes": "New branding guidelines to be followed.",
      "assigned_to": "sarah.smith@example.com",
      "assigned_by": "director@example.com",
      "department": "Marketing",
      "priority": "Medium",
      "status": "In Progress",
      "due_date": "15-05-25",
      "auditor_date": "17-05-2025",
      "completion_date": "",
      "rating": "",
      "pending_to_auditor_remarks": "",
      "auditor_to_completed_remarks": "",
      "us_id": "a003"
    },
    {
      "task_name": "Prepare Monthly Budget",
      "task_file": "budget_may_2025.xlsx",
      "notes": "Include the new project allocations.",
      "assigned_to": "finance.team@example.com",
      "assigned_by": "cfo@example.com",
      "department": "Finance",
      "priority": "High",
      "status": "Completed",
      "due_date": "05-05-25",
      "auditor_date": "07-05-2025",
      "completion_date": "04-05-2025",
      "rating": "Good",
      "pending_to_auditor_remarks": "Expedited for early completion",
      "auditor_to_completed_remarks": "Approved with minor adjustments",
      "us_id": "a004"
    }
  ];

  // Initialize data and columns on component mount
  useEffect(() => {
    // Simulate API call to fetch data
    setTimeout(() => {
      setRecords(mockData);
      setLoading(false);
      setTotalRecords(mockData.length);
      setTotalPages(Math.ceil(mockData.length / pageSize));
      
      // Dynamically set columns based on the first record
      if (mockData.length > 0) {
        const firstRecord = mockData[0];
        const dynamicColumns = Object.keys(firstRecord).map(key => ({
          id: key,
          name: formatColumnName(key),
          accessor: key,
          sortable: true,
          visible: true
        }));
        setColumns(dynamicColumns);
      }
    }, 500);
  }, []);

  // Helper function to format column names
  const formatColumnName = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // In a real app, this would trigger an API call with the search term
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
      setSelectedRecords(records.map(record => record.us_id));
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
    // In a real app, this would trigger an API call with sort parameters
  };

  // Export to CSV function
  const exportToCSV = () => {
    // In a real app, this would generate and download a CSV file
    alert('Exporting to CSV...');
  };

  // Export to PDF function
  const exportToPDF = () => {
    // In a real app, this would generate and download a PDF file
    alert('Exporting to PDF...');
  };

  // Upload CSV function
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // In a real app, this would upload the CSV file to the server
      alert(`Uploading file: ${file.name}`);
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
    switch(status.toLowerCase()) {
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
    switch(priority.toLowerCase()) {
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

  // Filter visible columns
  const visibleColumns = columns.filter(column => column.visible);

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
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setRecords(mockData)}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuItem>In Progress</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuItem>High</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>Low</DropdownMenuItem>
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
              onClick={exportToPDF}
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
            
            <div className="relative">
              <input
                type="file"
                id="csvUpload"
                accept=".csv"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
              />
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload CSV</span>
              </Button>
            </div>
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
                            className={`h-4 w-4 transition-transform ${
                              sortDirection === 'desc' ? 'rotate-180' : ''
                            }`} 
                          />
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 2} className="h-24 text-center">
                      Loading records...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 2} className="h-24 text-center">
                      No records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record, index) => (
                    <TableRow key={record.us_id || index} className="hover:bg-slate-50">
                      <TableCell className="w-[40px]">
                        <Checkbox 
                          checked={selectedRecords.includes(record.us_id)}
                          onCheckedChange={() => handleSelectRecord(record.us_id)}
                        />
                      </TableCell>
                      
                      {visibleColumns.map(column => (
                        <TableCell key={column.id}>
                          {column.id === 'status' ? (
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
                      
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
            Showing <span className="font-medium">{records.length}</span> of <span className="font-medium">{totalRecords}</span> records
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

export default RecordsDashboard;