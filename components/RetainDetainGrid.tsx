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
    'high-high': { label: 'Top Talent', action: 'Retain & Promote', color: 'bg-gradient-to-br from-green-400/80 via-green-500/60 to-green-600/80 shadow-2xl shadow-green-500/30', borderColor: 'border-green-400/70', icon: Award, employees: [] as any[] },
    'high-med': { label: 'Strong Performers', action: 'Retain & Develop', color: 'bg-gradient-to-br from-green-300/80 via-green-400/60 to-green-500/80 shadow-2xl shadow-green-400/30', borderColor: 'border-green-300/70', icon: TrendingUp, employees: [] as any[] },
    'high-low': { label: 'Experts', action: 'Retain & Leverage', color: 'bg-gradient-to-br from-blue-400/80 via-blue-500/60 to-blue-600/80 shadow-2xl shadow-blue-500/30', borderColor: 'border-blue-400/70', icon: CheckCircle, employees: [] as any[] },
    'med-high': { label: 'High Potentials', action: 'Develop Urgently', color: 'bg-gradient-to-br from-purple-400/80 via-purple-500/60 to-purple-600/80 shadow-2xl shadow-purple-500/30', borderColor: 'border-purple-400/70', icon: Target, employees: [] as any[] },
    'med-med': { label: 'Core Contributors', action: 'Develop & Monitor', color: 'bg-gradient-to-br from-blue-300/80 via-blue-400/60 to-blue-500/80 shadow-2xl shadow-blue-400/30', borderColor: 'border-blue-300/70', icon: Users, employees: [] as any[] },
    'med-low': { label: 'Solid Performers', action: 'Monitor', color: 'bg-gradient-to-br from-gray-400/80 via-gray-500/60 to-gray-600/80 shadow-2xl shadow-gray-500/30', borderColor: 'border-gray-400/70', icon: CheckCircle, employees: [] as any[] },
    'low-high': { label: 'Rough Diamonds', action: 'Coach Intensively', color: 'bg-gradient-to-br from-yellow-400/80 via-yellow-500/60 to-yellow-600/80 shadow-2xl shadow-yellow-500/30', borderColor: 'border-yellow-400/70', icon: AlertTriangle, employees: [] as any[] },
    'low-med': { label: 'Development Needed', action: 'Performance Plan', color: 'bg-gradient-to-br from-orange-400/80 via-orange-500/60 to-orange-600/80 shadow-2xl shadow-orange-500/30', borderColor: 'border-orange-400/70', icon: AlertTriangle, employees: [] as any[] },
    'low-low': { label: 'At Risk', action: 'Detain (Consider Exit)', color: 'bg-gradient-to-br from-red-400/80 via-red-500/60 to-red-600/80 shadow-2xl shadow-red-500/30', borderColor: 'border-red-400/70', icon: AlertTriangle, employees: [] as any[] }
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-400/80 via-green-500/60 to-green-600/80 shadow-2xl shadow-green-500/30 border border-green-400/60 rounded-lg p-3 sm:p-4 text-center">
              <Award className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-white" />
              <p className="text-xl sm:text-2xl font-bold text-white">{gridData['high-high'].employees.length}</p>
              <p className="text-green-100 text-xs sm:text-sm mt-1">Top Talent</p>
            </div>
            <div className="bg-gradient-to-br from-purple-400/80 via-purple-500/60 to-purple-600/80 shadow-2xl shadow-purple-500/30 border border-purple-400/60 rounded-lg p-3 sm:p-4 text-center">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-white" />
              <p className="text-xl sm:text-2xl font-bold text-white">{gridData['med-high'].employees.length}</p>
              <p className="text-purple-100 text-xs sm:text-sm mt-1">High Potentials</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-400/80 via-yellow-500/60 to-yellow-600/80 shadow-2xl shadow-yellow-500/30 border border-yellow-400/60 rounded-lg p-3 sm:p-4 text-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-white" />
              <p className="text-xl sm:text-2xl font-bold text-white">{gridData['low-high'].employees.length + gridData['low-med'].employees.length}</p>
              <p className="text-yellow-100 text-xs sm:text-sm mt-1">Needs Development</p>
            </div>
            <div className="bg-gradient-to-br from-red-400/80 via-red-500/60 to-red-600/80 shadow-2xl shadow-red-500/30 border border-red-400/60 rounded-lg p-3 sm:p-4 text-center">
              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-white" />
              <p className="text-xl sm:text-2xl font-bold text-white">{gridData['low-low'].employees.length}</p>
              <p className="text-red-100 text-xs sm:text-sm mt-1">At Risk</p>
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
          <div className="bg-black/50 border border-[#B58342]/10 rounded-lg p-4 sm:p-6">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-500" />
              Strategic Action Plan
            </h4>
            <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4">
                <h5 className="text-green-400 font-medium mb-2 text-xs sm:text-sm">🎯 Retain (Top Right)</h5>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Focus on retention strategies: competitive compensation, challenging projects, leadership opportunities, recognition programs.
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-4">
                <h5 className="text-purple-400 font-medium mb-2 text-xs sm:text-sm">📈 Develop (Top Left & Middle)</h5>
                <p className="text-gray-300 text-xs sm:text-sm">
                  Invest in training, mentorship, stretch assignments, and career pathing to unlock potential and improve performance.
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4">
                <h5 className="text-red-400 font-medium mb-2 text-xs sm:text-sm">⚠️ Detain (Bottom Left)</h5>
                <p className="text-gray-300 text-xs sm:text-sm">
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
