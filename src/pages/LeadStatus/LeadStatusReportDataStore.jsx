import React, { useEffect, useState } from 'react';
// import '../css/components/NewDataStore.css';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setDynamicData, addDynamicField, setLoading, setError } from '../../features/productMethod/leadStatusSlice';

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
  { name: 'id', type: 'Text', defaultValue: 'Auto', locked: true },
  { name: 'us_id', type: 'Text', locked: true },
  // { name: 'assigned_to', type: 'Text', defaultValue: '-', locked: true },
  // { name: 'notes', type: 'Text', label: 'Notes', defaultValue: '-', locked: true },
  // { name: 'assigned_to', type: 'Text', label: 'Assigned To', defaultValue: '-', locked: true },
  // { name: 'assigned_by', type: 'Text', label: 'Assigned By', defaultValue: '-', locked: true },
  // { name: 'department', type: 'Text', label: 'Department', defaultValue: '-', locked: true },
  // { name: 'priority', type: 'Text', label: 'Priority', defaultValue: '-', locked: true },
  // { name: 'status', type: 'Text', label: 'Status', defaultValue: 'Pending', locked: true },
  // { name: 'due_date', type: 'Date', label: 'Due Date', locked: true },
  // { name: 'auditor_date', type: 'Date', label: 'Auditor Date', locked: true },
  // { name: 'completion_date', type: 'Date', label: 'Completion Date', locked: true },
  // { name: 'rating', type: 'Text', label: 'Rating', defaultValue: '-', locked: true },
  // { name: 'pending_to_auditor_remarks', type: 'Text', label: 'Auditor Remarks', defaultValue: '-', locked: true },
  // { name: 'auditor_to_completed_remarks', type: 'Text', label: 'Completed Remarks', defaultValue: '-', locked: true },
];

const LeadStatusReportDataStore = ({ setShowDialog, columnFields }) => {

  const [showCaptureWebhook, setShowCaptureWebhook] = useState('');

   const dispatch = useDispatch();
  const [title, setTitle] = useState('leadstatus');
  const [customFields, setCustomFields] = useState([]);
  const [showInChat, setShowInChat] = useState(false);
  const user = useSelector((state) => state.user);
  const id = user.id;
  const schema_name = user.schema_name;
  const [columns, setColumns] = useState(columnFields);

  const [actualData, setActualData] = useState([])

  function capitalizeFirstLetter(str) {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const convertWithMapping = (message) => {
    const typeMapping = {
      'character varying': 'text',
      'text': 'text',
      'character': 'text',
      'timestamp with time zone': 'timestamp',
      'ARRAY': 'array'
    };

    const converted = message.map(element => ({
      name: element.column_name,
      type: capitalizeFirstLetter(typeMapping[element.data_type] || element.data_type)
    }));

    console.log('Alternative approach:', converted);
    return converted;
  }


  useEffect(() => {
    const getTableStructure = async () => {
      const { data } = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/getTableStructure`, {
        schemaName: schema_name,
        tableName: 'leadstatus'
      });

      setActualData(convertWithMapping(data.data));
      dispatch(setDynamicData({jobStatusStructure: convertWithMapping(data.data)}))
      console.log(data.data);
    }
    getTableStructure();
  }, []);


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
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/createTable`, data);
      alert("Form submitted successfully!");
      console.log(res)
      // setShowDialog(0); // Close the dialog after successful submission
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Creation failed! Please try again.");
    }
  };

// Replace your current handleSubmit function with this:

// const handleSubmit = async () => {
//   setLoading(true);
  
//   try {
//     console.log("=== STARTING HANDLESUBMIT ===");
//     console.log("Schema name:", schema_name);
//     console.log("Title:", title);
//     console.log("User ID:", id);
//     console.log("Custom fields:", customFields);
//     console.log("Predefined fields:", predefinedFields);

//     // First, check if table exists by trying to get its structure
//     let tableExists = false;
//     try {
//       console.log("Checking if table exists...");
//       const checkTable = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/getTableStructure`, {
//         schemaName: schema_name,
//         tableName: "jobstatus"
//       });
      
//       console.log("Table check response:", checkTable.data);
//       tableExists = checkTable.data.success && checkTable.data.data && checkTable.data.data.length > 0;
//       console.log("Table exists:", tableExists);
//     } catch (error) {
//       console.log("Error checking table (table probably doesn't exist):", error.message);
//       tableExists = false;
//     }

//     if (tableExists) {
//       console.log("=== TABLE EXISTS - ADDING COLUMNS ===");
      
//       if (customFields.length === 0) {
//         alert("No new fields to add to existing table!");
//         return;
//       }

//       const data = { 
//         table_name: title, 
//         fields: customFields,
//         schema_name, 
//         id 
//       };

//       console.log('Data being sent to addColumnsToTable:', JSON.stringify(data, null, 2));
      
//       const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/addColumnsToTable`, data);
//       console.log('Add columns response:', res.data);
      
//       if (res.data.success) {
//         alert(`Successfully added ${customFields.length} new columns!`);
        
//         // Refresh table structure
//         const updatedStructure = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/getTableStructure`, {
//           schemaName: schema_name,
//           tableName: title
//         });
        
//         if (updatedStructure.data.success) {
//           setActualData(convertWithMapping(updatedStructure.data.data));
//           dispatch(setDynamicData({jobStatusStructure: convertWithMapping(updatedStructure.data.data)}));
//         }
        
//         setCustomFields([]);
//       } else {
//         console.error("Failed to add columns:", res.data);
//         alert("Failed to add columns: " + (res.data.message || "Unknown error"));
//       }

//     } else {
//       console.log("=== TABLE DOES NOT EXIST - CREATING NEW TABLE ===");
      
//       const allFields = [...predefinedFields, ...customFields];
//       const data = { 
//         table_name: title, 
//         fields: allFields, 
//         schema_name, 
//         id 
//       };
      
//       console.log('Data being sent to createTable:', JSON.stringify(data, null, 2));
//       console.log('All fields being sent:', allFields);
      
//       // Add more detailed logging
//       console.log("Making request to:", `${import.meta.env.VITE_APP_BASE_URL}/secure/createTable`);
      
//       const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/createTable`, data);
      
//       console.log('Create table response:', res);
//       console.log('Create table response data:', res.data);
      
//       // Check what the backend actually returned
//       if (res.data && res.data.success) {
//         console.log("✅ Table creation succeeded");
//         alert("Table created successfully!");
        
//         // Update the actual data to show the new table structure
//         try {
//           const newStructure = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/getTableStructure`, {
//             schemaName: schema_name,
//             tableName: title
//           });
          
//           if (newStructure.data.success) {
//             setActualData(convertWithMapping(newStructure.data.data));
//             dispatch(setDynamicData({jobStatusStructure: convertWithMapping(newStructure.data.data)}));
//           }
//         } catch (structureError) {
//           console.warn("Could not fetch new table structure:", structureError);
//         }
        
//         setCustomFields([]);
//       } else {
//         console.error("❌ Table creation failed");
//         console.error("Response data:", res.data);
        
//         // More detailed error message
//         const errorMessage = res.data?.message || res.data?.error || "Unknown error occurred";
//         alert("Table creation failed: " + errorMessage);
//       }
//     }

//   } catch (error) {
//     console.error("=== OPERATION FAILED ===");
//     console.error("Full error:", error);
//     console.error("Error response:", error.response);
//     console.error("Error response data:", error.response?.data);
    
//     const errorMessage = error.response?.data?.message || 
//                         error.response?.data?.error || 
//                         error.message || 
//                         "Unknown error occurred";
    
//     alert(`Operation failed: ${errorMessage}`);
//   } finally {
//     setLoading(false);
//     console.log("=== HANDLESUBMIT COMPLETED ===");
//   }
// };


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#4285B4]" />
          <CardTitle>New Data Store</CardTitle>
        </div>
        <CardDescription>
          Configure your lead management data store with custom fields
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
              disabled
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
                    {/* <TableHead>Label</TableHead> */}
                    <TableHead>Default Value</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(actualData.length > 0 ? actualData : predefinedFields).map((field, index) => (
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
                      {/* <TableHead>Label</TableHead> */}
                      <TableHead>Default Value</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customFields.map((field, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {/* <Input
                            placeholder="Field Name"
                            value={field.name}
                            onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                          /> */}
                          {console.log(columnFields)}
                          <Select
                            value={field.name}
                            onValueChange={(value) => handleCustomFieldChange(index, 'name', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {columnFields.map((columns) => (
                                <SelectItem key={columns} value={columns}>{columns}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        {/* <TableCell>
                          <Input
                            placeholder="Label"
                            value={field.label}
                            onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
                          />
                        </TableCell> */}
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

export default LeadStatusReportDataStore;