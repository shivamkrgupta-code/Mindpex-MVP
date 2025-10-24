const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Using Service Role Key for import...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Path to your CSV file
const csvFilePath = path.join('C:', 'Users', 'hp', 'Downloads', 'archive', 'WA_Fn-UseC_-HR-Employee-Attrition.csv')

function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  // Handle both Windows (\r\n) and Unix (\n) line endings
  const lines = fileContent.replace(/\r\n/g, '\n').split('\n').filter(line => line.trim())

  // Remove BOM if present
  const headers = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim())

  const employees = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length !== headers.length) continue

    const employee = {}
    headers.forEach((header, index) => {
      const value = values[index].trim()

      // Parse integers for numeric fields
      if (['Age', 'DailyRate', 'DistanceFromHome', 'Education', 'EmployeeCount',
           'EmployeeNumber', 'EnvironmentSatisfaction', 'HourlyRate', 'JobInvolvement',
           'JobLevel', 'JobSatisfaction', 'MonthlyIncome', 'MonthlyRate',
           'NumCompaniesWorked', 'PercentSalaryHike', 'PerformanceRating',
           'RelationshipSatisfaction', 'StandardHours', 'StockOptionLevel',
           'TotalWorkingYears', 'TrainingTimesLastYear', 'WorkLifeBalance',
           'YearsAtCompany', 'YearsInCurrentRole', 'YearsSinceLastPromotion',
           'YearsWithCurrManager'].includes(header)) {
        employee[header] = parseInt(value) || 0
      } else {
        employee[header] = value
      }
    })

    employees.push(employee)
  }

  return employees
}

async function importData() {
  try {
    console.log('Starting fresh CSV import...')
    console.log('Reading CSV from:', csvFilePath)

    const allEmployees = parseCSV(csvFilePath)
    console.log(`✓ Parsed ${allEmployees.length} employees from CSV`)

    // Import ALL employees
    const employeesToImport = allEmployees
    console.log(`✓ Importing all ${employeesToImport.length} employees...\n`)

    let successCount = 0
    const batchSize = 10

    for (let i = 0; i < employeesToImport.length; i += batchSize) {
      const batch = employeesToImport.slice(i, i + batchSize)

      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}...`)

      const { data, error } = await supabase
        .from('employees')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Error inserting batch: ${error.message}`)
        console.error('Full error details:', JSON.stringify(error, null, 2))
        continue
      }

      successCount += data.length
      console.log(`✓ Inserted ${data.length} employees (Total: ${successCount})`)
    }

    console.log(`\n✓ Successfully imported ${successCount} employees!`)

    console.log('\n✓ Data import completed successfully!')
    console.log('\nYou can now refresh your browser at http://localhost:3001')

  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

importData()
