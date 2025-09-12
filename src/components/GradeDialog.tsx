import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  
  const [selectedGrade, setSelectedGrade] = useState(currentGrade?.grade?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGrade) {
      toast.error('Please select a grade');
      return;
    }

    const grade = parseFloat(selectedGrade);
    if (grade < 1 || grade > 10) {
      toast.error('Grade must be between 1 and 10');
      return;
    }

    updateStudentGrade(studentId, subjectId, grade, 10);
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
              <Label htmlFor="grade">Grade (1-10)</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a grade" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      {grade}/10
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Current Grade: {currentGrade ? currentGrade.grade.toFixed(1) : 'Not graded'}/10
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