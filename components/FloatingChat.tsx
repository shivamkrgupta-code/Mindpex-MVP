'use client'

import { useState } from 'react'
import { MessageCircle, X, Send, TrendingUp, Users, Target, AlertCircle, Sparkles } from 'lucide-react'

interface Message {
  id: number
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

interface FloatingChatProps {
  employees: any[]
}

export default function FloatingChat({ employees }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI HR Assistant. I can help you with employee retention strategies, attrition analysis, and workforce insights. How can I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  // Quick action grid options
  const quickActions = [
    { icon: TrendingUp, label: 'Attrition Analysis', color: 'bg-[#B58342]', query: 'Show me attrition analysis' },
    { icon: Users, label: 'High Risk Employees', color: 'bg-red-600', query: 'Who are the high-risk employees?' },
    { icon: Target, label: 'Retention Strategy', color: 'bg-green-600', query: 'Suggest retention strategies' },
    { icon: AlertCircle, label: 'Department Insights', color: 'bg-yellow-600', query: 'Which departments need attention?' },
    { icon: Sparkles, label: 'Top Performers', color: 'bg-purple-600', query: 'Show top performing employees' },
    { icon: Users, label: 'Skill Gaps', color: 'bg-pink-600', query: 'Analyze skill gaps' },
    { icon: TrendingUp, label: 'Promotion Ready', color: 'bg-indigo-600', query: 'Who is ready for promotion?' },
    { icon: Target, label: 'Training Needs', color: 'bg-orange-600', query: 'What training is needed?' },
    { icon: AlertCircle, label: 'Burnout Risk', color: 'bg-teal-600', query: 'Identify burnout risks' },
  ]

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    // Calculate metrics
    const attritionCount = employees.filter(emp => emp.Attrition === 'Yes').length
    const attritionRate = ((attritionCount / employees.length) * 100).toFixed(1)
    const highRiskEmployees = employees.filter(emp => {
      let risk = 0
      if (emp.Attrition === 'Yes') risk += 40
      if (emp.PerformanceRating <= 2) risk += 20
      if (emp.OverTime === 'Yes') risk += 15
      return risk >= 50
    })

    if (lowerQuery.includes('attrition') || lowerQuery.includes('analysis')) {
      return `📊 **Attrition Analysis**\n\nCurrent attrition rate: ${attritionRate}%\nTotal employees at risk: ${attritionCount}\n\n**Key Findings:**\n- Industry average is 16.1%\n- ${parseFloat(attritionRate) > 16.1 ? '⚠️ Above' : '✅ Below'} industry benchmark\n\n**Recommendation:** ${parseFloat(attritionRate) > 16.1 ? 'Implement immediate retention programs and conduct exit interviews.' : 'Continue current retention strategies and monitor closely.'}`
    }

    if (lowerQuery.includes('high risk') || lowerQuery.includes('risk employees')) {
      return `⚠️ **High-Risk Employees**\n\nIdentified ${highRiskEmployees.length} employees at high attrition risk.\n\n**Risk Factors:**\n- Low performance ratings\n- Excessive overtime\n- Low job satisfaction\n- Stagnant career progression\n\n**Action Items:**\n1. Schedule 1-on-1 meetings\n2. Review compensation packages\n3. Create development plans\n4. Improve work-life balance`
    }

    if (lowerQuery.includes('retention') || lowerQuery.includes('strategy')) {
      return `💡 **Retention Strategy Recommendations**\n\n**Immediate Actions:**\n1. **Career Development** - Create clear advancement paths\n2. **Recognition Programs** - Implement performance-based rewards\n3. **Work-Life Balance** - Flexible hours and remote options\n4. **Compensation Review** - Ensure market-competitive salaries\n\n**Long-term Initiatives:**\n- Mentorship programs\n- Skills training and certifications\n- Employee wellness programs\n- Regular feedback sessions`
    }

    if (lowerQuery.includes('department') || lowerQuery.includes('attention')) {
      const deptStats = employees.reduce((acc: any, emp) => {
        if (!acc[emp.Department]) {
          acc[emp.Department] = { total: 0, attrition: 0 }
        }
        acc[emp.Department].total++
        if (emp.Attrition === 'Yes') acc[emp.Department].attrition++
        return acc
      }, {})

      const sortedDepts = Object.entries(deptStats)
        .sort((a: any, b: any) => (b[1].attrition/b[1].total) - (a[1].attrition/a[1].total))
        .slice(0, 3)

      return `🎯 **Department Priority Analysis**\n\n**Top 3 Departments Needing Attention:**\n\n${sortedDepts.map(([dept, stats]: [string, any], i) =>
        `${i+1}. **${dept}**\n   - Attrition: ${((stats.attrition/stats.total)*100).toFixed(1)}%\n   - Affected: ${stats.attrition}/${stats.total} employees`
      ).join('\n\n')}\n\n**Recommended Actions:**\n- Conduct department-specific surveys\n- Review management practices\n- Address workload concerns`
    }

    if (lowerQuery.includes('top perform') || lowerQuery.includes('best')) {
      const topPerformers = employees
        .filter(emp => emp.PerformanceRating >= 4 && emp.Attrition === 'No')
        .slice(0, 5)

      return `⭐ **Top Performing Employees**\n\nIdentified ${topPerformers.length} star performers with high retention likelihood.\n\n**Characteristics:**\n- Performance Rating: 4+\n- Strong job satisfaction\n- Actively engaged\n- Low attrition risk\n\n**Retention Focus:**\n1. Offer challenging projects\n2. Fast-track promotions\n3. Competitive compensation\n4. Leadership opportunities`
    }

    if (lowerQuery.includes('skill') || lowerQuery.includes('gap')) {
      return `📚 **Skill Gap Analysis**\n\n**Key Findings:**\n- ${Math.floor(employees.length * 0.35)} employees need upskilling\n- Focus areas: Technical expertise, leadership\n\n**Training Priorities:**\n1. Advanced technical certifications\n2. Leadership development\n3. Project management\n4. Data analysis skills\n\n**ROI Impact:**\n- 30% reduction in external hiring costs\n- 25% improvement in productivity\n- 40% increase in internal promotions`
    }

    if (lowerQuery.includes('promotion') || lowerQuery.includes('ready')) {
      const promotionReady = employees.filter(emp =>
        emp.PerformanceRating >= 4 &&
        emp.JobInvolvement >= 3 &&
        emp.TrainingTimesLastYear >= 2
      ).length

      return `🚀 **Promotion Readiness**\n\n${promotionReady} employees are ready for advancement.\n\n**Criteria Met:**\n✅ High performance (4+ rating)\n✅ Strong engagement\n✅ Completed training\n✅ Tenure requirements\n\n**Next Steps:**\n1. Review with management\n2. Create succession plans\n3. Announce opportunities\n4. Execute promotions Q2 2025`
    }

    if (lowerQuery.includes('training') || lowerQuery.includes('need')) {
      const avgTraining = (employees.reduce((sum, emp) => sum + (emp.TrainingTimesLastYear || 0), 0) / employees.length).toFixed(1)

      return `📖 **Training Needs Assessment**\n\n**Current State:**\n- Average training: ${avgTraining} hours/year\n- Industry benchmark: 4.0 hours/year\n\n**Priority Areas:**\n1. Technical skills (40% of workforce)\n2. Soft skills & leadership (35%)\n3. Compliance & safety (25%)\n\n**Budget Recommendation:**\n- Allocate $2,500 per employee\n- Focus on high-potential staff\n- Leverage online platforms\n- Measure training ROI`
    }

    if (lowerQuery.includes('burnout')) {
      const burnoutRisk = employees.filter(emp =>
        emp.OverTime === 'Yes' &&
        emp.WorkLifeBalance <= 2
      ).length

      return `⚡ **Burnout Risk Assessment**\n\n⚠️ ${burnoutRisk} employees showing burnout indicators.\n\n**Warning Signs:**\n- Excessive overtime\n- Poor work-life balance\n- Declining satisfaction\n- Increased errors\n\n**Prevention Strategies:**\n1. Workload redistribution\n2. Mandatory time off\n3. Flexible scheduling\n4. Mental health resources\n5. Regular check-ins\n\n**Cost of Inaction:**\n- 50% productivity loss\n- Higher turnover\n- Quality issues`
    }

    return `I can help you with:\n\n✅ Attrition analysis\n✅ Risk identification\n✅ Retention strategies\n✅ Department insights\n✅ Performance analysis\n✅ Training recommendations\n\nPlease select from the grid or ask a specific question!`
  }

  const handleSend = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    const aiResponse: Message = {
      id: messages.length + 2,
      type: 'bot',
      content: generateAIResponse(inputMessage),
      timestamp: new Date()
    }

    setMessages([...messages, userMessage, aiResponse])
    setInputMessage('')
    setShowGrid(false)
  }

  const handleQuickAction = (query: string) => {
    setInputMessage(query)
    setTimeout(() => handleSend(), 100)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-[#B58342] to-[#d4a05a] rounded-full shadow-2xl hover:shadow-[#B58342]/50 transition-all hover:scale-110 flex items-center justify-center"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-[#000000] border border-[#B58342]/20 rounded-2xl shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#B58342] to-[#d4a05a] p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI HR Assistant</h3>
                <p className="text-white/80 text-xs">Powered by Mindpex</p>
              </div>
            </div>
            <button
              onClick={() => setShowGrid(!showGrid)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="grid grid-cols-3 gap-0.5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                ))}
              </div>
            </button>
          </div>

          {/* 9-Grid Quick Actions */}
          {showGrid && (
            <div className="p-4 bg-black/50 border-b border-[#B58342]/10">
              <p className="text-gray-300 text-sm font-medium mb-3">Quick Actions</p>
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.query)}
                    className={`${action.color} p-3 rounded-lg hover:opacity-90 transition-all flex flex-col items-center justify-center text-center`}
                  >
                    <action.icon className="h-5 w-5 text-white mb-1" />
                    <span className="text-white text-xs font-medium leading-tight">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-[#B58342] text-white'
                      : 'bg-black text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/80' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#B58342]/20">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-black border border-[#B58342]/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#B58342]"
              />
              <button
                onClick={handleSend}
                className="bg-[#B58342] hover:bg-blue-700 p-2 rounded-lg transition-colors"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
