-- ================================
-- Create sequence for audit table
-- ================================
CREATE SEQUENCE IF NOT EXISTS "public"."security_definer_audit_id_seq";

-- ================================
-- Drop existing policies
-- ================================
DROP POLICY IF EXISTS "Admins can manage all employees" ON "public"."employees";
DROP POLICY IF EXISTS "Viewers can read employees data" ON "public"."employees";
DROP POLICY IF EXISTS "job_roles_admin_all" ON "public"."job_roles";
DROP POLICY IF EXISTS "job_roles_auth_update" ON "public"."job_roles";
DROP POLICY IF EXISTS "user_roles_admin_select" ON "public"."user_roles";
DROP POLICY IF EXISTS "user_roles_owner_select" ON "public"."user_roles";

-- ================================
-- Revoke permissions explicitly
-- ================================
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.employees FROM anon;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.employees FROM authenticated;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.employees FROM service_role;

REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.job_roles FROM anon;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.job_roles FROM authenticated;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.job_roles FROM service_role;

REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.target_competencies FROM anon;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.target_competencies FROM authenticated;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.target_competencies FROM service_role;

REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.user_roles FROM anon;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.user_roles FROM authenticated;
REVOKE DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.user_roles FROM service_role;

-- ================================
-- Drop views
-- ================================
DROP VIEW IF EXISTS "public"."nine_box_grid_all";
DROP VIEW IF EXISTS "public"."nine_box_grid_data";
DROP VIEW IF EXISTS "public"."nine_box_grid_data_v2";

-- ================================
-- Drop constraints/indexes
-- ================================
ALTER TABLE "public"."employees" DROP CONSTRAINT IF EXISTS "employees_pkey";
DROP INDEX IF EXISTS "public"."idx_target_competencies_user_id";
DROP INDEX IF EXISTS "public"."idx_user_roles_user_id";
DROP INDEX IF EXISTS "public"."employees_pkey";

-- ================================
-- Create audit table
-- ================================
CREATE TABLE IF NOT EXISTS "public"."security_definer_audit" (
    "id" integer NOT NULL DEFAULT nextval('security_definer_audit_id_seq'::regclass),
    "schema_name" text NOT NULL,
    "object_name" text NOT NULL,
    "object_type" text NOT NULL,
    "definition" text NOT NULL,
    "captured_at" timestamp with time zone DEFAULT now()
);
ALTER TABLE "public"."security_definer_audit" ENABLE ROW LEVEL SECURITY;

-- ================================
-- Drop and recreate employee columns
-- ================================
ALTER TABLE "public"."employees" 
    DROP COLUMN IF EXISTS "Age",
    DROP COLUMN IF EXISTS "Attrition",
    DROP COLUMN IF EXISTS "BusinessTravel",
    DROP COLUMN IF EXISTS "DailyRate",
    DROP COLUMN IF EXISTS "Department",
    DROP COLUMN IF EXISTS "DistanceFromHome",
    DROP COLUMN IF EXISTS "Education",
    DROP COLUMN IF EXISTS "EducationField",
    DROP COLUMN IF EXISTS "EmployeeCount",
    DROP COLUMN IF EXISTS "EmployeeNumber",
    DROP COLUMN IF EXISTS "EnvironmentSatisfaction",
    DROP COLUMN IF EXISTS "Gender",
    DROP COLUMN IF EXISTS "HourlyRate",
    DROP COLUMN IF EXISTS "JobInvolvement",
    DROP COLUMN IF EXISTS "JobLevel",
    DROP COLUMN IF EXISTS "JobRole",
    DROP COLUMN IF EXISTS "JobSatisfaction",
    DROP COLUMN IF EXISTS "MaritalStatus",
    DROP COLUMN IF EXISTS "MonthlyIncome",
    DROP COLUMN IF EXISTS "MonthlyRate",
    DROP COLUMN IF EXISTS "NumCompaniesWorked",
    DROP COLUMN IF EXISTS "Over18",
    DROP COLUMN IF EXISTS "OverTime",
    DROP COLUMN IF EXISTS "PercentSalaryHike",
    DROP COLUMN IF EXISTS "PerformanceRating",
    DROP COLUMN IF EXISTS "RelationshipSatisfaction",
    DROP COLUMN IF EXISTS "StandardHours",
    DROP COLUMN IF EXISTS "StockOptionLevel",
    DROP COLUMN IF EXISTS "TotalWorkingYears",
    DROP COLUMN IF EXISTS "TrainingTimesLastYear",
    DROP COLUMN IF EXISTS "WorkLifeBalance",
    DROP COLUMN IF EXISTS "YearsAtCompany",
    DROP COLUMN IF EXISTS "YearsInCurrentRole",
    DROP COLUMN IF EXISTS "YearsSinceLastPromotion",
    DROP COLUMN IF EXISTS "YearsWithCurrManager";

ALTER TABLE "public"."employees" 
    ADD COLUMN "Age" integer,
    ADD COLUMN "Attrition" text,
    ADD COLUMN "BusinessTravel" text,
    ADD COLUMN "DailyRate" integer,
    ADD COLUMN "Department" text,
    ADD COLUMN "DistanceFromHome" integer,
    ADD COLUMN "Education" integer,
    ADD COLUMN "EducationField" text,
    ADD COLUMN "EmployeeCount" integer,
    ADD COLUMN "EmployeeNumber" integer NOT NULL,
    ADD COLUMN "EnvironmentSatisfaction" integer,
    ADD COLUMN "Gender" text,
    ADD COLUMN "HourlyRate" integer,
    ADD COLUMN "JobInvolvement" integer,
    ADD COLUMN "JobLevel" integer,
    ADD COLUMN "JobRole" text,
    ADD COLUMN "JobSatisfaction" integer,
    ADD COLUMN "MaritalStatus" text,
    ADD COLUMN "MonthlyIncome" integer,
    ADD COLUMN "MonthlyRate" integer,
    ADD COLUMN "NumCompaniesWorked" integer,
    ADD COLUMN "Over18" text,
    ADD COLUMN "OverTime" text,
    ADD COLUMN "PercentSalaryHike" integer,
    ADD COLUMN "PerformanceRating" integer,
    ADD COLUMN "RelationshipSatisfaction" integer,
    ADD COLUMN "StandardHours" integer,
    ADD COLUMN "StockOptionLevel" integer,
    ADD COLUMN "TotalWorkingYears" integer,
    ADD COLUMN "TrainingTimesLastYear" integer,
    ADD COLUMN "WorkLifeBalance" integer,
    ADD COLUMN "YearsAtCompany" integer,
    ADD COLUMN "YearsInCurrentRole" integer,
    ADD COLUMN "YearsSinceLastPromotion" integer,
    ADD COLUMN "YearsWithCurrManager" integer;

-- ================================
-- Sequence ownership and indexes
-- ================================
ALTER SEQUENCE "public"."security_definer_audit_id_seq" OWNED BY "public"."security_definer_audit"."id";
CREATE UNIQUE INDEX IF NOT EXISTS security_definer_audit_pkey ON public.security_definer_audit USING btree (id);
CREATE UNIQUE INDEX IF NOT EXISTS employees_pkey ON public.employees USING btree ("EmployeeNumber");
ALTER TABLE "public"."security_definer_audit" ADD CONSTRAINT "security_definer_audit_pkey" PRIMARY KEY USING INDEX "security_definer_audit_pkey";
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_pkey" PRIMARY KEY USING INDEX "employees_pkey";

-- ================================
-- Functions
-- ================================
-- 1. Calculate Competency Gap
CREATE OR REPLACE FUNCTION public.calculate_competency_gap(employee_id integer)
RETURNS numeric
LANGUAGE plpgsql
AS $function$
DECLARE
    role_name_text TEXT;
    total_required_level INT;
    mock_current_level INT;
    gap_score NUMERIC;
BEGIN
    SELECT "JobRole" INTO role_name_text FROM employees WHERE "EmployeeNumber" = employee_id;
    IF role_name_text IS NULL THEN RETURN 0.0; END IF;

    SELECT SUM(tc.required_level)
    INTO total_required_level
    FROM job_roles jr
    JOIN target_competencies tc ON jr.role_id = tc.role_id
    WHERE jr.role_name = role_name_text;

    IF total_required_level IS NULL OR total_required_level = 0 THEN
        UPDATE employees SET competency_gap_score = 100.00 WHERE "EmployeeNumber" = employee_id;
        RETURN 100.00;
    END IF;

    SELECT ((e."YearsAtCompany" * 2) + (e."JobInvolvement" * 3))
    INTO mock_current_level
    FROM employees e WHERE "EmployeeNumber" = employee_id;

    mock_current_level := LEAST(mock_current_level, total_required_level);
    gap_score := (CAST(mock_current_level AS NUMERIC) / total_required_level) * 100.00;

    UPDATE employees
    SET competency_gap_score = gap_score
    WHERE "EmployeeNumber" = employee_id;

    RETURN gap_score;
END;
$function$;

-- 2. Check Promotion Readiness
CREATE OR REPLACE FUNCTION public.check_promotion_readiness(employee_id integer)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
    c_gap_score NUMERIC;
    is_ready BOOLEAN;
    p_score TEXT;
BEGIN
    SELECT competency_gap_score INTO c_gap_score FROM public.employees WHERE "EmployeeNumber" = employee_id;
    is_ready := (c_gap_score >= 80.00);

    CASE
        WHEN c_gap_score >= 90.00 THEN p_score := 'High';
        WHEN c_gap_score >= 70.00 THEN p_score := 'Medium';
        ELSE p_score := 'Low';
    END CASE;

    UPDATE public.employees
    SET promotion_readiness_flag = is_ready,
        potential_score = p_score
    WHERE "EmployeeNumber" = employee_id;

    RETURN is_ready;
END;
$function$;

-- 3. Set Target Competency User ID Trigger Function
CREATE OR REPLACE FUNCTION public.set_target_competency_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    IF NEW.user_id IS NULL THEN
        NEW.user_id := (SELECT auth.uid());
    END IF;
    RETURN NEW;
END;
$function$;

-- ================================
-- Views
-- ================================
CREATE OR REPLACE VIEW "public"."nine_box_grid_all" AS
SELECT "EmployeeNumber", "MonthlyIncome", "JobRole", "PerformanceRating", potential_score, competency_gap_score, promotion_readiness_flag
FROM employees;

CREATE OR REPLACE VIEW "public"."nine_box_grid_data_v2" AS
WITH income_bounds AS (
    SELECT 
        percentile_cont(0.25) WITHIN GROUP (ORDER BY "MonthlyIncome"::double precision) AS q1,
        percentile_cont(0.50) WITHIN GROUP (ORDER BY "MonthlyIncome"::double precision) AS q2,
        percentile_cont(0.75) WITHIN GROUP (ORDER BY "MonthlyIncome"::double precision) AS q3
    FROM employees
    WHERE "MonthlyIncome" IS NOT NULL
)
SELECT e."EmployeeNumber",
       e."MonthlyIncome",
       e."JobRole",
       e."PerformanceRating",
       CASE
           WHEN e."PerformanceRating" >= 4 THEN 'High'
           WHEN e."MonthlyIncome" >= ib.q3 THEN 'High'
           WHEN e."PerformanceRating" = 3 THEN 'Medium'
           WHEN e."MonthlyIncome" >= ib.q2 THEN 'Medium'
           ELSE 'Low'
       END AS potential_score,
       ROUND(100.0 * (1.0 - (COALESCE(e."PerformanceRating", 0)::numeric / 5.0)), 2) AS competency_gap_score,
       CASE
           WHEN (CASE
                    WHEN e."PerformanceRating" >= 4 THEN 'High'
                    WHEN e."MonthlyIncome" >= ib.q3 THEN 'High'
                    WHEN e."PerformanceRating" = 3 THEN 'Medium'
                    WHEN e."MonthlyIncome" >= ib.q2 THEN 'Medium'
                    ELSE 'Low'
                 END = 'High' AND COALESCE(e."PerformanceRating",0) >= 4) THEN true
           ELSE false
       END AS promotion_readiness_flag
FROM employees e CROSS JOIN income_bounds ib
WHERE e."Attrition" = 'No';

CREATE OR REPLACE VIEW "public"."nine_box_grid_data" AS
SELECT * FROM nine_box_grid_data_v2;

-- ================================
-- Trigger
-- ================================
DROP TRIGGER IF EXISTS trg_set_target_competency_user_id ON "public"."target_competencies";
CREATE TRIGGER trg_set_target_competency_user_id
BEFORE INSERT ON "public"."target_competencies"
FOR EACH ROW
EXECUTE FUNCTION public.set_target_competency_user_id();

-- ================================
-- Policies
-- ================================
CREATE POLICY "employees_select"
ON "public"."employees"
AS permissive
FOR SELECT
TO authenticated
USING (
    (auth.jwt() ->> 'app_role' = 'administrator') OR
    (auth.jwt() ->> 'user_role' = 'admin') OR
    (auth.jwt() ->> 'app_role' = 'viewer') OR
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.app_role = ANY(ARRAY['administrator','viewer'])
    )
);

CREATE POLICY "job_roles_update_consolidated"
ON "public"."job_roles"
AS permissive
FOR UPDATE
TO authenticated
USING (
    (auth.jwt() ->> 'user_role' = 'administrator') OR
    (auth.jwt() ->> 'app_role' = 'administrator') OR
    (auth.uid() IS NOT NULL)
)
WITH CHECK (
    (auth.jwt() ->> 'user_role' = 'administrator') OR
    (auth.jwt() ->> 'app_role' = 'administrator') OR
    (auth.uid() IS NOT NULL)
);

CREATE POLICY "security_definer_audit_admin_select"
ON "public"."security_definer_audit"
AS permissive
FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'user_role' = 'admin'));

CREATE POLICY "user_roles_select_consolidated"
ON "public"."user_roles"
AS permissive
FOR SELECT
TO public
USING ((auth.uid() = user_id) OR (app_role = 'administrator'));

