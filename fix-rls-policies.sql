-- Fix Row Level Security (RLS) Policies for MindPex
-- This allows the browser (using anon key) to read employee data

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON employees;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON employees;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON employees;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON employees;

-- Create new policies that allow public read access
-- Allow anyone to SELECT (read) employee data
CREATE POLICY "Allow public read access"
ON employees
FOR SELECT
TO public
USING (true);

-- Allow service role to INSERT
CREATE POLICY "Allow service role insert"
ON employees
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service role to UPDATE
CREATE POLICY "Allow service role update"
ON employees
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Allow service role to DELETE
CREATE POLICY "Allow service role delete"
ON employees
FOR DELETE
TO service_role
USING (true);

-- Verify RLS is enabled (it should be)
-- If you need to enable RLS, uncomment the line below:
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
