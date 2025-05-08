import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const TaskManagementTable = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      task_name: "Review Quarterly Report",
      task_file: null,
      file_name: "",
      file_url: "",
      notes: "Please prioritize this task.",
      assigned_to: "john.doe@example.com",
      assigned_by: "manager@example.com",
      department: "Finance",
      priority: "High",
      status: "Pending",
      due_date: "2025-05-25",
      auditor_date: "2025-05-27",
      completion_date: "2025-05-29",
      rating: "Excellent",
      pending_to_auditor_remarks: "Waiting for approval",
      auditor_to_completed_remarks: "Approved and closed",
      us_id: "a002"
    }
  ]);

  // Function to handle file upload
  const handleFileUpload = (id, file) => {
    // In a real application, this would upload to S3 and return a URL
    // For demo purposes, we'll just store the file name and simulate a URL
    
    if (!file) return;
    
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          task_file: file,
          file_name: file.name,
          file_url: `https://s3.example.com/tasks/${id}/${file.name}`
        };
      }
      return task;
    }));
  };

  // Function to handle input changes
  const handleInputChange = (id, field, value) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return { ...task, [field]: value };
      }
      return task;
    }));
  };

  // Function to add a new row
  const addNewRow = () => {
    if (tasks.length >= 25) {
      alert("Maximum 25 rows allowed");
      return;
    }
    
    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    
    setTasks([...tasks, {
      id: newId,
      task_name: "",
      task_file: null,
      file_name: "",
      file_url: "",
      notes: "",
      assigned_to: "",
      assigned_by: "",
      department: "",
      priority: "Medium",
      status: "Pending",
      due_date: "",
      auditor_date: "",
      completion_date: "",
      rating: "",
      pending_to_auditor_remarks: "",
      auditor_to_completed_remarks: "",
      us_id: ""
    }]);
  };

  // Function to remove a row
  const removeRow = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Function to submit data to backend
  const submitData = () => {
    // Prepare data for backend
    const formattedData = tasks.map(task => ({
      task_name: task.task_name,
      task_file: task.file_name,
      notes: task.notes,
      assigned_to: task.assigned_to,
      assigned_by: task.assigned_by,
      department: task.department,
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
      auditor_date: task.auditor_date,
      completion_date: task.completion_date,
      rating: task.rating,
      pending_to_auditor_remarks: task.pending_to_auditor_remarks,
      auditor_to_completed_remarks: task.auditor_to_completed_remarks,
      us_id: task.us_id,
      file_url: task.file_url
    }));
    
    // In a real application, this would send the data to your backend
    console.log("Submitting data to backend:", formattedData);
    
    // Show success dialog
    setShowSuccessDialog(true);
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Task Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Badge variant="outline" className="text-sm py-1">
              {tasks.length} / 25 Tasks
            </Badge>
            <Button onClick={addNewRow} disabled={tasks.length >= 25}>
              Add New Task
            </Button>
          </div>
          
          <div className="max-h-screen overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-gray-900">
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Task Name</TableHead>
                  <TableHead>File Upload</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>
                      <Input
                        value={task.task_name}
                        onChange={(e) => handleInputChange(task.id, 'task_name', e.target.value)}
                        placeholder="Enter task name"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-2">
                        <Input
                          type="file"
                          onChange={(e) => handleFileUpload(task.id, e.target.files[0])}
                          className="w-full"
                        />
                        {task.file_name && (
                          <Badge variant="secondary" className="w-fit">
                            {task.file_name}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={task.notes}
                        onChange={(e) => handleInputChange(task.id, 'notes', e.target.value)}
                        placeholder="Add notes"
                        className="h-12"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={task.assigned_to}
                        onChange={(e) => handleInputChange(task.id, 'assigned_to', e.target.value)}
                        placeholder="Email"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.department}
                        onValueChange={(value) => handleInputChange(task.id, 'department', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.priority}
                        onValueChange={(value) => handleInputChange(task.id, 'priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(value) => handleInputChange(task.id, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Under Review">Under Review</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Input
                          type="date"
                          value={task.due_date}
                          onChange={(e) => handleInputChange(task.id, 'due_date', e.target.value)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeRow(task.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setTasks([])}>
            Clear All
          </Button>
          <Button onClick={submitData}>
            Submit All Tasks
          </Button>
        </CardFooter>
      </Card>

      {/* Advanced Task Details Modal (could be expanded) */}
      
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              Your tasks have been successfully submitted to the backend.
              {tasks.length} task(s) processed and data sent for database insertion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskManagementTable;