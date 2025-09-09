import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, role: 'student' | 'teacher' | 'admin') => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
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

// Mock data for subjects, attendance, assignments (will be replaced with Supabase later)
const mockSubjects: Subject[] = [
  { id: '1', name: 'CIE', teacher: 'Narayana', grade: 'A' },
  { id: '2', name: 'CICD', teacher: 'Narayana', grade: 'A+' },
  { id: '3', name: 'TOC', teacher: 'Narayana', grade: 'A' },
  { id: '4', name: 'Certificate Course', teacher: 'Narayana', grade: 'A+' },
];

const mockAttendance: AttendanceRecord[] = [
  { id: '1', studentId: '1', subject: 'CIE', date: '2024-01-15', status: 'present' },
  { id: '2', studentId: '1', subject: 'CICD', date: '2024-01-15', status: 'present' },
  { id: '3', studentId: '1', subject: 'TOC', date: '2024-01-15', status: 'present' },
];

const mockAssignments: Assignment[] = [
  { id: '1', title: 'Home Assignment of CIE', subject: 'CIE', dueDate: '2024-01-25', status: 'pending' },
  { id: '2', title: 'Home Assignment of CICD', subject: 'CICD', dueDate: '2024-01-30', status: 'pending' },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [assignments] = useState<Assignment[]>(mockAssignments);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetch with setTimeout
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => {
          fetchUserProfile(session.user);
        }, 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profile) {
        setUser({
          id: profile.user_id,
          email: supabaseUser.email || '',
          name: profile.name,
          role: profile.role,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      if (profiles) {
        const usersList = profiles.map(profile => ({
          id: profile.user_id,
          email: '', // Email is not stored in profiles for security
          name: profile.name,
          role: profile.role,
        }));
        setUsers(usersList);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Login failed. Please try again.' };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'student' | 'teacher' | 'admin'
  ): Promise<{ error: string | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error) {
      return { error: 'Sign up failed. Please try again.' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
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

  // Fetch all users when user logs in (for admin/teacher views)
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'teacher')) {
      fetchAllUsers();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      login,
      signUp,
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