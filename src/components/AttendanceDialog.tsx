import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, AttendanceRecord } from '@/context/AuthContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  subject: string;
}

const AttendanceDialog = ({ open, onOpenChange, studentId, studentName, subject }: AttendanceDialogProps) => {
  const { addAttendance } = useAuth();
  const [status, setStatus] = useState<'present' | 'absent' | 'late'>('present');

  const handleSubmit = () => {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId,
      subject,
      date: new Date().toISOString().split('T')[0],
      status
    };

    addAttendance(newRecord);
    onOpenChange(false);
    setStatus('present');
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'present': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'late': return <Clock className="w-4 h-4 text-warning" />;
      case 'absent': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Mark attendance for {studentName} in {subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={(value: 'present' | 'absent' | 'late') => setStatus(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('present')}
                    <span>Present</span>
                  </div>
                </SelectItem>
                <SelectItem value="late">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('late')}
                    <span>Late</span>
                  </div>
                </SelectItem>
                <SelectItem value="absent">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon('absent')}
                    <span>Absent</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Mark Attendance</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;