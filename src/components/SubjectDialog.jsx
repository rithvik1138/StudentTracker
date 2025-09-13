import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext.jsx';

const SubjectDialog = ({ open, onOpenChange, subject, mode }) => {
  const { addSubject, addAttendance, updateStudentGrade, users } = useAuth();
  const [name, setName] = useState(subject?.name || '');
  const [teacher, setTeacher] = useState(subject?.teacher || 'Narayana');
  const [credits, setCredits] = useState(subject?.credits?.toString() || '4');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const newSubject = {
      id: mode === 'add' ? Date.now().toString() : subject.id,
      name: name.trim(),
      teacher: teacher.trim(),
      credits: parseInt(credits)
    };

    if (mode === 'add') {
      addSubject(newSubject);
      
      // Create default attendance and grade records for all students when adding a new subject
      const students = users.filter(u => u.role === 'student');
      students.forEach(student => {
        // Add default attendance records (5 classes with 80% attendance)
        for (let i = 0; i < 5; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const status = i < 4 ? 'present' : 'absent'; // 4 present, 1 absent = 80%
          
          addAttendance({
            id: `${Date.now()}-${student.id}-${i}`,
            studentId: student.id,
            subject: name.trim(),
            date: date.toISOString().split('T')[0],
            status: status
          });
        }
        
        // Add default grade of 0 for all students in the new subject
        updateStudentGrade(student.id, newSubject.id, 0, 10);
      });
    }
    // Edit functionality would be implemented similarly

    onOpenChange(false);
    setName('');
    setTeacher('Narayana');
    setCredits('4');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Subject' : 'Edit Subject'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Add a new subject to the curriculum'
              : 'Edit the subject information'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
            />
          </div>
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Input
              id="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="Enter teacher name"
            />
          </div>
          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input
              id="credits"
              type="number"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder="4"
              min="1"
              max="10"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {mode === 'add' ? 'Add Subject' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectDialog;