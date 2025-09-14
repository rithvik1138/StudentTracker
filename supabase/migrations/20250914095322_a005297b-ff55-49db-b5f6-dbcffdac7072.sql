-- Create users table for the app (separate from auth.users)
CREATE TABLE public.app_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin', 'teacher')),
  cgpa DECIMAL(3,2) DEFAULT NULL,
  password_hash TEXT NOT NULL, -- Store hashed passwords
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  teacher TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create grades table
CREATE TABLE public.grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  grade DECIMAL(3,2) NOT NULL,
  max_marks DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  obtained_marks DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, subject_id)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for app_users
CREATE POLICY "Users can view all users" ON public.app_users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON public.app_users FOR UPDATE USING (true);
CREATE POLICY "Admins can manage users" ON public.app_users FOR ALL USING (true);

-- Create policies for subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage subjects" ON public.subjects FOR ALL USING (true);

-- Create policies for grades
CREATE POLICY "Anyone can view grades" ON public.grades FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage grades" ON public.grades FOR ALL USING (true);

-- Create policies for attendance
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage attendance" ON public.attendance FOR ALL USING (true);

-- Create policies for assignments
CREATE POLICY "Anyone can view assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Admins and teachers can manage assignments" ON public.assignments FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_app_users_updated_at BEFORE UPDATE ON public.app_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert mock data with the same passwords
INSERT INTO public.app_users (id, name, email, role, cgpa, password_hash) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Rithvik', 'rithvik@student.com', 'student', 9.0, 'password123'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Jeethu', 'jeethu@student.com', 'student', 8.5, 'password123'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Pardhav', 'pardhav@student.com', 'student', 8.3, 'password123'),
  ('550e8400-e29b-41d4-a716-446655440004', 'D.Rithvik', 'admin@studenttracker.com', 'admin', NULL, 'admin123'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Narayana', 'narayana@teacher.com', 'teacher', NULL, 'teacher123');

-- Insert subjects with fixed UUIDs
INSERT INTO public.subjects (id, name, teacher, credits) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'CIE', 'Narayana', 4),
  ('650e8400-e29b-41d4-a716-446655440002', 'CICD', 'Narayana', 5),
  ('650e8400-e29b-41d4-a716-446655440003', 'TOC', 'Narayana', 4),
  ('650e8400-e29b-41d4-a716-446655440004', 'Certificate Course', 'Narayana', 5);

-- Insert grades
INSERT INTO public.grades (student_id, subject_id, grade, max_marks, obtained_marks) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 9.0, 10.0, 9.0),
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 9.0, 10.0, 9.0),
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440003', 9.0, 10.0, 9.0),
  ('550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 9.0, 10.0, 9.0),
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 8.5, 10.0, 8.5),
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 8.5, 10.0, 8.5),
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 8.5, 10.0, 8.5),
  ('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', 8.5, 10.0, 8.5),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 8.3, 10.0, 8.3),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', 8.3, 10.0, 8.3),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 8.3, 10.0, 8.3),
  ('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440004', 8.3, 10.0, 8.3);

-- Insert sample attendance data
INSERT INTO public.attendance (student_id, subject, date, status) VALUES
  -- Rithvik attendance
  ('550e8400-e29b-41d4-a716-446655440001', 'CIE', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440001', 'CICD', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440001', 'TOC', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Certificate Course', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440001', 'CIE', '2025-09-03', 'present'),
  ('550e8400-e29b-41d4-a716-446655440001', 'CICD', '2025-09-03', 'absent'),
  ('550e8400-e29b-41d4-a716-446655440001', 'TOC', '2025-09-03', 'present'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Certificate Course', '2025-09-03', 'present'),
  -- Jeethu attendance (100%)
  ('550e8400-e29b-41d4-a716-446655440002', 'CIE', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440002', 'CICD', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440002', 'TOC', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Certificate Course', '2025-09-02', 'present'),
  -- Pardhav attendance (lower)
  ('550e8400-e29b-41d4-a716-446655440003', 'CIE', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440003', 'CICD', '2025-09-02', 'absent'),
  ('550e8400-e29b-41d4-a716-446655440003', 'TOC', '2025-09-02', 'present'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Certificate Course', '2025-09-02', 'absent');

-- Insert assignments
INSERT INTO public.assignments (title, subject, due_date, status) VALUES
  ('Home Assignment of CIE', 'CIE', '2025-09-15', 'pending'),
  ('Home Assignment of CICD', 'CICD', '2025-09-20', 'pending');