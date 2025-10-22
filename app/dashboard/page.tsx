'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data matching the images
const keyMetrics = {
  totalEmployees: 17,
  avgAttritionRisk: 52,
  highRiskCount: 5
}

const highRiskEmployees = [
  { name: 'Alex Johnson', title: 'Senior Engineer', department: 'Engineering', riskScore: 85 },
  { name: 'Christopher Lee', title: 'Junior Engineer', department: 'Engineering', riskScore: 80 },
  { name: 'Daniel Harris', title: 'Senior PM', department: 'Product', riskScore: 75 },
  { name: 'Sarah Chen', title: 'Senior Engineer', department: 'Engineering', riskScore: 72 },
  { name: 'Rachel Green', title: 'Senior Engineer', department: 'Engineering', riskScore: 70 }
]

const competencyTrendData = [
  { month: 'Apr', score: 3.5 },
  { month: 'May', score: 3.7 },
  { month: 'Jun', score: 3.8 },
  { month: 'Jul', score: 4.0 },
  { month: 'Aug', score: 4.1 },
  { month: 'Sep', score: 4.2 }
]

export default function Dashboard() {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your talent intelligence metrics</p>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Employees</CardTitle>
            <Users className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{keyMetrics.totalEmployees}</div>
            <p className="text-sm text-gray-400">Active workforce</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg Attrition Risk</CardTitle>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{keyMetrics.avgAttritionRisk}</div>
            <p className="text-sm text-gray-400">Out of 100</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">High Risk Count</CardTitle>
            <TrendingUp className="h-5 w-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{keyMetrics.highRiskCount}</div>
            <p className="text-sm text-gray-400">Employees at risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* High Attrition Risk Employees */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">High Attrition Risk Employees</CardTitle>
            <CardDescription className="text-gray-400">Top 5 employees requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {highRiskEmployees.map((employee, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">{employee.name}</p>
                      <p className="text-sm text-gray-400">{employee.title} • {employee.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{employee.riskScore}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Competency Trend */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Team Competency Trend</CardTitle>
            <CardDescription className="text-gray-400">Average competency score over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={competencyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  domain={[0, 5]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
