const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://lmogwfwmmtpxfdrwfjar.supabase.co'
// Using service role key to bypass RLS for seeding
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxtb2d3ZndtbXRweGZkcndmamFyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDg1NzI3NywiZXhwIjoyMDc2NDMzMjc3fQ.HxvtQmhapHUK7UrmW6RE67OeutvSZIyF3A83Ec7io2os'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample employee data based on your screenshots
// Education: 1=Below College, 2=College, 3=Bachelor, 4=Master, 5=Doctor
const sampleEmployees = [
  { EmployeeNumber: 1, JobRole: 'Senior Engineer', Department: 'Engineering', PerformanceRating: 5, YearsAtCompany: 5, JobInvolvement: 4, Age: 35, Gender: 'Male', MaritalStatus: 'Married', Education: 4, EducationField: 'Technical', MonthlyIncome: 8000, Attrition: 'No' },
  { EmployeeNumber: 2, JobRole: 'Senior Engineer', Department: 'Engineering', PerformanceRating: 4, YearsAtCompany: 4, JobInvolvement: 4, Age: 32, Gender: 'Female', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 7500, Attrition: 'No' },
  { EmployeeNumber: 3, JobRole: 'Product Manager', Department: 'Product', PerformanceRating: 5, YearsAtCompany: 6, JobInvolvement: 5, Age: 38, Gender: 'Male', MaritalStatus: 'Married', Education: 4, EducationField: 'Business', MonthlyIncome: 9000, Attrition: 'No' },
  { EmployeeNumber: 4, JobRole: 'Junior Engineer', Department: 'Engineering', PerformanceRating: 3, YearsAtCompany: 2, JobInvolvement: 3, Age: 26, Gender: 'Female', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 5000, Attrition: 'No' },
  { EmployeeNumber: 5, JobRole: 'Engineering Manager', Department: 'Engineering', PerformanceRating: 4, YearsAtCompany: 7, JobInvolvement: 5, Age: 40, Gender: 'Male', MaritalStatus: 'Married', Education: 4, EducationField: 'Technical', MonthlyIncome: 12000, Attrition: 'No' },
  { EmployeeNumber: 6, JobRole: 'Product Director', Department: 'Product', PerformanceRating: 5, YearsAtCompany: 8, JobInvolvement: 5, Age: 42, Gender: 'Female', MaritalStatus: 'Married', Education: 4, EducationField: 'Business', MonthlyIncome: 15000, Attrition: 'No' },
  { EmployeeNumber: 7, JobRole: 'Mid-Level Engineer', Department: 'Engineering', PerformanceRating: 3, YearsAtCompany: 3, JobInvolvement: 3, Age: 28, Gender: 'Male', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 6000, Attrition: 'No' },
  { EmployeeNumber: 8, JobRole: 'Junior PM', Department: 'Product', PerformanceRating: 3, YearsAtCompany: 2, JobInvolvement: 3, Age: 27, Gender: 'Female', MaritalStatus: 'Single', Education: 3, EducationField: 'Business', MonthlyIncome: 5500, Attrition: 'No' },
  { EmployeeNumber: 9, JobRole: 'Senior Designer', Department: 'Design', PerformanceRating: 4, YearsAtCompany: 5, JobInvolvement: 4, Age: 34, Gender: 'Male', MaritalStatus: 'Married', Education: 3, EducationField: 'Design', MonthlyIncome: 7000, Attrition: 'No' },
  { EmployeeNumber: 10, JobRole: 'Senior Engineer', Department: 'Engineering', PerformanceRating: 4, YearsAtCompany: 4, JobInvolvement: 4, Age: 31, Gender: 'Female', MaritalStatus: 'Single', Education: 4, EducationField: 'Technical', MonthlyIncome: 7800, Attrition: 'No' },
  { EmployeeNumber: 11, JobRole: 'Junior Engineer', Department: 'Engineering', PerformanceRating: 2, YearsAtCompany: 1, JobInvolvement: 2, Age: 24, Gender: 'Male', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 4500, Attrition: 'No' },
  { EmployeeNumber: 12, JobRole: 'Mid-Level Engineer', Department: 'Engineering', PerformanceRating: 3, YearsAtCompany: 3, JobInvolvement: 3, Age: 29, Gender: 'Female', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 6200, Attrition: 'No' },
  { EmployeeNumber: 13, JobRole: 'Senior PM', Department: 'Product', PerformanceRating: 4, YearsAtCompany: 5, JobInvolvement: 4, Age: 36, Gender: 'Male', MaritalStatus: 'Married', Education: 4, EducationField: 'Business', MonthlyIncome: 10000, Attrition: 'No' },
  { EmployeeNumber: 14, JobRole: 'Junior Engineer', Department: 'Engineering', PerformanceRating: 2, YearsAtCompany: 1, JobInvolvement: 2, Age: 25, Gender: 'Female', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 4800, Attrition: 'No' },
  { EmployeeNumber: 15, JobRole: 'Mid-Level Engineer', Department: 'Engineering', PerformanceRating: 3, YearsAtCompany: 3, JobInvolvement: 3, Age: 30, Gender: 'Male', MaritalStatus: 'Single', Education: 3, EducationField: 'Technical', MonthlyIncome: 6500, Attrition: 'No' },
  { EmployeeNumber: 16, JobRole: 'Senior Engineer', Department: 'Engineering', PerformanceRating: 5, YearsAtCompany: 6, JobInvolvement: 5, Age: 37, Gender: 'Female', MaritalStatus: 'Married', Education: 4, EducationField: 'Technical', MonthlyIncome: 8500, Attrition: 'No' },
  { EmployeeNumber: 17, JobRole: 'Product Manager', Department: 'Product', PerformanceRating: 4, YearsAtCompany: 4, JobInvolvement: 4, Age: 33, Gender: 'Male', MaritalStatus: 'Married', Education: 3, EducationField: 'Business', MonthlyIncome: 8200, Attrition: 'No' }
]

async function seedDatabase() {
  console.log('Starting database seeding...')

  try {
    // Insert employees
    console.log('Inserting employees...')
    const { data, error } = await supabase
      .from('employees')
      .insert(sampleEmployees)
      .select()

    if (error) {
      console.error('Error inserting employees:', error)
      return
    }

    console.log(`✓ Successfully inserted ${data.length} employees`)

    // Calculate competency gaps for all employees
    console.log('\nCalculating competency gaps...')
    for (const emp of data) {
      const { data: gapData, error: gapError } = await supabase
        .rpc('calculate_competency_gap', { employee_id: emp.EmployeeNumber })

      if (gapError) {
        console.error(`Error calculating gap for employee ${emp.EmployeeNumber}:`, gapError)
      } else {
        console.log(`  Employee ${emp.EmployeeNumber}: Gap score = ${gapData}`)
      }

      // Check promotion readiness
      const { data: readyData, error: readyError } = await supabase
        .rpc('check_promotion_readiness', { employee_id: emp.EmployeeNumber })

      if (readyError) {
        console.error(`Error checking readiness for employee ${emp.EmployeeNumber}:`, readyError)
      }
    }

    console.log('\n✓ Database seeding completed successfully!')
    console.log('\nYou can now refresh your browser to see the data.')

  } catch (err) {
    console.error('Seeding error:', err)
  }
}

seedDatabase()
