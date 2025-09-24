import { useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GradeDialog from '@/components/GradeDialog.jsx';
import { 
  GraduationCap, 
  TrendingUp, 
  BookOpen,
  Award,
  Plus,
  Edit
} from 'lucide-react';

const Grades = () => {
  const { user, subjects, grades, users, getStudentGrade, calculateCGPA } = useAuth();
  const [gradeDialog, setGradeDialog] = useState({
    open: false,
    studentId: '',
    subjectId: '',
    studentName: '',
    subjectName: ''
  });

  const isStudent = user?.role === 'student';
  const canManageGrades = user?.role === 'admin' || user?.role === 'teacher';
  const students = users.filter(u => u.role === 'student');

  const openGradeDialog = (studentId, subjectId, studentName, subjectName) => {
    setGradeDialog({
      open: true,
      studentId,
      subjectId,
      studentName,
      subjectName,
    });
  };

  const closeGradeDialog = () => {
    setGradeDialog(prev => ({ ...prev, open: false }));
  };

  const getGradeColor = (grade) => {
    if (grade >= 9.5) return 'bg-success text-success-foreground';
    if (grade >= 8.5) return 'bg-primary text-primary-foreground';
    if (grade >= 7.5) return 'bg-warning text-warning-foreground';
    if (grade >= 6.0) return 'bg-secondary text-secondary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getCGPAProgress = (cgpa) => (cgpa / 10) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {isStudent ? 'My Grades' : 'Grade Management'}
          </h2>
          <p className="text-muted-foreground">
            {isStudent 
              ? 'Track your academic performance and CGPA'
              : 'Manage student grades and academic records'
            }
          </p>
        </div>
        {canManageGrades && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Grade
          </Button>
        )}
      </div>

      {isStudent ? (
        <div className="space-y-6">
          {/* CGPA Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Current CGPA</span>
            <span className="text-2xl font-bold text-foreground">{(() => {
              const currentUser = user;
              console.log('CGPA calculation for user:', currentUser?.name, 'ID:', currentUser?.id);
              const cgpa = calculateCGPA(currentUser?.id || '');
              console.log('CGPA result:', cgpa);
              return typeof cgpa === 'number' ? cgpa.toFixed(2) : '0.00';
            })()}/10</span>
                  </div>
                  <Progress 
                    value={(() => {
                      const currentUser = user;
                      const cgpa = calculateCGPA(currentUser?.id || '');
                      return getCGPAProgress(cgpa);
                    })()} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {(() => {
                      const cgpa = calculateCGPA(user?.id || '');
                      return cgpa >= 9 ? 'Excellent Performance!' : 
                             cgpa >= 8 ? 'Good Performance!' : 'Keep improving!';
                    })()}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Subjects:</span>
                    <span className="font-medium text-foreground">{subjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Graded Subjects:</span>
                    <span className="font-medium text-foreground">
                      {subjects.filter(s => getStudentGrade(user?.id || '', s.id)).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Grade:</span>
                    <span className="font-medium text-foreground">{(() => {
                      const studentGrades = subjects.map(s => getStudentGrade(user?.id || '', s.id)).filter(g => g !== undefined);
                      if (studentGrades.length === 0) return 'N/A';
                      const avgGrade = studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length;
                      return typeof avgGrade === 'number' ? avgGrade.toFixed(1) : 'N/A';
                    })()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Grades */}
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => {
              const studentGrade = getStudentGrade(user?.id || '', subject.id);
              return (
                <Card key={subject.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                      </div>
                      {studentGrade && (
                        <Badge className={getGradeColor(studentGrade)}>
                          {typeof studentGrade === 'number' ? studentGrade.toFixed(1) : 'N/A'}/10
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Grade Points:</span>
                        <span className="font-medium text-foreground">
                          {studentGrade && typeof studentGrade === 'number' ? studentGrade.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Credits:</span>
                        <span className="font-medium text-foreground">{subject.credits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Teacher:</span>
                        <span className="font-medium text-foreground">{subject.teacher}</span>
                      </div>
                      {studentGrade && (
                        <Progress 
                          value={studentGrade * 10} 
                          className="h-2"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ) : canManageGrades ? (
        <div className="space-y-6">
          {/* Student CGPA Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Student Performance Overview
              </CardTitle>
              <CardDescription>
                Current CGPA standings for all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {students.map((student) => (
                  <div key={student.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{student.name}</h4>
                      <Badge variant="outline" className="text-primary">
                        {(() => {
                          const cgpa = calculateCGPA(student.user_id);
                          return typeof cgpa === 'number' ? cgpa.toFixed(2) : '0.00';
                        })()}/10
                      </Badge>
                    </div>
                    <Progress 
                      value={(() => {
                        const cgpa = calculateCGPA(student.user_id);
                        return getCGPAProgress(typeof cgpa === 'number' ? cgpa : 0);
                      })()} 
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {(() => {
                        const cgpa = calculateCGPA(student.user_id);
                        return typeof cgpa === 'number' && cgpa >= 9 ? 'Excellent' : 
                               typeof cgpa === 'number' && cgpa >= 8 ? 'Good' : 'Average';
                      })()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Management by Subject */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Grade Management</CardTitle>
              <CardDescription>
                Manage grades for each subject across all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjects.map((subject) => (
                  <div key={subject.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-foreground">{subject.name}</h4>
                          <p className="text-sm text-muted-foreground">Teacher: {subject.teacher} | Credits: {subject.credits}</p>
                        </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // For now, just edit the first student's grade as an example
                          const firstStudent = students[0];
                          if (firstStudent) {
                            openGradeDialog(firstStudent.user_id, subject.id, firstStudent.name, subject.name);
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Grades
                      </Button>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-3">
                      {students.map((student) => {
                        const studentGrade = getStudentGrade(student.user_id, subject.id);
                        return (
                          <div key={student.id} 
                               className="flex items-center justify-between p-2 bg-muted/50 rounded cursor-pointer hover:bg-muted/70 transition-colors"
                             onClick={() => openGradeDialog(student.user_id, subject.id, student.name, subject.name)}
                          >
                            <span className="text-sm font-medium text-foreground">{student.name}</span>
                            <Badge className={getGradeColor(studentGrade || 0)}>
                              {studentGrade && typeof studentGrade === 'number' ? studentGrade.toFixed(1) : 'Not Graded'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">You don't have permission to manage grades.</p>
        </div>
      )}

      <GradeDialog
        open={gradeDialog.open}
        onOpenChange={closeGradeDialog}
        studentId={gradeDialog.studentId}
        subjectId={gradeDialog.subjectId}
        studentName={gradeDialog.studentName}
        subjectName={gradeDialog.subjectName}
      />
    </div>
  );
};

export default Grades;