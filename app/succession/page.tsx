'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Employee {
  EmployeeNumber: number
  JobRole: string
  Department: string
  PerformanceRating: number
  competency_gap_score: number
  potential_score: string
  promotion_readiness_flag: boolean
}

interface NineBoxCell {
  performance: string
  potential: string
  employees: Employee[]
  count: number
}

export default function SuccessionRisk() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [nineBoxData, setNineBoxData] = useState<NineBoxCell[]>([])
  const [promotionCandidates, setPromotionCandidates] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSuccessionData() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        // Fetch all employees - need to paginate to get all 1470
        let allEmployees: any[] = []
        let page = 0
        const pageSize = 1000
        let hasMore = true

        while (hasMore) {
          const { data: employees, error } = await supabase
            .from('employees')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) throw error

          if (employees && employees.length > 0) {
            allEmployees = [...allEmployees, ...employees]
            page++
            hasMore = employees.length === pageSize
          } else {
            hasMore = false
          }
        }

        const data = allEmployees

        // Use fallback data if database is empty
        if (!data || data.length === 0) {
          const fallbackEmployees = Array.from({ length: 17 }, (_, i) => ({
            EmployeeNumber: i + 1,
            JobRole: i % 3 === 0 ? 'Senior Engineer' : i % 3 === 1 ? 'Mid-Level Engineer' : 'Junior Engineer',
            Department: i < 12 ? 'Engineering' : i < 15 ? 'Product' : 'Design',
            PerformanceRating: 2 + Math.floor(Math.random() * 4),
            competency_gap_score: 30 + Math.floor(Math.random() * 60),
            potential_score: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low',
            promotion_readiness_flag: i < 5
          }))

          processNineBoxData(fallbackEmployees)
          setPromotionCandidates(fallbackEmployees.slice(0, 10))
        } else {
          processNineBoxData(data)

          // Get promotion candidates based on performance, education, and job level
          const candidates = data
            .filter(emp => {
              // High performers with good education and involvement
              const isHighPerformer = emp.PerformanceRating >= 3
              const hasGoodEducation = emp.Education >= 3
              const isEngaged = emp.JobInvolvement >= 3
              const recentTraining = emp.TrainingTimesLastYear >= 2

              return isHighPerformer && (hasGoodEducation || isEngaged || recentTraining)
            })
            .sort((a, b) => {
              // Sort by performance rating first, then education
              if (b.PerformanceRating !== a.PerformanceRating) {
                return b.PerformanceRating - a.PerformanceRating
              }
              return b.Education - a.Education
            })
            .slice(0, 10)

          setPromotionCandidates(candidates)
        }
      } catch (error) {
        console.error('Error fetching succession data:', error)
        // Use fallback on error
        const fallbackEmployees = Array.from({ length: 17 }, (_, i) => ({
          EmployeeNumber: i + 1,
          JobRole: i % 3 === 0 ? 'Senior Engineer' : i % 3 === 1 ? 'Mid-Level Engineer' : 'Junior Engineer',
          Department: i < 12 ? 'Engineering' : i < 15 ? 'Product' : 'Design',
          PerformanceRating: 2 + Math.floor(Math.random() * 4),
          competency_gap_score: 30 + Math.floor(Math.random() * 60),
          potential_score: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low',
          promotion_readiness_flag: i < 5
        }))

        processNineBoxData(fallbackEmployees)
        setPromotionCandidates(fallbackEmployees.slice(0, 10))
      } finally {
        setLoading(false)
      }
    }

    function processNineBoxData(data: Employee[]) {
      setEmployees(data)

      // Calculate potential based on CSV fields
      const calculatePotential = (emp: any) => {
        let score = 0

        // Higher education level indicates higher potential
        if (emp.Education >= 4) score += 2
        else if (emp.Education === 3) score += 1

        // Job level indicates growth trajectory
        if (emp.JobLevel >= 4) score += 2
        else if (emp.JobLevel >= 2) score += 1

        // Years at company without promotion might indicate stagnation
        if (emp.YearsSinceLastPromotion <= 1) score += 2
        else if (emp.YearsSinceLastPromotion <= 3) score += 1

        // High involvement and satisfaction suggests engagement
        if (emp.JobInvolvement >= 3) score += 1
        if (emp.JobSatisfaction >= 3) score += 1

        // Training indicates investment in growth
        if (emp.TrainingTimesLastYear >= 3) score += 1

        // Determine potential level
        if (score >= 6) return 'High'
        if (score >= 3) return 'Medium'
        return 'Low'
      }

      const performanceLevels = ['Low', 'Medium', 'High']
      const potentialLevels = ['Low', 'Medium', 'High']
      const cells: NineBoxCell[] = []

      performanceLevels.forEach(perf => {
        potentialLevels.forEach(pot => {
          const cellEmployees = data.filter(emp => {
            const empPerf = emp.PerformanceRating >= 4 ? 'High' : emp.PerformanceRating >= 3 ? 'Medium' : 'Low'
            const empPot = calculatePotential(emp)
            return empPerf === perf && empPot === pot
          })

          cells.push({
            performance: perf,
            potential: pot,
            employees: cellEmployees,
            count: cellEmployees.length
          })
        })
      })

      setNineBoxData(cells)
    }

    fetchSuccessionData()
  }, [])

  const getCellData = (perf: string, pot: string) => {
    return nineBoxData.find(cell => cell.performance === perf && cell.potential === pot)
  }

  const getCellColor = (perf: string, pot: string) => {
    // Performance (columns): Low, Medium, High
    // Potential (rows): High, Medium, Low
    if (perf === 'High' && pot === 'High') return 'bg-green-600' // Stars - Best talent
    if (perf === 'High' && pot === 'Medium') return 'bg-teal-600' // High performers
    if (perf === 'High' && pot === 'Low') return 'bg-blue-600' // Solid contributors
    if (perf === 'Medium' && pot === 'High') return 'bg-indigo-600' // Future leaders
    if (perf === 'Medium' && pot === 'Medium') return 'bg-yellow-600' // Core workforce
    if (perf === 'Medium' && pot === 'Low') return 'bg-orange-600' // Needs development
    if (perf === 'Low' && pot === 'High') return 'bg-purple-600' // High potential, coaching needed
    if (perf === 'Low' && pot === 'Medium') return 'bg-rose-600' // Struggling
    if (perf === 'Low' && pot === 'Low') return 'bg-red-700' // Critical attention
    return 'bg-slate-500'
  }

  const filteredCandidates = promotionCandidates.filter(emp =>
    searchTerm === '' ||
    emp.EmployeeNumber.toString().includes(searchTerm.toLowerCase()) ||
    emp.JobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.Department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="text-white">Loading succession data...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-[#B58342]/20">
        <h1 className="text-3xl font-bold text-white">Succession Planning & Continuity Risk</h1>
        <p className="text-slate-300 mt-2">Strategic talent pipeline and critical role succession analytics</p>
      </div>

      {/* 9-Box Grid */}
      <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#B58342]/10 to-[#B58342]/5 border-b-2 border-[#B58342]/20">
          <CardTitle className="text-white text-xl">Performance-Potential Matrix (9-Box)</CardTitle>
          <CardDescription className="text-slate-400">
            Strategic talent segmentation for succession planning (hover cells to view employees)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Performance label on top */}
            <div className="text-center mb-2">
              <span className="text-white font-bold text-sm uppercase tracking-wide">Performance →</span>
            </div>

            {/* Grid with labels */}
            <div className="grid grid-cols-4 gap-3">
              {/* Top row with performance headers */}
              <div className="flex items-center justify-center">
                <span className="text-white font-bold text-sm transform -rotate-90 whitespace-nowrap">Potential →</span>
              </div>
              <div className="text-center pb-2">
                <span className="text-slate-400 font-semibold text-sm">Low</span>
              </div>
              <div className="text-center pb-2">
                <span className="text-slate-400 font-semibold text-sm">Medium</span>
              </div>
              <div className="text-center pb-2">
                <span className="text-slate-400 font-semibold text-sm">High</span>
              </div>

              {/* High Potential Row */}
              <div className="flex items-center justify-end pr-3">
                <span className="text-slate-400 font-semibold text-sm">High</span>
              </div>
              {['Low', 'Medium', 'High'].map(perf => {
                const cellData = getCellData(perf, 'High')
                const cellKey = `${perf}-High`
                return (
                  <div
                    key={cellKey}
                    className={`relative ${getCellColor(perf, 'High')} rounded-lg p-6 min-h-[140px] flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl`}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {/* Show count by default */}
                    {hoveredCell !== cellKey && (
                      <>
                        <div className="text-4xl font-bold text-white">{cellData?.count || 0}</div>
                        <div className="text-sm text-white/80 mt-1">Employees</div>
                      </>
                    )}

                    {/* Show employee names on hover INSIDE the box */}
                    {hoveredCell === cellKey && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 overflow-y-auto">
                        {cellData && cellData.employees.length > 0 ? (
                          <>
                            <div className="text-xs font-semibold text-white mb-2">Employees:</div>
                            <ul className="text-xs text-white space-y-1 text-center">
                              {cellData.employees.slice(0, 8).map(emp => (
                                <li key={emp.EmployeeNumber}>Employee {emp.EmployeeNumber}</li>
                              ))}
                              {cellData.employees.length > 8 && (
                                <li className="text-white/70 font-semibold">+{cellData.employees.length - 8} more</li>
                              )}
                            </ul>
                          </>
                        ) : (
                          <div className="text-lg text-white/80">No employees</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Medium Potential Row */}
              <div className="flex items-center justify-end pr-3">
                <span className="text-gray-300 font-medium text-sm">Medium</span>
              </div>
              {['Low', 'Medium', 'High'].map(perf => {
                const cellData = getCellData(perf, 'Medium')
                const cellKey = `${perf}-Medium`
                return (
                  <div
                    key={cellKey}
                    className={`relative ${getCellColor(perf, 'Medium')} rounded-lg p-6 min-h-[140px] flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl`}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {/* Show count by default */}
                    {hoveredCell !== cellKey && (
                      <>
                        <div className="text-4xl font-bold text-white">{cellData?.count || 0}</div>
                        <div className="text-sm text-white/80 mt-1">Employees</div>
                      </>
                    )}

                    {/* Show employee names on hover INSIDE the box */}
                    {hoveredCell === cellKey && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 overflow-y-auto">
                        {cellData && cellData.employees.length > 0 ? (
                          <>
                            <div className="text-xs font-semibold text-white mb-2">Employees:</div>
                            <ul className="text-xs text-white space-y-1 text-center">
                              {cellData.employees.slice(0, 8).map(emp => (
                                <li key={emp.EmployeeNumber}>Employee {emp.EmployeeNumber}</li>
                              ))}
                              {cellData.employees.length > 8 && (
                                <li className="text-white/70 font-semibold">+{cellData.employees.length - 8} more</li>
                              )}
                            </ul>
                          </>
                        ) : (
                          <div className="text-lg text-white/80">No employees</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Low Potential Row */}
              <div className="flex items-center justify-end pr-3">
                <span className="text-gray-300 font-medium text-sm">Low</span>
              </div>
              {['Low', 'Medium', 'High'].map(perf => {
                const cellData = getCellData(perf, 'Low')
                const cellKey = `${perf}-Low`
                return (
                  <div
                    key={cellKey}
                    className={`relative ${getCellColor(perf, 'Low')} rounded-lg p-6 min-h-[140px] flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-xl`}
                    onMouseEnter={() => setHoveredCell(cellKey)}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {/* Show count by default */}
                    {hoveredCell !== cellKey && (
                      <>
                        <div className="text-4xl font-bold text-white">{cellData?.count || 0}</div>
                        <div className="text-sm text-white/80 mt-1">Employees</div>
                      </>
                    )}

                    {/* Show employee names on hover INSIDE the box */}
                    {hoveredCell === cellKey && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 overflow-y-auto">
                        {cellData && cellData.employees.length > 0 ? (
                          <>
                            <div className="text-xs font-semibold text-white mb-2">Employees:</div>
                            <ul className="text-xs text-white space-y-1 text-center">
                              {cellData.employees.slice(0, 8).map(emp => (
                                <li key={emp.EmployeeNumber}>Employee {emp.EmployeeNumber}</li>
                              ))}
                              {cellData.employees.length > 8 && (
                                <li className="text-white/70 font-semibold">+{cellData.employees.length - 8} more</li>
                              )}
                            </ul>
                          </>
                        ) : (
                          <div className="text-lg text-white/80">No employees</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Color Legend */}
            <div className="mt-6 pt-4 border-t-2 border-[#B58342]/20">
              <div className="text-sm text-white font-bold mb-3">Talent Segmentation Framework:</div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-green-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">High/High - Stars (Best Talent)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-indigo-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">Medium/High - Future Leaders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-purple-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">Low/High - High Potential (Coaching)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-teal-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">High/Medium - High Performers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-yellow-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">Medium/Medium - Core Workforce</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-orange-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">Medium/Low - Needs Development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-blue-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">High/Low - Solid Contributors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-rose-600 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">Low/Medium - Struggling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded bg-red-700 shadow"></div>
                  <span className="text-xs text-slate-400 font-medium">Low/Low - Critical Attention</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Readiness Analysis */}
      <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#B58342]/10 to-[#B58342]/5 border-b-2 border-[#B58342]/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Promotion Readiness Assessment</CardTitle>
              <CardDescription className="text-slate-400">
                High-potential candidates qualified for advancement (multi-factor evaluation)
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black/40 backdrop-blur-xl border-2 border-slate-300 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#B58342]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#000000]/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">Name</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Current Title</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Department</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Performance</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Potential</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Ready for Next Level?</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((emp) => {
                  // Calculate promotion readiness based on multiple factors
                  const hasHighPerformance = emp.PerformanceRating >= 4
                  const hasGoodEducation = emp.Education >= 3
                  const isEngaged = emp.JobInvolvement >= 3
                  const hasTraining = emp.TrainingTimesLastYear >= 2
                  const hasExperience = emp.YearsAtCompany >= 2
                  const goodWorkLife = emp.WorkLifeBalance >= 2

                  const isReady = hasHighPerformance && hasGoodEducation && isEngaged && hasTraining && hasExperience && goodWorkLife

                  const performance = emp.PerformanceRating >= 4 ? 'High' : emp.PerformanceRating >= 3 ? 'Medium' : 'Low'

                  // Calculate potential based on CSV data
                  let potentialScore = 0
                  if (emp.Education >= 4) potentialScore += 2
                  else if (emp.Education >= 3) potentialScore += 1
                  if (emp.JobLevel >= 2) potentialScore += 1
                  if (emp.YearsSinceLastPromotion <= 1) potentialScore += 2
                  else if (emp.YearsSinceLastPromotion <= 3) potentialScore += 1
                  if (emp.JobInvolvement >= 3) potentialScore += 1
                  if (emp.TrainingTimesLastYear >= 3) potentialScore += 1

                  const potential = potentialScore >= 6 ? 'High' : potentialScore >= 3 ? 'Medium' : 'Low'

                  return (
                    <tr key={emp.EmployeeNumber} className="border-b border-[#B58342]/20 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">Employee {emp.EmployeeNumber}</td>
                      <td className="py-3 px-4 text-slate-400">{emp.JobRole}</td>
                      <td className="py-3 px-4 text-slate-400">{emp.Department}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                            performance === 'High'
                              ? 'bg-emerald-500'
                              : performance === 'Medium'
                              ? 'bg-blue-500'
                              : 'bg-red-500'
                          }`}>
                            {performance}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                            potential === 'High'
                              ? 'bg-purple-500'
                              : potential === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-slate-500'
                          }`}>
                            {potential}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          {isReady ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-lg border-2 border-green-500/50">
                              <CheckCircle2 className="h-5 w-5 text-green-400" />
                              <span className="text-xs font-semibold text-green-300">Ready</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-lg border-2 border-red-500/50">
                              <XCircle className="h-5 w-5 text-red-400" />
                              <span className="text-xs font-semibold text-red-300">Not Ready</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
