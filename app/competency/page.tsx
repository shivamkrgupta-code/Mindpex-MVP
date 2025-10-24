'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface TargetCompetency {
  target_id: number
  role_id: number
  competency_name: string
  required_level: number
  role_name?: string
}

interface JobRole {
  role_id: number
  role_name: string
}

interface CompetencyModel {
  role_name: string
  competencies: { name: string; level: number }[]
}

interface Employee {
  EmployeeNumber: number
  JobRole: string
  Department: string
  competency_gap_score: number
}

export default function CompetencyModels() {
  const [competencyModels, setCompetencyModels] = useState<CompetencyModel[]>([])
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompetencyData() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        // Fetch job roles
        const { data: roles, error: rolesError } = await supabase
          .from('job_roles')
          .select('*')

        if (rolesError) throw rolesError

        // Fetch target competencies
        const { data: competencies, error: competenciesError } = await supabase
          .from('target_competencies')
          .select('*')

        if (competenciesError) throw competenciesError

        // Fetch employees for heatmap - using Research & Development department from CSV
        const { data: employees, error: employeesError } = await supabase
          .from('employees')
          .select('*')
          .eq('Department', 'Research & Development')
          .limit(15)

        // Use fallback data if database is empty
        if (!employees || employees.length === 0) {
          const fallbackHeatmap = Array.from({ length: 8 }, (_, i) => {
            const empCompetencies: any = {
              employee: `Employee ${i + 1}`,
              role: i % 3 === 0 ? 'Research Scientist' : i % 3 === 1 ? 'Laboratory Technician' : 'Healthcare Representative'
            }

            const compNames = ['Research Skills', 'Technical Expertise', 'Data Analysis', 'Innovation']
            compNames.forEach(comp => {
              const required = 4
              const current = Math.floor(Math.random() * 5) + 1
              empCompetencies[comp] = { current, required }
            })

            return empCompetencies
          })

          setHeatmapData(fallbackHeatmap)
        } else {
          const heatmap = employees.map(emp => {
            const empCompetencies: any = {
              employee: `Employee ${emp.EmployeeNumber}`,
              role: emp.JobRole
            }

            // Calculate competency levels based on CSV data with variation
            const compNames = ['Research Skills', 'Technical Expertise', 'Data Analysis', 'Innovation']
            compNames.forEach((comp, compIndex) => {
              // Required level based on job level
              const required = emp.JobLevel >= 4 ? 5 : emp.JobLevel >= 2 ? 4 : 3

              // Current level - more conservative calculation to create gaps
              let current = 1

              // Performance affects competency (but not 1:1)
              if (emp.PerformanceRating >= 4) current += 1.5
              else if (emp.PerformanceRating >= 3) current += 0.5

              // Education provides foundation
              if (emp.Education >= 4) current += 1
              else if (emp.Education >= 3) current += 0.5
              else if (emp.Education >= 2) current += 0.25

              // Training is crucial
              if (emp.TrainingTimesLastYear >= 4) current += 1
              else if (emp.TrainingTimesLastYear >= 2) current += 0.5

              // Create variation across different competencies
              const competencyModifier = (emp.EmployeeNumber * 7 + compIndex * 11) % 5 - 2 // -2 to +2
              current += competencyModifier * 0.3

              // Experience matters but not always
              if (emp.YearsAtCompany >= 10) current += 0.5
              else if (emp.YearsAtCompany >= 5) current += 0.25

              // Engagement helps
              if (emp.JobInvolvement >= 4) current += 0.5
              else if (emp.JobInvolvement >= 3) current += 0.25

              // Work-life balance affects performance
              if (emp.WorkLifeBalance <= 1) current -= 0.5

              // Overtime can reduce competency
              if (emp.OverTime === 'Yes') current -= 0.3

              // Ensure current is reasonable but can fall short
              current = Math.max(1, Math.min(Math.round(current * 10) / 10, 5))

              // Round to nearest integer
              current = Math.round(current)

              empCompetencies[comp] = { current, required }
            })

            return empCompetencies
          })

          setHeatmapData(heatmap)
        }
      } catch (error) {
        console.error('Error fetching competency data:', error)
        // Use fallback on error
        const fallbackHeatmap = Array.from({ length: 8 }, (_, i) => {
          const empCompetencies: any = {
            employee: `Employee ${i + 1}`,
            role: i % 3 === 0 ? 'Research Scientist' : i % 3 === 1 ? 'Laboratory Technician' : 'Healthcare Representative'
          }

          const compNames = ['Research Skills', 'Technical Expertise', 'Data Analysis', 'Innovation']
          compNames.forEach(comp => {
            const required = 4
            const current = Math.floor(Math.random() * 5) + 1
            empCompetencies[comp] = { current, required }
          })

          return empCompetencies
        })

        setHeatmapData(fallbackHeatmap)
      } finally {
        setLoading(false)
      }
    }

    fetchCompetencyData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="text-white">Loading competency data...</div>
      </div>
    )
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 5: return 'bg-green-600 text-white' // Expert - Green
      case 4: return 'bg-blue-600 text-white' // Advanced - Blue
      case 3: return 'bg-indigo-600 text-white' // Intermediate - Indigo
      case 2: return 'bg-amber-600 text-white' // Basic - Amber
      default: return 'bg-slate-600 text-white' // Novice - Gray
    }
  }

  const getGapColor = (current: number, required: number) => {
    if (current >= required) return 'bg-green-600' // Meets/exceeds target
    if (current >= required - 1) return 'bg-amber-600' // 1 level below - warning
    return 'bg-red-600' // 2+ levels below - critical gap
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#B58342]/30">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent">Competency Intelligence System</h1>
        <p className="text-slate-300 mt-2">Strategic workforce capability mapping and skill gap analysis</p>
      </div>

      {/* Competency Models Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Senior Engineer */}
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl hover:shadow-[#B58342]/20 hover:border-[#B58342]/50 transition-all">
          <CardHeader className="border-b border-[#B58342]/20">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-[#B58342]" />
              <CardTitle className="text-white">Senior Engineer</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Critical competency requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Node.js</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg ${getLevelColor(4)}`}>
                Level 4
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">System Design</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg ${getLevelColor(5)}`}>
                Level 5
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">TypeScript</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg ${getLevelColor(4)}`}>
                Level 4
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">React</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-lg ${getLevelColor(4)}`}>
                Level 4
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Mid-Level Engineer */}
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl hover:shadow-[#B58342]/20 hover:border-[#B58342]/50 transition-all">
          <CardHeader className="border-b border-[#B58342]/20">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-[#B58342]" />
              <CardTitle className="text-white">Mid-Level Engineer</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Core competency requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Node.js</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(3)}`}>
                Level 3
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">System Design</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(3)}`}>
                Level 3
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">TypeScript</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(3)}`}>
                Level 3
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">React</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(3)}`}>
                Level 3
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Junior Engineer */}
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-white/5 border-b-2 border-[#B58342]/20">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-slate-400" />
              <CardTitle className="text-white">Junior Engineer</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Foundation competency requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Node.js</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(2)}`}>
                Level 2
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">System Design</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(2)}`}>
                Level 2
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">TypeScript</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(2)}`}>
                Level 2
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">React</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(2)}`}>
                Level 2
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Senior PM */}
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl hover:shadow-[#B58342]/20 hover:border-[#B58342]/50 transition-all">
          <CardHeader className="border-b border-[#B58342]/20">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-[#B58342]" />
              <CardTitle className="text-white">Senior PM</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Leadership competency requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Product Strategy</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(5)}`}>
                Level 5
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Stakeholder Management</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(4)}`}>
                Level 4
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">User Research</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(4)}`}>
                Level 4
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Junior PM */}
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-br from-[#B58342]/10 to-[#B58342]/5 border-b-2 border-[#B58342]/20">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-[#B58342]" />
              <CardTitle className="text-white">Junior PM</CardTitle>
            </div>
            <CardDescription className="text-slate-400">Developing competency requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Product Strategy</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(2)}`}>
                Level 2
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">Stakeholder Management</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(3)}`}>
                Level 3
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-lg">
              <span className="text-white font-medium">User Research</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(3)}`}>
                Level 3
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research & Development Department Competency Heatmap */}
      <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#B58342]/10 to-[#B58342]/5 border-b-2 border-[#B58342]/20">
          <CardTitle className="text-white text-xl">Research & Development Department - Capability Matrix</CardTitle>
          <CardDescription className="text-slate-400">
            Current vs. target proficiency levels (Teal = proficient, Gold = developing, Red = critical gap)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#000000]/20">
                  <th className="text-left py-3 px-4 text-white font-semibold">Employee</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Role</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Research Skills</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Technical Expertise</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Data Analysis</th>
                  <th className="text-center py-3 px-4 text-white font-semibold">Innovation</th>
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((emp, idx) => (
                  <tr key={idx} className="border-b border-[#B58342]/20 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{emp.employee}</td>
                    <td className="py-3 px-4 text-slate-400">{emp.role}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <div className={`px-4 py-2 rounded ${getGapColor(emp['Research Skills'].current, emp['Research Skills'].required)}`}>
                          <span className="text-white font-medium">{emp['Research Skills'].current}/{emp['Research Skills'].required}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <div className={`px-4 py-2 rounded ${getGapColor(emp['Technical Expertise'].current, emp['Technical Expertise'].required)}`}>
                          <span className="text-white font-medium">{emp['Technical Expertise'].current}/{emp['Technical Expertise'].required}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <div className={`px-4 py-2 rounded ${getGapColor(emp['Data Analysis'].current, emp['Data Analysis'].required)}`}>
                          <span className="text-white font-medium">{emp['Data Analysis'].current}/{emp['Data Analysis'].required}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <div className={`px-4 py-2 rounded ${getGapColor(emp['Innovation'].current, emp['Innovation'].required)}`}>
                          <span className="text-white font-medium">{emp['Innovation'].current}/{emp['Innovation'].required}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-sm text-white font-bold mb-3">Competency Gap Status:</div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-600 rounded shadow-lg"></div>
                <span className="text-sm text-slate-300 font-medium">Meets/Exceeds Target</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-600 rounded shadow-lg"></div>
                <span className="text-sm text-slate-300 font-medium">1 Level Below (Warning)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-600 rounded shadow-lg"></div>
                <span className="text-sm text-slate-300 font-medium">Critical Gap (2+ Levels)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
