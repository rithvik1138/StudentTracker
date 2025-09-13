import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';

const TeacherDialog = ({ teacher, trigger, onSuccess }) => {
  const { subjects, addTeacher, updateTeacher } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: teacher?.name || '',
    email: teacher?.email || '',
    assignedSubjects: teacher?.assignedSubjects || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (teacher) {
      updateTeacher(teacher.id, formData);
    } else {
      const newTeacher = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: 'teacher',
        assignedSubjects: formData.assignedSubjects,
      };
      addTeacher(newTeacher);
    }
    
    setOpen(false);
    onSuccess?.();
    
    // Reset form if adding new teacher
    if (!teacher) {
      setFormData({
        name: '',
        email: '',
        assignedSubjects: [],
      });
    }
  };

  const handleSubjectToggle = (subjectId) => {
    setFormData(prev => ({
      ...prev,
      assignedSubjects: prev.assignedSubjects.includes(subjectId)
        ? prev.assignedSubjects.filter(id => id !== subjectId)
        : [...prev.assignedSubjects, subjectId]
    }));
  };

  const defaultTrigger = (
    <Button size="sm" className="flex items-center gap-2">
      {teacher ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {teacher ? 'Edit Teacher' : 'Add Teacher'}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter teacher name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Assigned Subjects</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    checked={formData.assignedSubjects.includes(subject.id)}
                    onChange={() => handleSubjectToggle(subject.id)}
                    className="rounded border-border"
                  />
                  <Label htmlFor={`subject-${subject.id}`} className="text-sm">
                    {subject.name} ({subject.credits} credits)
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {teacher ? 'Update' : 'Add'} Teacher
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherDialog;