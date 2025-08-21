import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Import Lucide React icons
import { 
  Calendar,
  Clock,
  Database,
  Eye,
  Pencil,
  Trash2,
  Table as TableIcon,
  Search,
  Settings
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Lead = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const schemas = [
    {
      "id": "9",
      "title": "Lead Status",
      "fieldsCount": 8,
      "createdAt": "2024-10-18T15:35:00Z",
      "updatedAt": "2024-10-18T15:35:00Z"
    }
  ];

  const formatDate = (iso) => {
    const date = new Date(iso);
    return {
      date: '10/18/2024',
      time: '09:05 PM'
    };
  };

  const user = useSelector((state) => state.user);
  const id = user.id;

  return (
    <Card className="border border-slate-200 rounded-lg shadow-sm mx-[6rem]">
      <CardContent className="p-6">
        {/* Header with title and search/button */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-medium text-slate-800">Lead Status</h1>
          <p className="text-sm text-slate-500">Manage your data stores and schemas</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search data store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full sm:w-[300px]"
            />
          </div>
          <Button 
            className="gap-2 bg-[#4285B4] hover:bg-[#3778b4] w-full sm:w-auto"
          >
            <TableIcon className="h-4 w-4" /> Custom Table
          </Button>
        </div>
        
        {/* Table */}
        <div className="rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-b">
                <TableHead className="font-medium text-slate-700">Schema Title</TableHead>
                <TableHead className="font-medium text-slate-700">Number of Fields</TableHead>
                <TableHead className="font-medium text-slate-700">Created at</TableHead>
                <TableHead className="font-medium text-slate-700">Last Updated at</TableHead>
                <TableHead className="font-medium text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemas.map((schema) => {
                const created = formatDate(schema.createdAt);
                const updated = formatDate(schema.updatedAt);
                
                return (
                  <TableRow key={schema.id} className="hover:bg-slate-50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center h-6 w-6 text-[#4285B4]">
                          <Database className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-slate-700">{schema.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-slate-700">
                        {schema.fieldsCount} fields
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{created.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-6">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{created.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{updated.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 ml-6">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{updated.time}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 p-0 text-slate-500 hover:text-[#4285B4] hover:bg-slate-100"
                          onClick={() => navigate(`/leadstatus/record`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 p-0 text-slate-500 hover:text-[#4285B4] hover:bg-slate-100"
                            onClick={() => navigate(`/db/custom/capture/leadstatus`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                         {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Setup"
                         onClick={
                        ()=> navigate(`/db/setup/${schema.title}`)
                      }>
                       <Settings
                        className="h-4 w-4 text-red-500" />
                      </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Lead;


