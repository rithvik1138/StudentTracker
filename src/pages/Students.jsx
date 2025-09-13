import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, UserX, Edit } from 'lucide-react';
import StudentDialog from '@/components/StudentDialog';

const Students = () => {
  const { user, users, removeStudent } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  if (user?.role === 'student') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">You don't have permission to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const students = users.filter(u => u.role === 'student');

  const handleAddStudent = () => {
    setEditingStudent(null);
    setDialogOpen(true);
  };

  const handleEditStudent = (student: any) => {
    setEditingStudent(student);
    setDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage students in the system</p>
        </div>
        <Button onClick={handleAddStudent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            Manage students enrolled in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    {student.cgpa !== undefined && (
                      <Badge variant="secondary" className="mt-1">
                        CGPA: {student.cgpa.toFixed(1)}/10
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStudent(student)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStudent(student.id)}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No students found. Add a student to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={editingStudent}
        mode={editingStudent ? 'edit' : 'add'}
      />
    </div>
  );
};

export default Students;