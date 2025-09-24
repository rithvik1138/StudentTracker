-- Update teachers for different subjects to show variety
UPDATE public.subjects 
SET teacher = CASE 
  WHEN name = 'CIE' THEN 'Dr. Ravi Kumar'
  WHEN name = 'CICD' THEN 'Prof. Sharma'
  WHEN name = 'TOC' THEN 'Dr. Narayana'
  WHEN name = 'Certification Course' THEN 'Ms. Priya Singh'
  ELSE teacher
END;