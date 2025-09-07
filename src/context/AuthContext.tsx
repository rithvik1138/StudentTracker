import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'teacher';
  cgpa?: number;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  grade?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  users: User[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  addAttendance: (record: AttendanceRecord) => void;
  updateAttendance: (id: string, status: 'present' | 'absent' | 'late') => void;
  addSubjectToStudent: (studentId: string, subject: Subject) => void;
  removeSubjectFromStudent: (studentId: string, subjectId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Rithvik', email: 'rithvik@student.com', role: 'student', cgpa: 9.0 },
  { id: '2', name: 'Jeethu', email: 'jeethu@student.com', role: 'student', cgpa: 8.5 },
  { id: '3', name: 'Pardhav', email: 'pardhav@student.com', role: 'student', cgpa: 8.3 },
  { id: '4', name: 'D.Rithvik', email: 'admin@studenttracker.com', role: 'admin' },
  { id: '5', name: 'Narayana', email: 'narayana@teacher.com', role: 'teacher' },
];

const mockCredentials = {
  'rithvik@student.com': 'password123',
  'jeethu@student.com': 'password123',
  'pardhav@student.com': 'password123',
  'admin@studenttracker.com': 'admin123',
  'narayana@teacher.com': 'teacher123',
};

const mockSubjects: Subject[] = [
  { id: '1', name: 'CIE', teacher: 'Narayana', grade: 'A' },
  { id: '2', name: 'CICD', teacher: 'Narayana', grade: 'A+' },
  { id: '3', name: 'TOC', teacher: 'Narayana', grade: 'A' },
  { id: '4', name: 'Certificate Course', teacher: 'Narayana', grade: 'A+' },
];

const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: '1', subject: 'CIE', date: '2024-01-15', status: 'present' },
  { id: '2', studentId: '1', subject: 'CICD', date: '2024-01-15', status: 'present' },
  { id: '3', studentId: '2', subject: 'CIE', date: '2024-01-15', status: 'late' },
  { id: '4', studentId: '3', subject: 'TOC', date: '2024-01-15', status: 'absent' },
];

const mockAssignments: Assignment[] = [
  { id: '1', title: 'Home Assignment of CIE', subject: 'CIE', dueDate: '2024-01-25', status: 'pending' },
  { id: '2', title: 'Home Assignment of CICD', subject: 'CICD', dueDate: '2024-01-30', status: 'pending' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [assignments] = useState<Assignment[]>(mockAssignments);

  useEffect(() => {
    const savedUser = localStorage.getItem('studentTracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (mockCredentials[email as keyof typeof mockCredentials] === password) {
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('studentTracker_user', JSON.stringify(foundUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studentTracker_user');
  };

  const addAttendance = (record: AttendanceRecord) => {
    setAttendance(prev => [...prev, record]);
  };

  const updateAttendance = (id: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => prev.map(record => 
      record.id === id ? { ...record, status } : record
    ));
  };

  const addSubjectToStudent = (studentId: string, subject: Subject) => {
    // Implementation for adding subject to student
  };

  const removeSubjectFromStudent = (studentId: string, subjectId: string) => {
    // Implementation for removing subject from student
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      users,
      subjects,
      attendance,
      assignments,
      addAttendance,
      updateAttendance,
      addSubjectToStudent,
      removeSubjectFromStudent,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};