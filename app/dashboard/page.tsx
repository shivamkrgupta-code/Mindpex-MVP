'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { Users, TrendingUp, Award, Target } from 'lucide-react'

// Mock data for demonstration
const performanceData = [
  { name: 'Jan', performance: 85, potential: 78 },
  { name: 'Feb', performance: 88, potential: 82 },
  { name: 'Mar', performance: 92, potential: 85 },
  { name: 'Apr', performance: 89, potential: 88 },
  { name: 'May', performance: 94, potential: 90 },
  { name: 'Jun', performance: 91, potential: 87 }
]

const competencyData = [
  { name: 'Technical Skills', value: 85, color: '#8884d8' },
  { name: 'Leadership', value: 72, color: '#82ca9d' },
  { name: 'Communication', value: 68, color: '#ffc658' },
  { name: 'Problem Solving', value: 91, color: '#ff7300' }
]

const nineBoxData = [
  { performance: 85, potential: 78, name: 'John Doe', department: 'Engineering' },
  { performance: 92, potential: 88, name: 'Jane Smith', department: 'Marketing' },
  { performance: 78, potential: 85, name: 'Mike Johnson', department: 'Sales' },
  { performance: 88, potential: 82, name: 'Sarah Wilson', department: 'HR' }
]

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employee Analytics Dashboard</h2>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotion Ready</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competency Gap</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.2%</div>
            <p className="text-xs text-muted-foreground">-1.2% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
          <TabsTrigger value="competency">Competency Tracking</TabsTrigger>
          <TabsTrigger value="ninebox">Nine-Box Grid</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Employee performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="performance" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="potential" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Competency Distribution</CardTitle>
                <CardDescription>Skill areas breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={competencyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {competencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="performance" fill="#8884d8" />
                  <Bar dataKey="potential" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="competency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competency Gap Analysis</CardTitle>
              <CardDescription>Identify skill gaps and development opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competencyData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${item.value}%`, 
                            backgroundColor: item.color 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ninebox" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nine-Box Grid</CardTitle>
              <CardDescription>Talent assessment and succession planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {nineBoxData.map((employee, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{employee.name}</h4>
                    <p className="text-sm text-gray-600">{employee.department}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Performance:</span>
                        <span className="font-medium">{employee.performance}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Potential:</span>
                        <span className="font-medium">{employee.potential}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
