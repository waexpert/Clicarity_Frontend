// Previously working code 31-10-2025


// import React, { useEffect, useState } from 'react';
// import TagInput from '../../components/setup/TagInput';
// import { useDispatch, useSelector } from 'react-redux';
// import { data, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { setDynamicData } from '../../features/dataMethod/tableStructureSlice';
// import { Button } from '../../components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
// import { Badge } from '../../components/ui/badge';
// import { Separator } from '../../components/ui/separator';
// import { Input } from '../../components/ui/input';
// import { Loader2, Settings, Save, Plus, RefreshCw, Database, Info, ArrowUpDown } from 'lucide-react';


// const DropDownSetup = () => {
//     const [webhooksByColumn, setWebhooksByColumn] = useState({});
//     const [columnOrder, setColumnOrder] = useState({}); // New state for column ordering
//     const [setupExists, setSetupExists] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [processSaving, setProcessSaving] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [processSteps, setProcessSteps] = useState([]); 
//     const [fetchedProcessSteps, setFetchedProcessSteps] = useState([]);

//     const user = useSelector((state) => state.user);
//     const dispatch = useDispatch();
//     const schemaName = user.schema_name;
//     const { tableName } = useParams();
//     const [columns, setColumns] = useState([]);
//     var [data, setData] = useState({});
//     console.log(webhooksByColumn);
//     console.log('Column Order:', columnOrder);

// useEffect(() => {
//     const fetchData = async () => {
//         const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
//         const { data } = await axios.get(route);
//         setData(data.setup);
//         setFetchedProcessSteps(data.setup?.process_steps || []);
//         setProcessSteps(data.setup?.process_steps || []);
//         console.log('Fetched setup data:', data.setup);
//         console.log('Fetched process steps:', data.setup?.process_steps || []);
//     };

//     fetchData();
// }, [user.id, tableName]); 

//     const checkSetupExists = async () => {
//         try {
//             const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
//             const { data } = await axios.get(route);

//             console.log('Setup check response:', data); // Debug log

//             if (data.exists && data.setup) {
//                 setSetupExists(true);
//                 // Populate the webhook fields with existing data
//                 if (data.setup.mapping) {
//                     setWebhooksByColumn(data.setup.mapping);
//                     console.log('Loaded mapping:', data.setup.mapping);
//                 }
//                 // Populate column order if exists
//                 if (data.setup.columnOrder) {
//                     setColumnOrder(data.setup.columnOrder);
//                     console.log('Loaded columnOrder:', data.setup.columnOrder);
//                 } else {
//                     console.log('No columnOrder found in setup');
//                 }
//             } else {
//                 setSetupExists(false);
//                 console.log('No setup exists');
//             }
//         } catch (err) {
//             console.error('Error checking setup:', err);
//             setSetupExists(false);
//         }
//     };

//     const getTableStructure = async () => {
//         const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getTableColumns?schemaName=${schemaName}&tableName=${tableName}`;
//         try {
//             const { data } = await axios.get(route);
//             dispatch(setDynamicData({
//                 table: tableName,
//                 columns: data.data
//             }));
//             setColumns(data.data);

//             // Initialize empty array for each column if setup doesn't exist
//             if (!setupExists) {
//                 const initialWebhookState = {};
//                 const initialOrderState = {};
//                 data.data.forEach((col) => {
//                     initialWebhookState[col.name] = [];
//                     // ENSURE: Set default order as 0 for ALL columns
//                     initialOrderState[col.name] = 0;
//                 });

//                 console.log('Initializing with order state:', initialOrderState); // Debug log

//                 setWebhooksByColumn(prev => ({ ...initialWebhookState, ...prev }));
//                 setColumnOrder(prev => ({ ...initialOrderState, ...prev }));
//             } else {
//                 console.log('Setup exists, not initializing default values');
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleSaveSetup = async () => {
//         setSaving(true);
//         try {
//             // NO DUPLICATE VALIDATION - just save directly
//             const payload = {
//                 owner_id: user.id,
//                 product_name: tableName,
//                 mapping: webhooksByColumn,
//                 columnOrder: columnOrder
//             };

//             console.log('Saving payload:', payload);

//             const route = setupExists
//                 ? `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/update`
//                 : `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/create`;

//             const method = setupExists ? 'PUT' : 'POST';

//             const response = await axios({
//                 method,
//                 url: route,
//                 data: payload,
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log('Save response:', response.data);

//             await checkSetupExists();

//             alert(setupExists ? 'Setup updated successfully!' : 'Setup created successfully!');
//         } catch (err) {
//             console.error('Error saving setup:', err);
//             console.error('Error response:', err.response?.data);
//             alert('Error saving setup. Please try again.');
//         } finally {
//             setSaving(false);
//         }
//     };

// const handleSaveProcess = async () => {
//     setProcessSaving(true);
//     try {

//         // const uniqueSteps = processSteps.filter(item => !fetchedProcessSteps.includes(item));
//         // console.log('Unique Steps to be added:', uniqueSteps);


//         if (!processSteps || processSteps.length === 0) {
//             alert('Please enter at least one process step');
//             setProcessSaving(false);
//             return;
//         }

//         console.log('Data', data);
//         const response = await axios.get(
//             `${import.meta.env.VITE_APP_BASE_URL}/data/updateRecord`,
//             {
//                 params: {
//                     schemaName: 'public',
//                     tableName: 'dropdown_setup',
//                     recordId: data.id,
//                     ownerId: data.owner_id,
//                     columnName: 'process_steps',
//                     value: JSON.stringify(processSteps) 
//                 }
//             }
//         );

//         alert('Process steps updated successfully!');
//         console.log("json stringify",JSON.stringify(processSteps) );

//     } catch (err) {
//         console.error('Error saving process steps:', err);
//         alert(`Error: ${err.response?.data?.error || 'Failed to save process steps'}`);
//     } finally {
//         setProcessSaving(false);
//     }
// };

//     const handleRefresh = async () => {
//         setRefreshing(true);
//         try {
//             await checkSetupExists();
//             await getTableStructure();
//         } catch (err) {
//             console.error('Error refreshing:', err);
//         } finally {
//             setRefreshing(false);
//         }
//     };

//     // Function to auto-fix duplicate order values
//     const autoFixDuplicateOrders = () => {
//         const orderEntries = Object.entries(columnOrder).filter(([_, order]) => order && order !== '');
//         const orderCounts = {};
//         const duplicates = [];

//         // Find duplicates
//         orderEntries.forEach(([column, order]) => {
//             if (orderCounts[order]) {
//                 orderCounts[order].push(column);
//             } else {
//                 orderCounts[order] = [column];
//             }
//         });

//         // Identify duplicates
//         Object.entries(orderCounts).forEach(([order, columns]) => {
//             if (columns.length > 1) {
//                 duplicates.push(...columns.slice(1)); // Keep first, mark others as duplicates
//             }
//         });

//         if (duplicates.length > 0) {
//             const newColumnOrder = { ...columnOrder };
//             let nextAvailableOrder = Math.max(...Object.values(columnOrder).filter(v => v && v !== '')) + 1;

//             duplicates.forEach(column => {
//                 newColumnOrder[column] = nextAvailableOrder;
//                 nextAvailableOrder++;
//             });

//             setColumnOrder(newColumnOrder);
//             alert(`Fixed ${duplicates.length} duplicate order values. Check the updated order numbers.`);
//         } else {
//             alert('No duplicate order values found.');
//         }
//     };

//     const handleOrderChange = (columnName, newOrder) => {
//         const orderValue = newOrder === '' ? 0 : parseInt(newOrder) || 0;

//         // NO VALIDATION - just set the value
//         setColumnOrder(prev => ({
//             ...prev,
//             [columnName]: orderValue
//         }));
//     };
//     const filteredColumns = columns.filter(
//         obj =>
//             obj.name !== "id" &&
//             // obj.name !== "us_id" &&
//             !obj.name.endsWith("_date") &&
//             !obj.name.endsWith("_comment")
//     );

//     // Sort columns by order number, then alphabetically for columns without order
//     const sortedColumns = [...filteredColumns].sort((a, b) => {
//         const orderA = columnOrder[a.name] || 0;
//         const orderB = columnOrder[b.name] || 0;

//         // If both have order 0 (no order set), sort alphabetically
//         if (orderA === 0 && orderB === 0) {
//             return a.name.localeCompare(b.name);
//         }

//         // If one has order 0, it goes to the end
//         if (orderA === 0) return 1;
//         if (orderB === 0) return -1;

//         // Both have order numbers, sort by order
//         if (orderA !== orderB) {
//             return orderA - orderB;
//         }

//         // If orders are the same, sort alphabetically
//         return a.name.localeCompare(b.name);
//     });

//     // Split sorted columns into two arrays for two-column layout
//     const midPoint = Math.ceil(sortedColumns.length / 2);
//     const leftColumns = sortedColumns.slice(0, midPoint);
//     const rightColumns = sortedColumns.slice(midPoint);

//     useEffect(() => {
//         const initializeData = async () => {
//             setLoading(true);
//             await checkSetupExists();
//             await getTableStructure();
//             setLoading(false);
//         };

//         initializeData();
//     }, [tableName]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <Loader2 className="h-8 w-8 animate-spin" />
//                 <span className="ml-2">Loading setup...</span>
//             </div>
//         );
//     }

//     const ColumnCard = ({ columns, title }) => (
//         <Card className="h-fit">
//             <CardHeader className="pb-4">
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                     <Database className="h-5 w-5 text-blue-600" />
//                     {title}
//                 </CardTitle>
//                 <CardDescription className="text-sm">
//                     Configure dropdown values and display order for these columns
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 {columns.length === 0 ? (
//                     <div className="text-center py-4 text-gray-500">
//                         <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                         <p className="text-sm">No columns in this section</p>
//                     </div>
//                 ) : (
//                     columns.map(obj => (
//                         <div key={obj.name} className="space-y-3 p-4 bg-gray-50 rounded-lg border">
//                             <div className="flex items-center gap-2 justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <h4 className="font-medium text-gray-700 capitalize text-sm">
//                                         {obj.name.replace(/_/g, ' ')}
//                                     </h4>
//                                     <Badge variant="outline" className="text-xs h-5">
//                                         {obj.type}
//                                     </Badge>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <ArrowUpDown className="h-4 w-4 text-gray-400" />
//                                     <Input
//                                         type="number"
//                                         min="0"
//                                         max="999"
//                                         placeholder="0"
//                                         value={columnOrder[obj.name] === 0 ? '' : columnOrder[obj.name] || ''}
//                                         onChange={(e) => handleOrderChange(obj.name, e.target.value)}
//                                         className="w-16 h-8 text-xs text-center"
//                                         title="Set display order (0 = no order, 1 = first, 2 = second, etc.)"
//                                     />
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <label className="text-xs font-medium text-gray-600">
//                                     Dropdown Values:
//                                 </label>
//                                 <TagInput
//                                     webhooks={webhooksByColumn[obj.name] || []}
//                                     setWebhooks={(newTags) =>
//                                         setWebhooksByColumn(prev => ({
//                                             ...prev,
//                                             [obj.name]: newTags
//                                         }))
//                                     }
//                                     disabled={saving}
//                                     placeholder={`Add values for ${obj.name}..`}
//                                 />
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </CardContent>
//         </Card>
//     );


//     return (
//         <div className=" mx-[6rem]">
//             {/* Header Section */}
//             <div className="mb-6">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         {/* <Settings className="h-8 w-8 text-blue-600" /> */}
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-700">Dropdown Setup</h1>
//                             <p className="text-gray-600 mt-1">Configure dropdown values and display order for <span className="font-semibold text-blue-600">{tableName}</span></p>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <Badge
//                             variant={setupExists ? "default" : "secondary"}
//                             className="text-sm px-3 py-1"
//                         >
//                             {setupExists ? "✓ Configured" : "Not Configured"}
//                         </Badge>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={handleRefresh}
//                             disabled={refreshing}
//                             className="flex items-center gap-2"
//                         >
//                             <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//                             Refresh
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             <Separator className="mb-6" />

//             {/* Two Column Layout */}
//             {filteredColumns.length === 0 ? (
//                 <Card>
//                     <CardContent className="text-center py-12">
//                         <Settings className="h-16 w-16 mx-auto mb-4 opacity-30" />
//                         <h3 className="text-lg font-medium text-gray-700 mb-2">No configurable columns found</h3>
//                         <p className="text-gray-500">This table doesn't have any columns that can be configured for dropdowns.</p>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                     <ColumnCard
//                         columns={leftColumns}
//                         title={`Columns 1-${leftColumns.length} (Ordered)`}
//                     />
//                     <ColumnCard
//                         columns={rightColumns}
//                         title={`Columns ${leftColumns.length + 1}-${filteredColumns.length} (Ordered)`}
//                     />
//                 </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex justify-between items-center mb-6">
//                 <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Info className="h-4 w-4" />
//                         <span>Total configurable columns: <strong>{filteredColumns.length}</strong></span>
//                     </div>
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={autoFixDuplicateOrders}
//                         className="flex items-center gap-2"
//                         title="Auto-fix feature has been disabled"
//                         disabled
//                     >
//                         <ArrowUpDown className="h-4 w-4" />
//                         Fix Duplicates (Disabled)
//                     </Button>
//                 </div>
//                 <Button
//                     onClick={handleSaveSetup}
//                     disabled={saving || filteredColumns.length === 0}
//                     className="flex items-center gap-2 min-w-32 h-10"
//                     size="lg"
//                 >
//                     {saving ? (
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : setupExists ? (
//                         <Save className="h-4 w-4" />
//                     ) : (
//                         <Plus className="h-4 w-4" />
//                     )}
//                     {saving ? 'Saving...' : setupExists ? 'Update Setup' : 'Create Setup'}
//                 </Button>
//             </div>

//             {/* Debug Section - Remove in production */}
//             {/* <Card className="mb-6 bg-gray-50 border-gray-200">
//                 <CardContent className="pt-6">
//                     <div className="text-sm">
//                         <h4 className="font-semibold mb-2">Debug Info (Remove in production):</h4>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <h5 className="font-medium mb-1">Column Order Object:</h5>
//                                 <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
//                                     {JSON.stringify(columnOrder, null, 2)}
//                                 </pre>
//                             </div>
//                             <div>
//                                 <h5 className="font-medium mb-1">Webhook Mapping Object:</h5>
//                                 <pre className="bg-white p-2 rounded text-xs overflow-auto max-h-40">
//                                     {JSON.stringify(webhooksByColumn, null, 2)}
//                                 </pre>
//                             </div>
//                         </div>
//                         <div className="mt-2">
//                             <p className="text-xs text-gray-600">
//                                 Column Order entries with values: {Object.entries(columnOrder).filter(([_, v]) => v > 0).length}
//                             </p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card> */}

//             <Card className="mb-6 bg-gray-50 border-gray-200">
//                 <CardContent className="pt-6">
//                     <div className="text-sm">
//                         <h4 className="font-semibold mb-2">Configure Process Steps:</h4>
//                         <div className="space-y-2 flex flex-col">
//                             <label className="text-xs font-medium text-gray-600">
//                                 Dropdown Values:
//                             </label>
//                             {/* <TagInput
//                                 webhooks={webhooksByColumn[obj.name] || []}
//                                 setWebhooks={(newTags) =>
//                                     setWebhooksByColumn(prev => ({
//                                         ...prev,
//                                         [obj.name]: newTags
//                                     }))
//                                 }
//                                 disabled={saving}
//                                 placeholder={`Add all the process names..`}
//                             /> */}

//                             <input type="text"
//                                 className="border border-gray-300 rounded px-3 py-2 w-full"
//                                 value={processSteps}
//                                 placeholder='Enter are values in this formate [process1,process2,process3]'
//                                 onChange={(e) => setProcessSteps(e.target.value)} />
//                             {console.log('Rendering process steps input', processSteps)}


//                         </div>
//                         <Button
//                             onClick={handleSaveProcess}
//                             disabled={saving || filteredColumns.length === 0}
//                             className="flex items-center gap-2 min-w-32 h-10 mt-4" 
//                             size="lg"
//                         >
//                             {saving ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                             ) : setupExists ? (
//                                 <Save className="h-4 w-4" />
//                             ) : (
//                                 <Plus className="h-4 w-4" />
//                             )}
//                             {saving ? 'Saving...' : setupExists ? 'Update Process' : 'Create Setup'}
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default DropDownSetup;



import React, { useEffect, useState } from 'react';
import TagInput from '../../components/setup/TagInput';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setDynamicData } from '../../features/dataMethod/tableStructureSlice';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Input } from '../../components/ui/input';
import { Loader2, Settings, Save, Plus, RefreshCw, Database, Info, ArrowUpDown } from 'lucide-react';
import "../../css/components/CustomTable.css"

const DropDownSetup = () => {
    const [webhooksByColumn, setWebhooksByColumn] = useState({});
    const [columnOrder, setColumnOrder] = useState({});
    const [setupExists, setSetupExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [processSaving, setProcessSaving] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [processSteps, setProcessSteps] = useState([]);
    const [fetchedProcessSteps, setFetchedProcessSteps] = useState([]);
    const processType = ["Fixed", "Dynamic", "Wastage"];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processTypes, setProcessTypes] = useState({});
    const [error, setError] = useState('');
    const [fetchedProcessTypes, setFetchedProcessTypes] = useState({});
    const [resetting, setResetting] = useState(false);
    // Webhook input state
    const [webhookInput, setWebhookInput] = useState('');

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const schemaName = user.schema_name;
    const { tableName } = useParams();
    const [columns, setColumns] = useState([]);
    const [setupData, setSetupData] = useState({});

    console.log(webhooksByColumn);
    console.log('Column Order:', columnOrder);

    const handleNextProcessChange = (stepName, value) => {
        setProcessTypes(prev => ({
            ...prev,
            [stepName]: value
        }));
        if (error) setError("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    useEffect(() => {
        const fetchSetupData = async () => {
            try {
                const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
                const { data } = await axios.get(route);

                console.log('Fetched setup data:', data.setup);
                setWebhookInput(data.setup?.webhook || '');

                if (data.exists && data.setup) {
                    setSetupExists(true);
                    setSetupData(data.setup);

                    const steps = Array.isArray(data.setup?.process_steps)
                        ? data.setup.process_steps
                        : [];
                    setFetchedProcessSteps(steps);
                    setProcessSteps(steps);

                    const typeMapping = data.setup?.process_type_mapping || {};
                    setProcessTypes(typeMapping);
                    setFetchedProcessTypes(typeMapping);

                    if (data.setup.mapping) {
                        setWebhooksByColumn(data.setup.mapping);
                    }
                    if (data.setup.columnOrder) {
                        setColumnOrder(data.setup.columnOrder);
                    }
                } else {
                    setSetupExists(false);
                }
            } catch (err) {
                console.error('Error fetching setup:', err);
                setSetupExists(false);
            }
        };

        fetchSetupData();
    }, [user.id, tableName]);

    const getTableStructure = async () => {
        const route = `${import.meta.env.VITE_APP_BASE_URL}/data/getTableColumns?schemaName=${schemaName}&tableName=${tableName}`;
        try {
            const { data } = await axios.get(route);
            dispatch(setDynamicData({
                table: tableName,
                columns: data.data
            }));
            setColumns(data.data);

            if (!setupExists) {
                const initialWebhookState = {};
                const initialOrderState = {};
                data.data.forEach((col) => {
                    initialWebhookState[col.name] = [];
                    initialOrderState[col.name] = 0;
                });

                setWebhooksByColumn(prev => ({ ...initialWebhookState, ...prev }));
                setColumnOrder(prev => ({ ...initialOrderState, ...prev }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveSetup = async () => {
        setSaving(true);
        try {
            const payload = {
                owner_id: user.id,
                product_name: tableName,
                mapping: webhooksByColumn,
                columnOrder: columnOrder,
                webhook_input: webhookInput
            };

            console.log('Saving payload:', payload);

            const route = setupExists
                ? `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/update`
                : `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/create`;

            const method = setupExists ? 'PUT' : 'POST';

            const response = await axios({
                method,
                url: route,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Save response:', response.data);
            alert(setupExists ? 'Setup updated successfully!' : 'Setup created successfully!');
        } catch (err) {
            console.error('Error saving setup:', err);
            alert('Error saving setup. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProcessTypes = async () => {
        setProcessSaving(true);
        try {
            if (Object.keys(processTypes).length === 0) {
                alert('Please select at least one process type');
                setProcessSaving(false);
                return;
            }

            console.log('Saving process type mapping:', processTypes);

            const response = await axios.get(
                `${import.meta.env.VITE_APP_BASE_URL}/data/updateRecord`,
                {
                    params: {
                        schemaName: 'public',
                        tableName: 'dropdown_setup',
                        recordId: setupData.id,
                        ownerId: setupData.owner_id,
                        columnName: 'process_type_mapping',
                        userSchemaName: user.schema_name,
                        userTableName: tableName,
                        value: JSON.stringify(processTypes)
                    }
                }
            );

            alert('Process type mapping saved successfully!');
            setFetchedProcessTypes({ ...processTypes });
        } catch (err) {
            console.error('Error saving process type mapping:', err);
            alert(`Error: ${err.response?.data?.error || 'Failed to save process type mapping'}`);
        } finally {
            setProcessSaving(false);
        }
    };

    const handleResetProcessTypes = async () => {
        const confirmReset = window.confirm(
            '⚠️ Are you sure you want to reset all process type mappings? This action cannot be undone.'
        );

        if (!confirmReset) return;

        setResetting(true);
        try {
            console.log('Resetting process type mapping...');

            const response = await axios.get(
                `${import.meta.env.VITE_APP_BASE_URL}/data/updateRecord`,
                {
                    params: {
                        schemaName: 'public',
                        tableName: 'dropdown_setup',
                        recordId: setupData.id,
                        ownerId: setupData.owner_id,
                        columnName: 'process_type_mapping',
                        userSchemaName: user.schema_name,
                        userTableName: tableName,
                        value: JSON.stringify({})
                    }
                }
            );

            setProcessTypes({});
            setFetchedProcessTypes({});
            
            alert('Process type mapping reset successfully!');
        } catch (err) {
            console.error('Error resetting process type mapping:', err);
            alert(`Error: ${err.response?.data?.error || 'Failed to reset process type mapping'}`);
        } finally {
            setResetting(false);
        }
    };

    const handleSaveProcess = async () => {
        setProcessSaving(true);
        try {
            if (!Array.isArray(processSteps) || processSteps.length === 0) {
                alert('Please enter at least one process step');
                setProcessSaving(false);
                return;
            }

            console.log('Saving process steps:', processSteps);
            console.log('Setup data:', setupData);

            const response = await axios.get(
                `${import.meta.env.VITE_APP_BASE_URL}/data/updateRecord`,
                {
                    params: {
                        schemaName: 'public',
                        tableName: 'dropdown_setup',
                        recordId: setupData.id,
                        ownerId: setupData.owner_id,
                        columnName: 'process_steps',
                        userSchemaName: user.schema_name,
                        userTableName: tableName,
                        value: JSON.stringify(processSteps)
                    }
                }
            );

            alert('Process steps updated successfully!');
            setFetchedProcessSteps([...processSteps]);
        } catch (err) {
            console.error('Error saving process steps:', err);
            alert(`Error: ${err.response?.data?.error || 'Failed to save process steps'}`);
        } finally {
            setProcessSaving(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getTableStructure();
            const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${user.id}&product_name=${tableName}`;
            const { data } = await axios.get(route);

            if (data.exists && data.setup) {
                setSetupData(data.setup);
                
                const steps = Array.isArray(data.setup?.process_steps)
                    ? data.setup.process_steps
                    : [];
                setFetchedProcessSteps(steps);
                setProcessSteps(steps);

                const typeMapping = data.setup?.process_type_mapping || {};
                setProcessTypes(typeMapping);
                setFetchedProcessTypes(typeMapping);
            }
        } catch (err) {
            console.error('Error refreshing:', err);
        } finally {
            setRefreshing(false);
        }
    };

    const handleOrderChange = (columnName, newOrder) => {
        const orderValue = newOrder === '' ? 0 : parseInt(newOrder) || 0;
        setColumnOrder(prev => ({
            ...prev,
            [columnName]: orderValue
        }));
    };

    const filteredColumns = columns.filter(
        obj =>
            obj.name !== "id" &&
            !obj.name.endsWith("_date") &&
            !obj.name.endsWith("_comment")
    );

    const sortedColumns = [...filteredColumns].sort((a, b) => {
        const orderA = columnOrder[a.name] || 0;
        const orderB = columnOrder[b.name] || 0;

        if (orderA === 0 && orderB === 0) {
            return a.name.localeCompare(b.name);
        }
        if (orderA === 0) return 1;
        if (orderB === 0) return -1;
        if (orderA !== orderB) {
            return orderA - orderB;
        }
        return a.name.localeCompare(b.name);
    });

    const midPoint = Math.ceil(sortedColumns.length / 2);
    const leftColumns = sortedColumns.slice(0, midPoint);
    const rightColumns = sortedColumns.slice(midPoint);

    useEffect(() => {
        const initializeData = async () => {
            setLoading(true);
            await getTableStructure();
            setLoading(false);
        };

        initializeData();
    }, [tableName]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2 text-base">Loading setup...</span>
            </div>
        );
    }

    const ColumnCard = ({ columns, title }) => (
        <Card className="h-fit">
            <CardHeader className="pb-4 px-3 md:px-6">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Database className="h-5 w-5 text-blue-600" />
                    {title}
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">
                    Configure dropdown values and display order for these columns
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-3 md:px-6">
                {columns.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                        <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No columns in this section</p>
                    </div>
                ) : (
                    columns.map(obj => (
                        <div key={obj.name} className="space-y-3 p-3 md:p-4 bg-gray-50 rounded-lg border">
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-700 capitalize text-sm md:text-base">
                                        {obj.name.replace(/_/g, ' ')}
                                    </h4>
                                    <Badge variant="outline" className="text-xs h-5">
                                        {obj.type}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                                    <Input
                                        type="number"
                                        min="0"
                                        max="999"
                                        placeholder="0"
                                        value={columnOrder[obj.name] === 0 ? '' : columnOrder[obj.name] || ''}
                                        onChange={(e) => handleOrderChange(obj.name, e.target.value)}
                                        className="w-16 h-8 text-xs text-center"
                                        title="Set display order (0 = no order, 1 = first, 2 = second, etc.)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs md:text-sm font-medium text-gray-600">
                                    Dropdown Values:
                                </label>
                                <TagInput
                                    webhooks={webhooksByColumn[obj.name] || []}
                                    setWebhooks={(newTags) =>
                                        setWebhooksByColumn(prev => ({
                                            ...prev,
                                            [obj.name]: newTags
                                        }))
                                    }
                                    disabled={saving}
                                    placeholder={`Add values for ${obj.name}..`}
                                />
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );

    return (
        <div className="mx-4 md:mx-24">
            {/* Header Section */}
            <div className="mb-4">
                <div className="flex items-center justify-between gap-4"> 
                    <div className="flex items-center gap-3 ">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-700 ">Dropdown Setup</h1>
                            <p className="text-sm md:text-base text-gray-600 mt-1">
                                Configure dropdown values and display order for{' '}
                                <span className="font-semibold text-blue-600">{tableName}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Badge
                            variant={setupExists ? "default" : "secondary"}
                            className="text-xs md:text-sm px-3 py-1"
                        >
                            {setupExists ? "✓ Configured" : "Not Configured"}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 text-sm"
                        >
                            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                    </div>
                </div>
            </div>

            <Separator className="mb-6" />
            <div className="mb-6">

                <h2 className="text-lg font-medium text-gray-700 mb-2">Add Outgoing Webhook</h2>
                <Input type="text" value={webhookInput} placeholder="Webhook Url" onChange={(e)=> setWebhookInput(e.target.value)} />
            </div>
     

            {/* Columns Grid */}
            {filteredColumns.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12 px-3 md:px-6">
                        <Settings className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">No configurable columns found</h3>
                        <p className="text-sm text-gray-500">This table doesn't have any columns that can be configured for dropdowns.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ColumnCard
                        columns={leftColumns}
                        title={`Columns 1-${leftColumns.length} (Ordered)`}
                    />
                    <ColumnCard
                        columns={rightColumns}
                        title={`Columns ${leftColumns.length + 1}-${filteredColumns.length} (Ordered)`}
                    />
                </div>
            )}

            {/* Save Setup Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                        <Info className="h-4 w-4" />
                        <span>Total configurable columns: <strong>{filteredColumns.length}</strong></span>
                    </div>
                </div>
                <Button
                    onClick={handleSaveSetup}
                    disabled={saving || filteredColumns.length === 0}
                    className="flex items-center gap-2 min-w-32 h-10 text-sm md:text-base"
                    size="lg"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : setupExists ? (
                        <Save className="h-4 w-4" />
                    ) : (
                        <Plus className="h-4 w-4" />
                    )}
                    {saving ? 'Saving...' : setupExists ? 'Update Setup' : 'Create Setup'}
                </Button>
            </div>

            {/* Process Steps Section */}
            <Card className="mb-6 bg-gray-50 border-gray-200">
                <CardContent className="pt-6 px-3 md:px-6">
                    <div className="text-sm md:text-base">
                        <h4 className="text-base md:text-lg font-semibold mb-3 text-gray-700">Configure Process Steps:</h4>
                        <div className="space-y-2 flex flex-col">
                            <label className="text-xs md:text-sm font-medium text-gray-600">
                                Process Steps:
                            </label>
                            <TagInput
                                webhooks={processSteps}
                                setWebhooks={setProcessSteps}
                                disabled={processSaving}
                                placeholder="Add process steps (e.g., artwork, printing, lamination)..."
                            />
                            <p className="text-xs text-gray-500">
                                Current steps: {Array.isArray(processSteps) ? processSteps.join(', ') : 'None'}
                            </p>
                        </div>
                        <Button
                            onClick={handleSaveProcess}
                            disabled={processSaving}
                            className="flex items-center gap-2 min-w-32 h-10 mt-4 text-sm md:text-base"
                            size="lg"
                        >
                            {processSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {processSaving ? 'Saving...' : 'Update Process Steps'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Process Type Mapping Section */}
            <Card className="mb-6 bg-gray-50 border-gray-200">
                <CardContent className="pt-6 px-3 md:px-6">
                    <div className="text-sm md:text-base">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <h4 className="text-base md:text-lg font-semibold text-gray-700">Define Process Type:</h4>
                            {Object.keys(processTypes).length > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleResetProcessTypes}
                                    disabled={resetting || processSaving}
                                    className="flex items-center gap-2 text-sm w-full sm:w-auto"
                                >
                                    {resetting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                    {resetting ? 'Resetting...' : 'Reset All'}
                                </Button>
                            )}
                        </div>

                        {processSteps.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-white rounded border">
                                <Settings className="h-12 w-12 mx-auto mb-2 opacity-30" />
                                <p className="text-sm md:text-base">No process steps defined yet.</p>
                                <p className="text-xs md:text-sm mt-1">Add process steps in the section above first.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {processSteps.map((step, index) => (
                                    <div 
                                        key={index} 
                                        className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center p-3 md:p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
                                    >
                                        <div className="md:min-w-[200px] w-full md:w-auto">
                                            <p className="text-sm md:text-base font-medium text-gray-700 capitalize">
                                                {step.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                        <div className="flex-1 w-full">
                                            <select
                                                id={`process-type-${index}`}
                                                value={processTypes[step] || ''}
                                                onChange={(e) => handleNextProcessChange(step, e.target.value)}
                                                disabled={processSaving || resetting}
                                                className="w-full px-3 md:px-4 py-2 text-sm md:text-base border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <option value="" disabled>
                                                    -- Select Process Type --
                                                </option>
                                                {processType.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {processTypes[step] && (
                                            <Badge variant="default" className="md:ml-2 self-start md:self-center text-xs md:text-sm">
                                                {processTypes[step]}
                                            </Badge>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-4">
                            <Button
                                onClick={handleSaveProcessTypes}
                                disabled={processSaving || resetting || processSteps.length === 0 || Object.keys(processTypes).length === 0}
                                className="flex items-center gap-2 min-w-32 h-10 text-sm md:text-base"
                                size="lg"
                            >
                                {processSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {processSaving ? 'Saving...' : 'Save Process Types'}
                            </Button>

                            {/* Show changes indicator */}
                            {JSON.stringify(processTypes) !== JSON.stringify(fetchedProcessTypes) && (
                                <Badge variant="outline" className="self-center text-xs md:text-sm">
                                    Unsaved changes
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DropDownSetup;