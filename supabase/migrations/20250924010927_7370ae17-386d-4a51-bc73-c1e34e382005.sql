-- First, let's add sample attendance and grades data only for students that exist in app_users
-- This will work with the current foreign key constraints

-- Add attendance data for September 2025 for app_users students only
WITH september_dates AS (
  SELECT date_series::date as date
  FROM generate_series('2025-09-01'::date, '2025-09-30'::date, '1 day'::interval) as date_series
  WHERE EXTRACT(DOW FROM date_series) BETWEEN 1 AND 5
),
student_subjects AS (
  SELECT au.id as student_id, s.name as subject
  FROM public.app_users au
  CROSS JOIN public.subjects s
  WHERE au.role = 'student'
)
INSERT INTO public.attendance (student_id, subject, status, date)
SELECT 
  ss.student_id,
  ss.subject,
  CASE 
    WHEN RANDOM() > 0.2 THEN 'present'
    ELSE 'absent'
  END as status,
  sd.date
FROM student_subjects ss
CROSS JOIN september_dates sd
ON CONFLICT DO NOTHING;

-- Add grades data for app_users students only
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
WHERE au.role = 'student'
ON CONFLICT DO NOTHING;