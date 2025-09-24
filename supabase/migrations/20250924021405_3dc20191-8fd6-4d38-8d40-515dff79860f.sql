-- Adjust Rithvik's attendance to exactly 85% (75 present out of 88 total)
-- First, set some records to absent to achieve 75 present
UPDATE public.attendance 
SET status = 'absent'
WHERE student_id = '550e8400-e29b-41d4-a716-446655440001' 
AND status = 'present'
AND id IN (
    SELECT id FROM public.attendance 
    WHERE student_id = '550e8400-e29b-41d4-a716-446655440001' 
    AND status = 'present'
    ORDER BY date DESC
    LIMIT 3
);

-- Update Rithvik's grades to achieve exactly 9.00 CGPA
UPDATE public.grades 
SET grade = 9.00, obtained_marks = 90.00
WHERE student_id = '550e8400-e29b-41d4-a716-446655440001';