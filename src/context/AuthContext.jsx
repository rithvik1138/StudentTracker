import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock data - Update CGPA with calculateCGPA function
const mockUsers = [
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

const mockSubjects = [
  { id: '1', name: 'CIE', teacher: 'Narayana', credits: 4 },
  { id: '2', name: 'CICD', teacher: 'Narayana', credits: 5 },
  { id: '3', name: 'TOC', teacher: 'Narayana', credits: 4 },
  { id: '4', name: 'Certificate Course', teacher: 'Narayana', credits: 5 },
];

const mockGrades = [
  { id: '1', studentId: '1', subjectId: '1', grade: 9.0, maxMarks: 10, obtainedMarks: 9.0 },
  { id: '2', studentId: '1', subjectId: '2', grade: 9.0, maxMarks: 10, obtainedMarks: 9.0 },
  { id: '3', studentId: '1', subjectId: '3', grade: 9.0, maxMarks: 10, obtainedMarks: 9.0 },
  { id: '4', studentId: '1', subjectId: '4', grade: 9.0, maxMarks: 10, obtainedMarks: 9.0 },
  { id: '5', studentId: '2', subjectId: '1', grade: 8.5, maxMarks: 10, obtainedMarks: 8.5 },
  { id: '6', studentId: '2', subjectId: '2', grade: 8.5, maxMarks: 10, obtainedMarks: 8.5 },
  { id: '7', studentId: '2', subjectId: '3', grade: 8.5, maxMarks: 10, obtainedMarks: 8.5 },
  { id: '8', studentId: '2', subjectId: '4', grade: 8.5, maxMarks: 10, obtainedMarks: 8.5 },
  { id: '9', studentId: '3', subjectId: '1', grade: 8.3, maxMarks: 10, obtainedMarks: 8.3 },
  { id: '10', studentId: '3', subjectId: '2', grade: 8.3, maxMarks: 10, obtainedMarks: 8.3 },
  { id: '11', studentId: '3', subjectId: '3', grade: 8.3, maxMarks: 10, obtainedMarks: 8.3 },
  { id: '12', studentId: '3', subjectId: '4', grade: 8.3, maxMarks: 10, obtainedMarks: 8.3 },
];

const mockAttendance = [
  // Rithvik - 85% attendance (17/20 classes present)
  { id: '1', studentId: '1', subject: 'CIE', date: '2025-09-02', status: 'present' },
  { id: '2', studentId: '1', subject: 'CICD', date: '2025-09-02', status: 'present' },
  { id: '3', studentId: '1', subject: 'TOC', date: '2025-09-02', status: 'present' },
  { id: '4', studentId: '1', subject: 'Certificate Course', date: '2025-09-02', status: 'present' },
  { id: '5', studentId: '1', subject: 'CIE', date: '2025-09-03', status: 'present' },
  { id: '6', studentId: '1', subject: 'CICD', date: '2025-09-03', status: 'absent' },
  { id: '7', studentId: '1', subject: 'TOC', date: '2025-09-03', status: 'present' },
  { id: '8', studentId: '1', subject: 'Certificate Course', date: '2025-09-03', status: 'present' },
  { id: '9', studentId: '1', subject: 'CIE', date: '2025-09-04', status: 'present' },
  { id: '10', studentId: '1', subject: 'CICD', date: '2025-09-04', status: 'present' },
  { id: '11', studentId: '1', subject: 'TOC', date: '2025-09-04', status: 'present' },
  { id: '12', studentId: '1', subject: 'Certificate Course', date: '2025-09-04', status: 'present' },
  { id: '13', studentId: '1', subject: 'CIE', date: '2025-09-05', status: 'present' },
  { id: '14', studentId: '1', subject: 'CICD', date: '2025-09-05', status: 'present' },
  { id: '15', studentId: '1', subject: 'TOC', date: '2025-09-05', status: 'absent' },
  { id: '16', studentId: '1', subject: 'Certificate Course', date: '2025-09-05', status: 'present' },
  { id: '17', studentId: '1', subject: 'CIE', date: '2025-09-06', status: 'present' },
  { id: '18', studentId: '1', subject: 'CICD', date: '2025-09-06', status: 'present' },
  { id: '19', studentId: '1', subject: 'TOC', date: '2025-09-06', status: 'present' },
  { id: '20', studentId: '1', subject: 'Certificate Course', date: '2025-09-06', status: 'absent' },

  // Jeethu - 100% attendance (20/20 classes present)
  { id: '21', studentId: '2', subject: 'CIE', date: '2025-09-02', status: 'present' },
  { id: '22', studentId: '2', subject: 'CICD', date: '2025-09-02', status: 'present' },
  { id: '23', studentId: '2', subject: 'TOC', date: '2025-09-02', status: 'present' },
  { id: '24', studentId: '2', subject: 'Certificate Course', date: '2025-09-02', status: 'present' },
  { id: '25', studentId: '2', subject: 'CIE', date: '2025-09-03', status: 'present' },
  { id: '26', studentId: '2', subject: 'CICD', date: '2025-09-03', status: 'present' },
  { id: '27', studentId: '2', subject: 'TOC', date: '2025-09-03', status: 'present' },
  { id: '28', studentId: '2', subject: 'Certificate Course', date: '2025-09-03', status: 'present' },
  { id: '29', studentId: '2', subject: 'CIE', date: '2025-09-04', status: 'present' },
  { id: '30', studentId: '2', subject: 'CICD', date: '2025-09-04', status: 'present' },
  { id: '31', studentId: '2', subject: 'TOC', date: '2025-09-04', status: 'present' },
  { id: '32', studentId: '2', subject: 'Certificate Course', date: '2025-09-04', status: 'present' },
  { id: '33', studentId: '2', subject: 'CIE', date: '2025-09-05', status: 'present' },
  { id: '34', studentId: '2', subject: 'CICD', date: '2025-09-05', status: 'present' },
  { id: '35', studentId: '2', subject: 'TOC', date: '2025-09-05', status: 'present' },
  { id: '36', studentId: '2', subject: 'Certificate Course', date: '2025-09-05', status: 'present' },
  { id: '37', studentId: '2', subject: 'CIE', date: '2025-09-06', status: 'present' },
  { id: '38', studentId: '2', subject: 'CICD', date: '2025-09-06', status: 'present' },
  { id: '39', studentId: '2', subject: 'TOC', date: '2025-09-06', status: 'present' },
  { id: '40', studentId: '2', subject: 'Certificate Course', date: '2025-09-06', status: 'present' },

  // Pardhav - 60% attendance (12/20 classes present)
  { id: '41', studentId: '3', subject: 'CIE', date: '2025-09-02', status: 'present' },
  { id: '42', studentId: '3', subject: 'CICD', date: '2025-09-02', status: 'absent' },
  { id: '43', studentId: '3', subject: 'TOC', date: '2025-09-02', status: 'present' },
  { id: '44', studentId: '3', subject: 'Certificate Course', date: '2025-09-02', status: 'absent' },
  { id: '45', studentId: '3', subject: 'CIE', date: '2025-09-03', status: 'present' },
  { id: '46', studentId: '3', subject: 'CICD', date: '2025-09-03', status: 'present' },
  { id: '47', studentId: '3', subject: 'TOC', date: '2025-09-03', status: 'absent' },
  { id: '48', studentId: '3', subject: 'Certificate Course', date: '2025-09-03', status: 'absent' },
  { id: '49', studentId: '3', subject: 'CIE', date: '2025-09-04', status: 'present' },
  { id: '50', studentId: '3', subject: 'CICD', date: '2025-09-04', status: 'present' },
  { id: '51', studentId: '3', subject: 'TOC', date: '2025-09-04', status: 'absent' },
  { id: '52', studentId: '3', subject: 'Certificate Course', date: '2025-09-04', status: 'present' },
  { id: '53', studentId: '3', subject: 'CIE', date: '2025-09-05', status: 'absent' },
  { id: '54', studentId: '3', subject: 'CICD', date: '2025-09-05', status: 'present' },
  { id: '55', studentId: '3', subject: 'TOC', date: '2025-09-05', status: 'present' },
  { id: '56', studentId: '3', subject: 'Certificate Course', date: '2025-09-05', status: 'absent' },
  { id: '57', studentId: '3', subject: 'CIE', date: '2025-09-06', status: 'present' },
  { id: '58', studentId: '3', subject: 'CICD', date: '2025-09-06', status: 'absent' },
  { id: '59', studentId: '3', subject: 'TOC', date: '2025-09-06', status: 'present' },
  { id: '60', studentId: '3', subject: 'Certificate Course', date: '2025-09-06', status: 'present' },
];

const mockAssignments = [
  { id: '1', title: 'Home Assignment of CIE', subject: 'CIE', dueDate: '2025-09-15', status: 'pending' },
  { id: '2', title: 'Home Assignment of CICD', subject: 'CICD', dueDate: '2025-09-20', status: 'pending' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [subjects, setSubjects] = useState(mockSubjects);
  const [grades, setGrades] = useState(mockGrades);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [assignments] = useState(mockAssignments);

  useEffect(() => {
    const savedUser = localStorage.getItem('studentTracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    if (mockCredentials[email] === password) {
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

  const addAttendance = (record) => {
    setAttendance(prev => [...prev, record]);
  };

  const updateAttendance = (id, status) => {
    setAttendance(prev => prev.map(record => 
      record.id === id ? { ...record, status } : record
    ));
  };

  const addSubjectToStudent = (studentId, subject) => {
    // Implementation for adding subject to student
  };

  const removeSubjectFromStudent = (studentId, subjectId) => {
    // Implementation for removing subject from student
  };

  const addSubject = (subject) => {
    setSubjects(prev => [...prev, subject]);
  };

  const removeSubject = (subjectId) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
  };

  const addStudent = (student) => {
    setUsers(prev => [...prev, student]);
  };

  const removeStudent = (studentId) => {
    setUsers(prev => prev.filter(u => u.id !== studentId));
    setAttendance(prev => prev.filter(a => a.studentId !== studentId));
    setGrades(prev => prev.filter(g => g.studentId !== studentId));
  };

  const updateStudentGrade = (studentId, subjectId, grade, maxMarks = 10) => {
    setGrades(prev => {
      const existingGrade = prev.find(g => g.studentId === studentId && g.subjectId === subjectId);
      if (existingGrade) {
        return prev.map(g => 
          g.studentId === studentId && g.subjectId === subjectId 
            ? { ...g, grade, obtainedMarks: grade, maxMarks } 
            : g
        );
      } else {
        return [...prev, {
          id: Date.now().toString(),
          studentId,
          subjectId,
          grade,
          obtainedMarks: grade,
          maxMarks
        }];
      }
    });
    
    // Update user CGPA
    setUsers(prev => prev.map(user => 
      user.id === studentId 
        ? { ...user, cgpa: calculateCGPA(studentId) }
        : user
    ));
  };

  const getStudentGrade = (studentId, subjectId) => {
    const gradeRecord = grades.find(g => g.studentId === studentId && g.subjectId === subjectId);
    return gradeRecord?.grade;
  };

  const addTeacher = (teacher) => {
    setUsers(prev => [...prev, teacher]);
  };

  const removeTeacher = (teacherId) => {
    setUsers(prev => prev.filter(u => u.id !== teacherId));
  };

  const updateTeacher = (teacherId, data) => {
    setUsers(prev => prev.map(user => 
      user.id === teacherId ? { ...user, ...data } : user
    ));
  };

  const calculateCGPA = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 0;

    let totalWeightedGrades = 0;
    let totalCredits = 0;

    studentGrades.forEach(gradeRecord => {
      const subject = subjects.find(s => s.id === gradeRecord.subjectId);
      if (subject) {
        totalWeightedGrades += gradeRecord.grade * subject.credits;
        totalCredits += subject.credits;
      }
    });

    return totalCredits > 0 ? totalWeightedGrades / totalCredits : 0;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      users,
      subjects,
      grades,
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
      updateStudentGrade,
      getStudentGrade,
      calculateCGPA,
      addTeacher,
      removeTeacher,
      updateTeacher,
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