// import React, { useEffect, useState } from 'react';
// // import '../css/components/NewDataStore.css';
// import axios from "axios";
// import { useSelector, useDispatch } from 'react-redux';
// import { setDynamicData, addDynamicField, setLoading, setError } from '../../features/productMethod/jobStatusSlice';

// // Lucide React icons
// import {
//   Lock,
//   Plus,
//   X,
//   Database,
//   Save
// } from "lucide-react";

// // Shadcn UI components
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

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
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";

// const fieldTypes = ['Text', 'Number', 'Date', 'Boolean'];


// // Predefined system fields (locked)
// const predefinedFields = [
//   { name: 'id', type: 'Text', defaultValue: 'Auto', locked: true },
//   { name: 'us_id', type: 'Text', locked: true },
// ];

// const CustomReportDataStore = ({ setShowDialog, columnFields }) => {

//   const [showCaptureWebhook, setShowCaptureWebhook] = useState('');

//    const dispatch = useDispatch();
//   const [title, setTitle] = useState('');
//   const [customFields, setCustomFields] = useState([]);
//   const [showInChat, setShowInChat] = useState(false);
//   const user = useSelector((state) => state.user);
//   const id = user.id;
//   const schema_name = user.schema_name;
//   const [columns, setColumns] = useState(columnFields);

//   const [actualData, setActualData] = useState([])

//   function capitalizeFirstLetter(str) {
//     if (!str) {
//       return str;
//     }
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   }

//   const convertWithMapping = (message) => {
//     const typeMapping = {
//       'character varying': 'text',
//       'text': 'text',
//       'character': 'text',
//       'timestamp with time zone': 'timestamp',
//       'ARRAY': 'array'
//     };

//     const converted = message.map(element => ({
//       name: element.column_name,
//       type: capitalizeFirstLetter(typeMapping[element.data_type] || element.data_type)
//     }));

//     console.log('Alternative approach:', converted);
//     return converted;
//   }


//   useEffect(() => {
//     const getTableStructure = async () => {
//       // const { data } = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/getTableStructure`, {
//       //   schemaName: schema_name,
//       //   tableName: 'jobstatus'
//       // });

//       setActualData(convertWithMapping(data.data));
//       dispatch(setDynamicData({jobStatusStructure: convertWithMapping(data.data)}))
//       console.log(data.data);
//     }
//     getTableStructure();
//   }, []);


//   const handleCustomFieldChange = (index, key, value) => {
//     const updated = [...customFields];
//     updated[index][key] = value;
//     setCustomFields(updated);
//   };

//   const addField = () => {
//     setCustomFields([...customFields, { name: '', type: 'Text', label: '', defaultValue: '' }]);
//   };

//   const removeField = (index) => {
//     const updated = customFields.filter((_, i) => i !== index);
//     setCustomFields(updated);
//   };

//   const handleSubmit = async () => {
//     const allFields = [...predefinedFields, ...customFields];
//     const data = { table_name: title, fields: allFields, schema_name, id };
//     console.log('Creating Data Store:', data);
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/createTable`, data);
//       alert("Form submitted successfully!");
//       console.log(res)
//       // setShowDialog(0); // Close the dialog after successful submission
//     } catch (error) {
//       console.error("Creation failed:", error);
//       alert("Creation failed! Please try again.");
//     }
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-md">
//       <CardHeader className="pb-4 border-b">
//         <div className="flex items-center gap-2">
//           <Database className="h-5 w-5 text-[#4285B4]" />
//           <CardTitle>New Data Store</CardTitle>
//         </div>
//         <CardDescription>
//           Configure your task management data store with custom fields
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="pt-6">
//         <div className="space-y-6">
//           {/* Title input */}
//           <div className="space-y-2">
//             <Label htmlFor="title">Data Store Title</Label>
//             <Input
//               id="title"
//               placeholder="Enter Data Store Title"
//               value={title}
//               // disabled
//               onChange={(e) => setTitle(e.target.value)}
//               className="max-w-md"
//             />
//           </div>

//           {/* Optional Show in Chat checkbox */}
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="showInChat"
//               checked={showInChat}
//               onCheckedChange={setShowInChat}
//             />
//             <Label
//               htmlFor="showInChat"
//               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//             >
//               Show in Chat Interface
//             </Label>
//           </div>

//           <Separator />

//           {/* Predefined Fields Section */}
//           <div>
//             <div className="flex items-center gap-2 mb-4">
//               <h3 className="text-lg font-medium">Predefined Fields</h3>
//               <Badge variant="outline" className="bg-slate-100">
//                 <Lock className="h-3 w-3 mr-1" /> Locked
//               </Badge>
//             </div>

//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Field Name</TableHead>
//                     <TableHead>Type</TableHead>
//                     {/* <TableHead>Label</TableHead> */}
//                     <TableHead>Default Value</TableHead>
//                     <TableHead className="w-[50px]"></TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {(actualData.length > 0 ? actualData : predefinedFields).map((field, index) => (
//                     <TableRow key={index} className="bg-slate-50/50">
//                       <TableCell className="font-medium text-slate-500">
//                         {field.name}
//                       </TableCell>
//                       <TableCell className="text-slate-500">
//                         {field.type}
//                       </TableCell>
//                       <TableCell className="text-slate-500">
//                         {field.label}
//                       </TableCell>
//                       <TableCell className="text-slate-500">
//                         {field.defaultValue || '-'}
//                       </TableCell>
//                       <TableCell>
//                         <Lock className="h-3.5 w-3.5 text-slate-400" />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </div>

//           <Separator />

//           {/* Custom Fields Section */}
//           <div>
//             <h3 className="text-lg font-medium mb-4">Custom Fields</h3>

//             {customFields.length > 0 ? (
//               <div className="rounded-md border mb-4">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Field Name</TableHead>
//                       <TableHead>Type</TableHead>
//                       {/* <TableHead>Label</TableHead> */}
//                       <TableHead>Default Value</TableHead>
//                       <TableHead className="w-[80px]">Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {customFields.map((field, index) => (
//                       <TableRow key={index}>
//                         <TableCell>
//                           {/* <Input
//                             placeholder="Field Name"
//                             value={field.name}
//                             onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
//                           /> */}
//                           {console.log(columnFields)}
//                           <Select
//                             value={field.name}
//                             onValueChange={(value) => handleCustomFieldChange(index, 'name', value)}
//                           >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Type" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {columnFields.map((columns) => (
//                                 <SelectItem key={columns} value={columns}>{columns}</SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                         <TableCell>
//                           <Select
//                             value={field.type}
//                             onValueChange={(value) => handleCustomFieldChange(index, 'type', value)}
//                           >
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Type" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {fieldTypes.map((type) => (
//                                 <SelectItem key={type} value={type}>{type}</SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </TableCell>
//                         {/* <TableCell>
//                           <Input
//                             placeholder="Label"
//                             value={field.label}
//                             onChange={(e) => handleCustomFieldChange(index, 'label', e.target.value)}
//                           />
//                         </TableCell> */}
//                         <TableCell>
//                           <Input
//                             placeholder="Default Value"
//                             value={field.defaultValue}
//                             onChange={(e) => handleCustomFieldChange(index, 'defaultValue', e.target.value)}
//                           />
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             onClick={() => removeField(index)}
//                             className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             ) : (
//               <div className="text-center py-8 border rounded-md bg-slate-50">
//                 <p className="text-slate-500">No custom fields added yet</p>
//                 <p className="text-sm text-slate-400 mt-1">Click "Add Field" to create custom fields</p>
//               </div>
//             )}

//             <Button
//               variant="outline"
//               onClick={addField}
//               className="gap-2 mt-2"
//             >
//               <Plus className="h-4 w-4" /> Add Field
//             </Button>
//           </div>
//         </div>
//       </CardContent>

//       <CardFooter className="flex justify-between border-t pt-4 mt-6">
//         <Button
//           variant="outline"
//           onClick={() => setShowDialog(0)}
//         >
//           Cancel
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
//           disabled={!title}
//         >
//           <Save className="h-4 w-4" /> Create Data Store
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default CustomReportDataStore;

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from "axios";
// import { useSelector, useDispatch } from 'react-redux';
// import { setDynamicData, addDynamicField, setLoading, setError } from '../../features/productMethod/jobStatusSlice';

// // Lucide React icons
// import {
//   Lock,
//   Plus,
//   X,
//   Database,
//   Save,
//   Loader2,
//   AlertCircle
// } from "lucide-react";

// // Shadcn UI components
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

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
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// const fieldTypes = ['Text', 'Number', 'Date', 'Boolean'];

// // Predefined system fields (locked)
// const predefinedFields = [
//   { name: 'id', type: 'Text', defaultValue: 'Auto', locked: true },
//   { name: 'us_id', type: 'Text', locked: true },
// ];

// const CustomReportDataStore = ({ setShowDialog, columnFields }) => {
//   const { tableName } = useParams(); // Get tableName from route parameter
  
//   const [showCaptureWebhook, setShowCaptureWebhook] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const dispatch = useDispatch();
//   const [title, setTitle] = useState('');
//   const [customFields, setCustomFields] = useState([]);
//   const [showInChat, setShowInChat] = useState(false);
//   const user = useSelector((state) => state.user);
//   const id = user.id;
//   const schema_name = user.schema_name;
//   const [columns, setColumns] = useState(columnFields || []);
  
//   const [actualData, setActualData] = useState([]);

//   function capitalizeFirstLetter(str) {
//     if (!str) {
//       return str;
//     }
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   }

//   const convertWithMapping = (message) => {
//     console.log('Input data for conversion:', message);
    
//     const typeMapping = {
//       'character varying': 'text',
//       'text': 'text',
//       'character': 'text',
//       'timestamp with time zone': 'timestamp',
//       'timestamp without time zone': 'timestamp',
//       'integer': 'number',
//       'bigint': 'number',
//       'boolean': 'boolean',
//       'ARRAY': 'array'
//     };

//     // Handle different possible data formats
//     let dataToConvert = message;
//     if (message && message.data) {
//       dataToConvert = message.data;
//     }

//     if (!Array.isArray(dataToConvert)) {
//       console.error('Data is not an array:', dataToConvert);
//       return [];
//     }

//     const converted = dataToConvert.map((element, index) => {
//       console.log(`Converting element ${index}:`, element);
      
//       // Handle different possible column name properties
//       const columnName = element.column_name || element.name || element.field_name || `column_${index}`;
//       const dataType = element.data_type || element.type || element.field_type || 'text';
      
//       const mappedType = typeMapping[dataType.toLowerCase()] || dataType;
      
//       const converted = {
//         name: columnName,
//         type: capitalizeFirstLetter(mappedType),
//         originalType: dataType
//       };
      
//       console.log(`Converted element ${index}:`, converted);
//       return converted;
//     });

//     console.log('Final converted data:', converted);
//     return converted;
//   }

//   useEffect(() => {
//     const getTableStructure = async () => {
//       // Only make API call if tableName exists (from route parameter)
//       if (!tableName) {
//         console.log('No tableName provided in route');
//         return;
//       }

//       setLoading(true);
//       setError('');

//       try {
//         console.log('Fetching table structure for:', tableName);
//         console.log('Schema name:', schema_name);
        
//         // API call to get table structure
//         const response = await axios.get(
//           `${import.meta.env.VITE_APP_BASE_URL}/data/getTableColumns?schemaName=${schema_name}&tableName=${tableName}`
//         );

//         console.log('Full API Response:', response);
//         console.log('Response data:', response.data);

//         // Handle different possible response formats
//         let tableData;
//         if (response.data && response.data.success && response.data.data) {
//           tableData = response.data.data;
//         } else if (response.data && Array.isArray(response.data)) {
//           tableData = response.data;
//         } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
//           tableData = response.data.data;
//         } else {
//           console.error('Unexpected response format:', response.data);
//           throw new Error('Unexpected response format from API');
//         }

//         console.log('Table data to convert:', tableData);

//         if (tableData && Array.isArray(tableData) && tableData.length > 0) {
//           const convertedData = convertWithMapping(tableData);
//           console.log('Converted data:', convertedData);
          
//           setActualData(convertedData);
//           setTitle(tableName); // Set the table name as title
          
//           dispatch(setDynamicData({
//             tableName : convertedData
//           }));

//           console.log('Table structure loaded successfully:', convertedData);
//         } else {
//           console.warn('No table data found or empty array');
//           throw new Error('No columns found in table');
//         }
//       } catch (err) {
//         console.error('Error fetching table structure:', err);
//         console.error('Error details:', err.response?.data);
        
//         let errorMessage = `Failed to load table structure for "${tableName}".`;
//         if (err.response?.status === 404) {
//           errorMessage += ' Table not found.';
//         } else if (err.response?.status === 403) {
//           errorMessage += ' Access denied.';
//         } else if (err.message) {
//           errorMessage += ` Error: ${err.message}`;
//         } else {
//           errorMessage += ' Please check if the table exists.';
//         }
        
//         setError(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     getTableStructure();
//   }, [tableName, schema_name, dispatch]);

//   const handleCustomFieldChange = (index, key, value) => {
//     const updated = [...customFields];
//     updated[index][key] = value;
//     setCustomFields(updated);
//   };

//   const addField = () => {
//     setCustomFields([...customFields, { name: '', type: 'Text', label: '', defaultValue: '' }]);
//   };

//   const removeField = (index) => {
//     const updated = customFields.filter((_, i) => i !== index);
//     setCustomFields(updated);
//   };

//   const handleSubmit = async () => {
//     const allFields = [...predefinedFields, ...customFields];
//     const data = { table_name: title, fields: allFields, schema_name, id };
//     console.log('Creating Data Store:', data);
    
//     try {
//       setLoading(true);
//       const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/createTable`, data);
//       alert("Form submitted successfully!");
//       console.log(res);
//       // setShowDialog(0); // Close the dialog after successful submission
//     } catch (error) {
//       console.error("Creation failed:", error);
//       alert("Creation failed! Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show loading state
//   if (loading) {
//     return (
//       <Card className="w-full max-w-4xl mx-auto shadow-md">
//         <CardContent className="flex items-center justify-center py-12">
//           <Loader2 className="h-8 w-8 animate-spin mr-2" />
//           <span>Loading table structure...</span>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full max-w-4xl mx-auto shadow-md">
//       <CardHeader className="pb-4 border-b">
//         <div className="flex items-center gap-2">
//           <Database className="h-5 w-5 text-[#4285B4]" />
//           <CardTitle>
//             {tableName ? `Table Structure: ${tableName}` : 'New Data Store'}
//           </CardTitle>
//         </div>
//         <CardDescription>
//           {tableName 
//             ? `Viewing structure and configuration for table "${tableName}"`
//             : 'Configure your task management data store with custom fields'
//           }
//         </CardDescription>
//       </CardHeader>

//       <CardContent className="pt-6">
//         {/* Error Alert */}
//         {error && (
//           <Alert variant="destructive" className="mb-6">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         <div className="space-y-6">
//           {/* Title input */}
//           <div className="space-y-2">
//             <Label htmlFor="title">Data Store Title</Label>
//             <Input
//               id="title"
//               placeholder="Enter Data Store Title"
//               value={title}
//               disabled={!!tableName} // Disable if tableName exists (viewing mode)
//               onChange={(e) => setTitle(e.target.value)}
//               className="max-w-md"
//             />
//             {tableName && (
//               <p className="text-sm text-muted-foreground">
//                 Title is auto-populated from the table name in the URL
//               </p>
//             )}
//           </div>

//           {/* Optional Show in Chat checkbox */}
//           <div className="flex items-center space-x-2">
//             <Checkbox
//               id="showInChat"
//               checked={showInChat}
//               onCheckedChange={setShowInChat}
//             />
//             <Label
//               htmlFor="showInChat"
//               className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//             >
//               Show in Chat Interface
//             </Label>
//           </div>

//           <Separator />

//           {/* Table Structure Section */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-lg font-medium">
//                   {tableName ? 'Current Table Structure' : 'Predefined Fields'}
//                 </h3>
//                 <Badge variant="outline" className="bg-slate-100">
//                   <Lock className="h-3 w-3 mr-1" /> 
//                   {tableName ? 'Existing' : 'Locked'}
//                 </Badge>
//               </div>
//               {tableName && (
//                 <Badge variant="secondary">
//                   {actualData.length} columns
//                 </Badge>
//               )}
//             </div>

//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Field Name</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="w-[50px]"></TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {(actualData.length > 0 ? actualData : predefinedFields).map((field, index) => {
//                     console.log(`Rendering row ${index}:`, field);
//                     return (
//                       <TableRow key={index} className="bg-slate-50/50">
//                         <TableCell className="font-medium text-slate-700">
//                           {field.name || 'Unknown Field'}
//                         </TableCell>
//                         <TableCell className="text-slate-600">
//                           {field.type || 'Unknown Type'}
//                           {field.originalType && field.originalType !== field.type && (
//                             <span className="text-xs text-gray-400 ml-1">
//                               ({field.originalType})
//                             </span>
//                           )}
//                         </TableCell>
//                         <TableCell>
//                           <Badge variant="outline" className="text-xs">
//                             {tableName ? 'Existing' : 'System'}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Lock className="h-3.5 w-3.5 text-slate-400" />
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </div>

//             {tableName && actualData.length === 0 && !loading && (
//               <div className="text-center py-8 border rounded-md bg-red-50 mt-4">
//                 <p className="text-red-600">No table structure found</p>
//                 <p className="text-sm text-red-500 mt-1">
//                   The table "{tableName}" might not exist or you don't have access to it
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Only show custom fields section if not in table viewing mode */}
//           {!tableName && (
//             <>
//               <Separator />

//               {/* Custom Fields Section */}
//               <div>
//                 <h3 className="text-lg font-medium mb-4">Custom Fields</h3>

//                 {customFields.length > 0 ? (
//                   <div className="rounded-md border mb-4">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Field Name</TableHead>
//                           <TableHead>Type</TableHead>
//                           <TableHead>Default Value</TableHead>
//                           <TableHead className="w-[80px]">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {customFields.map((field, index) => (
//                           <TableRow key={index}>
//                             <TableCell>
//                               <Select
//                                 value={field.name}
//                                 onValueChange={(value) => handleCustomFieldChange(index, 'name', value)}
//                               >
//                                 <SelectTrigger className="w-full">
//                                   <SelectValue placeholder="Select Field" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   {columns.map((column) => (
//                                     <SelectItem key={column} value={column}>{column}</SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </TableCell>
//                             <TableCell>
//                               <Select
//                                 value={field.type}
//                                 onValueChange={(value) => handleCustomFieldChange(index, 'type', value)}
//                               >
//                                 <SelectTrigger className="w-full">
//                                   <SelectValue placeholder="Type" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   {fieldTypes.map((type) => (
//                                     <SelectItem key={type} value={type}>{type}</SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                             </TableCell>
//                             <TableCell>
//                               <Input
//                                 placeholder="Default Value"
//                                 value={field.defaultValue}
//                                 onChange={(e) => handleCustomFieldChange(index, 'defaultValue', e.target.value)}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => removeField(index)}
//                                 className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
//                               >
//                                 <X className="h-4 w-4" />
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 ) : (
//                   <div className="text-center py-8 border rounded-md bg-slate-50">
//                     <p className="text-slate-500">No custom fields added yet</p>
//                     <p className="text-sm text-slate-400 mt-1">Click "Add Field" to create custom fields</p>
//                   </div>
//                 )}

//                 <Button
//                   variant="outline"
//                   onClick={addField}
//                   className="gap-2 mt-2"
//                 >
//                   <Plus className="h-4 w-4" /> Add Field
//                 </Button>
//               </div>
//             </>
//           )}
//         </div>
//       </CardContent>

//       <CardFooter className="flex justify-between border-t pt-4 mt-6">
//         <Button
//           variant="outline"
//           onClick={() => setShowDialog && setShowDialog(0)}
//         >
//           {tableName ? 'Back' : 'Cancel'}
//         </Button>
        
//         {/* Only show create button if not in table viewing mode */}
//         {!tableName && (
//           <Button
//             onClick={handleSubmit}
//             className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
//             disabled={!title || loading}
//           >
//             {loading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Save className="h-4 w-4" />
//             )}
//             {loading ? 'Creating...' : 'Create Data Store'}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default CustomReportDataStore;





import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setDynamicData, addDynamicField, setLoading, setError } from '../../features/productMethod/jobStatusSlice';

// Lucide React icons
import {
  Lock,
  Plus,
  X,
  Database,
  Save,
  Loader2,
  AlertCircle
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const fieldTypes = ['Text', 'Number', 'Date', 'Boolean'];

// Predefined system fields (locked)
const predefinedFields = [
  { name: 'id', type: 'Text', defaultValue: 'Auto', locked: true },
  { name: 'us_id', type: 'Text', locked: true },
];

const CustomReportDataStore = ({ setShowDialog, columnFields = [] }) => {
  const { tableName } = useParams(); // Get tableName from route parameter
  
  const [showCaptureWebhook, setShowCaptureWebhook] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [showInChat, setShowInChat] = useState(false);
  const user = useSelector((state) => state.user);
  const id = user.id;
  const schema_name = user.schema_name;
  const [columns, setColumns] = useState(columnFields || []);
  
  const [actualData, setActualData] = useState([]);

  // Debug logs
  console.log('columnFields prop:', columnFields);
  console.log('columns state:', columns);

  function capitalizeFirstLetter(str) {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const convertWithMapping = (message) => {
    console.log('Input data for conversion:', message);
    
    const typeMapping = {
      'character varying': 'text',
      'text': 'text',
      'character': 'text',
      'timestamp with time zone': 'timestamp',
      'timestamp without time zone': 'timestamp',
      'integer': 'number',
      'bigint': 'number',
      'boolean': 'boolean',
      'ARRAY': 'array'
    };

    // Handle different possible data formats
    let dataToConvert = message;
    if (message && message.data) {
      dataToConvert = message.data;
    }

    if (!Array.isArray(dataToConvert)) {
      console.error('Data is not an array:', dataToConvert);
      return [];
    }

    const converted = dataToConvert.map((element, index) => {
      console.log(`Converting element ${index}:`, element);
      
      // Handle different possible column name properties
      const columnName = element.column_name || element.name || element.field_name || `column_${index}`;
      const dataType = element.data_type || element.type || element.field_type || 'text';
      
      const mappedType = typeMapping[dataType.toLowerCase()] || dataType;
      
      const converted = {
        name: columnName,
        type: capitalizeFirstLetter(mappedType),
        originalType: dataType
      };
      
      console.log(`Converted element ${index}:`, converted);
      return converted;
    });

    console.log('Final converted data:', converted);
    return converted;
  }

  // FIXED: Update columns state when columnFields prop changes
  useEffect(() => {
    console.log('columnFields updated:', columnFields);
    if (columnFields && columnFields.length > 0) {
      setColumns(columnFields);
    }
  }, [columnFields]);

  useEffect(() => {
    const getTableStructure = async () => {
      // If columnFields are provided as props, use them instead of making API call
      if (columnFields && columnFields.length > 0) {
        console.log('Using provided columnFields:', columnFields);
        setColumns(columnFields);
        return;
      }

      // Only make API call if tableName exists (from route parameter) and no columnFields provided
      if (!tableName) {
        console.log('No tableName provided in route and no columnFields');
        return;
      }

      setLoading(true);
      setError('');

      try {
        console.log('Fetching table structure for:', tableName);
        console.log('Schema name:', schema_name);
        
        // API call to get table structure
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BASE_URL}/data/getTableColumns?schemaName=${schema_name}&tableName=${tableName}`
        );

        console.log('Full API Response:', response);
        console.log('Response data:', response.data);

        // Handle different possible response formats
        let tableData;
        if (response.data && response.data.success && response.data.data) {
          tableData = response.data.data;
        } else if (response.data && Array.isArray(response.data)) {
          tableData = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          tableData = response.data.data;
        } else {
          console.error('Unexpected response format:', response.data);
          throw new Error('Unexpected response format from API');
        }

        console.log('Table data to convert:', tableData);

        if (tableData && Array.isArray(tableData) && tableData.length > 0) {
          const convertedData = convertWithMapping(tableData);
          console.log('Converted data:', convertedData);
          
          setActualData(convertedData);
          setTitle(tableName); // Set the table name as title
          
          dispatch(setDynamicData({
            tableName : convertedData
          }));

          console.log('Table structure loaded successfully:', convertedData);
        } else {
          console.warn('No table data found or empty array');
          throw new Error('No columns found in table');
        }
      } catch (err) {
        console.error('Error fetching table structure:', err);
        console.error('Error details:', err.response?.data);
        
        let errorMessage = `Failed to load table structure for "${tableName}".`;
        if (err.response?.status === 404) {
          errorMessage += ' Table not found.';
        } else if (err.response?.status === 403) {
          errorMessage += ' Access denied.';
        } else if (err.message) {
          errorMessage += ` Error: ${err.message}`;
        } else {
          errorMessage += ' Please check if the table exists.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getTableStructure();
  }, [tableName, schema_name, dispatch]); // Removed columnFields from dependencies to avoid infinite loop

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
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/createTable`, data);
      alert("Form submitted successfully!");
      console.log(res);
      // setShowDialog(0); // Close the dialog after successful submission
    } catch (error) {
      console.error("Creation failed:", error);
      alert("Creation failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-md">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading table structure...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#4285B4]" />
          <CardTitle>
            {tableName ? `Table Structure: ${tableName}` : 'New Data Store'}
          </CardTitle>
        </div>
        <CardDescription>
          {tableName 
            ? `Viewing structure and configuration for table "${tableName}"`
            : 'Configure your task management data store with custom fields'
          }
        </CardDescription>
        {/* DEBUG INFO */}
        <div className="text-xs text-gray-500 mt-2">
          Debug: columnFields length: {columnFields?.length || 0}, columns length: {columns?.length || 0}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Title input */}
          <div className="space-y-2">
            <Label htmlFor="title">Data Store Title</Label>
            <Input
              id="title"
              placeholder="Enter Data Store Title"
              value={title}
              disabled={!!tableName} // Disable if tableName exists (viewing mode)
              onChange={(e) => setTitle(e.target.value)}
              className="max-w-md"
            />
            {tableName && (
              <p className="text-sm text-muted-foreground">
                Title is auto-populated from the table name in the URL
              </p>
            )}
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

          {/* Table Structure Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">
                  {tableName ? 'Current Table Structure' : 'Predefined Fields'}
                </h3>
                <Badge variant="outline" className="bg-slate-100">
                  <Lock className="h-3 w-3 mr-1" /> 
                  {tableName ? 'Existing' : 'Locked'}
                </Badge>
              </div>
              {tableName && (
                <Badge variant="secondary">
                  {actualData.length} columns
                </Badge>
              )}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(actualData.length > 0 ? actualData : predefinedFields).map((field, index) => {
                    console.log(`Rendering row ${index}:`, field);
                    return (
                      <TableRow key={index} className="bg-slate-50/50">
                        <TableCell className="font-medium text-slate-700">
                          {field.name || 'Unknown Field'}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {field.type || 'Unknown Type'}
                          {field.originalType && field.originalType !== field.type && (
                            <span className="text-xs text-gray-400 ml-1">
                              ({field.originalType})
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {tableName ? 'Existing' : 'System'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Lock className="h-3.5 w-3.5 text-slate-400" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {tableName && actualData.length === 0 && !loading && (
              <div className="text-center py-8 border rounded-md bg-red-50 mt-4">
                <p className="text-red-600">No table structure found</p>
                <p className="text-sm text-red-500 mt-1">
                  The table "{tableName}" might not exist or you don't have access to it
                </p>
              </div>
            )}
          </div>

          {/* Custom Fields Section - FIXED: Always show this section and use the columns state properly */}
          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-4">Custom Fields</h3>

            {customFields.length > 0 ? (
              <div className="rounded-md border mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Default Value</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customFields.map((field, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={field.name}
                            onValueChange={(value) => handleCustomFieldChange(index, 'name', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Field" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* FIXED: Use columns state which is properly updated */}
                              {columns.map((column) => (
                                <SelectItem key={column} value={column}>{column}</SelectItem>
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
                {/* FIXED: Show debug info */}
                <p className="text-xs text-gray-400 mt-2">
                  Available columns: {columns.length > 0 ? columns.join(', ') : 'None'}
                </p>
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
          onClick={() => setShowDialog && setShowDialog(0)}
        >
          {tableName ? 'Back' : 'Cancel'}
        </Button>
        
        {/* Show create button */}
        <Button
          onClick={handleSubmit}
          className="gap-2 bg-[#4285B4] hover:bg-[#3778b4]"
          disabled={!title || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {loading ? 'Creating...' : 'Create Data Store'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomReportDataStore;