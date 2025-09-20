import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    loadData();
    
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('studentTracker_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loadData = async () => {
    try {
      // Load all data from Supabase
      const [usersRes, subjectsRes, gradesRes, attendanceRes, assignmentsRes] = await Promise.all([
        supabase.from('app_users').select('*'),
        supabase.from('subjects').select('*'),
        supabase.from('grades').select('*'),
        supabase.from('attendance').select('*'),
        supabase.from('assignments').select('*')
      ]);

      if (usersRes.data) setUsers(usersRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (gradesRes.data) setGrades(gradesRes.data);
      if (attendanceRes.data) setAttendance(attendanceRes.data);
      if (assignmentsRes.data) setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('app_users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();
      
      if (data && !error) {
        setUser(data);
        localStorage.setItem('studentTracker_user', JSON.stringify(data));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studentTracker_user');
  };

  const addAttendance = async (record) => {
    try {
      const newRecord = {
        id: crypto.randomUUID(),
        student_id: record.studentId,
        subject: record.subject,
        date: record.date,
        status: record.status,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('attendance')
        .insert(newRecord)
        .select()
        .single();
        
      if (data && !error) {
        setAttendance(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding attendance:', error);
    }
  };

  const updateAttendance = async (id, status) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
        
      if (data && !error) {
        setAttendance(prev => prev.map(record => 
          record.id === id ? data : record
        ));
      }
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const addSubject = async (subject) => {
    try {
      const newSubject = {
        ...subject,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('subjects')
        .insert(newSubject)
        .select()
        .single();
        
      if (data && !error) {
        setSubjects(prev => [...prev, data]);
        
        // Initialize grades for all students for this new subject
        const students = users.filter(u => u.role === 'student');
        for (const student of students) {
          await updateStudentGrade(student.id, data.id, 0, 10);
        }
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const removeSubject = async (subjectId) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);
        
      if (!error) {
        setSubjects(prev => prev.filter(s => s.id !== subjectId));
        setGrades(prev => prev.filter(g => g.subject_id !== subjectId));
        setAttendance(prev => prev.filter(a => a.subject_id !== subjectId));
      }
    } catch (error) {
      console.error('Error removing subject:', error);
    }
  };

  const addStudent = async (student) => {
    try {
      const newStudent = {
        ...student,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('app_users')
        .insert(newStudent)
        .select()
        .single();
        
      if (data && !error) {
        setUsers(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const removeStudent = async (studentId) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', studentId);
        
      if (!error) {
        setUsers(prev => prev.filter(u => u.id !== studentId));
        setAttendance(prev => prev.filter(a => a.student_id !== studentId));
        setGrades(prev => prev.filter(g => g.student_id !== studentId));
      }
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const updateStudentGrade = async (studentId, subjectId, grade, maxMarks = 10) => {
    try {
      const gradeData = {
        student_id: studentId,
        subject_id: subjectId,
        grade: parseFloat(grade),
        obtained_marks: parseFloat(grade),
        max_marks: parseFloat(maxMarks)
      };

      // Try to update existing grade first
      const { data: existingGrade } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', studentId)
        .eq('subject_id', subjectId)
        .single();

      let result;
      if (existingGrade) {
        result = await supabase
          .from('grades')
          .update(gradeData)
          .eq('student_id', studentId)
          .eq('subject_id', subjectId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('grades')
          .insert({ ...gradeData, id: crypto.randomUUID() })
          .select()
          .single();
      }

      if (result.data && !result.error) {
        setGrades(prev => {
          const filtered = prev.filter(g => !(g.student_id === studentId && g.subject_id === subjectId));
          return [...filtered, result.data];
        });
        
        // Update user CGPA
        const newCgpa = calculateCGPA(studentId);
        await supabase
          .from('app_users')
          .update({ cgpa: newCgpa })
          .eq('id', studentId);
          
        setUsers(prev => prev.map(user => 
          user.id === studentId ? { ...user, cgpa: newCgpa } : user
        ));
      }
    } catch (error) {
      console.error('Error updating student grade:', error);
    }
  };

  const getStudentGrade = (studentId, subjectId) => {
    const gradeRecord = grades.find(g => g.student_id === studentId && g.subject_id === subjectId);
    return gradeRecord?.grade;
  };

  const addTeacher = async (teacher) => {
    try {
      const newTeacher = {
        ...teacher,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('app_users')
        .insert(newTeacher)
        .select()
        .single();
        
      if (data && !error) {
        setUsers(prev => [...prev, data]);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const removeTeacher = async (teacherId) => {
    try {
      const { error } = await supabase
        .from('app_users')
        .delete()
        .eq('id', teacherId);
        
      if (!error) {
        setUsers(prev => prev.filter(u => u.id !== teacherId));
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
    }
  };

  const updateTeacher = async (teacherId, data) => {
    try {
      const { data: updatedData, error } = await supabase
        .from('app_users')
        .update(data)
        .eq('id', teacherId)
        .select()
        .single();
        
      if (updatedData && !error) {
        setUsers(prev => prev.map(user => 
          user.id === teacherId ? updatedData : user
        ));
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const calculateCGPA = (studentId) => {
    const studentGrades = grades.filter(g => g.student_id === studentId);
    if (studentGrades.length === 0) return 0;

    let totalWeightedGrades = 0;
    let totalCredits = 0;

    studentGrades.forEach(gradeRecord => {
      const subject = subjects.find(s => s.id === gradeRecord.subject_id);
      if (subject) {
        totalWeightedGrades += gradeRecord.grade * subject.credits;
        totalCredits += subject.credits;
      }
    });

    return totalCredits > 0 ? parseFloat((totalWeightedGrades / totalCredits).toFixed(2)) : 0;
  };

  // Legacy functions for compatibility
  const addSubjectToStudent = (studentId, subject) => {
    // Implementation for adding subject to student
  };

  const removeSubjectFromStudent = (studentId, subjectId) => {
    // Implementation for removing subject from student
  };

  if (loading) {
    return (
      <AuthContext.Provider value={{
        user: null,
        login,
        logout,
        users: [],
        subjects: [],
        grades: [],
        attendance: [],
        assignments: [],
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
        <div>Loading...</div>
      </AuthContext.Provider>
    );
  }

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