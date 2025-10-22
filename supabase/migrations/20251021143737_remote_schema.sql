revoke delete on table "public"."security_definer_audit" from "anon";
revoke insert on table "public"."security_definer_audit" from "anon";
revoke references on table "public"."security_definer_audit" from "anon";
revoke select on table "public"."security_definer_audit" from "anon";
revoke trigger on table "public"."security_definer_audit" from "anon";
revoke truncate on table "public"."security_definer_audit" from "anon";
revoke update on table "public"."security_definer_audit" from "anon";
revoke delete on table "public"."security_definer_audit" from "authenticated";
revoke insert on table "public"."security_definer_audit" from "authenticated";
revoke references on table "public"."security_definer_audit" from "authenticated";
revoke select on table "public"."security_definer_audit" from "authenticated";
revoke trigger on table "public"."security_definer_audit" from "authenticated";
revoke truncate on table "public"."security_definer_audit" from "authenticated";
revoke update on table "public"."security_definer_audit" from "authenticated";
revoke delete on table "public"."security_definer_audit" from "service_role";
revoke insert on table "public"."security_definer_audit" from "service_role";
revoke references on table "public"."security_definer_audit" from "service_role";
revoke select on table "public"."security_definer_audit" from "service_role";
revoke trigger on table "public"."security_definer_audit" from "service_role";
revoke truncate on table "public"."security_definer_audit" from "service_role";
revoke update on table "public"."security_definer_audit" from "service_role";
set check_function_bodies = off;
CREATE OR REPLACE FUNCTION public.calculate_competency_gap(employee_id integer)
 RETURNS numeric
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
    role_name_text TEXT;
    total_required_level INT;
    mock_current_level INT;
    gap_score NUMERIC;
BEGIN
    -- 1. Get the employee's JobRole (Note: double quotes for case-sensitive column name)
    SELECT "JobRole" INTO role_name_text FROM employees WHERE "EmployeeNumber" = employee_id;

    -- If no role is found, exit
    IF role_name_text IS NULL THEN
        RETURN 0.0;
    END IF;

    -- 2. Calculate the total required level for that role from job_roles/target_competencies
    SELECT SUM(tc.required_level)
    INTO total_required_level
    FROM job_roles jr
    JOIN target_competencies tc ON jr.role_id = tc.role_id
    WHERE jr.role_name = role_name_text;

    -- Fallback for roles with no defined competencies (Assume 100% ready)
    IF total_required_level IS NULL OR total_required_level = 0 THEN
        UPDATE employees SET competency_gap_score = 100.00 WHERE "EmployeeNumber" = employee_id;
        RETURN 100.00;
    END IF;

    -- 3. Mock the Employee's Current Competency Level (MVP Logic using existing columns)
    -- This uses a simple calculation based on YearsAtCompany and JobInvolvement
    SELECT ((e."YearsAtCompany" * 2) + (e."JobInvolvement" * 3))
    INTO mock_current_level
    FROM employees e WHERE "EmployeeNumber" = employee_id;

    -- Cap current level at the required level (can't be more than 100% ready)
    mock_current_level := LEAST(mock_current_level, total_required_level);

    -- 4. Calculate the score and update the employees table
    gap_score := (CAST(mock_current_level AS NUMERIC) / total_required_level) * 100.00;

    UPDATE employees
    SET competency_gap_score = gap_score
    WHERE "EmployeeNumber" = employee_id;

    RETURN gap_score;
END;
$function$;
CREATE OR REPLACE FUNCTION public.check_promotion_readiness(employee_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_catalog'
AS $function$
DECLARE
    c_gap_score NUMERIC;
    is_ready BOOLEAN;
    p_score TEXT;
BEGIN
    -- 1. Fetch the latest competency gap score
    SELECT competency_gap_score
    INTO c_gap_score
    FROM public.employees
    WHERE "EmployeeNumber" = employee_id;

    -- 2. Determine readiness (FR-SRI-04: >= 80% of target)
    is_ready := (c_gap_score >= 80.00);

    -- 3. Determine Potential Score (X-axis for 9-Box Grid)
    CASE
        WHEN c_gap_score >= 90.00 THEN p_score := 'High';
        WHEN c_gap_score >= 70.00 THEN p_score := 'Medium';
        ELSE p_score := 'Low';
    END CASE;

    -- 4. Update the employees table (schema-qualified)
    UPDATE public.employees
    SET
        promotion_readiness_flag = is_ready,
        potential_score = p_score
    WHERE "EmployeeNumber" = employee_id;

    RETURN is_ready;
END;
$function$;
CREATE OR REPLACE FUNCTION public.set_target_competency_user_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_catalog'
AS $function$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := (SELECT auth.uid());
  END IF;
  RETURN NEW;
END;
$function$;
