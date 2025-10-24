'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp, BookOpen, Target, Star } from 'lucide-react'

export default function TopLearnersPage() {
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
        <div className="text-white">Loading Top Learners...</div>
      </div>
    )
  }

  // Get all learners sorted by training times
  const topLearners = allEmployees
    .filter(emp => emp.TrainingTimesLastYear > 0)
    .sort((a, b) => b.TrainingTimesLastYear - a.TrainingTimesLastYear)
    .slice(0, 50) // Show top 50 learners

  // Calculate statistics
  const totalTrainings = topLearners.reduce((sum, emp) => sum + emp.TrainingTimesLastYear, 0)
  const avgTrainings = (totalTrainings / topLearners.length).toFixed(1)
  const topPerformer = topLearners[0]

  // Group learners by performance tier
  const eliteLearners = topLearners.filter(emp => emp.TrainingTimesLastYear >= 5)
  const advancedLearners = topLearners.filter(emp => emp.TrainingTimesLastYear >= 3 && emp.TrainingTimesLastYear < 5)
  const activeLearners = topLearners.filter(emp => emp.TrainingTimesLastYear >= 1 && emp.TrainingTimesLastYear < 3)

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-[#B58342]/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent">Top Learners Leaderboard</h1>
        <p className="text-slate-300 mt-2">Recognizing employees with exceptional training engagement and continuous learning commitment</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Top Performer</p>
                <p className="text-2xl font-bold text-white mt-2">{topPerformer?.TrainingTimesLastYear || 0}</p>
                <p className="text-yellow-200 text-xs mt-1">trainings completed</p>
              </div>
              <Award className="h-10 w-10 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Elite Learners</p>
                <p className="text-2xl font-bold text-white mt-2">{eliteLearners.length}</p>
                <p className="text-purple-200 text-xs mt-1">5+ trainings</p>
              </div>
              <Star className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Average Trainings</p>
                <p className="text-2xl font-bold text-white mt-2">{avgTrainings}</p>
                <p className="text-blue-200 text-xs mt-1">per top learner</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Completions</p>
                <p className="text-2xl font-bold text-white mt-2">{totalTrainings}</p>
                <p className="text-green-200 text-xs mt-1">by top 50 learners</p>
              </div>
              <BookOpen className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elite Learners (5+ trainings) */}
      {eliteLearners.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border-[#B58342]/20">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Elite Learners (5+ Trainings)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Exceptional dedication to continuous learning and skill development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {eliteLearners.map((employee, index) => (
                <div key={index} className="bg-gradient-to-r from-yellow-900/20 to-yellow-800/20 border-2 border-yellow-600/50 rounded-lg p-4 flex items-center space-x-4 hover:border-yellow-500 transition-all">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                    'bg-gradient-to-br from-purple-500 to-purple-700'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">Employee {employee.EmployeeNumber}</p>
                    <p className="text-slate-400 text-sm">{employee.Department}</p>
                    <p className="text-slate-500 text-xs">{employee.JobRole}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-2xl">{employee.TrainingTimesLastYear}</p>
                    <p className="text-slate-400 text-xs">trainings</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Learners (3-4 trainings) */}
      {advancedLearners.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border-[#B58342]/20">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center">
              <Target className="h-6 w-6 mr-2 text-blue-500" />
              Advanced Learners (3-4 Trainings)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Strong commitment to professional development and growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {advancedLearners.map((employee, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-600/30 rounded-lg p-4 hover:border-blue-500/60 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center font-bold text-white text-sm">
                      #{eliteLearners.length + index + 1}
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-bold text-xl">{employee.TrainingTimesLastYear}</p>
                      <p className="text-slate-500 text-xs">trainings</p>
                    </div>
                  </div>
                  <p className="text-white font-semibold text-sm">Employee {employee.EmployeeNumber}</p>
                  <p className="text-slate-400 text-xs">{employee.Department}</p>
                  <p className="text-slate-500 text-xs truncate">{employee.JobRole}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Learners (1-2 trainings) */}
      {activeLearners.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border-[#B58342]/20">
          <CardHeader>
            <CardTitle className="text-white text-xl flex items-center">
              <BookOpen className="h-6 w-6 mr-2 text-green-500" />
              Active Learners (1-2 Trainings)
            </CardTitle>
            <CardDescription className="text-slate-400">
              Employees engaged in learning and skill enhancement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {activeLearners.map((employee, index) => (
                <div key={index} className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-600/30 rounded-lg p-3 hover:border-green-500/60 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center font-bold text-white text-xs">
                      #{eliteLearners.length + advancedLearners.length + index + 1}
                    </div>
                    <p className="text-green-400 font-bold text-lg">{employee.TrainingTimesLastYear}</p>
                  </div>
                  <p className="text-white font-semibold text-xs">Emp {employee.EmployeeNumber}</p>
                  <p className="text-slate-400 text-xs truncate">{employee.Department}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recognition Message */}
      <Card className="bg-gradient-to-br from-[#B58342]/20 to-[#d4a05a]/10 border-[#B58342]/50">
        <CardContent className="p-6">
          <div className="text-center">
            <Award className="h-12 w-12 text-[#B58342] mx-auto mb-3" />
            <h3 className="text-white text-xl font-bold mb-2">Congratulations to All Our Top Learners!</h3>
            <p className="text-slate-300 text-sm">
              Your commitment to continuous learning and professional development drives our organization's success.
              Keep up the excellent work and inspire others to follow your example!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
