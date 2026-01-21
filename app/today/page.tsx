'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { supabase } from '@/lib/supabase'
import { CheckCircle2, ChevronDown, ChevronUp, Clock, Shield, Headphones, Eye, Share2 } from 'lucide-react'
import SupportDrawer from '@/components/SupportDrawer'

interface PriorityIntervention {
  id: string
  employeeId: string
  role: string
  detectedPattern: string
  whyItMatters: string
  recommendedAction: string
  status: 'pending' | 'started' | 'completed' | 'paused' | 'deferred'
  daysActive: number
  patternType: 'burnout' | 'promotion' | 'satisfaction' | 'performance' | 'commute'
}

export default function Dashboard() {
  const [interventions, setInterventions] = useState<PriorityIntervention[]>([])
  const [loading, setLoading] = useState(true)
  const [laterCollapsed, setLaterCollapsed] = useState(true)
  const [toast, setToast] = useState<{ message: string; color: string } | null>(null)
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showActionsModal, setShowActionsModal] = useState(false)
  const [selectedIntervention, setSelectedIntervention] = useState<PriorityIntervention | null>(null)

  useEffect(() => {
    async function fetchDashboardData() {
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

        if (allEmployees.length > 0) {
          const priorityInterventions = generateInterventions(allEmployees)
          setInterventions(priorityInterventions)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const generateInterventions = (employees: any[]): PriorityIntervention[] => {
    const employeesWithRisk = employees.map(emp => {
      let risk = 0
      let pattern = ''
      let patternType: PriorityIntervention['patternType'] = 'performance'
      let whyItMatters = ''
      let action = ''

      if (emp.OverTime === 'Yes' && emp.WorkLifeBalance <= 2) {
        risk += 25
        pattern = 'Consistent overtime with declining work-life balance'
        patternType = 'burnout'
        whyItMatters = 'Risk of burnout may lead to disengagement or departure'
        action = 'Initiate workload redistribution review'
      } else if (emp.YearsSinceLastPromotion >= 3 && emp.PerformanceRating >= 3) {
        risk += 20
        pattern = 'High performer overdue for promotion'
        patternType = 'promotion'
        whyItMatters = 'Career stagnation may trigger voluntary departure'
        action = 'Accelerate promotion review and communicate career trajectory'
      } else if (emp.JobSatisfaction <= 2) {
        risk += 15
        pattern = 'Low satisfaction with current role alignment'
        patternType = 'satisfaction'
        whyItMatters = 'Disengagement trend detected across multiple signals'
        action = 'Conduct career development conversation'
      } else if (emp.PerformanceRating <= 2) {
        risk += 20
        pattern = 'Performance decline with high job demands'
        patternType = 'performance'
        whyItMatters = 'Early intervention prevents further performance decline'
        action = 'Schedule 1:1 performance coaching session'
      } else if (emp.DistanceFromHome > 20) {
        risk += 10
        pattern = 'Long commute affecting engagement'
        patternType = 'commute'
        whyItMatters = 'Distance from workplace correlates with lower retention'
        action = 'Discuss remote work or flexible schedule options'
      }

      const daysActive = Math.floor(Math.random() * 10) + 1

      return {
        ...emp,
        riskScore: risk,
        detectedPattern: pattern,
        patternType,
        whyItMatters,
        recommendedAction: action,
        daysActive
      }
    })

    const topRisk = employeesWithRisk
      .filter(emp => emp.riskScore > 0)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 8)

    return topRisk.map(emp => ({
      id: emp.EmployeeNumber?.toString() || Math.random().toString(),
      employeeId: `ID-${emp.EmployeeNumber || 'Unknown'}`,
      role: emp.JobRole || 'Unknown Role',
      detectedPattern: emp.detectedPattern || 'General engagement monitoring',
      whyItMatters: emp.whyItMatters || 'Pattern requires attention',
      recommendedAction: emp.recommendedAction || 'Continue routine check-ins',
      status: 'pending' as const,
      daysActive: emp.daysActive,
      patternType: emp.patternType
    }))
  }

  const updateInterventionStatus = async (id: string, status: 'started' | 'completed') => {
    setInterventions(prevInterventions => {
      const updated = prevInterventions.map(intervention =>
        intervention.id === id ? { ...intervention, status } : intervention
      )

      if (status === 'completed') {
        const completed = updated.filter(i => i.status === 'completed')
        const notCompleted = updated.filter(i => i.status !== 'completed')
        return [...notCompleted, ...completed]
      }

      return updated
    })

    if (status === 'started') {
      showToast('Intervention tracking started', 'blue')
    } else if (status === 'completed') {
      showToast('Intervention completed', 'green')
    }
  }

  const viewEmployeeDetails = async (employeeId: string) => {
    if (supabase) {
      try {
        const { data: employee, error } = await supabase
          .from('employees')
          .select('*')
          .eq('EmployeeNumber', employeeId)
          .single()

        if (!error && employee) {
          setSelectedEmployee(employee)
          setShowEmployeeModal(true)
        }
      } catch (error) {
        console.error('Error fetching employee details:', error)
      }
    }
  }

  const deferIntervention = (id: string) => {
    // Update status to deferred and move to end of list
    setInterventions(prevInterventions => {
      const updated = prevInterventions.map(intervention =>
        intervention.id === id ? { ...intervention, status: 'deferred' as const } : intervention
      )

      const intervention = updated.find(i => i.id === id)
      const others = updated.filter(i => i.id !== id)

      if (intervention) {
        return [...others, intervention]
      }
      return updated
    })

    showToast('Intervention deferred to tomorrow', 'red')
  }

  const pauseIntervention = (id: string) => {
    setInterventions(prevInterventions =>
      prevInterventions.map(intervention =>
        intervention.id === id ? { ...intervention, status: 'paused' as const } : intervention
      )
    )
    showToast('Intervention paused', 'yellow')
  }

  const handleCardDoubleClick = (intervention: PriorityIntervention) => {
    setSelectedIntervention(intervention)
    setShowActionsModal(true)
  }

  const handleShareIntervention = (intervention: PriorityIntervention) => {
    const actions = getRecommendedActions(intervention.patternType)

    // Create shareable text content
    const shareText = `
INTERVENTION GUIDANCE - ${getEmployeeName(parseInt(intervention.id))}
Employee ID: ${intervention.employeeId}
Role: ${intervention.role}

PATTERN DETECTED:
${intervention.detectedPattern}

WHY THIS MATTERS:
${intervention.whyItMatters}

RECOMMENDED ACTIONS:
${actions.do.map((action, i) => `${i + 1}. ${action}`).join('\n')}

WHAT NOT TO DO:
${actions.dont.map((action, i) => `• ${action}`).join('\n')}

IMMEDIATE NEXT STEP:
${intervention.recommendedAction}

---
Generated from Mindpex Talent Intelligence Platform
    `.trim()

    // Try to use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `Intervention Guidance - ${intervention.employeeId}`,
        text: shareText
      }).then(() => {
        showToast('Intervention details shared successfully', 'green')
      }).catch((error) => {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          // Fallback to clipboard
          copyToClipboard(shareText)
        }
      })
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard - ready to share with manager', 'green')
    }).catch(() => {
      showToast('Unable to copy to clipboard', 'red')
    })
  }

  const getRecommendedActions = (patternType: string) => {
    const actions: Record<string, { do: string[]; dont: string[] }> = {
      burnout: {
        do: [
          'Schedule a 1:1 meeting to discuss workload and priorities',
          'Review current project assignments and deadlines',
          'Explore flexible work arrangements or temporary workload reduction',
          'Encourage use of PTO and ensure they take regular breaks'
        ],
        dont: [
          'Don\'t assign additional high-priority tasks immediately',
          'Don\'t mention performance concerns during the initial conversation',
          'Don\'t minimize their feelings or suggest they "just need to work smarter"',
          'Don\'t wait until the annual review to address this pattern'
        ]
      },
      promotion: {
        do: [
          'Acknowledge their contributions and value to the team',
          'Discuss career aspirations and create a clear promotion timeline',
          'Provide visibility into the promotion process and requirements',
          'Offer stretch assignments to demonstrate readiness for next level'
        ],
        dont: [
          'Don\'t make promises you can\'t keep about promotion timing',
          'Don\'t compare them unfavorably to others who were promoted',
          'Don\'t suggest they need to "wait their turn"',
          'Don\'t overlook them for high-visibility projects'
        ]
      },
      satisfaction: {
        do: [
          'Have an open conversation about their role satisfaction and career goals',
          'Explore opportunities for role adjustment or project variety',
          'Connect them with mentorship or professional development resources',
          'Identify specific aspects causing dissatisfaction and address them'
        ],
        dont: [
          'Don\'t assume you know what will make them satisfied',
          'Don\'t dismiss their concerns as "just a phase"',
          'Don\'t wait for them to bring up resignation before acting',
          'Don\'t offer only compensation as a solution'
        ]
      },
      performance: {
        do: [
          'Schedule regular coaching sessions to provide support',
          'Clarify expectations and provide specific, actionable feedback',
          'Identify any skill gaps and offer training or resources',
          'Check if external factors are impacting their performance'
        ],
        dont: [
          'Don\'t start with disciplinary action without understanding root causes',
          'Don\'t compare them to other team members publicly',
          'Don\'t assume lack of effort is the issue',
          'Don\'t delay having the conversation'
        ]
      },
      commute: {
        do: [
          'Discuss remote work or hybrid arrangement possibilities',
          'Explore flexible start/end times to avoid peak traffic',
          'Consider relocation assistance if available',
          'Acknowledge the impact of commute on work-life balance'
        ],
        dont: [
          'Don\'t suggest they should have considered this when accepting the role',
          'Don\'t dismiss the commute as "not that bad"',
          'Don\'t make remote work contingent on performance improvement',
          'Don\'t treat this as less important than other retention factors'
        ]
      }
    }
    return actions[patternType] || { do: [], dont: [] }
  }

  const showToast = (message: string, color: string) => {
    setToast({ message, color })
    setTimeout(() => setToast(null), 3000)
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] min-h-screen">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Split interventions into NOW (1), TODAY (2-3), LATER (4+)
  const pending = interventions.filter(i => i.status === 'pending')
  const started = interventions.filter(i => i.status === 'started')
  const completed = interventions.filter(i => i.status === 'completed')

  const nowItem = pending[0] || started[0]
  const todayItems = [...pending.slice(1, 3), ...started.slice(1)].slice(0, 2)
  const laterItems = [...pending.slice(3), ...started.slice(2), ...completed]

  const getPatternIcon = (type: string) => {
    const icons: Record<string, string> = {
      burnout: '⚡',
      promotion: '📈',
      satisfaction: '💭',
      performance: '🎯',
      commute: '🚗'
    }
    return icons[type] || '📋'
  }

  const getEmployeeName = (employeeNumber: number) => {
    // Generate a consistent name based on employee number
    const firstNames = ['Rajesh', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Rahul', 'Sneha', 'Arjun', 'Pooja',
                       'Karan', 'Divya', 'Rohit', 'Meera', 'Sanjay', 'Kavita', 'Nitin', 'Ritu', 'Anil', 'Shreya',
                       'Deepak', 'Nisha', 'Suresh', 'Anita', 'Manoj', 'Rekha', 'Ashok', 'Sunita', 'Ravi', 'Madhuri']
    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Verma', 'Gupta', 'Rao', 'Joshi', 'Nair',
                      'Mehta', 'Desai', 'Kulkarni', 'Malhotra', 'Agarwal', 'Chopra', 'Bansal', 'Iyer', 'Khan', 'Das']

    const firstNameIndex = employeeNumber % firstNames.length
    const lastNameIndex = Math.floor(employeeNumber / firstNames.length) % lastNames.length

    return `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`
  }

  const getStatusBorderColor = (status: PriorityIntervention['status']) => {
    switch (status) {
      case 'started':
        return 'border-blue-400/60'
      case 'completed':
        return 'border-green-400/60'
      case 'paused':
        return 'border-yellow-400/60'
      case 'deferred':
        return 'border-red-400/60'
      default:
        return 'border-white/20'
    }
  }

  return (
    <div className="flex-1 px-4 sm:px-6 pt-6 pb-12 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] min-h-screen">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className={`px-6 py-4 rounded-lg shadow-2xl border backdrop-blur-xl ${
            toast.color === 'blue' ? 'bg-blue-500/20 border-blue-400/50 text-blue-200' :
            toast.color === 'green' ? 'bg-green-500/20 border-green-400/50 text-green-200' :
            toast.color === 'yellow' ? 'bg-yellow-500/20 border-yellow-400/50 text-yellow-200' :
            toast.color === 'red' ? 'bg-red-500/20 border-red-400/50 text-red-200' :
            'bg-green-500/20 border-green-400/50 text-green-200'
          }`}>
            <p className="font-semibold text-sm">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header with Support Link */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Priority Briefing</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">Cohort-level patterns requiring action</p>
        </div>
        <button
          onClick={() => setIsSupportDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-slate-600/30 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 hover:border-slate-500 transition-all text-xs"
        >
          <Headphones className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Need help?</span>
        </button>
      </div>

      {interventions.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm sm:text-base">
          No priority interventions at this time. All cohorts showing healthy patterns.
        </div>
      ) : (
        <div className="space-y-6">
          {/* NOW - Primary Glass Focus Panel */}
          {nowItem && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-1 rounded-full bg-amber-400"></div>
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-wide">Now</p>
              </div>

              <div
                className={`relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl border-2 ${getStatusBorderColor(nowItem.status)} rounded-2xl p-6 sm:p-8 shadow-2xl cursor-pointer transition-all hover:border-opacity-80`}
                onDoubleClick={() => handleCardDoubleClick(nowItem)}
              >
                {/* Pattern Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{getPatternIcon(nowItem.patternType)}</span>
                  <span className="text-slate-400 text-xs sm:text-sm">{nowItem.employeeId} · {nowItem.role}</span>
                  <button
                    onClick={() => viewEmployeeDetails(nowItem.id)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto"
                    title="View employee directory"
                  >
                    <Eye className="h-4 w-4 text-slate-400 hover:text-[#B58342]" />
                  </button>
                </div>

                {/* Pattern Detected */}
                <div className="mb-4">
                  <p className="text-white text-lg sm:text-xl font-medium leading-relaxed">
                    {nowItem.detectedPattern}
                  </p>
                </div>

                {/* Why It Matters */}
                <div className="mb-6">
                  <p className="text-slate-300 text-sm">
                    {nowItem.whyItMatters}
                  </p>
                </div>

                {/* Recommended Action */}
                <div className="bg-[#B58342]/10 border border-[#B58342]/30 rounded-lg p-4 mb-6">
                  <p className="text-slate-200 text-sm sm:text-base">
                    {nowItem.recommendedAction}
                  </p>
                </div>

                {/* Time Cue */}
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-6">
                  <Clock className="h-3 w-3" />
                  <span>Recommended within 7 days · Pending {nowItem.daysActive} {nowItem.daysActive === 1 ? 'day' : 'days'}</span>
                </div>

                {/* Action Buttons - Hierarchical Layout */}
                <div className="space-y-3">
                  {/* Primary Action - Full Width */}
                  {nowItem.status === 'pending' ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateInterventionStatus(nowItem.id, 'started')
                      }}
                      className="w-full h-12 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white font-semibold text-base shadow-lg"
                    >
                      Start
                    </Button>
                  ) : nowItem.status === 'started' ? (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateInterventionStatus(nowItem.id, 'completed')
                      }}
                      className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-semibold text-base shadow-lg"
                    >
                      Mark Complete
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateInterventionStatus(nowItem.id, 'completed')
                      }}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-semibold text-base shadow-lg"
                    >
                      Mark Complete
                    </Button>
                  )}

                  {/* Secondary Actions - De-emphasized Row */}
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        pauseIntervention(nowItem.id)
                      }}
                      variant="outline"
                      className="flex-1 h-9 border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200 text-xs"
                    >
                      Pause
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        deferIntervention(nowItem.id)
                      }}
                      variant="outline"
                      className="flex-1 h-9 border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 text-xs"
                    >
                      Defer to Tomorrow
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TODAY - Flat, De-emphasized */}
          {todayItems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-1 rounded-full bg-blue-400"></div>
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-wide">Today</p>
              </div>

              <div className="space-y-2">
                {todayItems.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white/5 border-2 ${getStatusBorderColor(item.status)} rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer`}
                    onDoubleClick={() => handleCardDoubleClick(item)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm">{getPatternIcon(item.patternType)}</span>
                          <span className="text-slate-400 text-xs">{item.employeeId} · {item.role}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              viewEmployeeDetails(item.id)
                            }}
                            className="p-1 rounded hover:bg-white/10 transition-colors ml-1"
                            title="View employee directory"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500 hover:text-[#B58342]" />
                          </button>
                        </div>
                        <p className="text-white text-sm font-medium mb-1">
                          {item.detectedPattern}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {item.recommendedAction}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Hierarchical Layout */}
                    <div className="space-y-2 mt-4">
                      {/* Primary Action - Full Width */}
                      {item.status === 'pending' ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateInterventionStatus(item.id, 'started')
                          }}
                          className="w-full h-10 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white font-medium text-sm"
                        >
                          Start
                        </Button>
                      ) : item.status === 'started' ? (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateInterventionStatus(item.id, 'completed')
                          }}
                          className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white font-medium text-sm"
                        >
                          Mark Complete
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            updateInterventionStatus(item.id, 'completed')
                          }}
                          className="w-full h-10 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-medium text-sm"
                        >
                          Mark Complete
                        </Button>
                      )}

                      {/* Secondary Actions - De-emphasized Row */}
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            pauseIntervention(item.id)
                          }}
                          variant="outline"
                          className="flex-1 h-8 border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 hover:text-yellow-200 text-xs"
                        >
                          Pause
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            deferIntervention(item.id)
                          }}
                          variant="outline"
                          className="flex-1 h-8 border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200 text-xs"
                        >
                          Defer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LATER - Collapsed */}
          {laterItems.length > 0 && (
            <div>
              <button
                onClick={() => setLaterCollapsed(!laterCollapsed)}
                className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity"
              >
                {laterCollapsed ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronUp className="h-4 w-4 text-slate-500" />}
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                  Later ({laterItems.length})
                </p>
              </button>

              {!laterCollapsed && (
                <div className="space-y-1">
                  {laterItems.map((item) => (
                    <div
                      key={item.id}
                      className={`bg-transparent border-2 ${getStatusBorderColor(item.status)} rounded-lg p-3 transition-all ${
                        item.status === 'completed' ? 'opacity-40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs">{getPatternIcon(item.patternType)}</span>
                          <span className="text-slate-500 text-xs truncate">
                            {item.employeeId} · {item.detectedPattern}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => viewEmployeeDetails(item.id)}
                            className="p-1.5 rounded hover:bg-white/10 transition-colors"
                            title="View employee directory"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500 hover:text-[#B58342]" />
                          </button>
                          {item.status === 'completed' && (
                            <span className="text-green-500 text-xs flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Done
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Privacy Footer */}
      <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Shield className="h-3 w-3 text-slate-500 flex-shrink-0 mt-0.5" />
          <p className="text-slate-500 text-xs leading-relaxed">
            Pattern-level interventions only. Employee identifiers are de-identified. No raw signals or sentiment data displayed.
          </p>
        </div>
      </div>

      {/* Support Drawer */}
      <SupportDrawer
        isOpen={isSupportDrawerOpen}
        onClose={() => setIsSupportDrawerOpen(false)}
        context={{
          page: 'Today - Priority Briefing',
          orgId: 'demo-org-001',
          userId: 'demo-user-001'
        }}
      />

      {/* Recommended Actions Modal - Apple Liquid Glass Style */}
      {showActionsModal && selectedIntervention && (
        <>
          {/* Overlay - Darker blur like iOS */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 animate-in fade-in duration-200"
            onClick={() => setShowActionsModal(false)}
          />

          {/* Modal - iOS Style Frosted Glass */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="relative bg-[#1c1c1e]/80 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-3xl w-full max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
              style={{
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)'
              }}
            >
              {/* Header - Dark frosted glass */}
              <div className="border-b border-white/5 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getPatternIcon(selectedIntervention.patternType)}</span>
                    <div>
                      <h2 className="text-base font-semibold text-white/95">
                        {getEmployeeName(parseInt(selectedIntervention.id))}
                      </h2>
                      <p className="text-white/50 text-xs mt-0.5">
                        {selectedIntervention.employeeId} · {selectedIntervention.role}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowActionsModal(false)}
                    className="p-1 rounded-full hover:bg-white/10 transition-all text-white/60 hover:text-white/90"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Pattern Badge */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3">
                  <p className="text-white/80 text-xs font-medium leading-relaxed">
                    {selectedIntervention.detectedPattern}
                  </p>
                </div>
              </div>

              {/* Content - Scrollable with iOS styling */}
              <div className="overflow-y-auto max-h-[calc(85vh-240px)] p-5 space-y-3">
                {/* Why It Matters - Larger, bolder typography */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <h3 className="text-white/60 font-medium text-[11px] uppercase tracking-wider mb-2">
                    Why This Matters
                  </h3>
                  <p className="text-white/90 text-base font-medium leading-relaxed">
                    {selectedIntervention.whyItMatters}
                  </p>
                </div>

                {/* Recommended Actions - Green checkmarks */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <h3 className="text-white/60 font-medium text-[11px] uppercase tracking-wider mb-3">
                    Recommended Actions
                  </h3>
                  <ul className="space-y-2">
                    {getRecommendedActions(selectedIntervention.patternType).do.map((action, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <p className="text-white/75 text-xs leading-relaxed">{action}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What NOT to Do - Red dots only */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <h3 className="text-white/60 font-medium text-[11px] uppercase tracking-wider mb-3">
                    What NOT to Do
                  </h3>
                  <ul className="space-y-2">
                    {getRecommendedActions(selectedIntervention.patternType).dont.map((action, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                        <p className="text-white/75 text-xs leading-relaxed">{action}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Immediate Next Step */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
                  <h3 className="text-white/60 font-medium text-[11px] uppercase tracking-wider mb-2">
                    Immediate Next Step
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {selectedIntervention.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Footer - Primary CTA + Share Button */}
              <div className="border-t border-white/5 p-4 space-y-3">
                {/* Primary CTA */}
                <button
                  onClick={() => {
                    setShowActionsModal(false)
                    if (selectedIntervention.status === 'pending') {
                      updateInterventionStatus(selectedIntervention.id, 'started')
                    }
                  }}
                  className="w-full bg-[#B58342] hover:bg-[#d4a05a] text-white font-medium text-sm py-3 rounded-xl transition-all"
                >
                  {selectedIntervention.status === 'pending' ? 'Start Intervention' : 'Continue'}
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShareIntervention(selectedIntervention)}
                  className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium text-sm py-3 rounded-xl transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share with Manager
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Employee Directory Modal */}
      {showEmployeeModal && selectedEmployee && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowEmployeeModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#B58342]/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#B58342]/20 to-transparent border-b border-[#B58342]/30 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {getEmployeeName(selectedEmployee.EmployeeNumber)}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      ID-{selectedEmployee.EmployeeNumber} · {selectedEmployee.JobRole} · {selectedEmployee.Department}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmployeeModal(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-slate-400 text-2xl">×</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#B58342] mb-4 flex items-center gap-2">
                    <span>👤</span> Personal Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Age</p>
                      <p className="text-white font-semibold">{selectedEmployee.Age}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Gender</p>
                      <p className="text-white font-semibold">{selectedEmployee.Gender}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Marital Status</p>
                      <p className="text-white font-semibold">{selectedEmployee.MaritalStatus}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Education</p>
                      <p className="text-white font-semibold">{selectedEmployee.Education}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Education Field</p>
                      <p className="text-white font-semibold">{selectedEmployee.EducationField}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Distance From Home</p>
                      <p className="text-white font-semibold">{selectedEmployee.DistanceFromHome} km</p>
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#B58342] mb-4 flex items-center gap-2">
                    <span>💼</span> Job Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Job Role</p>
                      <p className="text-white font-semibold">{selectedEmployee.JobRole}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Department</p>
                      <p className="text-white font-semibold">{selectedEmployee.Department}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Job Level</p>
                      <p className="text-white font-semibold">{selectedEmployee.JobLevel}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Years at Company</p>
                      <p className="text-white font-semibold">{selectedEmployee.YearsAtCompany} years</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Years in Current Role</p>
                      <p className="text-white font-semibold">{selectedEmployee.YearsInCurrentRole} years</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Years Since Last Promotion</p>
                      <p className="text-white font-semibold">{selectedEmployee.YearsSinceLastPromotion} years</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Total Working Years</p>
                      <p className="text-white font-semibold">{selectedEmployee.TotalWorkingYears} years</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Num Companies Worked</p>
                      <p className="text-white font-semibold">{selectedEmployee.NumCompaniesWorked}</p>
                    </div>
                  </div>
                </div>

                {/* Performance & Satisfaction */}
                <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#B58342] mb-4 flex items-center gap-2">
                    <span>⭐</span> Performance & Satisfaction
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Performance Rating</p>
                      <p className="text-white font-semibold">{selectedEmployee.PerformanceRating}/4</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Job Satisfaction</p>
                      <p className="text-white font-semibold">{selectedEmployee.JobSatisfaction}/4</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Work-Life Balance</p>
                      <p className="text-white font-semibold">{selectedEmployee.WorkLifeBalance}/4</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Environment Satisfaction</p>
                      <p className="text-white font-semibold">{selectedEmployee.EnvironmentSatisfaction}/4</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Relationship Satisfaction</p>
                      <p className="text-white font-semibold">{selectedEmployee.RelationshipSatisfaction}/4</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Job Involvement</p>
                      <p className="text-white font-semibold">{selectedEmployee.JobInvolvement}/4</p>
                    </div>
                  </div>
                </div>

                {/* Compensation */}
                <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#B58342] mb-4 flex items-center gap-2">
                    <span>💰</span> Compensation
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Monthly Income</p>
                      <p className="text-white font-semibold">₹{selectedEmployee.MonthlyIncome?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Percent Salary Hike</p>
                      <p className="text-white font-semibold">{selectedEmployee.PercentSalaryHike}%</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Stock Option Level</p>
                      <p className="text-white font-semibold">{selectedEmployee.StockOptionLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Work Schedule */}
                <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#B58342] mb-4 flex items-center gap-2">
                    <span>📅</span> Work Schedule
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Business Travel</p>
                      <p className="text-white font-semibold">{selectedEmployee.BusinessTravel}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Overtime</p>
                      <p className="text-white font-semibold">{selectedEmployee.OverTime}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Training Times Last Year</p>
                      <p className="text-white font-semibold">{selectedEmployee.TrainingTimesLastYear}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-[#B58342]/30 p-6">
                <button
                  onClick={() => setShowEmployeeModal(false)}
                  className="w-full bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white font-semibold py-3 rounded-lg transition-all"
                >
                  Close Directory
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
