import { useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookOpen, User, Plus, Trash2, UserPlus, UserMinus } from 'lucide-react';
import SubjectDialog from '@/components/SubjectDialog.jsx';
import StudentDialog from '@/components/StudentDialog.jsx';

const Subjects = () => {
  const { user, subjects, removeSubject, users, removeStudent, getStudentGrade } = useAuth();
  const [subjectDialog, setSubjectDialog] = useState({
    open: false,
    mode: 'add'
  });
  const [studentDialog, setStudentDialog] = useState({
    open: false,
    mode: 'add'
  });

  const students = users.filter(u => u.role === 'student');

  const getGradeColor = (grade) => {
    if (grade >= 9.5) return 'bg-success text-success-foreground';
    if (grade >= 8.5) return 'bg-primary text-primary-foreground';
    if (grade >= 7.5) return 'bg-warning text-warning-foreground';
    if (grade >= 6.0) return 'bg-secondary text-secondary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {user?.role === 'student' ? 'My Subjects' : 'Subject Management'}
          </h2>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'View your enrolled subjects and performance'
              : 'Manage subjects and student enrollments'
            }
          </p>
        </div>
        {user?.role !== 'student' && (
          <div className="flex gap-2">
            <Button onClick={() => setSubjectDialog({ open: true, mode: 'add' })}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
            <Button variant="outline" onClick={() => setStudentDialog({ open: true, mode: 'add' })}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const studentGrade = user?.role === 'student' ? getStudentGrade(user?.id || '', subject.id) : null;
          return (
            <Card key={subject.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                    </div>
                  </div>
                  {user?.role === 'student' && studentGrade && (
                    <Badge className={getGradeColor(studentGrade)}>
                      {studentGrade.toFixed(1)}/10
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="w-4 h-4 mr-2" />
                  <span>Teacher: {subject.teacher}</span>
                </div>

                {user?.role === 'student' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Grade:</span>
                      <span className="font-medium text-foreground">
                        {studentGrade ? studentGrade.toFixed(1) : 'Not graded'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-success">Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSubjectDialog({ open: true, subject, mode: 'edit' })}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{subject.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeSubject(subject.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {user?.role !== 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>
              Manage students in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    {student.cgpa && (
                      <p className="text-sm text-muted-foreground">CGPA: {student.cgpa}/10</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setStudentDialog({ open: true, student, mode: 'edit' })}
                    >
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Student</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to remove "{student.name}" from the system? This will also remove all their attendance records.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeStudent(student.id)}>
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <SubjectDialog
        open={subjectDialog.open}
        onOpenChange={(open) => setSubjectDialog({ ...subjectDialog, open })}
        subject={subjectDialog.subject}
        mode={subjectDialog.mode}
      />

      <StudentDialog
        open={studentDialog.open}
        onOpenChange={(open) => setStudentDialog({ ...studentDialog, open })}
        student={studentDialog.student}
        mode={studentDialog.mode}
      />
    </div>
  );
};

export default Subjects;