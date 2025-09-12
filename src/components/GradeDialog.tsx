import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  subjectId: string;
  studentName: string;
  subjectName: string;
}

const GradeDialog = ({ open, onOpenChange, studentId, subjectId, studentName, subjectName }: GradeDialogProps) => {
  const { updateStudentGrade, grades } = useAuth();
  const currentGrade = grades.find(g => g.studentId === studentId && g.subjectId === subjectId);
  
  const [obtainedMarks, setObtainedMarks] = useState(currentGrade?.obtainedMarks?.toString() || '');
  const [maxMarks, setMaxMarks] = useState(currentGrade?.maxMarks?.toString() || '100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const obtained = parseFloat(obtainedMarks);
    const max = parseFloat(maxMarks);
    
    if (isNaN(obtained) || isNaN(max) || obtained < 0 || max <= 0 || obtained > max) {
      toast.error('Please enter valid marks');
      return;
    }

    updateStudentGrade(studentId, subjectId, obtained, max);
    toast.success(`Grade updated for ${studentName} in ${subjectName}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Grade</DialogTitle>
          <DialogDescription>
            Update grade for {studentName} in {subjectName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="maxMarks">Maximum Marks</Label>
              <Input
                id="maxMarks"
                type="number"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value)}
                placeholder="100"
                min="1"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="obtainedMarks">Obtained Marks</Label>
              <Input
                id="obtainedMarks"
                type="number"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(e.target.value)}
                placeholder="85"
                min="0"
                max={maxMarks}
                step="0.1"
                required
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Current Grade: {currentGrade ? (currentGrade.grade).toFixed(1) : 'Not graded'}/10
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Grade</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GradeDialog;