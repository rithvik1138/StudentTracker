import { useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  User,
  Plus
} from 'lucide-react';
import AttendanceDialog from '@/components/AttendanceDialog.jsx';

const Attendance = () => {
  const { user, attendance, subjects, users } = useAuth();
  const [attendanceDialog, setAttendanceDialog] = useState({
    open: false,
    studentId: '',
    studentName: '',
    subject: ''
  });

  const isStudent = user?.role === 'student';
  const students = users.filter(u => u.role === 'student');

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'late': return 'bg-warning text-warning-foreground';
      case 'absent': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle className="w-4 h-4" />;
      case 'late': return <Clock className="w-4 h-4" />;
      case 'absent': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getStudentAttendance = (studentId) => {
    const studentAttendance = attendance.filter(a => a.studentId === studentId);
    const totalClasses = studentAttendance.length;
    const presentClasses = studentAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const percentage = totalClasses > 0 ? (presentClasses / totalClasses * 100).toFixed(1) : '0';
    
    return {
      total: totalClasses,
      present: presentClasses,
      percentage: parseFloat(percentage)
    };
  };

  const getSubjectAttendance = (studentId, subjectName) => {
    const subjectAttendance = attendance.filter(a => a.studentId === studentId && a.subject === subjectName);
    const totalClasses = subjectAttendance.length;
    const presentClasses = subjectAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
    const percentage = totalClasses > 0 ? (presentClasses / totalClasses * 100).toFixed(1) : '0';
    
    return {
      total: totalClasses,
      present: presentClasses,
      percentage: parseFloat(percentage)
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {isStudent ? 'My Attendance' : 'Attendance Management'}
          </h2>
          <p className="text-muted-foreground">
            {isStudent 
              ? 'Track your class attendance and participation'
              : 'Manage student attendance records'
            }
          </p>
        </div>
        {!isStudent && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Mark Attendance
          </Button>
        )}
      </div>

      {isStudent ? (
        <div className="space-y-6">
          {/* Overall Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Overall Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const stats = getStudentAttendance(user?.id || '');
                return (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Attendance Rate</span>
                        <span className="text-2xl font-bold text-foreground">{stats.percentage}%</span>
                      </div>
                      <Progress value={stats.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {stats.percentage >= 90 ? 'Excellent attendance!' : 
                         stats.percentage >= 75 ? 'Good attendance!' : 'Needs improvement'}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Classes:</span>
                        <span className="font-medium text-foreground">{stats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Present:</span>
                        <span className="font-medium text-success">{stats.present}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Absent:</span>
                        <span className="font-medium text-destructive">{stats.total - stats.present}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Subject-wise Attendance */}
          <div className="grid gap-4 md:grid-cols-2">
            {subjects.map((subject) => {
              const stats = getSubjectAttendance(user?.id || '', subject.name);
              return (
                <Card key={subject.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <CardDescription>Teacher: {subject.teacher}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Attendance Rate</span>
                        <Badge variant="outline" className={
                          stats.percentage >= 90 ? 'text-success border-success' :
                          stats.percentage >= 75 ? 'text-warning border-warning' : 'text-destructive border-destructive'
                        }>
                          {stats.percentage}%
                        </Badge>
                      </div>
                      <Progress value={stats.percentage} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Classes: {stats.present}/{stats.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Records</CardTitle>
              <CardDescription>Your latest attendance entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendance
                  .filter(a => a.studentId === user?.id)
                  .slice(-10)
                  .reverse()
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{record.subject}</p>
                          <p className="text-sm text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1 capitalize">{record.status}</span>
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Student Attendance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance Overview</CardTitle>
              <CardDescription>Current attendance rates for all students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {students.map((student) => {
                  const stats = getStudentAttendance(student.id);
                  return (
                    <div key={student.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{student.name}</h4>
                        <Badge variant="outline" className={
                          stats.percentage >= 90 ? 'text-success border-success' :
                          stats.percentage >= 75 ? 'text-warning border-warning' : 'text-destructive border-destructive'
                        }>
                          {stats.percentage}%
                        </Badge>
                      </div>
                      <Progress value={stats.percentage} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {stats.present}/{stats.total} classes attended
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Daily Attendance Management */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>Mark attendance for today's classes</CardDescription>
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
                        Mark All Present
                      </Button>
                    </div>
                    
                    <div className="grid gap-3 md:grid-cols-3">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-foreground">{student.name}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setAttendanceDialog({
                              open: true,
                              studentId: student.id,
                              studentName: student.name,
                              subject: subject.name
                            })}
                          >
                            Mark
                          </Button>
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

      <AttendanceDialog
        open={attendanceDialog.open}
        onOpenChange={(open) => setAttendanceDialog({ ...attendanceDialog, open })}
        studentId={attendanceDialog.studentId}
        studentName={attendanceDialog.studentName}
        subject={attendanceDialog.subject}
      />
    </div>
  );
};

export default Attendance;