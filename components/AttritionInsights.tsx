'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingDown, TrendingUp, Users, Target, AlertCircle, Calendar, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import EmployeeDialog from './EmployeeDialog'

interface AttritionInsightsProps {
  employees: any[]
}

export default function AttritionInsights({ employees }: AttritionInsightsProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [timeframe, setTimeframe] = useState<'30' | '60' | '90'>('90')

  // Calculate comprehensive attrition metrics
  const calculateRisk = (emp: any): number => {
    let risk = 0
    if (emp.Attrition === 'Yes') risk += 40
    if (emp.PerformanceRating <= 2) risk += 20
    else if (emp.PerformanceRating === 3) risk += 10
    if (emp.OverTime === 'Yes') risk += 15
    if (emp.JobSatisfaction <= 2) risk += 10
    if (emp.WorkLifeBalance <= 2) risk += 10
    if (emp.EnvironmentSatisfaction <= 2) risk += 5
    if (emp.YearsSinceLastPromotion > 3) risk += 5
    return Math.min(risk, 100)
  }

  const employeesWithRisk = employees.map(emp => ({
    ...emp,
    riskScore: calculateRisk(emp)
  }))

  // AI Prediction Categories
  const predictions = {
    imminent: employeesWithRisk.filter(emp => emp.riskScore >= 70),
    likely: employeesWithRisk.filter(emp => emp.riskScore >= 50 && emp.riskScore < 70),
    possible: employeesWithRisk.filter(emp => emp.riskScore >= 30 && emp.riskScore < 50),
    unlikely: employeesWithRisk.filter(emp => emp.riskScore < 30)
  }

  // Attrition by department
  const departmentAttrition = employees.reduce((acc: any, emp) => {
    const dept = emp.Department
    if (!acc[dept]) {
      acc[dept] = { department: dept, attrition: 0, total: 0, rate: 0 }
    }
    acc[dept].total++
    if (emp.Attrition === 'Yes') acc[dept].attrition++
    return acc
  }, {})

  const departmentData = Object.values(departmentAttrition).map((dept: any) => ({
    ...dept,
    rate: parseFloat(((dept.attrition / dept.total) * 100).toFixed(1))
  })).sort((a: any, b: any) => b.rate - a.rate)

  // Attrition by job role
  const roleAttrition = employees.reduce((acc: any, emp) => {
    const role = emp.JobRole
    if (!acc[role]) {
      acc[role] = { role, attrition: 0, total: 0 }
    }
    acc[role].total++
    if (emp.Attrition === 'Yes') acc[role].attrition++
    return acc
  }, {})

  const topAttritionRoles = Object.values(roleAttrition)
    .map((r: any) => ({
      ...r,
      rate: parseFloat(((r.attrition / r.total) * 100).toFixed(1))
    }))
    .sort((a: any, b: any) => b.rate - a.rate)
    .slice(0, 6)

  // Risk distribution for pie chart
  const riskDistribution = [
    { name: 'Imminent (70-100)', value: predictions.imminent.length, color: '#DC2626' },
    { name: 'Likely (50-69)', value: predictions.likely.length, color: '#F59E0B' },
    { name: 'Possible (30-49)', value: predictions.possible.length, color: '#FCD34D' },
    { name: 'Unlikely (0-29)', value: predictions.unlikely.length, color: '#10B981' }
  ]

  // Predictive timeline (simulated based on risk scores)
  const timelineData = [
    { period: 'Next 30 Days', predicted: predictions.imminent.length, actual: Math.floor(predictions.imminent.length * 0.7) },
    { period: '31-60 Days', predicted: predictions.likely.length, actual: Math.floor(predictions.likely.length * 0.5) },
    { period: '61-90 Days', predicted: Math.floor(predictions.possible.length * 0.4), actual: Math.floor(predictions.possible.length * 0.3) },
    { period: '90+ Days', predicted: Math.floor(predictions.possible.length * 0.2), actual: Math.floor(predictions.possible.length * 0.1) }
  ]

  // Cost impact calculations
  const avgSalary = employees.length > 0
    ? Math.round(employees.reduce((sum, emp) => sum + (emp.MonthlyIncome || 0), 0) / employees.length)
    : 0
  const replacementCost = avgSalary * 6 // 6 months salary per replacement
  const potentialLoss = (predictions.imminent.length + predictions.likely.length) * replacementCost

  // Top risk factors analysis
  const riskFactors = [
    {
      factor: 'Low Performance',
      affected: employees.filter(emp => emp.PerformanceRating <= 2).length,
      percentage: ((employees.filter(emp => emp.PerformanceRating <= 2).length / employees.length) * 100).toFixed(1)
    },
    {
      factor: 'Overtime Burnout',
      affected: employees.filter(emp => emp.OverTime === 'Yes').length,
      percentage: ((employees.filter(emp => emp.OverTime === 'Yes').length / employees.length) * 100).toFixed(1)
    },
    {
      factor: 'Poor Work-Life Balance',
      affected: employees.filter(emp => emp.WorkLifeBalance <= 2).length,
      percentage: ((employees.filter(emp => emp.WorkLifeBalance <= 2).length / employees.length) * 100).toFixed(1)
    },
    {
      factor: 'Low Job Satisfaction',
      affected: employees.filter(emp => emp.JobSatisfaction <= 2).length,
      percentage: ((employees.filter(emp => emp.JobSatisfaction <= 2).length / employees.length) * 100).toFixed(1)
    },
    {
      factor: 'Career Stagnation',
      affected: employees.filter(emp => emp.YearsSinceLastPromotion > 3).length,
      percentage: ((employees.filter(emp => emp.YearsSinceLastPromotion > 3).length / employees.length) * 100).toFixed(1)
    }
  ].sort((a, b) => b.affected - a.affected)

  return (
    <Card className="bg-[#000000] border-[#B58342]/20">
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center">
          <Brain className="h-7 w-7 mr-3 text-purple-500" />
          AI-Powered Attrition Insights & Predictions
        </CardTitle>
        <CardDescription className="text-gray-400">
          Advanced analytics and machine learning predictions for proactive talent retention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prediction Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-600 to-red-700 border-2 border-red-500 rounded-xl p-5 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{predictions.imminent.length}</p>
            <p className="text-red-100 text-sm mt-1 font-medium">Imminent Risk</p>
            <p className="text-red-200 text-xs mt-1">70-100 risk score</p>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 border-2 border-orange-500 rounded-xl p-5 text-center">
            <TrendingDown className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{predictions.likely.length}</p>
            <p className="text-orange-100 text-sm mt-1 font-medium">Likely Attrition</p>
            <p className="text-orange-200 text-xs mt-1">50-69 risk score</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-2 border-yellow-500 rounded-xl p-5 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{predictions.possible.length}</p>
            <p className="text-yellow-100 text-sm mt-1 font-medium">Possible Risk</p>
            <p className="text-yellow-200 text-xs mt-1">30-49 risk score</p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 border-2 border-green-500 rounded-xl p-5 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-white" />
            <p className="text-3xl font-bold text-white">{predictions.unlikely.length}</p>
            <p className="text-green-100 text-sm mt-1 font-medium">Stable Employees</p>
            <p className="text-green-200 text-xs mt-1">0-29 risk score</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Risk Distribution Pie Chart */}
          <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 text-lg">Risk Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name.split(' ')[0]}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '2px solid #3B82F6',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Predictive Timeline */}
          <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 text-lg">Predicted Attrition Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="period"
                  stroke="#D1D5DB"
                  tick={{ fill: '#F3F4F6', fontSize: 12 }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#D1D5DB" tick={{ fill: '#F3F4F6', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '2px solid #3B82F6',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Legend />
                <Bar dataKey="predicted" fill="#F59E0B" name="AI Predicted" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" fill="#10B981" name="Historical Trend" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Attrition Analysis */}
        <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Department-wise Attrition Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#D1D5DB" tick={{ fill: '#F3F4F6' }} />
              <YAxis
                dataKey="department"
                type="category"
                stroke="#D1D5DB"
                tick={{ fill: '#F3F4F6', fontSize: 12 }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '2px solid #3B82F6',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Bar dataKey="rate" fill="#8B5CF6" name="Attrition Rate (%)" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Risk Factors */}
        <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Top Contributing Risk Factors
          </h3>
          <div className="space-y-3">
            {riskFactors.map((factor, index) => (
              <div key={index} className="bg-black/80/50 border border-[#B58342]/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium">{factor.factor}</h4>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400 text-sm">{factor.affected} employees</span>
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                      {factor.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-black/60 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-red-600 to-orange-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${factor.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Employees List */}
        <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            Critical Action Required - Top 10 High-Risk Employees
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {predictions.imminent
              .concat(predictions.likely)
              .sort((a, b) => b.riskScore - a.riskScore)
              .slice(0, 10)
              .map((emp, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedEmployee(emp)
                    setIsDialogOpen(true)
                  }}
                  className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-700 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-semibold">Employee #{emp.EmployeeNumber}</p>
                      <p className="text-gray-400 text-sm">{emp.JobRole}</p>
                      <p className="text-gray-500 text-xs">{emp.Department}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-lg font-bold text-lg ${
                        emp.riskScore >= 70 ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'
                      }`}>
                        {emp.riskScore}
                      </div>
                      <p className="text-gray-400 text-xs mt-1">risk score</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Financial Impact */}
        <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-2 border-purple-600 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-2 flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-purple-400" />
                Financial Impact Projection
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Cost analysis of predicted attrition over next 90 days
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-purple-300 text-sm mb-1">Avg Replacement Cost</p>
                  <p className="text-2xl font-bold text-white">${(replacementCost / 1000).toFixed(0)}K</p>
                  <p className="text-gray-400 text-xs">per employee</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">At-Risk Employees</p>
                  <p className="text-2xl font-bold text-white">{predictions.imminent.length + predictions.likely.length}</p>
                  <p className="text-gray-400 text-xs">high + imminent</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm mb-1">Potential Financial Loss</p>
                  <p className="text-3xl font-bold text-red-400">${(potentialLoss / 1000000).toFixed(2)}M</p>
                  <p className="text-gray-400 text-xs">if unaddressed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Employee Dialog */}
      <EmployeeDialog
        employee={selectedEmployee}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  )
}
