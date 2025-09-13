import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext.jsx';

const StudentDialog = ({ open, onOpenChange, student, mode }) => {
  const { addStudent } = useAuth();
  const [name, setName] = useState(student?.name || '');
  const [email, setEmail] = useState(student?.email || '');
  const [role, setRole] = useState(student?.role || 'student');
  const [cgpa, setCgpa] = useState(student?.cgpa?.toString() || '');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;

    const newStudent = {
      id: mode === 'add' ? Date.now().toString() : student.id,
      name: name.trim(),
      email: email.trim(),
      role,
      cgpa: cgpa ? parseFloat(cgpa) : undefined
    };

    if (mode === 'add') {
      addStudent(newStudent);
    }
    // Edit functionality would be implemented similarly

    onOpenChange(false);
    setName('');
    setEmail('');
    setRole('student');
    setCgpa('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Student' : 'Edit Student'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a new student to the system'
              : 'Edit the student information'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === 'student' && (
            <div>
              <Label htmlFor="cgpa">CGPA</Label>
              <Input
                id="cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="Enter CGPA (0-10)"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !email.trim()}>
            {mode === 'add' ? 'Add Student' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;