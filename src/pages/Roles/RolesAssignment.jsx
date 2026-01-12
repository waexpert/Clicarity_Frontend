import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserPlus, Trash2, Shield, Users, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function RolesAssignment() {
  const user = useSelector((state) => state.user);
  const schemaName = user?.schema_name;
  const ownerId = user?.id;
  // const ownerId = user?.owner_id || user?.id;
  const [teamMembers, setTeamMembers] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('=== INITIAL LOAD ===');
    console.log('User from Redux:', user);
    console.log('Schema Name:', schemaName);
    console.log('Owner ID:', ownerId);
    
    if (schemaName && ownerId) {
      fetchTeamMembers();
      fetchAvailableRoles();
    } else {
      console.warn('❌ Missing schemaName or ownerId');
      setError('User data not loaded. Please refresh the page.');
    }
  }, [schemaName, ownerId]);

  useEffect(() => {
    console.log('=== MEMBER SELECTION CHANGED ===');
    console.log('Selected Member:', selectedMember);
    
    if (selectedMember) {
      fetchMemberRoles(selectedMember);
    } else {
      setAssignedRoles([]);
    }
  }, [selectedMember]);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!schemaName) {
        throw new Error('User schema not found. Please log in again.');
      }
      
      console.log('📡 Fetching team members for schema:', schemaName);
      
      const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.post(apiUrl, {
        schemaName: schemaName,
        tableName: 'team_member'
      });

      console.log('✅ Team Members Response:', response.data);
      
      const data = response.data.data;
      
      if (!data || data.length === 0) {
        console.warn('⚠️ No team members found');
        setError('No team members found. Please add team members first.');
      } else {
        console.log(`✅ Found ${data.length} team members`);
      }
      
      setTeamMembers(data || []);
    } catch (err) {
      console.error('❌ Error fetching team members:', err);
      let errorMessage = 'Failed to load team members. ';
      
      if (err.response) {
        console.error('Response error:', err.response.data);
        errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
      } else if (err.request) {
        console.error('Request error - no response received');
        errorMessage += 'No response from server. Please check if the server is running.';
      } else {
        console.error('Error:', err.message);
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableRoles = async () => {
    try {
      console.log('📡 Fetching roles...');
      console.log('  Schema:', schemaName);
      console.log('  Owner:', ownerId);
      
      const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/getAllRoles?schemaName=${schemaName}&ownerId=${ownerId}`;
      console.log('  API URL:', route);
      
      const { data } = await axios.get(route);
      console.log('✅ Roles Response:', data);
      
      if (!data.data || data.data.length === 0) {
        console.warn('⚠️ No roles found');
        toast.warning('No roles configured. Please create roles first.');
      } else {
        console.log(`✅ Found ${data.data.length} roles:`, data.data.map(r => ({
          id: r.id,
          name: r.role_name,
          table: r.table_name
        })));
      }
      
      setAvailableRoles(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching roles:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
        toast.error(error.response.data.message || 'Failed to fetch roles');
      }
      setAvailableRoles([]);
    }
  };

  const fetchMemberRoles = async (memberId) => {
    try {
      console.log('📡 Fetching roles for member:', memberId);
      console.log('  Schema:', schemaName);
      
      if (!schemaName) {
        console.error('❌ schemaName is missing');
        toast.error('Schema name is missing');
        setAssignedRoles([]);
        return;
      }
      
      const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/getMemberRoles?teamMemberId=${memberId}&schemaName=${schemaName}`;
      console.log('  API URL:', route);
      
      const { data } = await axios.get(route);
      
      console.log('✅ Member Roles Response:', data);
      console.log('  Data array:', data.data);
      console.log('  Count:', data.count);
      
      if (data.data && data.data.length > 0) {
        console.log(`✅ Found ${data.data.length} assigned roles:`);
        data.data.forEach((role, idx) => {
          console.log(`  ${idx + 1}. ${role.roleName} (ID: ${role.id}, Setup ID: ${role.roleSetupId})`);
        });
      } else {
        console.log('ℹ️ No roles assigned to this member');
      }
      
      setAssignedRoles(data.data || []);
    } catch (error) {
      console.error('❌ Error fetching member roles:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
        toast.error(error.response.data.message || 'Failed to fetch member roles');
      }
      setAssignedRoles([]);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedMember || !selectedRole) {
      toast.error('Please select both team member and role');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        teamMemberId: selectedMember,
        roleSetupId: selectedRole,
        schemaName: schemaName,
        assignedBy: user.email || user.name || 'Unknown'
      };
      
      console.log('📡 Assigning role with payload:', payload);
      
      const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/assignRole`;
      const { data } = await axios.post(route, payload);
      
      console.log('✅ Role assigned:', data);
      toast.success('Role assigned successfully!');
      
      await fetchMemberRoles(selectedMember);
      setSelectedRole('');
    } catch (error) {
      console.error('❌ Error assigning role:', error);
      if (error.response) {
        console.error('Response error:', error.response.data);
        
        if (error.response?.status === 409) {
          toast.error('This role is already assigned to the team member');
        } else {
          toast.error(error.response?.data?.message || 'Failed to assign role');
        }
      } else {
        toast.error('Failed to assign role. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveRole = async (assignmentId) => {
    if (!confirm('Are you sure you want to remove this role?')) return;

    try {
      console.log('📡 Removing role assignment:', assignmentId);
      
      const route = `${import.meta.env.VITE_APP_BASE_URL}/roles/removeRole/${assignmentId}`;
      await axios.delete(route);
      
      console.log('✅ Role removed');
      toast.success('Role removed successfully!');
      
      await fetchMemberRoles(selectedMember);
    } catch (error) {
      console.error('❌ Error removing role:', error);
      toast.error('Failed to remove role. Please try again.');
    }
  };

  const selectedMemberData = teamMembers.find(m => m.id === selectedMember);

  // Filter out already assigned roles
  const unassignedRoles = availableRoles.filter(role => {
    const isAssigned = assignedRoles.some(assigned => assigned.roleSetupId === role.id);
    console.log(`Role ${role.role_name} (${role.id}): ${isAssigned ? 'ASSIGNED' : 'AVAILABLE'}`);
    return !isAssigned;
  });

  console.log('📊 Available Roles:', availableRoles.length);
  console.log('📊 Assigned Roles:', assignedRoles.length);
  console.log('📊 Unassigned Roles:', unassignedRoles.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Team Member Role Assignment</h1>
          <p className="text-slate-600">Manage data access permissions for your team members</p>
        </div>

        {/* Debug Info (Remove in production) */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-xs font-mono">
              Schema: {schemaName || 'N/A'} | Owner: {ownerId || 'N/A'} | 
              Members: {teamMembers.length} | Roles: {availableRoles.length}
            </p>
          </CardContent>
        </Card>

        {/* Show error message if any */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Select Team Member
                </CardTitle>
                <CardDescription>Choose a team member to manage their roles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-member-select">Team Member</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember} disabled={loading}>
                    <SelectTrigger id="team-member-select">
                      <SelectValue placeholder={
                        loading ? "Loading members..." : 
                        teamMembers.length === 0 ? "No members found" :
                        "Select member"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.length === 0 ? (
                        <div className="p-2 text-sm text-slate-500">
                          No team members available
                        </div>
                      ) : (
                        teamMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {member.name || `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed Member'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {member.email || member.phone_number || 'No contact info'}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedMemberData && (
                  <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                    <p className="text-sm font-medium text-slate-900">
                      {selectedMemberData.name || `${selectedMemberData.first_name} ${selectedMemberData.last_name}`}
                    </p>
                    {selectedMemberData.department && (
                      <p className="text-xs text-slate-600">
                        Department: {selectedMemberData.department}
                      </p>
                    )}
                    {selectedMemberData.email && (
                      <p className="text-xs text-slate-600">
                        Email: {selectedMemberData.email}
                      </p>
                    )}
                    <Badge variant="outline" className="mt-2">
                      {selectedMemberData.role || 'member'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedMember && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Assign New Role
                  </CardTitle>
                  <CardDescription>Add a data access role to this member</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="role-select">Available Roles</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger id="role-select">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {unassignedRoles.length === 0 ? (
                          <div className="p-2 text-sm text-slate-500">
                            {availableRoles.length === 0 
                              ? 'No roles configured in system'
                              : 'All roles already assigned'}
                          </div>
                        ) : (
                          unassignedRoles.map(role => (
                            <SelectItem key={role.id} value={role.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{role.role_name}</span>
                                <span className="text-xs text-slate-500">
                                  Table: {role.table_name}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleAssignRole} 
                    disabled={!selectedRole || submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Role
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Assigned Roles */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle>Assigned Roles</CardTitle>
                <CardDescription>
                  {selectedMember 
                    ? `Roles assigned to ${selectedMemberData?.name || 'this member'}`
                    : 'Select a team member to view their assigned roles'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedMember ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-16 w-16 text-slate-300 mb-4" />
                    <p className="text-slate-500">Select a team member to view their roles</p>
                  </div>
                ) : assignedRoles.length === 0 ? (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      No roles assigned yet. Assign a role to control data access for this team member.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {assignedRoles.map((assignment) => (
                      <Card key={assignment.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg text-slate-900">
                                  {assignment.roleName}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  Table: <span className="font-medium">{assignment.tableName}</span>
                                </p>
                              </div>

                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs font-medium text-slate-700 mb-1">
                                    Accessible Columns:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {assignment.columns?.map((col, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {col}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {assignment.conditions && assignment.conditions.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-slate-700 mb-1">
                                      Data Filters:
                                    </p>
                                    <div className="bg-slate-50 p-2 rounded text-xs font-mono space-y-1">
                                      {assignment.conditions.map((cond, idx) => (
                                        <div key={idx} className="flex items-center gap-1">
                                          <span className="text-blue-600">{cond.column}</span>
                                          <span className="text-slate-500">{cond.operator}</span>
                                          <span className="text-green-600">"{cond.value}"</span>
                                          {cond.logicalOperator && (
                                            <span className="text-orange-600 font-semibold ml-2">
                                              {cond.logicalOperator}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                {assignment.assignedBy && (
                                  <span>Assigned by: {assignment.assignedBy}</span>
                                )}
                                {assignment.assignedAt && (
                                  <span>
                                    {new Date(assignment.assignedAt).toLocaleDateString('en-IN', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      timeZone: 'Asia/Kolkata'
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveRole(assignment.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}