'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { supabase } from '@/lib/supabase'
import BenchmarkSystem from '@/components/BenchmarkSystem'
import FloatingChat from '@/components/FloatingChat'

interface Employee {
  EmployeeNumber: number
  JobRole: string
  Department: string
  competency_gap_score: number
  Attrition: string
}

export default function Dashboard() {
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [avgAttritionRisk, setAvgAttritionRisk] = useState(0)
  const [highRiskCount, setHighRiskCount] = useState(0)
  const [highRiskEmployees, setHighRiskEmployees] = useState<any[]>([])
  const [competencyTrendData, setCompetencyTrendData] = useState<any[]>([])
  const [allEmployees, setAllEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
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

        const employees = allEmployees

        // Save to state for other components
        setAllEmployees(allEmployees)

        if (false) {} // Keep the same structure

        // Use fallback data if database is empty
        if (!employees || employees.length === 0) {
          console.log('No data in database, using fallback data')
          setTotalEmployees(17)
          setAvgAttritionRisk(52)
          setHighRiskCount(5)
          setHighRiskEmployees([
            { name: 'Alex Johnson', title: 'Senior Engineer', department: 'Engineering', riskScore: 85 },
            { name: 'Christopher Lee', title: 'Junior Engineer', department: 'Engineering', riskScore: 80 },
            { name: 'Daniel Harris', title: 'Senior PM', department: 'Product', riskScore: 75 },
            { name: 'Sarah Chen', title: 'Senior Engineer', department: 'Engineering', riskScore: 72 },
            { name: 'Rachel Green', title: 'Senior Engineer', department: 'Engineering', riskScore: 70 }
          ])
          const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
          const trend = months.map((month, idx) => ({
            month,
            score: 3.5 + (idx * 0.1)
          }))
          setCompetencyTrendData(trend)
        } else {
          // Calculate total employees
          setTotalEmployees(employees.length)

          // Calculate average attrition risk based on multiple factors
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

          const employeesWithRisk = employees.map(emp => ({
            ...emp,
            calculatedRisk: calculateRiskScore(emp)
          }))

          const avgRisk = employeesWithRisk.reduce((acc, emp) => acc + emp.calculatedRisk, 0) / employeesWithRisk.length
          setAvgAttritionRisk(Math.round(avgRisk))

          // Get high risk employees (top 5 by risk score)
          const highRisk = employeesWithRisk
            .filter(emp => emp.calculatedRisk >= 50)
            .sort((a, b) => b.calculatedRisk - a.calculatedRisk)
            .slice(0, 5)
            .map(emp => ({
              name: `Employee ${emp.EmployeeNumber}`,
              title: emp.JobRole,
              department: emp.Department,
              riskScore: emp.calculatedRisk
            }))

          setHighRiskEmployees(highRisk)
          setHighRiskCount(employeesWithRisk.filter(emp => emp.calculatedRisk >= 50).length)

          // Generate competency trend data (mock for now - would need historical data)
          const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
          const trend = months.map((month, idx) => ({
            month,
            score: 3.5 + (idx * 0.1) + Math.random() * 0.2
          }))
          setCompetencyTrendData(trend)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Use fallback data on error
        setTotalEmployees(17)
        setAvgAttritionRisk(52)
        setHighRiskCount(5)
        setHighRiskEmployees([
          { name: 'Alex Johnson', title: 'Senior Engineer', department: 'Engineering', riskScore: 85 },
          { name: 'Christopher Lee', title: 'Junior Engineer', department: 'Engineering', riskScore: 80 },
          { name: 'Daniel Harris', title: 'Senior PM', department: 'Product', riskScore: 75 },
          { name: 'Sarah Chen', title: 'Senior Engineer', department: 'Engineering', riskScore: 72 },
          { name: 'Rachel Green', title: 'Senior Engineer', department: 'Engineering', riskScore: 70 }
        ])
        const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        const trend = months.map((month, idx) => ({
          month,
          score: 3.5 + (idx * 0.1)
        }))
        setCompetencyTrendData(trend)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="text-white">Loading dashboard data...</div>
      </div>
    )
  }
  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#B58342]/30">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent">Retention Intelligence Dashboard</h1>
        <p className="text-slate-300 mt-2">Real-time predictive analytics and workforce continuity metrics</p>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-blue-500/30 shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Workforce</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalEmployees.toLocaleString()}</div>
            <p className="text-sm text-slate-400 mt-1">Active employees</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-2 border-amber-500/30 shadow-2xl hover:shadow-amber-500/20 hover:border-amber-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Attrition Risk Score</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{avgAttritionRisk}%</div>
            <p className="text-sm text-slate-400 mt-1">Predictive risk index</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-xl border-2 border-red-500/30 shadow-2xl hover:shadow-red-500/20 hover:border-red-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Critical Risk Count</CardTitle>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{highRiskCount}</div>
            <p className="text-sm text-slate-400 mt-1">Immediate attention required</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* High Attrition Risk Employees */}
        <Card className="bg-white/5 backdrop-blur-xl border-2 border-red-500/30 shadow-2xl">
          <CardHeader className="border-b border-red-500/20">
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              High-Risk Talent Exposure
            </CardTitle>
            <CardDescription className="text-slate-400">Critical attention required - immediate intervention recommended</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {highRiskEmployees.map((employee, index) => (
                <div key={index} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-lg border border-red-500/20 hover:border-red-500/50 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <div>
                      <p className="font-semibold text-white">{employee.name}</p>
                      <p className="text-sm text-slate-400">{employee.title} • {employee.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-red-400">{employee.riskScore}</p>
                    <p className="text-xs text-slate-500">Risk Score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Competency Trend */}
        <Card className="bg-black/40 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl">
          <CardHeader className="border-b border-[#B58342]/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#B58342]" />
                  Competency Performance Trend
                </CardTitle>
                <CardDescription className="text-slate-400 mt-1">
                  6-month workforce capability progression
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#B58342]">
                  {competencyTrendData.length > 0 ? competencyTrendData[competencyTrendData.length - 1].score.toFixed(1) : '4.2'}
                </div>
                <div className="text-xs text-slate-500">Current Index</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={competencyTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B58342" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#B58342" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={13}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  domain={[0, 5]}
                  tickLine={false}
                  axisLine={false}
                  dx={-5}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: '2px solid #B58342',
                    borderRadius: '12px',
                    color: 'white',
                    padding: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                  }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '4px' }}
                  itemStyle={{ color: '#B58342', fontWeight: '600' }}
                  cursor={{ stroke: '#B58342', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#B58342"
                  strokeWidth={4}
                  dot={{
                    fill: '#B58342',
                    strokeWidth: 3,
                    r: 6,
                    stroke: '#000000'
                  }}
                  activeDot={{
                    r: 8,
                    fill: '#d4a05a',
                    stroke: '#000000',
                    strokeWidth: 3
                  }}
                  fill="url(#colorScore)"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                <span className="text-xs text-slate-400">Upward Trajectory</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#B58342] shadow-lg shadow-[#B58342]/50"></div>
                <span className="text-xs text-slate-400">Current Performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benchmark System */}
      <BenchmarkSystem employees={allEmployees} />






      {/* Floating Chat */}
      <FloatingChat employees={allEmployees} />
    </div>
  )
}
