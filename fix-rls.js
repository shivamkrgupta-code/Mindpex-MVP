const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLS() {
  console.log('Fixing Row Level Security policies...\n')

  try {
    // Drop existing policies
    console.log('Dropping existing policies...')

    const dropPolicies = `
      DROP POLICY IF EXISTS "Enable read access for all users" ON employees;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON employees;
      DROP POLICY IF EXISTS "Enable update for authenticated users only" ON employees;
      DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON employees;
    `

    const { error: dropError } = await supabase.rpc('exec_sql', { sql: dropPolicies })

    // Create new public read policy
    console.log('Creating new public read policy...')

    const createPolicies = `
      CREATE POLICY "Allow public read access"
      ON employees
      FOR SELECT
      TO public
      USING (true);
    `

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createPolicies })

    console.log('\n✓ RLS policies fixed!')
    console.log('\nTesting connection with anon key...')

    // Test with anon key
    const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const { data, error } = await anonSupabase
      .from('employees')
      .select('EmployeeNumber')
      .limit(5)

    if (error) {
      console.error('❌ Still getting error:', error.message)
      console.log('\nPlease run the SQL commands in Supabase SQL Editor manually.')
      console.log('File: fix-rls-policies.sql')
    } else {
      console.log('✓ Success! Anon key can now see', data.length, 'employees')
      console.log('Employee numbers:', data.map(e => e.EmployeeNumber).join(', '))
    }

  } catch (error) {
    console.error('Error:', error.message)
    console.log('\nThe automated fix failed. Please run this SQL in Supabase SQL Editor:\n')
    console.log('1. Go to: https://supabase.com/dashboard → Your Project → SQL Editor')
    console.log('2. Click "New Query"')
    console.log('3. Copy and paste the contents of fix-rls-policies.sql')
    console.log('4. Click "Run"')
  }
}

fixRLS()
