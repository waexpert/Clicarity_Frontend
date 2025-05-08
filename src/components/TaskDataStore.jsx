import React, { useState } from 'react';
import '../css/components/NewDataStore.css';
import { useSelector } from "react-redux";
import axios from "axios";

// Lucide React icons
import { 
  Lock, 
  Plus, 
  X, 
  Database, 
  Save
} from "lucide-react";

// Shadcn UI components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const fieldTypes = ['Text', 'Number', 'Date', 'Boolean'];

// Predefined system fields (locked)
const predefinedFields = [
  { name: 'id', type: 'Number', label: 'ID', defaultValue: 'Auto', locked: true },
  { name: 'task_name', type: 'Text', label: 'Task Name', defaultValue: '-', locked: true },
  { name: 'task_file', type: 'Text', label: 'Task File', defaultValue: '-', locked: true },
  { name: 'notes', type: 'Text', label: 'Notes', defaultValue: '-', locked: true },
  { name: 'assigned_to', type: 'Text', label: 'Assigned To', defaultValue: '-', locked: true },
  { name: 'assigned_by', type: 'Text', label: 'Assigned By', defaultValue: '-', locked: true },
  { name: 'department', type: 'Text', label: 'Department', defaultValue: '-', locked: true },
  { name: 'priority', type: 'Text', label: 'Priority', defaultValue: '-', locked: true },
  { name: 'status', type: 'Text', label: 'Status', defaultValue: 'Pending', locked: true },
  { name: 'due_date', type: 'Date', label: 'Due Date', locked: true },
  { name: 'auditor_date', type: 'Date', label: 'Auditor Date', locked: true },
  { name: 'completion_date', type: 'Date', label: 'Completion Date', locked: true },
  { name: 'rating', type: 'Text', label: 'Rating', defaultValue: '-', locked: true },
  { name: 'pending_to_auditor_remarks', type: 'Text', label: 'Auditor Remarks', defaultValue: '-', locked: true },
  { name: 'auditor_to_completed_remarks', type: 'Text', label: 'Completed Remarks', defaultValue: '-', locked: true },
];

const TaskDataStore = ({ setShowDialog }) => {
  const [title, setTitle] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [showInChat, setShowInChat] = useState(false);
  const user = useSelector((state) => state.user);
  const id = user.id;
  const schema_name = user.schema_name;

  const handleCustomFieldChange = (index, key, value) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };

  const addField = () => {
    setCustomFields([...customFields, { name: '', type: 'Text', label: '', defaultValue: '' }]);
  };

  const removeField = (index) => {
    const updated = customFields.filter((_, i) => i !== index);
    setCustomFields(updated);
  };

  const handleSubmit = async () => {
    const allFields = [...predefinedFields, ...customFields];
    const data = { table_name: title, fields: allFields, schema_name, id };
    console.log('Creating Data Store:', data);
    try {
      const res = await axios.post("http://localhost:3000/secure/createTable", data);
      alert("Form submitted successfully!");
      setShowDialog(0); // Close the dialog after successful submission
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Creation failed! Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#4285B4]" />
          <CardTitle>New Data Store</CardTitle>
        </div>
        <CardDescription>
          Configure your task management data store with custom fields
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Title input */}
          <div className="space-y-2">
            <Label htmlFor="title">Data Store Title</Label>
            <Input
              id="title"
              placeholder="Enter Data Store Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* Optional Show in Chat checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showInChat" 
              checked={showInChat}
              onCheckedChange={setShowInChat}
            />
            <Label 
              htmlFor="showInChat"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show in Chat Interface
            </Label>
          </div>
          
          <Separator />
          
          {/* Predefined Fields Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">Predefined Fields</h3>
              <Badge variant="outline" className="bg-slate-100">
                <Lock className="h-3 w-3 mr-1" /> Locked
              </Badge>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Default Value</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {predefinedFields.map((field, index) => (
                    <TableRow key={index} className="bg-slate-50/50">
                      <TableCell className="font-medium text-slate-500">
                        {field.name}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {field.type}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {field.label}
                      </TableCell>
                      <TableCell className="text-slate-500">
                        {field.defaultValue || '-'}
                      </TableCell>
                      <TableCell>
                        <Lock className="h-3.5 w-3.5 text-slate-400" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <Separator />
          
          {/* Custom Fields Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Custom Fields</h3>
            
            {customFields.length > 0 ? (
              <div className="rounded-md border mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Default Value</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customFields.map((field, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            placeholder="Field Name"
                            value={field.name}
                            onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={field.type}
                            onValueChange={(value) => handleCustomFieldChange(index, 'type', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Label"
                            value={field.label}
                            onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Default Value"
                            value={field.defaultValue}
                            onChange={(e) => handleCustomFieldChange(index, 'defaultValue', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeField(index)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md bg-slate-50">
                <p className="text-slate-500">No custom fields added yet</p>
                <p className="text-sm text-slate-400 mt-1">Click "Add Field" to create custom fields</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={addField} 
              className="gap-2 mt-2"
            >
              <Plus className="h-4 w-4" /> Add Field
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 mt-6">
        <Button 
          variant="outline" 
          onClick={() => setShowDialog(0)}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
          disabled={!title}
        >
          <Save className="h-4 w-4" /> Create Data Store
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskDataStore;