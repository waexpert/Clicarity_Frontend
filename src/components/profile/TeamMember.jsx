import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// Shadcn/UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Icons
import { Edit, Trash2, Plus, User, Search, Loader2, CheckCircle } from 'lucide-react';

// Import your ProfileHeader component
import ProfileHeader from './ProfileHeader';

export default function TeamMember() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    number: '',
    empid: '',
    department: '',
    manager_name: '',
    birthday: ''
  });
  const [addingMember, setAddingMember] = useState(false);

  const userData = useSelector((state) => state.user);

  // Fetch team members from backend using Axios
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if userData and schema_name exist
      if (!userData || !userData.schema_name) {
        throw new Error('User schema not found. Please log in again.');
      }
      
      const schemaName = userData.schema_name;
      console.log('Fetching data for schema:', schemaName);
      
      const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/getAllData`;
      console.log('API URL:', apiUrl);
      
      const response = await axios.post(apiUrl, {
        schemaName: schemaName,
        tableName: 'team_member'
      });

      console.log('Response:', response);
      
      // With Axios, the data is in response.data
      const data = response.data;
      console.log('Fetched team members:', data);
      setTeamMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
      
      // Better error message based on error type
      let errorMessage = 'Failed to load team members. ';
      if (err.response) {
        // Server responded with error status
        errorMessage += `Server error (${err.response.status}): ${err.response.data?.error || err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage += 'Please check if the server is running.';
      } else {
        // Something else happened
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add new team member using Axios
  const handleAddMember = async () => {
    try {
      setAddingMember(true);
      setError('');

      // Check if userData and schema_name exist
      if (!userData || !userData.schema_name) {
        throw new Error('User schema not found. Please log in again.');
      }

      // Generate unique us_id
      const us_id = `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const schemaName = userData.schema_name;
      console.log('Adding member to schema:', schemaName);
      
      const apiUrl = `${import.meta.env.VITE_APP_BASE_URL}/data/createRecord`;
      
      const response = await axios.post(apiUrl, {
        schemaName: schemaName,
        tableName: 'team_member',
        record: {
          ...newMember,
          us_id: us_id
        }
      });

      console.log('Added team member:', response.data);

      // Reset form and close dialog
      setNewMember({
        name: '',
        number: '',
        empid: '',
        department: '',
        manager_name: '',
        birthday: ''
      });
      setOpenAddDialog(false);
      
      // Refresh team members list
      await fetchTeamMembers();
    } catch (err) {
      console.error('Error adding team member:', err);
      
      let errorMessage = 'Failed to add team member. ';
      if (err.response) {
        errorMessage += err.response.data?.error || err.response.statusText;
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setAddingMember(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter(member => 
        member.name?.toLowerCase().includes(query.toLowerCase()) ||
        member.empid?.toLowerCase().includes(query.toLowerCase()) ||
        member.department?.toLowerCase().includes(query.toLowerCase()) ||
        member.number?.includes(query)
      );
      setFilteredMembers(filtered);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Load team members on component mount
  useEffect(() => {
    // Only fetch if userData is available
    if (userData && userData.schema_name) {
      fetchTeamMembers();
    } else {
      setError('User data not available. Please log in again.');
      setLoading(false);
    }
  }, [userData]);

  // Show loading state if userData is not available yet
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading user data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <ProfileHeader />
      

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Add Section */}
      <Card>
        <CardHeader>
                {/* Header Section */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-medium text-slate-800">Team Members</h1>
          <p className="text-sm text-slate-500">Details of team member</p>
        </div>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            
            <div className="flex-1 w-full sm:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, employee ID, department, or phone"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new team member to your database.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="number">Phone Number</Label>
                    <Input
                      id="number"
                      value={newMember.number}
                      onChange={(e) => setNewMember({ ...newMember, number: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="empid">Employee ID</Label>
                    <Input
                      id="empid"
                      value={newMember.empid}
                      onChange={(e) => setNewMember({ ...newMember, empid: e.target.value })}
                      placeholder="Enter employee ID"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newMember.department}
                      onChange={(e) => setNewMember({ ...newMember, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager Name</Label>
                    <Input
                      id="manager"
                      value={newMember.manager_name}
                      onChange={(e) => setNewMember({ ...newMember, manager_name: e.target.value })}
                      placeholder="Enter manager name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      type="date"
                      value={newMember.birthday}
                      onChange={(e) => setNewMember({ ...newMember, birthday: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setOpenAddDialog(false)}
                    disabled={addingMember}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddMember}
                    disabled={addingMember || !newMember.name.trim()}
                  >
                    {addingMember ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Team Members Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Birthday</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading team members...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <User className="h-8 w-8 mb-2" />
                        <p>No team members found.</p>
                        {searchQuery && (
                          <Button 
                            variant="link" 
                            onClick={() => handleSearch('')}
                            className="mt-1"
                          >
                            Clear search
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member, index) => (
                    <TableRow key={member.id || index}>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{member.name || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{member.empid || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{member.number || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge>{member.department || 'General'}</Badge>
                      </TableCell>
                      <TableCell>{member.manager_name || 'N/A'}</TableCell>
                      <TableCell>{formatDate(member.birthday)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              console.log('Edit member:', member);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              console.log('Delete member:', member);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}