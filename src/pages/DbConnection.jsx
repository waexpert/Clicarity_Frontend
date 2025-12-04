import React, { useState } from 'react';
import "../css/DbConnection.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SchemaCreation from '../components/SchemaCreation';

import { 
  Database, 
  Eye, 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  Clock 
} from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
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
      createdDate: "22 Aug, 2023",
      createdTime: "05:59 PM",
      updatedDate: "20 Sep, 2024",
      updatedTime: "08:19 PM",
      status: "active",
    },
  ];

  return (
    <Card className="tableCard shadow-sm border-slate-200 mx-4 sm:mx-[6rem]">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center gap-3">
          <div>
            <CardTitle className="text-2xl font-semibold text-slate-700">
              DB Connections
            </CardTitle>
            <CardDescription className="mt-1">
              Manage your database connections and schemas
            </CardDescription>
          </div>
          {/* <Button
            onClick={() => setAddConnection(true)}
            className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
          >
            <Plus className="h-4 w-4" /> Add Connection
          </Button> */}
        </div>
      </CardHeader>

      <CardContent>
        {addConnection ? <SchemaCreation setAddConnection={setAddConnection} /> : null}

        {connections.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Database className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No database connections found</p>
            <p className="text-sm mt-2">
              Click &quot;Add Connection&quot; to create your first database connection
            </p>
          </div>
        )}

        {connections.length > 0 && (
          <>
            {/* 📱 Mobile layout: card-style rows */}
            <div className="space-y-4 sm:hidden">
              {connections.map((conn, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white  p-4"
                >
                  {/* Top: icon + name + status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#4285B4]/10 flex items-center justify-center">
                        <Database className="h-5 w-5 text-[#4285B4]" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">
                          DB Connection
                        </p>
                        <p className="font-semibold text-slate-700 text-sm break-all">
                          {conn.name}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                      Active
                    </Badge>
                  </div>

                  {/* Middle: dates in 2-column grid */}
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                        Created at
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{conn.createdDate}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 ml-6">
                        <Clock className="h-3 w-3" />
                        {conn.createdTime}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">
                        Last updated
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>{conn.updatedDate}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 ml-6">
                        <Clock className="h-3 w-3" />
                        {conn.updatedTime}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: actions */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#4285B4] hover:bg-[#3778b4]"
                      onClick={() => navigate(`/db/${id}`)}
                    >
                      View details
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="More options"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 🖥 Desktop / tablet layout: normal table */}
            <Table className="hidden sm:table w-full mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>DB Connection Name</TableHead>
                  <TableHead>Created at</TableHead>
                  <TableHead>Last Updated at</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                  <TableHead className="text-right w-[120px]">Actions</TableHead>
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
                      <Badge className="bg-green-50 text-green-700 border-green-200">
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DbConnection;
