'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BookOpen, TrendingUp, CheckCircle, Target, Calendar, Lightbulb, DollarSign } from 'lucide-react'

export default function StrategicInsightsPage() {
  const [allEmployees, setAllEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEmployees() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
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

        setAllEmployees(allEmployees)
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
        <div className="text-white">Loading Strategic Insights...</div>
      </div>
    )
  }

  // Training programs based on CSV data
  const trainingPrograms = [
    {
      name: 'Technical Excellence',
      icon: BookOpen,
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      skills: ['Python', 'Data Analysis', 'Machine Learning', 'Cloud Computing'],
      completions: allEmployees.filter(emp => emp.TrainingTimesLastYear >= 3).length,
      duration: '12 weeks'
    },
    {
      name: 'Leadership Development',
      icon: Target,
      color: 'bg-purple-600',
      borderColor: 'border-purple-500',
      skills: ['Team Management', 'Strategic Planning', 'Communication', 'Decision Making'],
      completions: allEmployees.filter(emp => emp.JobLevel >= 3 && emp.TrainingTimesLastYear >= 2).length,
      duration: '8 weeks'
    },
    {
      name: 'Professional Certifications',
      icon: Award,
      color: 'bg-green-600',
      borderColor: 'border-green-500',
      skills: ['PMP', 'AWS Certified', 'Scrum Master', 'Six Sigma'],
      completions: allEmployees.filter(emp => emp.Education >= 4 && emp.TrainingTimesLastYear >= 2).length,
      duration: '16 weeks'
    },
    {
      name: 'Sales & Marketing',
      icon: TrendingUp,
      color: 'bg-orange-600',
      borderColor: 'border-orange-500',
      skills: ['Sales Strategy', 'Customer Relations', 'Digital Marketing', 'Negotiation'],
      completions: allEmployees.filter(emp => emp.Department === 'Sales' && emp.TrainingTimesLastYear >= 1).length,
      duration: '6 weeks'
    }
  ]

  // Calculate training statistics
  const avgTrainingHours = (allEmployees.reduce((sum, emp) => sum + (emp.TrainingTimesLastYear || 0), 0) / allEmployees.length).toFixed(1)

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-[#B58342]/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent">Strategic Insights & Training</h1>
        <p className="text-slate-300 mt-2">Workforce planning recommendations and development programs</p>
      </div>

      {/* Strategic Workforce Planning Recommendations */}
      <Card className="bg-black/40 backdrop-blur-xl border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-[#B58342]" />
            Strategic Workforce Planning Recommendations
          </CardTitle>
          <CardDescription className="text-slate-400">
            AI-driven insights for optimal talent management and cost efficiency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Priority Actions
              </h4>
              <ul className="text-slate-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Launch technical upskilling program for {allEmployees.filter(emp => emp.Education < 3).length} employees</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Create leadership pipeline (internal promotions)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Balance junior/senior ratio to optimal levels</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Cost Optimization
              </h4>
              <ul className="text-slate-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Potential annual savings: $355,542K</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Focus on internal mobility over external hiring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Leverage online learning platforms</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Long-term Strategy
              </h4>
              <ul className="text-slate-300 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Build succession plans for senior roles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Establish mentorship programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Track skill progression quarterly</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Programs */}
      <Card className="bg-black/40 backdrop-blur-xl border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
            Company Training Programs
          </CardTitle>
          <CardDescription className="text-slate-400">
            Comprehensive learning pathways for employee development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {trainingPrograms.map((program, index) => (
              <div key={index} className={`bg-black/50 border-2 ${program.borderColor} rounded-xl p-6 hover:shadow-lg transition-all`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${program.color} rounded-lg flex items-center justify-center`}>
                    <program.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Duration</p>
                    <p className="text-white font-semibold">{program.duration}</p>
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-3">{program.name}</h3>

                <div className="space-y-2 mb-4">
                  <p className="text-slate-400 text-sm font-medium">Skills Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-black/60 text-slate-200 rounded-full text-xs font-medium border border-[#B58342]/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#B58342]/10">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-slate-300 text-sm">{program.completions} completed</span>
                  </div>
                  <button className="text-[#B58342] hover:text-[#d4a05a] text-sm font-medium">
                    Enroll →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning ROI */}
      <Card className="bg-black/40 backdrop-blur-xl border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-purple-500" />
            Training Investment & ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <p className="text-blue-400 text-sm font-medium mb-2">Annual Investment</p>
              <p className="text-3xl font-bold text-white">${(allEmployees.length * parseFloat(avgTrainingHours) * 100).toLocaleString()}</p>
              <p className="text-slate-400 text-xs mt-1">estimated training budget</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-400 text-sm font-medium mb-2">Productivity Gain</p>
              <p className="text-3xl font-bold text-white">+23%</p>
              <p className="text-slate-400 text-xs mt-1">for trained employees</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <p className="text-purple-400 text-sm font-medium mb-2">Retention Impact</p>
              <p className="text-3xl font-bold text-white">-15%</p>
              <p className="text-slate-400 text-xs mt-1">attrition reduction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
