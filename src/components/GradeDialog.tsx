import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

interface GradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  subjectId: string;
  studentName: string;
  subjectName: string;
}

const GradeDialog = ({
  open,
  onOpenChange,
  studentId,
  subjectId,
  studentName,
  subjectName,
}: GradeDialogProps) => {
  const { getStudentGrade, updateStudentGrade } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState(
    getStudentGrade(studentId, subjectId) || ''
  );

  const grades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];

  const handleSave = () => {
    if (selectedGrade) {
      updateStudentGrade(studentId, subjectId, selectedGrade);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Grade</DialogTitle>
          <DialogDescription>
            Update the grade for {studentName} in {subjectName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="grade">Grade</Label>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade} value={grade}>
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedGrade}>
            Save Grade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeDialog;