import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/SchemaDashboard.css';
import { useNavigate } from 'react-router-dom';
import NewDataStore from '../components/NewDataStore';
import TaskDataStore from '../components/TaskDataStore';
import JobStatusReportDataStore from '../components/JobStatusReportDataStore';
import { useSelector } from "react-redux";

// Import Shadcn UI components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Import Lucide React icons
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Table as TableIcon,
  Calendar,
  Clock,
  Database
} from 'lucide-react';
import CaptureWebhook from '../components/CaptureWebhook';

const SchemaDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(0);
  const [showCapture,setCapture] = useState(true);
  const [dropDown,setDropDown] = useState([]); 

  const componentMap = {
    1: <NewDataStore setShowDialog={setShowDialog} />,
    2: <TaskDataStore setShowDialog={setShowDialog} />,
    8: <JobStatusReportDataStore setShowDialog={setShowDialog} />
  };

   const user = useSelector((state) => state.user);
  const ownerId = user.id;

  const products = ['task_management','expense_tracker','lead_management','project_management','support_ticket','birthday_reminder','job_status']

  const schemas = [
    {
      "id": "1",
      "title": "Task Management",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "2",
      "title": "Expense Tracker",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "3",
      "title": "Lead Management",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "4",
      "title": "Project Management",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "5",
      "title": "Support Ticket",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
    {
      "id": "6",
      "title": "Birthday Reminder",
      "fieldsCount": 4,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    },
        {
      "id": "7",
      "title": "Job Status Report",
      "fieldsCount": 8,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    }
  ];

  const filteredSchemas = schemas.filter(schema =>
    schema.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (iso) => {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (<>
  {/* {showCapture? <CaptureWebhook/> :""} */}
    <Card className="shadow-sm border-slate-200">
      
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-800">All Products</CardTitle>
            <CardDescription className="mt-1">
              Manage your data stores and schemas
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search data store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[250px]"
              />
            </div>
            <Button 
              className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
              onClick={() => setShowDialog(1)}
            >
              <TableIcon className="h-4 w-4" /> Custom Table
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {componentMap[showDialog] || null}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Schema Title</TableHead>
              <TableHead className="text-center">Number of Fields</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Last Updated at</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchemas.map((schema) => {
              const created = formatDate(schema.createdAt);
              const updated = formatDate(schema.updatedAt);
              
              return (
                <TableRow key={schema.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-9 w-9 rounded bg-[#4285B4]/10">
                        <Database className="h-4 w-4 text-[#4285B4]" />
                      </div>
                      {schema.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-slate-50">
                      {schema.fieldsCount} fields
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{created.date}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 ml-6">
                      <Clock className="h-3 w-3" />
                      {created.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{updated.date}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 ml-6">
                      <Clock className="h-3 w-3" />
                      {updated.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Browse" onClick={()=> navigate(`/jobs/record`)}>
                        <Eye className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        title="Edit"
                        // onClick={() => setShowDialog(parseInt(schema.id))}
                        onClick={() => navigate(`/db/${ownerId}/${products[parseInt(schema.id)-1]}`)}

                      >
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {filteredSchemas.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Database className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No data stores found</p>
            <p className="text-sm mt-2">Try a different search term or create a new data store</p>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
};

export default SchemaDashboard;