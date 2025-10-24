'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, AlertTriangle, CheckCircle, Target, Award } from 'lucide-react'
import { useState } from 'react'
import EmployeeDialog from './EmployeeDialog'

interface RetainDetainGridProps {
  employees: any[]
}

export default function RetainDetainGrid({ employees }: RetainDetainGridProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Calculate performance and potential scores
  const calculatePerformance = (emp: any): number => {
    let score = 0
    // Performance rating (40%)
    score += (emp.PerformanceRating / 4) * 40
    // Job involvement (20%)
    score += (emp.JobInvolvement / 4) * 20
    // Job satisfaction (20%)
    score += (emp.JobSatisfaction / 4) * 20
    // Training (20%)
    score += Math.min((emp.TrainingTimesLastYear / 6) * 20, 20)
    return Math.round(score)
  }

  const calculatePotential = (emp: any): number => {
    let score = 0
    // Education level (30%)
    score += (emp.Education / 5) * 30
    // Years at company indicates growth capacity (20%)
    const tenureScore = emp.YearsAtCompany >= 10 ? 20 : (emp.YearsAtCompany / 10) * 20
    score += tenureScore
    // Job level (25%)
    score += (emp.JobLevel / 5) * 25
    // Recent promotion indicates upward trajectory (15%)
    const promotionScore = emp.YearsSinceLastPromotion <= 1 ? 15 : emp.YearsSinceLastPromotion <= 2 ? 10 : 5
    score += promotionScore
    // Environment satisfaction (10%)
    score += (emp.EnvironmentSatisfaction / 4) * 10
    return Math.round(score)
  }

  // Categorize employees into 9 grid positions
  const categorizeEmployee = (performance: number, potential: number): string => {
    if (performance >= 70 && potential >= 70) return 'high-high' // Top Talent
    if (performance >= 70 && potential >= 40 && potential < 70) return 'high-med' // Strong Performers
    if (performance >= 70 && potential < 40) return 'high-low' // Experts
    if (performance >= 40 && performance < 70 && potential >= 70) return 'med-high' // High Potentials
    if (performance >= 40 && performance < 70 && potential >= 40 && potential < 70) return 'med-med' // Core Contributors
    if (performance >= 40 && performance < 70 && potential < 40) return 'med-low' // Solid Performers
    if (performance < 40 && potential >= 70) return 'low-high' // Rough Diamonds
    if (performance < 40 && potential >= 40 && potential < 70) return 'low-med' // Development Needed
    return 'low-low' // At Risk
  }

  // Process employees
  const processedEmployees = employees.map(emp => ({
    ...emp,
    performanceScore: calculatePerformance(emp),
    potentialScore: calculatePotential(emp),
    category: categorizeEmployee(calculatePerformance(emp), calculatePotential(emp))
  }))

  // Group by category
  const gridData = {
    'high-high': { label: 'Top Talent', action: 'Retain & Promote', color: 'bg-green-600', borderColor: 'border-green-500', icon: Award, employees: [] as any[] },
    'high-med': { label: 'Strong Performers', action: 'Retain & Develop', color: 'bg-green-500', borderColor: 'border-green-400', icon: TrendingUp, employees: [] as any[] },
    'high-low': { label: 'Experts', action: 'Retain & Leverage', color: 'bg-blue-600', borderColor: 'border-blue-500', icon: CheckCircle, employees: [] as any[] },
    'med-high': { label: 'High Potentials', action: 'Develop Urgently', color: 'bg-purple-600', borderColor: 'border-purple-500', icon: Target, employees: [] as any[] },
    'med-med': { label: 'Core Contributors', action: 'Develop & Monitor', color: 'bg-blue-500', borderColor: 'border-blue-400', icon: Users, employees: [] as any[] },
    'med-low': { label: 'Solid Performers', action: 'Monitor', color: 'bg-gray-600', borderColor: 'border-gray-500', icon: CheckCircle, employees: [] as any[] },
    'low-high': { label: 'Rough Diamonds', action: 'Coach Intensively', color: 'bg-yellow-600', borderColor: 'border-yellow-500', icon: AlertTriangle, employees: [] as any[] },
    'low-med': { label: 'Development Needed', action: 'Performance Plan', color: 'bg-orange-600', borderColor: 'border-orange-500', icon: AlertTriangle, employees: [] as any[] },
    'low-low': { label: 'At Risk', action: 'Detain (Consider Exit)', color: 'bg-red-600', borderColor: 'border-red-500', icon: AlertTriangle, employees: [] as any[] }
  }

  // Populate grid data
  processedEmployees.forEach(emp => {
    if (gridData[emp.category as keyof typeof gridData]) {
      gridData[emp.category as keyof typeof gridData].employees.push(emp)
    }
  })

  const handleEmployeeClick = (employee: any) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  return (
    <>
      <Card className="bg-[#000000] border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-2xl flex items-center">
            <Target className="h-7 w-7 mr-3 text-purple-500" />
            9-Grid Retain-or-Detain System
          </CardTitle>
          <CardDescription className="text-gray-400">
            Strategic talent assessment matrix based on performance and potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-600 to-green-700 border border-green-500 rounded-lg p-4 text-center">
              <Award className="h-8 w-8 mx-auto mb-2 text-white" />
              <p className="text-2xl font-bold text-white">{gridData['high-high'].employees.length}</p>
              <p className="text-green-100 text-sm mt-1">Top Talent</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 border border-purple-500 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 mx-auto mb-2 text-white" />
              <p className="text-2xl font-bold text-white">{gridData['med-high'].employees.length}</p>
              <p className="text-purple-100 text-sm mt-1">High Potentials</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 border border-yellow-500 rounded-lg p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-white" />
              <p className="text-2xl font-bold text-white">{gridData['low-high'].employees.length + gridData['low-med'].employees.length}</p>
              <p className="text-yellow-100 text-sm mt-1">Needs Development</p>
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 border border-red-500 rounded-lg p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-white" />
              <p className="text-2xl font-bold text-white">{gridData['low-low'].employees.length}</p>
              <p className="text-red-100 text-sm mt-1">At Risk</p>
            </div>
          </div>

          {/* 9-Grid Matrix */}
          <div className="mb-6">
            {/* Axis Labels */}
            <div className="flex items-center mb-4">
              <div className="flex-1 text-center">
                <p className="text-gray-400 text-sm font-semibold mb-2">POTENTIAL (Growth Capacity) ↑</p>
              </div>
            </div>

            <div className="relative">
              {/* Grid */}
              <div className="grid grid-rows-3 gap-3">
                {/* High Potential Row */}
                <div className="grid grid-cols-3 gap-3">
                  {['low-high', 'med-high', 'high-high'].map((category) => {
                    const cat = gridData[category as keyof typeof gridData]
                    const Icon = cat.icon
                    return (
                      <div
                        key={category}
                        className={`${cat.color} border-2 ${cat.borderColor} rounded-xl p-4 min-h-[140px] transition-all hover:shadow-xl cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold text-sm mb-1">{cat.label}</h4>
                            <p className="text-xs text-white/80">{cat.action}</p>
                          </div>
                          <Icon className="h-5 w-5 text-white/90" />
                        </div>
                        <div className="mt-3">
                          <p className="text-3xl font-bold text-white">{cat.employees.length}</p>
                          <p className="text-xs text-white/70 mt-1">employees</p>
                        </div>
                        {cat.employees.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cat.employees.slice(0, 3).map((emp, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleEmployeeClick(emp)}
                                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white transition-colors"
                              >
                                #{emp.EmployeeNumber}
                              </button>
                            ))}
                            {cat.employees.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                                +{cat.employees.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Medium Potential Row */}
                <div className="grid grid-cols-3 gap-3">
                  {['low-med', 'med-med', 'high-med'].map((category) => {
                    const cat = gridData[category as keyof typeof gridData]
                    const Icon = cat.icon
                    return (
                      <div
                        key={category}
                        className={`${cat.color} border-2 ${cat.borderColor} rounded-xl p-4 min-h-[140px] transition-all hover:shadow-xl cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold text-sm mb-1">{cat.label}</h4>
                            <p className="text-xs text-white/80">{cat.action}</p>
                          </div>
                          <Icon className="h-5 w-5 text-white/90" />
                        </div>
                        <div className="mt-3">
                          <p className="text-3xl font-bold text-white">{cat.employees.length}</p>
                          <p className="text-xs text-white/70 mt-1">employees</p>
                        </div>
                        {cat.employees.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cat.employees.slice(0, 3).map((emp, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleEmployeeClick(emp)}
                                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white transition-colors"
                              >
                                #{emp.EmployeeNumber}
                              </button>
                            ))}
                            {cat.employees.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                                +{cat.employees.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Low Potential Row */}
                <div className="grid grid-cols-3 gap-3">
                  {['low-low', 'med-low', 'high-low'].map((category) => {
                    const cat = gridData[category as keyof typeof gridData]
                    const Icon = cat.icon
                    return (
                      <div
                        key={category}
                        className={`${cat.color} border-2 ${cat.borderColor} rounded-xl p-4 min-h-[140px] transition-all hover:shadow-xl cursor-pointer`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold text-sm mb-1">{cat.label}</h4>
                            <p className="text-xs text-white/80">{cat.action}</p>
                          </div>
                          <Icon className="h-5 w-5 text-white/90" />
                        </div>
                        <div className="mt-3">
                          <p className="text-3xl font-bold text-white">{cat.employees.length}</p>
                          <p className="text-xs text-white/70 mt-1">employees</p>
                        </div>
                        {cat.employees.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cat.employees.slice(0, 3).map((emp, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleEmployeeClick(emp)}
                                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs text-white transition-colors"
                              >
                                #{emp.EmployeeNumber}
                              </button>
                            ))}
                            {cat.employees.length > 3 && (
                              <span className="px-2 py-1 bg-white/10 rounded text-xs text-white">
                                +{cat.employees.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* X-axis label */}
              <div className="text-center text-gray-400 font-semibold text-sm mt-4">
                PERFORMANCE (Current Contribution) →
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="bg-black/50 border border-[#B58342]/10 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Strategic Action Plan
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h5 className="text-green-400 font-medium mb-2">🎯 Retain (Top Right)</h5>
                <p className="text-gray-300 text-sm">
                  Focus on retention strategies: competitive compensation, challenging projects, leadership opportunities, recognition programs.
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h5 className="text-purple-400 font-medium mb-2">📈 Develop (Top Left & Middle)</h5>
                <p className="text-gray-300 text-sm">
                  Invest in training, mentorship, stretch assignments, and career pathing to unlock potential and improve performance.
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h5 className="text-red-400 font-medium mb-2">⚠️ Detain (Bottom Left)</h5>
                <p className="text-gray-300 text-sm">
                  Implement performance improvement plans, consider role changes, or initiate managed exits for persistent underperformers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Dialog */}
      <EmployeeDialog
        employee={selectedEmployee}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
