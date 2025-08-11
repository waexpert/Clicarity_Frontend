import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setDynamicData, addDynamicField, setLoading, setError } from '../../features/productMethod/leadStatusSlice';

// Lucide React icons
import {
  Lock,
  Plus,
  X,
  Database,
  Save,
  RefreshCw,
  Webhook
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
import { Checkbox } from "@/components/ui/checkbox";

const fieldTypes = ['Text', 'Number', 'Date', 'Boolean'];

const PaymentStatusReportDataStore = ({ setShowDialog, columnFields }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('payment_reminders');
  const [showInChat, setShowInChat] = useState(false);
  const [actualData, setActualData] = useState([]);
  const [fieldMappings, setFieldMappings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const user = useSelector((state) => state.user);
  const id = user.id;
  const schema_name = user.schema_name;

  function capitalizeFirstLetter(str) {
    if (!str) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // const convertWithMapping = (message) => {
  //   const typeMapping = {
  //     'character varying': 'Text',
  //     'text': 'Text',
  //     'character': 'Text',
  //     'timestamp with time zone': 'Date',
  //     'integer': 'Number',
  //     'bigint': 'Number',
  //     'boolean': 'Boolean',
  //     'ARRAY': 'Text'
  //   };

  //   const converted = message.map(element => ({
  //     name: element.column_name,
  //     type: capitalizeFirstLetter(typeMapping[element.data_type] || element.data_type),
  //     originalType: element.data_type
  //   }));

  //   return converted;
  // };


  const convertWithMapping = (message) => {
  const typeMapping = {
    'character varying': 'Text',
    'text': 'Text',
    'character': 'Text',
    'timestamp with time zone': 'Date',
    'timestamp without time zone': 'Date',
    'integer': 'Number',
    'bigint': 'Number',
    'boolean': 'Boolean',
    'ARRAY': 'Text'
  };

  const converted = message
    .filter(element => {
      const lowerType = element.data_type.toLowerCase();
      const lowerName = element.column_name.toLowerCase();

      const isTimestamp = lowerType.includes('timestamp');
      const isIdField = lowerName === 'id' || lowerName.endsWith('_id');

      return !isTimestamp && !isIdField;
    })
    .map(element => ({
      name: element.column_name,
      type: capitalizeFirstLetter(typeMapping[element.data_type] || element.data_type),
      originalType: element.data_type
    }));

  return converted;
};



//   const filteredFields = actualData.filter((field) => {
//   const lowerType = field.data_type.toLowerCase();
//   const lowerName = field.column_name.toLowerCase();

//   const isTimestamp = lowerType.includes('timestamp');
//   const isIdField = lowerName.endsWith('_id') || lowerName === 'id';

//   return !isTimestamp && !isIdField;
// });


  useEffect(() => {
    const getTableStructure = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}/secure/getTableStructure`, {
          schemaName: 'public',
          tableName: 'payment_reminders'
        });

        const convertedData = convertWithMapping(data.data);
        setActualData(convertedData);
        
        // Initialize field mappings with database fields
        const initialMappings = convertedData.map(field => ({
          databaseField: field.name,
          databaseType: field.type,
          webhookField: '', // To be selected from columnFields
          defaultValue: '',
          isRequired: false
        }));
        
        setFieldMappings(initialMappings);
        dispatch(setDynamicData({ paymentStatusStructure: convertedData }));
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching table structure:', error);
        dispatch(setError(error.message));
      } finally {
        setIsLoading(false);
      }
    };

    getTableStructure();
  }, [dispatch]);

  const handleMappingChange = (index, key, value) => {
    const updated = [...fieldMappings];
    updated[index][key] = value || ''; // Handle undefined values
    setFieldMappings(updated);
  };

  const handleSubmit = async () => {
    // Validate mappings
    const incompleteMappings = fieldMappings.filter(
      mapping => !mapping.webhookField && mapping.isRequired
    );

    if (incompleteMappings.length > 0) {
      alert('Please map all required fields or mark them as optional');
      return;
    }

    const data = {
      table_name: title,
      schema_name,
      id,
      fieldMappings,
      showInChat
    };

    console.log('Creating Data Store with mappings:', data);

    try {
      setIsLoading(true);
      // Mock API call - replace with actual axios call
      console.log('Creating Data Store with mappings:', data);
      alert("Field mapping saved successfully!");
      setShowDialog(0);
    } catch (error) {
      console.error("Mapping failed:", error);
      alert("Mapping failed! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetMappings = () => {
    const resetMappings = fieldMappings.map(mapping => ({
      ...mapping,
      webhookField: '',
      defaultValue: '',
      isRequired: false
    }));
    setFieldMappings(resetMappings);
  };

  if (isLoading && actualData.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Loading table structure...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-md">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-[#4285B4]" />
          <CardTitle>Field Mapping Configuration</CardTitle>
        </div>
        <CardDescription>
          Map database fields to webhook data fields for payment reminders
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Title and settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Data Store Title</Label>
              <Input
                id="title"
                placeholder="Enter Data Store Title"
                value={title}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="flex items-center space-x-2 self-end">
              <Checkbox
                id="showInChat"
                checked={showInChat}
                onCheckedChange={setShowInChat}
              />
              <Label htmlFor="showInChat" className="text-sm">
                Show in Chat Interface
              </Label>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          {/* Webhook Fields Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Webhook className="h-4 w-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">Available Webhook Fields</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {columnFields && columnFields.length > 0 ? (
                columnFields.map((field, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {field}
                  </Badge>
                ))
              ) : (
                <p className="text-blue-700 text-sm">No webhook fields captured yet. Please capture webhook data first.</p>
              )}
            </div>
          </div>

          {/* Field Mapping Table */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Database Field Mapping</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={resetMappings}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Mappings
              </Button>
            </div>

            {actualData.length > 0 ? (
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium">Database Field</th>
                        <th className="text-left p-3 font-medium">Type</th>
                        <th className="text-left p-3 font-medium">Map to Webhook Field</th>
                        {/* <th className="text-left p-3 font-medium">Default Value</th> */}
                        <th className="text-left p-3 font-medium">Required</th>
                        <th className="text-left p-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fieldMappings.map((mapping, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {mapping.databaseField === 'id' || mapping.databaseField === 'us_id' ? (
                                <Lock className="h-3 w-3 text-gray-400" />
                              ) : null}
                              <span className="font-medium">{mapping.databaseField}</span>
                            </div>
                          </td>
                          
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {mapping.databaseType}
                            </Badge>
                          </td>
                          
                          <td className="p-3">
                            <Select
                              value={mapping.webhookField || undefined} 
                              onValueChange={(value) => handleMappingChange(index, 'webhookField', value)}
                              disabled={mapping.databaseField === 'id'}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select webhook field" />
                              </SelectTrigger>
                              <SelectContent>
                                {columnFields && columnFields
                                  .filter(field => field && field.trim() !== '') // Filter out empty values
                                  .map((field) => (
                                    <SelectItem key={field} value={field}>
                                      {field}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </td>
                          
                          {/* <td className="p-3">
                            <Input
                              placeholder="Default value"
                              value={mapping.defaultValue}
                              onChange={(e) => handleMappingChange(index, 'defaultValue', e.target.value)}
                              className="w-full"
                              disabled={mapping.databaseField === 'id'}
                            />
                          </td>
                           */}
                          {/* <td className="p-3">
                            <Checkbox
                              checked={mapping.isRequired}
                              onCheckedChange={(checked) => handleMappingChange(index, 'isRequired', checked)}
                              disabled={mapping.databaseField === 'id' || mapping.databaseField === 'us_id'}
                            />
                          </td> */}
                          
                          <td className="p-3">
                            {mapping.databaseField === 'id' ? (
                              <Badge className="bg-green-100 text-green-800">Auto</Badge>
                            ) : mapping.webhookField ? (
                              <Badge className="bg-blue-100 text-blue-800">Mapped</Badge>
                            ) : mapping.defaultValue ? (
                              <Badge className="bg-yellow-100 text-yellow-800">Default</Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-500">Unmapped</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md bg-slate-50">
                <Database className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No database fields found</p>
                <p className="text-sm text-slate-400 mt-1">Please check the table structure</p>
              </div>
            )}
          </div>

          {/* Mapping Summary */}
          {fieldMappings.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Mapping Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Fields:</span>
                  <span className="ml-2 font-medium">{fieldMappings.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mapped:</span>
                  <span className="ml-2 font-medium text-blue-600">
                    {fieldMappings.filter(m => m.webhookField).length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">With Defaults:</span>
                  <span className="ml-2 font-medium text-yellow-600">
                    {fieldMappings.filter(m => m.defaultValue && !m.webhookField).length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Unmapped:</span>
                  <span className="ml-2 font-medium text-gray-600">
                    {fieldMappings.filter(m => !m.webhookField && !m.defaultValue && m.databaseField !== 'id').length}
                  </span>
                </div>
              </div>
            </div>
          )}
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
          disabled={!title || isLoading}
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Field Mapping
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentStatusReportDataStore;