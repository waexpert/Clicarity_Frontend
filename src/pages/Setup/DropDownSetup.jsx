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
import { toast } from 'sonner';

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

    const userData = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const schemaName = userData.schema_name;
    const { tableName } = useParams();
    const [columns, setColumns] = useState([]);
    const [setupData, setSetupData] = useState({});

    // Calculate owner_id based on userData
    const owner_id = userData.owner_id === null ? userData.id : userData.owner_id;

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
                const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
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
    }, [owner_id, tableName]);

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
                owner_id: owner_id,
                product_name: tableName,
                mapping: webhooksByColumn,
                columnOrder: columnOrder,
                webhook_input: webhookInput,
                us_id: `${owner_id}_${tableName}`
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

            toast(setupExists ? 'Setup updated successfully!' : 'Setup created successfully!', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
                     window.location.reload();
        } catch (err) {
            console.error('Error saving setup:', err);

            toast('Error saving setup. Please try again.', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
        } finally {
            setSaving(false);
        }
    };

    const handleSaveProcessTypes = async () => {
        setProcessSaving(true);
        try {
            if (Object.keys(processTypes).length === 0) {


                toast('Please select at least one process type', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
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
                        userSchemaName: userData.schema_name,
                        userTableName: tableName,
                        value: JSON.stringify(processTypes)
                    }
                }
            );


            toast('Process type mapping saved successfully!', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
            
            setFetchedProcessTypes({ ...processTypes });
                     window.location.reload();
        } catch (err) {
            console.error('Error saving process type mapping:', err);
    

            toast(`Error: ${err.response?.data?.error || 'Failed to save process type mapping'}`, {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
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
                        userSchemaName: userData.schema_name,
                        userTableName: tableName,
                        value: JSON.stringify({})
                    }
                }
            );

            setProcessTypes({});
            setFetchedProcessTypes({});
            


            toast('Process type mapping reset successfully!', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
        } catch (err) {
            console.error('Error resetting process type mapping:', err);


            toast(`Error: ${err.response?.data?.error || 'Failed to reset process type mapping'}`, {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
        } finally {
            setResetting(false);
        }
    };

    const handleSaveProcess = async () => {
        setProcessSaving(true);
        try {
            if (!Array.isArray(processSteps) || processSteps.length === 0) {
           
                toast('Please enter at least one process step', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
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
                        userSchemaName: userData.schema_name,
                        userTableName: tableName,
                        value: JSON.stringify(processSteps)
                    }
                }
            );

 

            toast('Process steps updated successfully!', {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
            setFetchedProcessSteps([...processSteps]);
                     window.location.reload();
        } catch (err) {
            console.error('Error saving process steps:', err);
     

            toast(`Error: ${err.response?.data?.error || 'Failed to save process steps'}`, {
  description: `Created at ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`
  // ,
  // action: {
  //   label: "Undo",
  //   onClick: () => console.log("Undo"),
  // },
})
        } finally {
            setProcessSaving(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getTableStructure();
            const route = `${import.meta.env.VITE_APP_BASE_URL}/reference/setup/check?owner_id=${owner_id}&product_name=${tableName}`;
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
                                {processSteps.filter(e=> !e.includes("form_")).map((step, index) => (
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