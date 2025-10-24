const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://lmogwfwmmtpxfdrwfjar.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2d3ZndtbXRweGZkcndmamFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NTcyNzcsImV4cCI6MjA3NjQzMzI3N30.PEv9ZVbHG1ePiTZG-chk_jG35uNShEUvxlZ4UjhR8ds'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')

  try {
    // Test fetching employees
    const { data, error, count } = await supabase
      .from('employees')
      .select('*', { count: 'exact' })
      .limit(5)

    if (error) {
      console.error('Error fetching employees:', error)
      return
    }

    console.log(`✓ Successfully connected to Supabase!`)
    console.log(`✓ Found ${count} employees in database`)
    console.log(`✓ Sample data (first 5):`)
    console.log(data)

  } catch (err) {
    console.error('Connection error:', err)
  }
}

testConnection()
