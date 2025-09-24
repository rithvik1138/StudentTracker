-- Clear current subjects and add the correct ones
DELETE FROM public.grades;
DELETE FROM public.attendance;  
DELETE FROM public.subjects;

-- Add the correct subjects
INSERT INTO public.subjects (name, teacher, credits) VALUES 
  ('CIE', 'Narayana', 4),
  ('CICD', 'Narayana', 3),
  ('TOC', 'Dr. Smith', 3),
  ('Certification Course', 'Prof. Johnson', 2);

-- Add grades for all students with the new subjects
INSERT INTO public.grades (student_id, subject_id, grade, obtained_marks, max_marks) 
SELECT 
  au.id as student_id,
  s.id as subject_id,
  CASE 
    WHEN au.name = 'Rithvik' THEN 9.0 + (RANDOM() * 1.0)
    WHEN au.name = 'Jeethu' THEN 8.0 + (RANDOM() * 1.5)
    WHEN au.name = 'Pardhav' THEN 8.2 + (RANDOM() * 1.3)
    ELSE 7.0 + (RANDOM() * 2.0)
  END as grade,
  CASE 
    WHEN au.name = 'Rithvik' THEN 90 + (RANDOM() * 10)::int
    WHEN au.name = 'Jeethu' THEN 80 + (RANDOM() * 15)::int
    WHEN au.name = 'Pardhav' THEN 82 + (RANDOM() * 13)::int
    ELSE 70 + (RANDOM() * 20)::int
  END as obtained_marks,
  100 as max_marks
FROM public.app_users au
CROSS JOIN public.subjects s
WHERE au.role = 'student';