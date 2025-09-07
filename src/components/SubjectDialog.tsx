import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, Subject } from '@/context/AuthContext';

interface SubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  mode: 'add' | 'edit';
}

const SubjectDialog = ({ open, onOpenChange, subject, mode }: SubjectDialogProps) => {
  const { addSubject } = useAuth();
  const [name, setName] = useState(subject?.name || '');
  const [teacher, setTeacher] = useState(subject?.teacher || 'Narayana');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const newSubject: Subject = {
      id: mode === 'add' ? Date.now().toString() : subject!.id,
      name: name.trim(),
      teacher: teacher.trim()
    };

    if (mode === 'add') {
      addSubject(newSubject);
    }
    // Edit functionality would be implemented similarly

    onOpenChange(false);
    setName('');
    setTeacher('Narayana');
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