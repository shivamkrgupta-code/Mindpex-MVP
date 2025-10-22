create sequence "public"."job_roles_role_id_seq";
create sequence "public"."target_competencies_target_id_seq";
create table "public"."employees" (
    "EmployeeNumber" integer not null,
    "JobLevel" integer,
    "JobRole" text,
    "Department" text,
    "Education" integer,
    "EducationField" text,
    "PerformanceRating" integer,
    "BusinessTravel" text,
    "OverTime" text,
    "Attrition" text,
    "MonthlyIncome" integer,
    "HourlyRate" integer,
    "DailyRate" integer,
    "MonthlyRate" integer,
    "PercentSalaryHike" integer,
    "StockOptionLevel" integer,
    "Age" integer,
    "Gender" text,
    "MaritalStatus" text,
    "DistanceFromHome" integer,
    "EnvironmentSatisfaction" integer,
    "JobInvolvement" integer,
    "JobSatisfaction" integer,
    "RelationshipSatisfaction" integer,
    "WorkLifeBalance" integer,
    "TotalWorkingYears" integer,
    "YearsAtCompany" integer,
    "YearsInCurrentRole" integer,
    "YearsSinceLastPromotion" integer,
    "YearsWithCurrManager" integer,
    "NumCompaniesWorked" integer,
    "TrainingTimesLastYear" integer,
    "EmployeeCount" integer,
    "StandardHours" integer,
    "Over18" text,
    "competency_gap_score" numeric(5,2) default 0.0,
    "potential_score" text default 'Low'::text,
    "promotion_readiness_flag" boolean default false
);
alter table "public"."employees" enable row level security;
create table "public"."job_roles" (
    "role_id" integer not null default nextval('job_roles_role_id_seq'::regclass),
    "role_name" text not null
);
alter table "public"."job_roles" enable row level security;
create table "public"."target_competencies" (
    "target_id" integer not null default nextval('target_competencies_target_id_seq'::regclass),
    "role_id" integer,
    "competency_name" text not null,
    "required_level" integer not null,
    "user_id" uuid
);
alter table "public"."target_competencies" enable row level security;
create table "public"."user_roles" (
    "user_id" uuid not null,
    "app_role" text not null
);
alter table "public"."user_roles" enable row level security;
alter sequence "public"."job_roles_role_id_seq" owned by "public"."job_roles"."role_id";
alter sequence "public"."target_competencies_target_id_seq" owned by "public"."target_competencies"."target_id";
CREATE UNIQUE INDEX employees_pkey ON public.employees USING btree ("EmployeeNumber");
CREATE INDEX idx_target_competencies_user_id ON public.target_competencies USING btree (user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles USING btree (user_id);
CREATE UNIQUE INDEX job_roles_pkey ON public.job_roles USING btree (role_id);
CREATE UNIQUE INDEX job_roles_role_name_key ON public.job_roles USING btree (role_name);
CREATE UNIQUE INDEX target_competencies_pkey ON public.target_competencies USING btree (target_id);
CREATE UNIQUE INDEX target_competencies_role_id_competency_name_key ON public.target_competencies USING btree (role_id, competency_name);
CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (user_id);
alter table "public"."employees" add constraint "employees_pkey" PRIMARY KEY using index "employees_pkey";
alter table "public"."job_roles" add constraint "job_roles_pkey" PRIMARY KEY using index "job_roles_pkey";
alter table "public"."target_competencies" add constraint "target_competencies_pkey" PRIMARY KEY using index "target_competencies_pkey";
alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";
alter table "public"."job_roles" add constraint "job_roles_role_name_key" UNIQUE using index "job_roles_role_name_key";
alter table "public"."target_competencies" add constraint "target_competencies_required_level_check" CHECK (((required_level >= 1) AND (required_level <= 5))) not valid;
alter table "public"."target_competencies" validate constraint "target_competencies_required_level_check";
alter table "public"."target_competencies" add constraint "target_competencies_role_id_competency_name_key" UNIQUE using index "target_competencies_role_id_competency_name_key";
alter table "public"."target_competencies" add constraint "target_competencies_role_id_fkey" FOREIGN KEY (role_id) REFERENCES job_roles(role_id) ON DELETE CASCADE not valid;
alter table "public"."target_competencies" validate constraint "target_competencies_role_id_fkey";
alter table "public"."user_roles" add constraint "user_roles_app_role_check" CHECK ((app_role = ANY (ARRAY['administrator'::text, 'viewer'::text, 'employee'::text]))) not valid;
alter table "public"."user_roles" validate constraint "user_roles_app_role_check";
alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;
alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";
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
create or replace view "public"."nine_box_grid_all" as  SELECT "EmployeeNumber",
    "MonthlyIncome",
    "JobRole",
    "PerformanceRating",
    potential_score,
    competency_gap_score,
    promotion_readiness_flag
   FROM employees;
create or replace view "public"."nine_box_grid_data_v2" as  WITH income_bounds AS (
         SELECT percentile_cont((0.25)::double precision) WITHIN GROUP (ORDER BY ((employees."MonthlyIncome")::double precision)) AS q1,
            percentile_cont((0.50)::double precision) WITHIN GROUP (ORDER BY ((employees."MonthlyIncome")::double precision)) AS q2,
            percentile_cont((0.75)::double precision) WITHIN GROUP (ORDER BY ((employees."MonthlyIncome")::double precision)) AS q3
           FROM employees
          WHERE (employees."MonthlyIncome" IS NOT NULL)
        )
 SELECT e."EmployeeNumber",
    e."MonthlyIncome",
    e."JobRole",
    e."PerformanceRating",
        CASE
            WHEN (e."PerformanceRating" >= 4) THEN 'High'::text
            WHEN ((e."MonthlyIncome")::double precision >= ib.q3) THEN 'High'::text
            WHEN (e."PerformanceRating" = 3) THEN 'Medium'::text
            WHEN ((e."MonthlyIncome")::double precision >= ib.q2) THEN 'Medium'::text
            ELSE 'Low'::text
        END AS potential_score,
    round((100.0 * (1.0 - ((COALESCE(e."PerformanceRating", 0))::numeric / 5.0))), 2) AS competency_gap_score,
        CASE
            WHEN ((
            CASE
                WHEN (e."PerformanceRating" >= 4) THEN 'High'::text
                WHEN ((e."MonthlyIncome")::double precision >= ib.q3) THEN 'High'::text
                WHEN (e."PerformanceRating" = 3) THEN 'Medium'::text
                WHEN ((e."MonthlyIncome")::double precision >= ib.q2) THEN 'Medium'::text
                ELSE 'Low'::text
            END = 'High'::text) AND (COALESCE(e."PerformanceRating", 0) >= 4)) THEN true
            ELSE false
        END AS promotion_readiness_flag
   FROM (employees e
     CROSS JOIN income_bounds ib)
  WHERE (e."Attrition" = 'No'::text);
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
create or replace view "public"."nine_box_grid_data" as  SELECT "EmployeeNumber",
    "MonthlyIncome",
    "JobRole",
    "PerformanceRating",
    potential_score,
    competency_gap_score,
    promotion_readiness_flag
   FROM nine_box_grid_data_v2;
create policy "Admins can manage all employees"
on "public"."employees"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.app_role = 'administrator'::text)))));
create policy "Viewers can read employees data"
on "public"."employees"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.app_role = ANY (ARRAY['administrator'::text, 'viewer'::text]))))));
create policy "job_roles_admin_all"
on "public"."job_roles"
as permissive
for all
to authenticated
using (((auth.jwt() ->> 'user_role'::text) = 'administrator'::text))
with check (((auth.jwt() ->> 'user_role'::text) = 'administrator'::text));
create policy "job_roles_auth_delete"
on "public"."job_roles"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) IS NOT NULL));
create policy "job_roles_auth_insert"
on "public"."job_roles"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) IS NOT NULL));
create policy "job_roles_auth_update"
on "public"."job_roles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) IS NOT NULL))
with check ((( SELECT auth.uid() AS uid) IS NOT NULL));
create policy "job_roles_public_select"
on "public"."job_roles"
as permissive
for select
to public
using (true);
create policy "Owners can delete"
on "public"."target_competencies"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
create policy "Owners can insert"
on "public"."target_competencies"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "Owners can select"
on "public"."target_competencies"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
create policy "Owners can update"
on "public"."target_competencies"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "user_roles_admin_select"
on "public"."user_roles"
as permissive
for select
to authenticated
using (((auth.jwt() ->> 'user_role'::text) = 'administrator'::text));
create policy "user_roles_owner_delete"
on "public"."user_roles"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
create policy "user_roles_owner_insert"
on "public"."user_roles"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));
create policy "user_roles_owner_select"
on "public"."user_roles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));
create policy "user_roles_owner_update"
on "public"."user_roles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));
CREATE TRIGGER trg_set_user_id BEFORE INSERT ON public.target_competencies FOR EACH ROW EXECUTE FUNCTION set_target_competency_user_id();
