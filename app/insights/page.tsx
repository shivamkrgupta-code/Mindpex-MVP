'use client'

import { useState } from 'react'
import { CheckCircle2, TrendingUp, Users, Target, BarChart3, Headphones, Sparkles } from 'lucide-react'
import SupportDrawer from '@/components/SupportDrawer'

interface PatternTile {
  id: string
  name: string
  descriptor: string
  color: string
  data30: { count: number; delta: number }
  data60: { count: number; delta: number }
  data90: { count: number; delta: number }
}

export default function InsightsPage() {
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false)
  const [showEmployeeListModal, setShowEmployeeListModal] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState<PatternTile | null>(null)
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<'30d' | '60d' | '90d'>('30d')

  // Time horizon state per tile (default: 30d)
  const [timeHorizons, setTimeHorizons] = useState<Record<string, '30d' | '60d' | '90d'>>({
    burnout: '30d',
    friction: '30d',
    promotion: '30d',
    satisfaction: '30d',
    performance: '30d'
  })

  // Pattern data with all time horizons
  const patterns: PatternTile[] = [
    {
      id: 'burnout',
      name: 'Burnout / Overload',
      descriptor: 'High-intensity stress signals',
      color: 'red',
      data30: { count: 23, delta: 5 },
      data60: { count: 31, delta: 12 },
      data90: { count: 38, delta: 18 }
    },
    {
      id: 'friction',
      name: 'Friction / Withdrawal',
      descriptor: 'Disengagement & conflict indicators',
      color: 'amber',
      data30: { count: 18, delta: -3 },
      data60: { count: 26, delta: 8 },
      data90: { count: 33, delta: 15 }
    },
    {
      id: 'promotion',
      name: 'Promotion Overdue',
      descriptor: 'Career progression stagnation',
      color: 'purple',
      data30: { count: 12, delta: 2 },
      data60: { count: 15, delta: 4 },
      data90: { count: 19, delta: 7 }
    },
    {
      id: 'satisfaction',
      name: 'Low Satisfaction',
      descriptor: 'Role fulfillment concerns',
      color: 'blue',
      data30: { count: 27, delta: 1 },
      data60: { count: 29, delta: 3 },
      data90: { count: 34, delta: 8 }
    },
    {
      id: 'performance',
      name: 'Performance Drop',
      descriptor: 'Output & engagement decline',
      color: 'orange',
      data30: { count: 9, delta: -2 },
      data60: { count: 11, delta: 1 },
      data90: { count: 14, delta: 4 }
    }
  ]

  // Intervention Effectiveness Data
  const interventionData = {
    completed: 85,
    improved: 72,
    avgRecoveryTime: 14
  }

  // Participation Health Data
  const participationData = {
    weeklyRate: 94,
    trendLine: 'upward',
    trustCopyReinforced: true
  }

  // System Load & Readiness Data
  const systemData = {
    interventionsPending: 23,
    managersNudged: 8,
    slaAdherence: 96
  }

  const handleTimeHorizonChange = (patternId: string, horizon: '30d' | '60d' | '90d') => {
    setTimeHorizons(prev => ({
      ...prev,
      [patternId]: horizon
    }))
  }

  const getCurrentData = (pattern: PatternTile) => {
    const horizon = timeHorizons[pattern.id]
    if (horizon === '60d') return pattern.data60
    if (horizon === '90d') return pattern.data90
    return pattern.data30
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; deltaBg: string }> = {
      red: {
        bg: 'from-red-500/10 to-red-600/5',
        border: 'border-red-500/30',
        text: 'text-red-400',
        deltaBg: 'bg-red-500/10'
      },
      amber: {
        bg: 'from-amber-500/10 to-amber-600/5',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        deltaBg: 'bg-amber-500/10'
      },
      purple: {
        bg: 'from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
        deltaBg: 'bg-purple-500/10'
      },
      blue: {
        bg: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
        deltaBg: 'bg-blue-500/10'
      },
      orange: {
        bg: 'from-orange-500/10 to-orange-600/5',
        border: 'border-orange-500/30',
        text: 'text-orange-400',
        deltaBg: 'bg-orange-500/10'
      }
    }
    return colors[color] || colors.blue
  }

  // Dynamic employee generator - creates exact number of employees based on count
  const getEmployeesForPattern = (patternId: string, horizon: '30d' | '60d' | '90d') => {
    // Get the actual count from the pattern data
    const pattern = patterns.find(p => p.id === patternId)
    if (!pattern) return []

    const count = horizon === '30d' ? pattern.data30.count :
                  horizon === '60d' ? pattern.data60.count :
                  pattern.data90.count

    // Employee name pools
    const firstNames = [
      'Sarah', 'Michael', 'Jessica', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'John',
      'Karen', 'Brandon', 'Linda', 'Paul', 'Michelle', 'Tom', 'Nina', 'Alex', 'Rachel', 'Chris',
      'Sophie', 'Daniel', 'George', 'Amanda', 'Kevin', 'Sandra', 'Mark', 'Jennifer', 'Ryan', 'Derek',
      'Monica', 'Victor', 'Patricia', 'Timothy', 'Angela', 'Steven', 'Laura', 'Brian', 'Nicole', 'Justin',
      'Rebecca', 'Matthew', 'Elizabeth', 'Christopher', 'Amy', 'Andrew', 'Stephanie', 'Joshua', 'Melissa', 'Daniel'
    ]

    const lastNames = [
      'Chen', 'Kumar', 'Park', 'Martinez', 'Wong', 'Johnson', 'Anderson', 'Wilson', 'Garcia', 'Smith',
      'White', 'Scott', 'Martinez', 'Anderson', 'Brown', 'Harrison', 'Patel', 'Thompson', 'Green', 'Evans',
      'Miller', 'Lee', 'Taylor', 'Clark', 'Rodriguez', 'Lewis', 'Thompson', 'Adams', 'Mitchell', 'Hall',
      'Wright', 'King', 'Moore', 'Baker', 'Davis', 'Martin', 'Young', 'Allen', 'Walker', 'Robinson',
      'Hill', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Edwards', 'Collins', 'Stewart', 'Morris', 'Rogers'
    ]

    const roles = [
      'Senior Developer', 'Product Manager', 'Team Lead', 'DevOps Engineer', 'UX Designer',
      'Backend Developer', 'QA Lead', 'Frontend Developer', 'Data Analyst', 'Account Executive',
      'Sales Manager', 'Customer Success', 'Support Engineer', 'Sales Rep', 'Account Manager',
      'Technical Writer', 'Operations Manager', 'Business Analyst', 'Project Manager', 'Compliance Officer',
      'Scrum Master', 'Content Writer', 'SEO Specialist', 'Junior Developer', 'Sales Associate',
      'Data Entry Clerk', 'Receptionist', 'IT Support', 'HR Specialist', 'Finance Analyst',
      'Marketing Manager', 'Software Engineer', 'System Administrator', 'Network Engineer', 'Security Analyst'
    ]

    const departments = [
      'Engineering', 'Product', 'Infrastructure', 'Design', 'Quality',
      'Sales', 'Support', 'Documentation', 'Operations', 'Strategy',
      'PMO', 'Legal', 'Agile', 'Marketing', 'Admin',
      'IT', 'Human Resources', 'Finance', 'Analytics', 'Customer Success'
    ]

    // Generate employees
    const employees = []
    for (let i = 0; i < count; i++) {
      const empId = `EMP-${1000 + i + (patternId.charCodeAt(0) * 100)}`
      const firstName = firstNames[i % firstNames.length]
      const lastName = lastNames[(i * 7) % lastNames.length]
      const role = roles[i % roles.length]
      const department = departments[i % departments.length]

      employees.push({
        id: empId,
        name: `${firstName} ${lastName}`,
        role,
        department
      })
    }

    return employees
  }

  const handleEmployeeCountClick = (pattern: PatternTile) => {
    setSelectedPattern(pattern)
    setSelectedTimeHorizon(timeHorizons[pattern.id])
    setShowEmployeeListModal(true)
  }

  return (
    <div className="flex-1 px-4 sm:px-6 pt-6 pb-12 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] min-h-screen overflow-y-auto">
      {/* Header with Support Link */}
      <div className="flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-[#B58342] animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Strategic Insights
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">Enterprise ROI Dashboard · Pattern Analytics & Intervention Effectiveness</p>
        </div>
        <button
          onClick={() => setIsSupportDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-white/10 to-white/5 border border-slate-600/30 rounded-lg text-slate-300 hover:text-white hover:border-[#B58342]/50 hover:shadow-lg hover:shadow-[#B58342]/20 transition-all duration-300 text-xs group"
        >
          <Headphones className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Need help?</span>
        </button>
      </div>

      {/* 1. Pattern Distribution (Primary) - NEW HORIZONTAL TILES */}
      <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border-2 border-white/20 rounded-xl shadow-2xl hover:shadow-white/10 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-100">
        <div className="bg-gradient-to-r from-white/10 to-transparent border-b border-white/20 p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">1. Pattern Distribution</h2>
              <div className="ml-auto px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-md">
                <span className="text-green-400 text-[10px] font-semibold uppercase tracking-wide">Primary</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs">Burnout / Overload / Friction / Withdrawal · Individual time horizons per pattern</p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* Horizontal Tile Grid - Compact */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {patterns.map((pattern) => {
              const currentData = getCurrentData(pattern)
              const colorClasses = getColorClasses(pattern.color)
              const isDeltaPositive = currentData.delta > 0
              const isDeltaNegative = currentData.delta < 0

              return (
                <div
                  key={pattern.id}
                  className={`relative bg-gradient-to-br ${colorClasses.bg} backdrop-blur-sm border ${colorClasses.border} rounded-lg p-3 hover:shadow-lg transition-all duration-300 aspect-square flex flex-col`}
                >
                  {/* Pattern Name */}
                  <div className="mb-2">
                    <h3 className={`text-xs font-semibold ${colorClasses.text} mb-0.5 leading-tight`}>
                      {pattern.name}
                    </h3>
                    <p className="text-slate-500 text-[9px] leading-snug">
                      {pattern.descriptor}
                    </p>
                  </div>

                  {/* Employee Count (Large, Primary) - Clickable */}
                  <div className="flex-1 flex items-center justify-center mb-2">
                    <div
                      className="text-center cursor-pointer hover:opacity-80 transition-opacity"
                      onDoubleClick={() => handleEmployeeCountClick(pattern)}
                      title="Double-click to view employee list"
                    >
                      <div className={`text-3xl font-bold ${colorClasses.text} mb-0.5`}>
                        {currentData.count}
                      </div>
                      <div className="text-slate-600 text-[9px] uppercase tracking-wide">
                        employees
                      </div>
                    </div>
                  </div>

                  {/* Time Horizon Dropdown */}
                  <div className="mb-1.5">
                    <select
                      value={timeHorizons[pattern.id]}
                      onChange={(e) => handleTimeHorizonChange(pattern.id, e.target.value as '30d' | '60d' | '90d')}
                      className="w-full bg-black/40 border border-slate-600/30 rounded px-1.5 py-1 text-white text-[10px] focus:outline-none focus:border-slate-500/50 transition-colors cursor-pointer"
                    >
                      <option value="30d">30 days</option>
                      <option value="60d">60 days</option>
                      <option value="90d">90 days</option>
                    </select>
                  </div>

                  {/* Delta Indicator (Small, Secondary) */}
                  <div className={`${colorClasses.deltaBg} rounded px-1.5 py-0.5 flex items-center justify-center gap-1`}>
                    {isDeltaPositive && (
                      <>
                        <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-500 text-[10px] font-medium">+{currentData.delta}</span>
                      </>
                    )}
                    {isDeltaNegative && (
                      <>
                        <svg className="w-2.5 h-2.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-500 text-[10px] font-medium">{currentData.delta}</span>
                      </>
                    )}
                    {!isDeltaPositive && !isDeltaNegative && (
                      <>
                        <div className="w-2.5 h-0.5 bg-slate-500 rounded"></div>
                        <span className="text-slate-500 text-[10px] font-medium">0</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Executive Summary */}
          <div className="mt-4 bg-gradient-to-br from-slate-800/40 to-transparent border border-slate-700/30 rounded-lg p-3">
            <p className="text-slate-400 text-[10px] leading-relaxed">
              <span className="text-white font-semibold">Executive scan:</span> {' '}
              {patterns.reduce((sum, p) => sum + getCurrentData(p).count, 0)} employees across {patterns.length} risk patterns.
              Select time horizons individually to understand trend context per pattern.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Intervention Effectiveness */}
      <div className="bg-gradient-to-br from-green-500/5 via-white/5 to-transparent backdrop-blur-xl border-2 border-green-500/30 rounded-xl shadow-2xl hover:shadow-green-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-200">
        <div className="bg-gradient-to-r from-green-500/20 to-transparent border-b border-green-500/30 p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <h2 className="text-lg sm:text-xl font-bold text-white">2. Intervention Effectiveness</h2>
            </div>
            <p className="text-slate-400 text-xs mb-2">% completed · % improved · Avg recovery time</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/40 rounded-md">
              <Target className="h-3 w-3 text-green-400" />
              <p className="text-green-400 text-[10px] font-semibold uppercase tracking-wide">Enterprise ROI Slide</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Interventions Completed */}
            <div className="group relative bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-4 text-center hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-white">Success Rate</h3>
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-green-400 mb-1 group-hover:scale-105 transition-transform">{interventionData.completed}%</div>
                  <div className="text-xs text-slate-500">interventions completed</div>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/40 rounded-md group-hover:bg-green-500/30 transition-colors">
                  <CheckCircle2 className="h-2.5 w-2.5 text-green-400" />
                  <span className="text-green-400 font-semibold text-[10px]">earned, muted</span>
                </div>
              </div>
            </div>

            {/* Improved Post-Intervention */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-4 text-center hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-white">Improvement</h3>
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-blue-400 mb-1 group-hover:scale-105 transition-transform">{interventionData.improved}%</div>
                  <div className="text-xs text-slate-500">improved post-intervention</div>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded-md group-hover:bg-blue-500/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  <span className="text-blue-400 font-semibold text-[10px]">in progress</span>
                </div>
              </div>
            </div>

            {/* Avg Recovery Time */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-lg p-4 text-center hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Target className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <h3 className="text-sm font-semibold text-white">Recovery</h3>
                </div>
                <div className="mb-2">
                  <div className="text-4xl font-bold text-amber-400 mb-1 group-hover:scale-105 transition-transform">{interventionData.avgRecoveryTime}</div>
                  <div className="text-xs text-slate-500">days avg recovery</div>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 border border-amber-500/40 rounded-md group-hover:bg-amber-500/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-amber-400 font-semibold text-[10px]">pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Color Legend */}
          <div className="mt-5 bg-gradient-to-br from-black/60 to-black/40 border border-slate-600/30 rounded-lg p-4 hover:border-slate-500/50 transition-colors">
            <h4 className="text-white font-semibold mb-3 text-xs flex items-center gap-2">
              <div className="w-0.5 h-4 bg-gradient-to-b from-[#B58342] to-transparent rounded-full"></div>
              Status Color Guide
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 p-2 bg-green-500/5 border border-green-500/20 rounded-md hover:bg-green-500/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-md shadow-green-500/50"></div>
                <span className="text-slate-400 text-[10px]">Green = success</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-500/5 border border-blue-500/20 rounded-md hover:bg-blue-500/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-md shadow-blue-500/50 animate-pulse"></div>
                <span className="text-slate-400 text-[10px]">Blue = progress</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber-500/5 border border-amber-500/20 rounded-md hover:bg-amber-500/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-md shadow-amber-500/50"></div>
                <span className="text-slate-400 text-[10px]">Amber = pending</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-500/5 border border-red-500/20 rounded-md hover:bg-red-500/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-500/50"></div>
                <span className="text-slate-400 text-[10px]">Red = system fail</span>
              </div>
            </div>
            <p className="text-slate-600 text-[10px] mt-2 text-center italic">(not people failure)</p>
          </div>
        </div>
      </div>

      {/* 3. Participation Health */}
      <div className="bg-gradient-to-br from-blue-500/5 via-white/5 to-transparent backdrop-blur-xl border-2 border-blue-500/30 rounded-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-300">
        <div className="bg-gradient-to-r from-blue-500/20 to-transparent border-b border-blue-500/30 p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <h2 className="text-lg sm:text-xl font-bold text-white">3. Participation Health</h2>
            </div>
            <p className="text-slate-400 text-xs mb-2">Weekly rate · Trend line · Trust reinforced</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-blue-500/40 rounded-md">
              <CheckCircle2 className="h-3 w-3 text-blue-400" />
              <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-wide">Calm & Reassuring</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* Weekly Participation Rate */}
          <div className="relative bg-gradient-to-br from-green-500/10 via-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-5 mb-4 overflow-hidden group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-400 animate-pulse" />
                <h3 className="text-base font-semibold text-white">Weekly Participation Rate</h3>
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-green-400 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform">
                {participationData.weeklyRate}%
              </div>
              <p className="text-slate-500 text-xs">of managers actively engaging</p>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-3 mb-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 via-blue-400 to-green-500 h-3 rounded-full transition-all duration-1000 relative"
                style={{ width: `${participationData.weeklyRate}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="h-2.5 w-2.5 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center justify-center gap-1.5 p-2 bg-green-500/10 border border-green-500/30 rounded-md">
              <TrendingUp className="h-4 w-4 text-green-400 animate-bounce" />
              <span className="text-green-400 font-semibold text-xs">Upward trend (30 days)</span>
            </div>
          </div>

          {/* Trust Copy Reinforced */}
          <div className="bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/20 rounded-lg p-4 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border border-green-500/30 group hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-1.5">
                  Trust & Privacy Commitment
                  <Sparkles className="h-3.5 w-3.5 text-green-400" />
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-2">
                  High participation reflects your team's trust in this system. All insights are aggregated and anonymized—
                  focusing on patterns, not people. Your managers use this tool to support teams proactively,
                  creating healthier work environments without surveillance.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-md">
                  <CheckCircle2 className="h-3 w-3 text-green-400" />
                  <p className="text-green-400 text-[10px] font-semibold italic">
                    Calm. Reassuring. Working as intended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. System Load & Readiness */}
      <div className="bg-gradient-to-br from-[#B58342]/5 via-white/5 to-transparent backdrop-blur-xl border-2 border-[#B58342]/30 rounded-xl shadow-2xl hover:shadow-[#B58342]/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 delay-[400ms]">
        <div className="bg-gradient-to-r from-[#B58342]/20 to-transparent border-b border-[#B58342]/30 p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#B58342]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#B58342]"></div>
              <h2 className="text-lg sm:text-xl font-bold text-white">4. System Load & Readiness</h2>
            </div>
            <p className="text-slate-400 text-xs mb-2">Interventions pending · Managers nudged · SLA adherence</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-[#B58342]/20 to-[#d4a05a]/20 border border-[#B58342]/40 rounded-md">
              <BarChart3 className="h-3 w-3 text-[#B58342]" />
              <p className="text-[#B58342] text-[10px] font-semibold uppercase tracking-wide">Execution Focus</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Interventions Pending */}
            <div className="group relative bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-lg p-4 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-500/20 rounded-md group-hover:scale-110 transition-transform">
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Queue Status</h3>
                </div>
                <div className="text-4xl font-bold text-amber-400 mb-1 group-hover:scale-105 transition-transform">{systemData.interventionsPending}</div>
                <p className="text-slate-500 text-xs mb-2">interventions pending</p>
                <div className="bg-black/40 rounded-md p-2 border border-amber-500/20 group-hover:border-amber-500/40 transition-colors">
                  <p className="text-amber-300 text-[10px] font-semibold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                    Action within 7 days
                  </p>
                </div>
              </div>
            </div>

            {/* Managers Nudged */}
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-blue-500/20 rounded-md group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Active Nudges</h3>
                </div>
                <div className="text-4xl font-bold text-blue-400 mb-1 group-hover:scale-105 transition-transform">{systemData.managersNudged}</div>
                <p className="text-slate-500 text-xs mb-2">managers nudged</p>
                <div className="bg-black/40 rounded-md p-2 border border-blue-500/20 group-hover:border-blue-500/40 transition-colors">
                  <p className="text-blue-300 text-[10px] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />
                    Reminders sent
                  </p>
                </div>
              </div>
            </div>

            {/* SLA Adherence */}
            <div className="group relative bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-lg p-4 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-green-500/20 rounded-md group-hover:scale-110 transition-transform">
                    <Target className="h-5 w-5 text-green-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">SLA Performance</h3>
                </div>
                <div className="text-4xl font-bold text-green-400 mb-1 group-hover:scale-105 transition-transform">{systemData.slaAdherence}%</div>
                <p className="text-slate-500 text-xs mb-2">7-day SLA adherence</p>
                <div className="bg-black/40 rounded-md p-2 border border-green-500/20 group-hover:border-green-500/40 transition-colors">
                  <p className="text-green-300 text-[10px] font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                    On track Q1
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Execution Focus Message */}
          <div className="mt-5 bg-gradient-to-br from-[#B58342]/5 to-transparent border border-[#B58342]/30 rounded-lg p-4 hover:border-[#B58342]/50 hover:shadow-lg hover:shadow-[#B58342]/10 transition-all duration-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B58342]/20 to-[#d4a05a]/20 flex items-center justify-center border border-[#B58342]/30 group hover:scale-110 transition-transform">
                  <BarChart3 className="h-5 w-5 text-[#B58342]" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-1.5">
                  Execution-Focused Dashboard
                  <Target className="h-3.5 w-3.5 text-[#B58342]" />
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  These metrics track system throughput and manager responsiveness—not employee performance.
                  SLA adherence ensures timely interventions reach those who need support.
                  This is about operational efficiency and caring for your workforce, not surveillance or judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List Modal */}
      {showEmployeeListModal && selectedPattern && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowEmployeeListModal(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-[90vw] max-w-2xl max-h-[80vh] bg-gradient-to-br from-[#1a1a1a]/95 via-[#2a2a2a]/95 to-[#1a1a1a]/95 backdrop-blur-xl border-2 border-[#B58342]/30 rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-top-4 duration-300">
            {/* Modal Header */}
            <div className="border-b border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {selectedPattern.name} Pattern
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {selectedPattern.descriptor} · {selectedTimeHorizon === '30d' ? '30 days' : selectedTimeHorizon === '60d' ? '60 days' : '90 days'}
                  </p>
                </div>
                <button
                  onClick={() => setShowEmployeeListModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Employee List */}
            <div className="p-5 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div className="space-y-2">
                {getEmployeesForPattern(selectedPattern.id, selectedTimeHorizon).map((employee) => (
                  <div
                    key={employee.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-[#B58342]/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-mono text-slate-400">
                            {employee.id}
                          </span>
                          <span className="text-base font-semibold text-white">
                            {employee.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{employee.role}</span>
                          <span className="text-slate-600">•</span>
                          <span>{employee.department}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {getEmployeesForPattern(selectedPattern.id, selectedTimeHorizon).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-slate-500 text-sm">
                    No employees found for this pattern and time horizon
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-white/10 p-4 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Showing {getEmployeesForPattern(selectedPattern.id, selectedTimeHorizon).length} employees
              </div>
              <button
                onClick={() => setShowEmployeeListModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white text-sm font-medium rounded-lg transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Support Drawer */}
      <SupportDrawer
        isOpen={isSupportDrawerOpen}
        onClose={() => setIsSupportDrawerOpen(false)}
        context={{
          page: 'Insights - Strategic Analytics',
          orgId: 'demo-org-001',
          userId: 'demo-user-001'
        }}
      />
    </div>
  )
}
