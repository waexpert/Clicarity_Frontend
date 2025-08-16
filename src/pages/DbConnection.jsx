import React, { useState } from 'react';
import "../css/DbConnection.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SchemaCreation from '../components/SchemaCreation';

// Lucide React icons instead of react-icons
import { 
  Database, 
  Eye, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Clock 
} from 'lucide-react';

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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DbConnection = () => {
  const [addConnection, setAddConnection] = useState(false);
  const user = useSelector((state) => state.user);
  const id = user.id;
  const navigate = useNavigate();

  const connections = [
    {
      name: `${user.schema_name}`,
      createdDate: '22 Aug, 2023',
      createdTime: '05:59 PM',
      updatedDate: '20 Sep, 2024',
      updatedTime: '08:19 PM',
      status: 'active'
    }
  ];

  return (
    <Card className="shadow-sm border-slate-200 mx-[6rem]">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold text-slate-800">DB Connections</CardTitle>
          <Button 
            onClick={() => setAddConnection(true)}
            className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
          >
            <Plus className="h-4 w-4" /> Add Connection
          </Button>
        </div>
        <CardDescription>
          Manage your database connections and schemas
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {addConnection ? <SchemaCreation setAddConnection={setAddConnection} /> : null}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead>DB Connection Name</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Last Updated at</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {connections.map((conn, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center justify-center h-10 w-10 rounded bg-[#4285B4]/10">
                    <Database className="h-5 w-5 text-[#4285B4]" />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{conn.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{conn.createdDate}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 ml-6">
                    <Clock className="h-3 w-3" />
                    {conn.createdTime}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{conn.updatedDate}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 ml-6">
                    <Clock className="h-3 w-3" />
                    {conn.updatedTime}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => navigate(`/db/${id}`)}
                      title="View Connection"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      title="More Options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {connections.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Database className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No database connections found</p>
            <p className="text-sm mt-2">Click "Add Connection" to create your first database connection</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DbConnection;