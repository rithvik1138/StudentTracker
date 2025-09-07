import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  GraduationCap, 
  TrendingUp, 
  BookOpen,
  Award,
  Plus,
  Edit
} from 'lucide-react';

const Grades = () => {
  const { user, subjects, users } = useAuth();

  const isStudent = user?.role === 'student';
  const students = users.filter(u => u.role === 'student');

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-success text-success-foreground';
      case 'A': return 'bg-primary text-primary-foreground';
      case 'B+': return 'bg-warning text-warning-foreground';
      case 'B': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGradePoints = (grade: string) => {
    switch (grade) {
      case 'A+': return 10;
      case 'A': return 9;
      case 'B+': return 8;
      case 'B': return 7;
      case 'C': return 6;
      default: return 0;
    }
  };

  const getCGPAProgress = (cgpa: number) => (cgpa / 10) * 100;

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
        {!isStudent && (
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
                    <span className="text-2xl font-bold text-foreground">{user?.cgpa}/10</span>
                  </div>
                  <Progress 
                    value={getCGPAProgress(user?.cgpa || 0)} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {user?.cgpa && user.cgpa >= 9 ? 'Excellent Performance!' : 
                     user?.cgpa && user.cgpa >= 8 ? 'Good Performance!' : 'Keep improving!'}
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
                      {subjects.filter(s => s.grade).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Grade:</span>
                    <span className="font-medium text-foreground">A</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Grades */}
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{subject.name}</CardTitle>
                    </div>
                    {subject.grade && (
                      <Badge className={getGradeColor(subject.grade)}>
                        {subject.grade}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Grade Points:</span>
                      <span className="font-medium text-foreground">
                        {subject.grade ? getGradePoints(subject.grade) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Teacher:</span>
                      <span className="font-medium text-foreground">{subject.teacher}</span>
                    </div>
                    {subject.grade && (
                      <Progress 
                        value={getGradePoints(subject.grade) * 10} 
                        className="h-2"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
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
                        {student.cgpa}/10
                      </Badge>
                    </div>
                    <Progress 
                      value={getCGPAProgress(student.cgpa || 0)} 
                      className="h-2 mb-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {student.cgpa && student.cgpa >= 9 ? 'Excellent' : 
                       student.cgpa && student.cgpa >= 8 ? 'Good' : 'Average'}
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
                        <p className="text-sm text-muted-foreground">Teacher: {subject.teacher}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Grades
                      </Button>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-3">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm font-medium text-foreground">{student.name}</span>
                          <Badge className={getGradeColor(subject.grade || 'N/A')}>
                            {subject.grade || 'Not Graded'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Grades;