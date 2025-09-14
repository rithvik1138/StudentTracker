-- Initial database schema for Student Tracker Application

-- Create custom types
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- Create app_users table
CREATE TABLE IF NOT EXISTS public.app_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    cgpa NUMERIC DEFAULT NULL::numeric,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    teacher TEXT NOT NULL,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grades table
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    subject_id UUID NOT NULL,
    grade NUMERIC NOT NULL,
    obtained_marks NUMERIC NOT NULL,
    max_marks NUMERIC NOT NULL DEFAULT 10.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    subject TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'::text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for app_users
CREATE POLICY "Users can view all users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON public.app_users FOR UPDATE USING (true);
CREATE POLICY "Admins can manage users" ON public.app_users FOR ALL USING (true);

-- Create RLS Policies for subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage subjects" ON public.subjects FOR ALL USING (true);

-- Create RLS Policies for grades
CREATE POLICY "Anyone can view grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage grades" ON public.grades FOR ALL USING (true);

-- Create RLS Policies for attendance
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage attendance" ON public.attendance FOR ALL USING (true);

-- Create RLS Policies for assignments
CREATE POLICY "Anyone can view assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage assignments" ON public.assignments FOR ALL USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_app_users_updated_at
    BEFORE UPDATE ON public.app_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
    BEFORE UPDATE ON public.subjects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grades_updated_at
    BEFORE UPDATE ON public.grades
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.app_users (id, email, name, password_hash, role, cgpa) VALUES
('admin-001', 'admin@school.edu', 'Administrator', 'admin123', 'admin', NULL),
('teacher-001', 'john.doe@school.edu', 'John Doe', 'password123', 'teacher', NULL),
('teacher-002', 'jane.smith@school.edu', 'Jane Smith', 'password123', 'teacher', NULL),
('student-001', 'alice.johnson@student.edu', 'Alice Johnson', 'password123', 'student', 0),
('student-002', 'bob.wilson@student.edu', 'Bob Wilson', 'password123', 'student', 0),
('student-003', 'charlie.brown@student.edu', 'Charlie Brown', 'password123', 'student', 0);

INSERT INTO public.subjects (id, name, teacher, credits) VALUES
('subject-001', 'Mathematics', 'John Doe', 4),
('subject-002', 'Physics', 'Jane Smith', 3),
('subject-003', 'Chemistry', 'John Doe', 3),
('subject-004', 'Computer Science', 'Jane Smith', 4);

INSERT INTO public.grades (id, student_id, subject_id, grade, obtained_marks, max_marks) VALUES
('grade-001', 'student-001', 'subject-001', 8.5, 8.5, 10),
('grade-002', 'student-001', 'subject-002', 9.0, 9.0, 10),
('grade-003', 'student-002', 'subject-001', 7.5, 7.5, 10),
('grade-004', 'student-002', 'subject-002', 8.0, 8.0, 10);

INSERT INTO public.attendance (id, student_id, subject, date, status) VALUES
('attendance-001', 'student-001', 'Mathematics', '2024-01-15', 'present'),
('attendance-002', 'student-001', 'Physics', '2024-01-15', 'present'),
('attendance-003', 'student-002', 'Mathematics', '2024-01-15', 'absent'),
('attendance-004', 'student-002', 'Physics', '2024-01-15', 'present');

INSERT INTO public.assignments (id, title, subject, due_date, status) VALUES
('assignment-001', 'Algebra Problems', 'Mathematics', '2024-02-01', 'pending'),
('assignment-002', 'Physics Lab Report', 'Physics', '2024-02-05', 'pending'),
('assignment-003', 'Chemical Reactions Study', 'Chemistry', '2024-02-10', 'pending');