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
  addSubject: (subject: Subject) => void;
  removeSubject: (subjectId: string) => void;
  addStudent: (student: User) => void;
  removeStudent: (studentId: string) => void;
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
  // Rithvik - 85% attendance (17/20 classes present)
  { id: '1', studentId: '1', subject: 'CIE', date: '2024-01-15', status: 'present' },
  { id: '2', studentId: '1', subject: 'CICD', date: '2024-01-15', status: 'present' },
  { id: '3', studentId: '1', subject: 'TOC', date: '2024-01-15', status: 'present' },
  { id: '4', studentId: '1', subject: 'Certificate Course', date: '2024-01-15', status: 'present' },
  { id: '5', studentId: '1', subject: 'CIE', date: '2024-01-16', status: 'present' },
  { id: '6', studentId: '1', subject: 'CICD', date: '2024-01-16', status: 'absent' },
  { id: '7', studentId: '1', subject: 'TOC', date: '2024-01-16', status: 'present' },
  { id: '8', studentId: '1', subject: 'Certificate Course', date: '2024-01-16', status: 'present' },
  { id: '9', studentId: '1', subject: 'CIE', date: '2024-01-17', status: 'present' },
  { id: '10', studentId: '1', subject: 'CICD', date: '2024-01-17', status: 'present' },
  { id: '11', studentId: '1', subject: 'TOC', date: '2024-01-17', status: 'present' },
  { id: '12', studentId: '1', subject: 'Certificate Course', date: '2024-01-17', status: 'present' },
  { id: '13', studentId: '1', subject: 'CIE', date: '2024-01-18', status: 'present' },
  { id: '14', studentId: '1', subject: 'CICD', date: '2024-01-18', status: 'present' },
  { id: '15', studentId: '1', subject: 'TOC', date: '2024-01-18', status: 'absent' },
  { id: '16', studentId: '1', subject: 'Certificate Course', date: '2024-01-18', status: 'present' },
  { id: '17', studentId: '1', subject: 'CIE', date: '2024-01-19', status: 'present' },
  { id: '18', studentId: '1', subject: 'CICD', date: '2024-01-19', status: 'present' },
  { id: '19', studentId: '1', subject: 'TOC', date: '2024-01-19', status: 'present' },
  { id: '20', studentId: '1', subject: 'Certificate Course', date: '2024-01-19', status: 'absent' },

  // Jeethu - 100% attendance (20/20 classes present)
  { id: '21', studentId: '2', subject: 'CIE', date: '2024-01-15', status: 'present' },
  { id: '22', studentId: '2', subject: 'CICD', date: '2024-01-15', status: 'present' },
  { id: '23', studentId: '2', subject: 'TOC', date: '2024-01-15', status: 'present' },
  { id: '24', studentId: '2', subject: 'Certificate Course', date: '2024-01-15', status: 'present' },
  { id: '25', studentId: '2', subject: 'CIE', date: '2024-01-16', status: 'present' },
  { id: '26', studentId: '2', subject: 'CICD', date: '2024-01-16', status: 'present' },
  { id: '27', studentId: '2', subject: 'TOC', date: '2024-01-16', status: 'present' },
  { id: '28', studentId: '2', subject: 'Certificate Course', date: '2024-01-16', status: 'present' },
  { id: '29', studentId: '2', subject: 'CIE', date: '2024-01-17', status: 'present' },
  { id: '30', studentId: '2', subject: 'CICD', date: '2024-01-17', status: 'present' },
  { id: '31', studentId: '2', subject: 'TOC', date: '2024-01-17', status: 'present' },
  { id: '32', studentId: '2', subject: 'Certificate Course', date: '2024-01-17', status: 'present' },
  { id: '33', studentId: '2', subject: 'CIE', date: '2024-01-18', status: 'present' },
  { id: '34', studentId: '2', subject: 'CICD', date: '2024-01-18', status: 'present' },
  { id: '35', studentId: '2', subject: 'TOC', date: '2024-01-18', status: 'present' },
  { id: '36', studentId: '2', subject: 'Certificate Course', date: '2024-01-18', status: 'present' },
  { id: '37', studentId: '2', subject: 'CIE', date: '2024-01-19', status: 'present' },
  { id: '38', studentId: '2', subject: 'CICD', date: '2024-01-19', status: 'present' },
  { id: '39', studentId: '2', subject: 'TOC', date: '2024-01-19', status: 'present' },
  { id: '40', studentId: '2', subject: 'Certificate Course', date: '2024-01-19', status: 'present' },

  // Pardhav - 60% attendance (12/20 classes present)
  { id: '41', studentId: '3', subject: 'CIE', date: '2024-01-15', status: 'present' },
  { id: '42', studentId: '3', subject: 'CICD', date: '2024-01-15', status: 'absent' },
  { id: '43', studentId: '3', subject: 'TOC', date: '2024-01-15', status: 'present' },
  { id: '44', studentId: '3', subject: 'Certificate Course', date: '2024-01-15', status: 'absent' },
  { id: '45', studentId: '3', subject: 'CIE', date: '2024-01-16', status: 'present' },
  { id: '46', studentId: '3', subject: 'CICD', date: '2024-01-16', status: 'present' },
  { id: '47', studentId: '3', subject: 'TOC', date: '2024-01-16', status: 'absent' },
  { id: '48', studentId: '3', subject: 'Certificate Course', date: '2024-01-16', status: 'absent' },
  { id: '49', studentId: '3', subject: 'CIE', date: '2024-01-17', status: 'present' },
  { id: '50', studentId: '3', subject: 'CICD', date: '2024-01-17', status: 'present' },
  { id: '51', studentId: '3', subject: 'TOC', date: '2024-01-17', status: 'absent' },
  { id: '52', studentId: '3', subject: 'Certificate Course', date: '2024-01-17', status: 'present' },
  { id: '53', studentId: '3', subject: 'CIE', date: '2024-01-18', status: 'absent' },
  { id: '54', studentId: '3', subject: 'CICD', date: '2024-01-18', status: 'present' },
  { id: '55', studentId: '3', subject: 'TOC', date: '2024-01-18', status: 'present' },
  { id: '56', studentId: '3', subject: 'Certificate Course', date: '2024-01-18', status: 'absent' },
  { id: '57', studentId: '3', subject: 'CIE', date: '2024-01-19', status: 'present' },
  { id: '58', studentId: '3', subject: 'CICD', date: '2024-01-19', status: 'absent' },
  { id: '59', studentId: '3', subject: 'TOC', date: '2024-01-19', status: 'present' },
  { id: '60', studentId: '3', subject: 'Certificate Course', date: '2024-01-19', status: 'present' },
];

const mockAssignments: Assignment[] = [
  { id: '1', title: 'Home Assignment of CIE', subject: 'CIE', dueDate: '2024-01-25', status: 'pending' },
  { id: '2', title: 'Home Assignment of CICD', subject: 'CICD', dueDate: '2024-01-30', status: 'pending' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
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

  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const removeSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
  };

  const addStudent = (student: User) => {
    setUsers(prev => [...prev, student]);
  };

  const removeStudent = (studentId: string) => {
    setUsers(prev => prev.filter(u => u.id !== studentId));
    setAttendance(prev => prev.filter(a => a.studentId !== studentId));
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
      addSubject,
      removeSubject,
      addStudent,
      removeStudent,
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