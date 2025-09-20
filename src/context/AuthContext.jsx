import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadData = async () => {
    try {
      // Load all data from Supabase
      const [profilesRes, subjectsRes, gradesRes, attendanceRes, assignmentsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('subjects').select('*'),
        supabase.from('grades').select('*'),
        supabase.from('attendance').select('*'),
        supabase.from('assignments').select('*')
      ]);

      if (profilesRes.data) setUsers(profilesRes.data);
      if (subjectsRes.data) setSubjects(subjectsRes.data);
      if (gradesRes.data) setGrades(gradesRes.data);
      if (attendanceRes.data) setAttendance(attendanceRes.data);
      if (assignmentsRes.data) setAssignments(assignmentsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Set up auth listener and load data
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Load user profile when logged in
        if (session?.user) {
          setTimeout(async () => {
            await loadUserProfile(session.user.id);
            await loadData();
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      loadData();
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addAttendance = async (studentId, subject, status, date) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .insert({
          student_id: studentId,
          subject: subject,
          status: status,
          date: date
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding attendance:', error);
        return { success: false, error: error.message };
      }

      setAttendance(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding attendance:', error);
      return { success: false, error: error.message };
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

      if (error) {
        console.error('Error updating attendance:', error);
        return { success: false, error: error.message };
      }

      setAttendance(prev => prev.map(a => a.id === id ? data : a));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating attendance:', error);
      return { success: false, error: error.message };
    }
  };

  const addSubject = async (subjectData) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subjectData)
        .select()
        .single();

      if (error) {
        console.error('Error adding subject:', error);
        return { success: false, error: error.message };
      }

      setSubjects(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding subject:', error);
      return { success: false, error: error.message };
    }
  };

  const removeSubject = async (subjectId) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) {
        console.error('Error removing subject:', error);
        return { success: false, error: error.message };
      }

      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      return { success: true };
    } catch (error) {
      console.error('Error removing subject:', error);
      return { success: false, error: error.message };
    }
  };

  const addStudent = async (studentData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          name: studentData.name,
          user_id: studentData.user_id || studentData.id,
          role: 'student'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding student:', error);
        return { success: false, error: error.message };
      }

      setUsers(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding student:', error);
      return { success: false, error: error.message };
    }
  };

  const removeStudent = async (studentId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('Error removing student:', error);
        return { success: false, error: error.message };
      }

      setUsers(prev => prev.filter(u => u.id !== studentId));
      return { success: true };
    } catch (error) {
      console.error('Error removing student:', error);
      return { success: false, error: error.message };
    }
  };

  const updateStudentGrade = async (studentId, subjectId, grade) => {
    try {
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
          .update({ 
            grade: parseFloat(grade),
            obtained_marks: parseFloat(grade),
            updated_at: new Date().toISOString()
          })
          .eq('student_id', studentId)
          .eq('subject_id', subjectId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('grades')
          .insert({
            student_id: studentId,
            subject_id: subjectId,
            grade: parseFloat(grade),
            obtained_marks: parseFloat(grade),
            max_marks: 10
          })
          .select()
          .single();
      }

      if (result.data && !result.error) {
        setGrades(prev => {
          const filtered = prev.filter(g => !(g.student_id === studentId && g.subject_id === subjectId));
          return [...filtered, result.data];
        });
      }

      return result;
    } catch (error) {
      console.error('Error updating grade:', error);
      return { error: error.message };
    }
  };

  const addTeacher = async (teacherData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          name: teacherData.name,
          user_id: teacherData.user_id || teacherData.id,
          role: 'teacher'
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding teacher:', error);
        return { success: false, error: error.message };
      }

      setUsers(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding teacher:', error);
      return { success: false, error: error.message };
    }
  };

  const removeTeacher = async (teacherId) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', teacherId);

      if (error) {
        console.error('Error removing teacher:', error);
        return { success: false, error: error.message };
      }

      setUsers(prev => prev.filter(u => u.id !== teacherId));
      return { success: true };
    } catch (error) {
      console.error('Error removing teacher:', error);
      return { success: false, error: error.message };
    }
  };

  const updateTeacher = async (teacherId, updatedData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', teacherId)
        .select()
        .single();

      if (error) {
        console.error('Error updating teacher:', error);
        return { success: false, error: error.message };
      }

      setUsers(prev => prev.map(user => 
        user.id === teacherId ? data : user
      ));
      return { success: true, data };
    } catch (error) {
      console.error('Error updating teacher:', error);
      return { success: false, error: error.message };
    }
  };

  const calculateCGPA = (studentUserId) => {
    const studentGrades = grades.filter(g => g.student_id === studentUserId);
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

  const getStudentGrade = (studentUserId, subjectId) => {
    const gradeRecord = grades.find(g => g.student_id === studentUserId && g.subject_id === subjectId);
    return gradeRecord ? gradeRecord.grade : undefined;
  };

  // Get current user with profile data
  const getCurrentUser = () => {
    if (!user || !profile) return null;
    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      role: profile.role,
      user_id: user.id,
      profile_id: profile.id,
      ...profile
    };
  };

  // Legacy functions for compatibility
  const addSubjectToStudent = (studentId, subject) => {
    console.log('addSubjectToStudent called', { studentId, subject });
  };

  const removeSubjectFromStudent = (studentId, subjectId) => {
    console.log('removeSubjectFromStudent called', { studentId, subjectId });
  };

  const contextValue = {
    user: getCurrentUser(),
    session,
    profile,
    users,
    subjects,
    grades,
    attendance,
    assignments,
    loading,
    logout: signOutUser,
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
  };

  if (loading) {
    return (
      <AuthContext.Provider value={contextValue}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
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