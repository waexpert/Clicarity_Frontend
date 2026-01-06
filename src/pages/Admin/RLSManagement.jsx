import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Save,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  setupCompleteRLS,
  enableRLS,
  disableRLS,
  createDynamicPolicy,
  listTablePolicies,
  checkRLSStatus,
  getSchemaRLSStatus,
  dropPolicy
} from '../../api/permissionApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';

const RLSManagement = () => {
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('quick-setup');
  const [loading, setLoading] = useState(false);
  const [schemaName, setSchemaName] = useState(user?.schema_name || '');
  const [tableName, setTableName] = useState('');
  const [condition, setCondition] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [policyType, setPolicyType] = useState('combined');
  const [rlsStatus, setRlsStatus] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [schemaTables, setSchemaTables] = useState([]);
  const [expandedPolicy, setExpandedPolicy] = useState(null);

  // Predefined condition templates
  const conditionTemplates = [
    {
      label: 'User Department Match',
      value: 'department = (SELECT department FROM users WHERE email = current_user)',
      description: 'Members can only see records from their department'
    },
    {
      label: 'User Ownership',
      value: 'created_by = (SELECT id FROM users WHERE email = current_user)',
      description: 'Members can only see records they created'
    },
    {
      label: 'User Region Match',
      value: 'region = (SELECT region FROM users WHERE email = current_user)',
      description: 'Members can only see records from their region'
    },
    {
      label: 'Team Match',
      value: 'team_id = (SELECT team_id FROM users WHERE email = current_user)',
      description: 'Members can only see records from their team'
    },
    {
      label: 'Custom Condition',
      value: 'CUSTOM',
      description: 'Write your own PostgreSQL condition'
    }
  ];

  // Fetch RLS status when table changes
  useEffect(() => {
    if (schemaName && tableName) {
      fetchRLSStatus();
      fetchPolicies();
    }
  }, [schemaName, tableName]);

  // Auto-populate schema name from user
  useEffect(() => {
    if (user?.schema_name) {
      setSchemaName(user.schema_name);
    }
  }, [user]);

  const fetchRLSStatus = async () => {
    try {
      const response = await checkRLSStatus(schemaName, tableName);
      setRlsStatus(response);
    } catch (error) {
      console.error('Error fetching RLS status:', error);
    }
  };

  const fetchPolicies = async () => {
    try {
      const response = await listTablePolicies(schemaName, tableName);
      setPolicies(response.policies || []);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setPolicies([]);
    }
  };

  const fetchSchemaStatus = async () => {
    try {
      setLoading(true);
      const response = await getSchemaRLSStatus(schemaName);
      setSchemaTables(response.tables || []);
      toast.success('Schema status loaded');
    } catch (error) {
      toast.error('Failed to load schema status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSetup = async () => {
    if (!schemaName || !tableName) {
      toast.error('Please provide schema name and table name');
      return;
    }

    try {
      setLoading(true);
      const response = await setupCompleteRLS(
        schemaName,
        tableName,
        condition || 'true',
        policyName || `${tableName}_rls_policy`,
        true
      );

      toast.success('RLS Setup Complete!', {
        description: `Row Level Security enabled on ${schemaName}.${tableName}`
      });

      // Refresh status
      await fetchRLSStatus();
      await fetchPolicies();

      // Clear form
      setCondition('');
      setPolicyName('');
    } catch (error) {
      toast.error('Setup Failed', {
        description: error.error || error.message || 'Failed to setup RLS'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnableRLS = async () => {
    if (!schemaName || !tableName) {
      toast.error('Please provide schema name and table name');
      return;
    }

    try {
      setLoading(true);
      await enableRLS(schemaName, tableName, true);
      toast.success('RLS Enabled');
      await fetchRLSStatus();
    } catch (error) {
      toast.error('Failed to enable RLS', {
        description: error.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisableRLS = async () => {
    if (!schemaName || !tableName) {
      toast.error('Please provide schema name and table name');
      return;
    }

    try {
      setLoading(true);
      await disableRLS(schemaName, tableName);
      toast.success('RLS Disabled');
      await fetchRLSStatus();
    } catch (error) {
      toast.error('Failed to disable RLS', {
        description: error.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!schemaName || !tableName || !condition) {
      toast.error('Please provide schema, table, and condition');
      return;
    }

    try {
      setLoading(true);
      await createDynamicPolicy(
        schemaName,
        tableName,
        condition,
        policyName || `${tableName}_policy`,
        policyType
      );

      toast.success('Policy Created');
      await fetchPolicies();
      setCondition('');
      setPolicyName('');
    } catch (error) {
      toast.error('Failed to create policy', {
        description: error.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDropPolicy = async (policyNameToDelete) => {
    try {
      setLoading(true);
      await dropPolicy(schemaName, tableName, policyNameToDelete);
      toast.success('Policy Deleted');
      await fetchPolicies();
    } catch (error) {
      toast.error('Failed to delete policy', {
        description: error.error || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
 <div className="w-[calc(100vw-14rem)] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {/* <Shield className="w-8 h-8 text-primary" /> */}
            <h1 className="text-3xl font-bold text-gray-900">Row Level Security Management</h1>
          </div>
          <p className="text-gray-600">
            Configure dynamic row-level security policies for your database tables
          </p>
        </div>

        {/* Info Banner */}
        {/* <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">How RLS Works in Your System:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li><strong>SuperAdmin:</strong> No restrictions - access all data across all schemas</li>
                  <li><strong>Admin:</strong> Access all data within their own schema</li>
                  <li><strong>Member:</strong> Restricted access based on custom conditions you define</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {['quick-setup', 'manage-policies', 'view-status'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'quick-setup' && 'Quick Setup'}
              {tab === 'manage-policies' && 'Manage Policies'}
              {tab === 'view-status' && 'View Status'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'quick-setup' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick RLS Setup
              </CardTitle>
              <CardDescription>
                Enable RLS and create a policy in one step
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schemaName">Schema Name</Label>
                  <Input
                    id="schemaName"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    placeholder="e.g., company_abc"
                  />
                </div>
                <div>
                  <Label htmlFor="tableName">Table Name</Label>
                  <Input
                    id="tableName"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    placeholder="e.g., employees"
                  />
                </div>
              </div>

              {/* Condition Templates */}
              <div>
                <Label>Condition Template (for Members)</Label>
                <Select onValueChange={(value) => setCondition(value === 'CUSTOM' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a condition template" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionTemplates.map((template) => (
                      <SelectItem key={template.label} value={template.value}>
                        {template.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition">Custom Condition (PostgreSQL)</Label>
                <Textarea
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g., department = (SELECT department FROM users WHERE email = current_user)"
                  rows={3}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to allow all access for members (same as admin)
                </p>
              </div>

              <div>
                <Label htmlFor="policyName">Policy Name (Optional)</Label>
                <Input
                  id="policyName"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder={`${tableName || 'table'}_rls_policy`}
                />
              </div>

              {/* RLS Status Display */}
              {rlsStatus && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {rlsStatus.rlsEnabled ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-900">RLS Enabled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-gray-600">RLS Disabled</span>
                        </>
                      )}
                    </div>
                    <Badge variant={rlsStatus.forceRls ? "default" : "secondary"}>
                      {rlsStatus.forceRls ? 'Forced' : 'Not Forced'}
                    </Badge>
                  </div>
                </div>
              )}

              <Button onClick={handleQuickSetup} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Setup RLS
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'manage-policies' && (
          <div className="space-y-6">
            {/* Enable/Disable RLS */}
            <Card>
              <CardHeader>
                <CardTitle>RLS Controls</CardTitle>
                <CardDescription>Enable or disable Row Level Security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schemaName2">Schema Name</Label>
                    <Input
                      id="schemaName2"
                      value={schemaName}
                      onChange={(e) => setSchemaName(e.target.value)}
                      placeholder="e.g., company_abc"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tableName2">Table Name</Label>
                    <Input
                      id="tableName2"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      placeholder="e.g., employees"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleEnableRLS} disabled={loading} variant="default">
                    <Lock className="w-4 h-4 mr-2" />
                    Enable RLS
                  </Button>
                  <Button onClick={handleDisableRLS} disabled={loading} variant="outline">
                    <Unlock className="w-4 h-4 mr-2" />
                    Disable RLS
                  </Button>
                  <Button onClick={fetchPolicies} disabled={loading} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Create New Policy */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Policy</CardTitle>
                <CardDescription>Add a new RLS policy to the table</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Policy Type</Label>
                  <Select value={policyType} onValueChange={setPolicyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="combined">Combined (All roles in one policy)</SelectItem>
                      <SelectItem value="separate">Separate (Individual policies per role)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="newCondition">Member Condition</Label>
                  <Textarea
                    id="newCondition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    placeholder="e.g., team_id = (SELECT team_id FROM users WHERE email = current_user)"
                    rows={3}
                    className="font-mono text-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="newPolicyName">Policy Name (Optional)</Label>
                  <Input
                    id="newPolicyName"
                    value={policyName}
                    onChange={(e) => setPolicyName(e.target.value)}
                    placeholder={`${tableName || 'table'}_policy`}
                  />
                </div>

                <Button onClick={handleCreatePolicy} disabled={loading}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Policy
                </Button>
              </CardContent>
            </Card>

            {/* Existing Policies */}
            {policies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Existing Policies ({policies.length})</CardTitle>
                  <CardDescription>Manage current RLS policies on this table</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {policies.map((policy, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <button
                                onClick={() =>
                                  setExpandedPolicy(expandedPolicy === index ? null : index)
                                }
                                className="hover:bg-gray-200 rounded p-1"
                              >
                                {expandedPolicy === index ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </button>
                              <h4 className="font-semibold text-gray-900">
                                {policy.policyname}
                              </h4>
                              <Badge variant="outline">{policy.cmd || 'ALL'}</Badge>
                            </div>

                            {expandedPolicy === index && (
                              <div className="ml-8 space-y-2 text-sm">
                                {policy.qual && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      USING Condition:
                                    </span>
                                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                      {policy.qual}
                                    </pre>
                                  </div>
                                )}
                                {policy.with_check && (
                                  <div>
                                    <span className="font-medium text-gray-700">
                                      WITH CHECK:
                                    </span>
                                    <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                      {policy.with_check}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleDropPolicy(policy.policyname)}
                            disabled={loading}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'view-status' && (
          <Card>
            <CardHeader>
              <CardTitle>Schema RLS Status</CardTitle>
              <CardDescription>
                View RLS status for all tables in the schema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="schemaName3">Schema Name</Label>
                  <Input
                    id="schemaName3"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    placeholder="e.g., company_abc"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchSchemaStatus} disabled={loading}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Status
                  </Button>
                </div>
              </div>

              {schemaTables.length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Table Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          RLS Enabled
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Force RLS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {schemaTables.map((table, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {table.tablename}
                          </td>
                          <td className="px-4 py-3">
                            {table.rls_enabled ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="w-3 h-3 mr-1" />
                                Disabled
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {table.force_rls ? (
                              <Badge variant="default">Forced</Badge>
                            ) : (
                              <Badge variant="outline">Not Forced</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {schemaTables.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tables found. Click "View Status" to load schema tables.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RLSManagement;
