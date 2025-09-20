import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  ClipboardList,
  TrendingUp,
  Users,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const { user, subjects, attendance, assignments, users } = useAuth();

  const getStudentStats = () => {
    if (user?.role !== 'student') return null;
    
    const userAttendance = attendance.filter(a => a.student_id === user.id);
    const presentCount = userAttendance.filter(a => a.status === 'present').length;
    const totalCount = userAttendance.length;
    const attendancePercentage = totalCount > 0 ? (presentCount / totalCount * 100).toFixed(1) : '0';
    
    return {
      totalSubjects: subjects.length,
      cgpa: user.cgpa || 0,
      attendancePercentage,
      pendingAssignments: assignments.filter(a => a.status === 'pending').length
    };
  };

  const getTeacherAdminStats = () => {
    if (user?.role === 'student') return null;
    
    const students = users.filter(u => u.role === 'student');
    const totalAttendance = attendance.length;
    const presentToday = attendance.filter(a => a.status === 'present').length;
    
    return {
      totalStudents: students.length,
      totalSubjects: subjects.length,
      attendanceToday: totalAttendance > 0 ? (presentToday / totalAttendance * 100).toFixed(1) : '0',
      totalAssignments: assignments.length
    };
  };

  const studentStats = getStudentStats();
  const teacherAdminStats = getTeacherAdminStats();

  const getRecentAttendance = () => {
    if (user?.role === 'student') {
      return attendance
        .filter(a => a.student_id === user.id)
        .slice(-5)
        .reverse();
    }
    return attendance.slice(-5).reverse();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      case 'absent': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'Track your academic progress and stay updated'
              : 'Manage students and monitor their progress'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {user?.role === 'student' && studentStats && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{studentStats.totalSubjects}</div>
                <p className="text-xs text-muted-foreground">Active subjects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CGPA</CardTitle>
                <GraduationCap className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{studentStats.cgpa}/10</div>
                <p className="text-xs text-muted-foreground">Current CGPA</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{studentStats.attendancePercentage}%</div>
                <p className="text-xs text-muted-foreground">Overall attendance</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <ClipboardList className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{studentStats.pendingAssignments}</div>
                <p className="text-xs text-muted-foreground">Assignments due</p>
              </CardContent>
            </Card>
          </>
        )}

        {user?.role !== 'student' && teacherAdminStats && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{teacherAdminStats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Active students</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{teacherAdminStats.totalSubjects}</div>
                <p className="text-xs text-muted-foreground">Total subjects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{teacherAdminStats.attendanceToday}%</div>
                <p className="text-xs text-muted-foreground">Present today</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                <ClipboardList className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{teacherAdminStats.totalAssignments}</div>
                <p className="text-xs text-muted-foreground">Total assignments</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Attendance
            </CardTitle>
            <CardDescription>
              {user?.role === 'student' ? 'Your recent attendance records' : 'Latest attendance updates'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getRecentAttendance().map((record) => {
                const student = users.find(u => u.user_id === record.student_id);
                return (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-foreground">{record.subject}</p>
                      {user?.role !== 'student' && (
                        <p className="text-sm text-muted-foreground">{student?.name}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{record.date}</p>
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status === 'present' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {record.status === 'late' && <Clock className="w-3 h-3 mr-1" />}
                      {record.status === 'absent' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {record.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Upcoming Assignments
            </CardTitle>
            <CardDescription>
              Assignments due soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.filter(a => a.status === 'pending').map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    <p className="text-xs text-muted-foreground">Due: {assignment.dueDate}</p>
                  </div>
                  <Badge variant="outline" className="text-warning border-warning">
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;