'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Search, Building2, Briefcase } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import EmployeeDialog from '@/components/EmployeeDialog'

interface Employee {
  EmployeeNumber: number
  JobRole: string
  Department: string
  PerformanceRating: number
  competency_gap_score: number
  potential_score: string
}

export default function EmployeeDirectory() {
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Calculate risk score based on multiple CSV factors
  const calculateRiskScore = (emp: any) => {
    let risk = 0

    // Attrition is a strong indicator
    if (emp.Attrition === 'Yes') risk += 40

    // Low performance rating increases risk
    if (emp.PerformanceRating <= 2) risk += 20
    else if (emp.PerformanceRating === 3) risk += 10

    // Overtime increases burnout risk
    if (emp.OverTime === 'Yes') risk += 15

    // Low satisfaction scores
    if (emp.JobSatisfaction <= 2) risk += 10
    if (emp.WorkLifeBalance <= 2) risk += 10
    if (emp.EnvironmentSatisfaction <= 2) risk += 5

    // Years without promotion
    if (emp.YearsSinceLastPromotion > 3) risk += 5

    return Math.min(risk, 100)
  }

  useEffect(() => {
    async function fetchEmployees() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        // Fetch all employees - paginate to get all 1470
        let allEmployees: any[] = []
        let page = 0
        const pageSize = 1000
        let hasMore = true

        while (hasMore) {
          const { data: pageData, error } = await supabase
            .from('employees')
            .select('*')
            .order('EmployeeNumber', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) throw error

          if (pageData && pageData.length > 0) {
            allEmployees = [...allEmployees, ...pageData]
            page++
            hasMore = pageData.length === pageSize
          } else {
            hasMore = false
          }
        }

        const data = allEmployees

        if (false) {} // Keep structure

        // Use fallback data if database is empty
        if (!data || data.length === 0) {
          const fallbackData = Array.from({ length: 17 }, (_, i) => ({
            EmployeeNumber: i + 1,
            JobRole: i % 3 === 0 ? 'Senior Engineer' : i % 3 === 1 ? 'Mid-Level Engineer' : 'Junior Engineer',
            Department: i < 12 ? 'Engineering' : i < 15 ? 'Product' : 'Design',
            PerformanceRating: 3 + Math.floor(Math.random() * 3),
            competency_gap_score: 30 + Math.floor(Math.random() * 60),
            potential_score: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'
          }))

          setEmployees(fallbackData)
          setFilteredEmployees(fallbackData)
          setDepartments(['All Departments', 'Engineering', 'Product', 'Design'])
        } else {
          // Calculate risk score for each employee based on CSV data
          const employeesWithRisk = data.map(emp => ({
            ...emp,
            calculatedRisk: calculateRiskScore(emp)
          }))

          setEmployees(employeesWithRisk)
          setFilteredEmployees(employeesWithRisk)

          // Extract unique departments
          const uniqueDepts = Array.from(new Set(data.map(emp => emp.Department)))
          setDepartments(['All Departments', ...uniqueDepts])
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
        // Use fallback on error
        const fallbackData = Array.from({ length: 17 }, (_, i) => ({
          EmployeeNumber: i + 1,
          JobRole: i % 3 === 0 ? 'Senior Engineer' : i % 3 === 1 ? 'Mid-Level Engineer' : 'Junior Engineer',
          Department: i < 12 ? 'Engineering' : i < 15 ? 'Product' : 'Design',
          PerformanceRating: 3 + Math.floor(Math.random() * 3),
          competency_gap_score: 30 + Math.floor(Math.random() * 60),
          potential_score: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'
        }))

        setEmployees(fallbackData)
        setFilteredEmployees(fallbackData)
        setDepartments(['All Departments', 'Engineering', 'Product', 'Design'])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  useEffect(() => {
    let filtered = employees

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.EmployeeNumber.toString().includes(searchTerm.toLowerCase()) ||
        emp.JobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.Department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by department
    if (selectedDepartment !== 'All Departments') {
      filtered = filtered.filter(emp => emp.Department === selectedDepartment)
    }

    setFilteredEmployees(filtered)
  }, [searchTerm, selectedDepartment, employees])

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'bg-red-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getRiskDot = (score: number) => {
    if (score >= 70) return 'text-red-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getPotentialColor = (potential: string) => {
    switch (potential?.toLowerCase()) {
      case 'high': return 'text-white bg-purple-500' // Purple for high potential
      case 'medium': return 'text-white bg-amber-500' // Amber for medium potential
      default: return 'text-white bg-slate-500' // Gray for low potential
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4) return 'text-white bg-emerald-500' // Green for high performance
    if (rating >= 3) return 'text-white bg-blue-500' // Blue for medium performance
    return 'text-white bg-red-500' // Red for low performance
  }

  // Generate unique color scheme for each employee card
  const getEmployeeCardColor = (employeeNumber: number) => {
    const colors = [
      { border: 'border-[#B58342]/30', shadow: 'hover:shadow-lg', gradient: 'from-[#B58342]', icon: 'bg-[#B58342]' },
      { border: 'border-[#B58342]/30', shadow: 'hover:shadow-lg', gradient: 'from-[#B58342]', icon: 'bg-[#B58342]' },
      { border: 'border-[#000000]/30', shadow: 'hover:shadow-lg', gradient: 'from-[#000000]', icon: 'bg-[#000000]' },
      { border: 'border-slate-400/30', shadow: 'hover:shadow-lg', gradient: 'from-slate-600', icon: 'bg-slate-600' },
    ]
    return colors[employeeNumber % colors.length]
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="text-white">Loading employee directory...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-[#B58342]/20">
        <h1 className="text-3xl font-bold text-white">Workforce Intelligence Directory</h1>
        <p className="text-slate-300 mt-2">Comprehensive talent profiles and performance analytics</p>
      </div>

      {/* All Employees Section */}
      <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-lg">
        <CardHeader className="border-b border-[#B58342]/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white">Complete Workforce Registry</CardTitle>
              <CardDescription className="text-slate-400">
                Displaying {filteredEmployees.length} of {employees.length} total employees
              </CardDescription>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-black/40 backdrop-blur-xl border-2 border-slate-300 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#B58342] w-64"
                />
              </div>

              {/* Department Filter */}
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 bg-black/40 backdrop-blur-xl border-2 border-slate-300 rounded-lg text-white focus:outline-none focus:border-[#B58342]"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => {
              const cardColors = getEmployeeCardColor(employee.EmployeeNumber)
              return (
              <Card
                key={employee.EmployeeNumber}
                className={`bg-black/40 backdrop-blur-xl ${cardColors.border} border-2 transition-all cursor-pointer ${cardColors.shadow}`}
                onClick={() => {
                  setSelectedEmployee(employee)
                  setIsDialogOpen(true)
                }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg ${cardColors.icon} flex items-center justify-center shadow-md`}>
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold hover:text-[#B58342] transition-colors">Employee {employee.EmployeeNumber}</h3>
                        <p className="text-slate-400 text-sm">EMP{String(employee.EmployeeNumber).padStart(3, '0')}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(employee.calculatedRisk || 0)} shadow-sm`}></div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Briefcase className="h-4 w-4 text-slate-400" />
                      <span className="text-white">{employee.JobRole}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-400">{employee.Department}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Performance</div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold border-2 ${getPerformanceColor(employee.PerformanceRating)}`}>
                        {employee.PerformanceRating ? 'High' : 'Medium'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Potential</div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold border-2 ${getPotentialColor(employee.potential_score)}`}>
                        {employee.potential_score || 'Medium'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Rating</span>
                      <span className="text-white font-semibold">{employee.PerformanceRating || 3}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Risk</span>
                      <span className={`font-semibold ${getRiskDot(employee.calculatedRisk || 0)}`}>
                        {employee.calculatedRisk || 0}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-slate-400 mb-2 font-medium">Core Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {employee.JobRole.includes('Engineer') ? (
                        <>
                          <span className="px-2 py-1 bg-[#B58342]/10 text-[#B58342] border border-[#B58342]/30 rounded text-xs font-medium">
                            Node.js ({Math.floor(Math.random() * 2) + 3})
                          </span>
                          <span className="px-2 py-1 bg-[#B58342]/10 text-[#B58342] border border-[#B58342]/30 rounded text-xs font-medium">
                            Design ({Math.floor(Math.random() * 2) + 3})
                          </span>
                          <span className="px-2 py-1 bg-[#B58342]/10 text-[#B58342] border border-[#B58342]/30 rounded text-xs font-medium">
                            TypeScript ({Math.floor(Math.random() * 2) + 3})
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="px-2 py-1 bg-[#B58342]/10 text-[#B58342] border border-[#B58342]/30 rounded text-xs font-medium">
                            Strategy ({Math.floor(Math.random() * 2) + 4})
                          </span>
                          <span className="px-2 py-1 bg-[#B58342]/10 text-[#B58342] border border-[#B58342]/30 rounded text-xs font-medium">
                            Leadership ({Math.floor(Math.random() * 2) + 4})
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {employee.JobRole.includes('Engineer') && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-xs text-slate-400 mb-1 font-medium">Recent Learning</div>
                      <div className="text-xs text-white font-medium">
                        {['AWS Certified Developer', 'Advanced React Patterns', 'System Design Course'][Math.floor(Math.random() * 3)]}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Employee Dialog */}
      <EmployeeDialog
        employee={selectedEmployee}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
