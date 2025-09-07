import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Plus, Trash2 } from 'lucide-react';

const Subjects = () => {
  const { user, subjects } = useAuth();

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-success text-success-foreground';
      case 'A': return 'bg-primary text-primary-foreground';
      case 'B+': return 'bg-warning text-warning-foreground';
      case 'B': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
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
                {user?.role === 'student' && subject.grade && (
                  <Badge className={getGradeColor(subject.grade)}>
                    {subject.grade}
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
                    <span className="font-medium text-foreground">{subject.grade || 'Not graded'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-success">Active</span>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.role !== 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollments</CardTitle>
            <CardDescription>
              Manage which students are enrolled in each subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h4 className="font-medium text-foreground">{subject.name}</h4>
                    <p className="text-sm text-muted-foreground">Teacher: {subject.teacher}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Manage Students
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subjects;