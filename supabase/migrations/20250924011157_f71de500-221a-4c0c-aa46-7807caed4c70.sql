-- Add comprehensive attendance data for September 2025 with correct subjects
-- Rithvik gets good attendance (like before), others get varied attendance
WITH september_dates AS (
  SELECT date_series::date as date
  FROM generate_series('2025-09-01'::date, '2025-09-30'::date, '1 day'::interval) as date_series
  WHERE EXTRACT(DOW FROM date_series) BETWEEN 1 AND 5
),
student_subjects AS (
  SELECT au.id as student_id, s.name as subject, au.name as student_name
  FROM public.app_users au
  CROSS JOIN public.subjects s
  WHERE au.role = 'student'
)
INSERT INTO public.attendance (student_id, subject, status, date)
SELECT 
  ss.student_id,
  ss.subject,
  CASE 
    -- Rithvik gets excellent attendance (like before)
    WHEN ss.student_name = 'Rithvik' THEN 
      CASE 
        WHEN RANDOM() > 0.1 THEN 'present' 
        ELSE 'absent' 
      END
    -- Jeethu gets good attendance  
    WHEN ss.student_name = 'Jeethu' THEN 
      CASE 
        WHEN RANDOM() > 0.2 THEN 'present' 
        ELSE 'absent' 
      END
    -- Pardhav gets decent attendance
    WHEN ss.student_name = 'Pardhav' THEN 
      CASE 
        WHEN RANDOM() > 0.25 THEN 'present' 
        ELSE 'absent' 
      END
    -- Default case
    ELSE 
      CASE 
        WHEN RANDOM() > 0.2 THEN 'present' 
        ELSE 'absent' 
      END
  END as status,
  sd.date
FROM student_subjects ss
CROSS JOIN september_dates sd;