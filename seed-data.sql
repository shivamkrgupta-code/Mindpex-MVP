-- Seed data for employees table
-- Run this in your Supabase SQL Editor

INSERT INTO public.employees (
  "EmployeeNumber", "JobRole", "Department", "PerformanceRating", "YearsAtCompany",
  "JobInvolvement", "Age", "Gender", "MaritalStatus", "Education", "EducationField",
  "MonthlyIncome", "Attrition"
) VALUES
  (1, 'Senior Engineer', 'Engineering', 5, 5, 4, 35, 'Male', 'Married', 4, 'Technical', 8000, 'No'),
  (2, 'Senior Engineer', 'Engineering', 4, 4, 4, 32, 'Female', 'Single', 3, 'Technical', 7500, 'No'),
  (3, 'Product Manager', 'Product', 5, 6, 5, 38, 'Male', 'Married', 4, 'Business', 9000, 'No'),
  (4, 'Junior Engineer', 'Engineering', 3, 2, 3, 26, 'Female', 'Single', 3, 'Technical', 5000, 'No'),
  (5, 'Engineering Manager', 'Engineering', 4, 7, 5, 40, 'Male', 'Married', 4, 'Technical', 12000, 'No'),
  (6, 'Product Director', 'Product', 5, 8, 5, 42, 'Female', 'Married', 4, 'Business', 15000, 'No'),
  (7, 'Mid-Level Engineer', 'Engineering', 3, 3, 3, 28, 'Male', 'Single', 3, 'Technical', 6000, 'No'),
  (8, 'Junior PM', 'Product', 3, 2, 3, 27, 'Female', 'Single', 3, 'Business', 5500, 'No'),
  (9, 'Senior Designer', 'Design', 4, 5, 4, 34, 'Male', 'Married', 3, 'Design', 7000, 'No'),
  (10, 'Senior Engineer', 'Engineering', 4, 4, 4, 31, 'Female', 'Single', 4, 'Technical', 7800, 'No'),
  (11, 'Junior Engineer', 'Engineering', 2, 1, 2, 24, 'Male', 'Single', 3, 'Technical', 4500, 'No'),
  (12, 'Mid-Level Engineer', 'Engineering', 3, 3, 3, 29, 'Female', 'Single', 3, 'Technical', 6200, 'No'),
  (13, 'Senior PM', 'Product', 4, 5, 4, 36, 'Male', 'Married', 4, 'Business', 10000, 'No'),
  (14, 'Junior Engineer', 'Engineering', 2, 1, 2, 25, 'Female', 'Single', 3, 'Technical', 4800, 'No'),
  (15, 'Mid-Level Engineer', 'Engineering', 3, 3, 3, 30, 'Male', 'Single', 3, 'Technical', 6500, 'No'),
  (16, 'Senior Engineer', 'Engineering', 5, 6, 5, 37, 'Female', 'Married', 4, 'Technical', 8500, 'No'),
  (17, 'Product Manager', 'Product', 4, 4, 4, 33, 'Male', 'Married', 3, 'Business', 8200, 'No')
ON CONFLICT ("EmployeeNumber") DO NOTHING;

-- Calculate competency gaps for all employees
DO $$
DECLARE
    emp_record RECORD;
BEGIN
    FOR emp_record IN SELECT "EmployeeNumber" FROM employees LOOP
        PERFORM calculate_competency_gap(emp_record."EmployeeNumber");
        PERFORM check_promotion_readiness(emp_record."EmployeeNumber");
    END LOOP;
END $$;

-- Verify the data
SELECT COUNT(*) as total_employees FROM employees;
SELECT * FROM employees LIMIT 5;
