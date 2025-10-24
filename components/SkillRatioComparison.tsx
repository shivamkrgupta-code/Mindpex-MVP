'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, DollarSign, Users, Award, Briefcase, BookOpen } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface SkillRatioComparisonProps {
  employees: any[]
}

export default function SkillRatioComparison({ employees }: SkillRatioComparisonProps) {
  // Define skill categories based on employee attributes
  const skillCategories = [
    {
      category: 'Technical Excellence',
      icon: Award,
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      criteria: (emp: any) => emp.Education >= 4 && emp.TrainingTimesLastYear >= 2,
      avgSalary: 0,
      count: 0,
      demand: 'High',
      marketRate: 85000
    },
    {
      category: 'Leadership & Management',
      icon: Briefcase,
      color: 'bg-purple-600',
      borderColor: 'border-purple-500',
      criteria: (emp: any) => emp.JobLevel >= 3 && emp.JobInvolvement >= 3,
      avgSalary: 0,
      count: 0,
      demand: 'High',
      marketRate: 95000
    },
    {
      category: 'Entry Level / Junior',
      icon: Users,
      color: 'bg-green-600',
      borderColor: 'border-green-500',
      criteria: (emp: any) => emp.JobLevel <= 2 && emp.YearsAtCompany <= 3,
      avgSalary: 0,
      count: 0,
      demand: 'Medium',
      marketRate: 45000
    },
    {
      category: 'Mid-Level Specialists',
      icon: BookOpen,
      color: 'bg-orange-600',
      borderColor: 'border-orange-500',
      criteria: (emp: any) => emp.JobLevel === 3 && emp.YearsInCurrentRole >= 2,
      avgSalary: 0,
      count: 0,
      demand: 'High',
      marketRate: 65000
    },
    {
      category: 'Senior Experts',
      icon: TrendingUp,
      color: 'bg-red-600',
      borderColor: 'border-red-500',
      criteria: (emp: any) => emp.JobLevel >= 4 && emp.YearsAtCompany >= 8,
      avgSalary: 0,
      count: 0,
      demand: 'Critical',
      marketRate: 110000
    }
  ]

  // Calculate metrics for each category
  skillCategories.forEach(category => {
    const categoryEmployees = employees.filter(category.criteria)
    category.count = categoryEmployees.length
    category.avgSalary = categoryEmployees.length > 0
      ? Math.round(categoryEmployees.reduce((sum, emp) => sum + ((emp.MonthlyIncome || 0) * 12), 0) / categoryEmployees.length)
      : 0
  })

  // Supply vs Demand Analysis
  const supplyDemandData = [
    { skill: 'Technical', current: skillCategories[0].count, needed: Math.ceil(employees.length * 0.35), gap: 0 },
    { skill: 'Leadership', current: skillCategories[1].count, needed: Math.ceil(employees.length * 0.15), gap: 0 },
    { skill: 'Mid-Level', current: skillCategories[3].count, needed: Math.ceil(employees.length * 0.40), gap: 0 },
    { skill: 'Senior', current: skillCategories[4].count, needed: Math.ceil(employees.length * 0.20), gap: 0 },
    { skill: 'Entry', current: skillCategories[2].count, needed: Math.ceil(employees.length * 0.25), gap: 0 }
  ]

  supplyDemandData.forEach(item => {
    item.gap = item.needed - item.current
  })

  // Cost Optimization Opportunities
  const costOptimization = skillCategories.map(cat => ({
    category: cat.category,
    currentCost: cat.avgSalary * cat.count,
    marketCost: cat.marketRate * cat.count,
    difference: (cat.avgSalary * cat.count) - (cat.marketRate * cat.count),
    count: cat.count
  }))

  const totalCurrentCost = costOptimization.reduce((sum, item) => sum + item.currentCost, 0)
  const totalMarketCost = costOptimization.reduce((sum, item) => sum + item.marketCost, 0)
  const potentialSavings = totalCurrentCost - totalMarketCost

  // Skill Mix Radar Chart Data
  const skillMixData = [
    {
      skill: 'Technical',
      current: (skillCategories[0].count / employees.length * 100).toFixed(1),
      optimal: 35,
      market: 32
    },
    {
      skill: 'Leadership',
      current: (skillCategories[1].count / employees.length * 100).toFixed(1),
      optimal: 15,
      market: 18
    },
    {
      skill: 'Senior',
      current: (skillCategories[4].count / employees.length * 100).toFixed(1),
      optimal: 20,
      market: 22
    },
    {
      skill: 'Mid-Level',
      current: (skillCategories[3].count / employees.length * 100).toFixed(1),
      optimal: 40,
      market: 38
    },
    {
      skill: 'Entry',
      current: (skillCategories[2].count / employees.length * 100).toFixed(1),
      optimal: 25,
      market: 20
    }
  ]

  // ROI Calculations
  const trainingCostPerEmployee = 2500
  const hireCostPerEmployee = 50000
  const skillGapEmployees = supplyDemandData.filter(item => item.gap > 0).reduce((sum, item) => sum + item.gap, 0)

  const trainROI = {
    upskillCost: skillGapEmployees * trainingCostPerEmployee,
    hireCost: skillGapEmployees * hireCostPerEmployee,
    savings: (skillGapEmployees * hireCostPerEmployee) - (skillGapEmployees * trainingCostPerEmployee)
  }

  return (
    <Card className="bg-[#000000] border-[#B58342]/20">
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center">
          <Target className="h-7 w-7 mr-3 text-green-500" />
          Skill-Based Ratio Comparison & Cost Optimization
        </CardTitle>
        <CardDescription className="text-gray-400">
          Strategic workforce planning through competency modeling and cost-benefit analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skill Category Overview */}
        <div className="grid grid-cols-5 gap-4">
          {skillCategories.map((category, index) => {
            const Icon = category.icon
            const percentOfTotal = ((category.count / employees.length) * 100).toFixed(1)
            return (
              <div key={index} className={`${category.color} border-2 ${category.borderColor} rounded-xl p-4 text-center`}>
                <Icon className="h-8 w-8 mx-auto mb-2 text-white" />
                <p className="text-white font-bold text-sm mb-1">{category.category}</p>
                <p className="text-3xl font-bold text-white mb-1">{category.count}</p>
                <p className="text-white/70 text-xs mb-2">{percentOfTotal}% of workforce</p>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-white/60 text-xs">Avg Salary</p>
                  <p className="text-white font-semibold text-sm">${(category.avgSalary / 1000).toFixed(0)}K</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Supply vs Demand Chart */}
        <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-500" />
            Supply vs Demand Analysis
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplyDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="skill" stroke="#D1D5DB" tick={{ fill: '#F3F4F6' }} />
              <YAxis stroke="#D1D5DB" tick={{ fill: '#F3F4F6' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '2px solid #3B82F6',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="current" fill="#3B82F6" name="Current Supply" radius={[8, 8, 0, 0]} />
              <Bar dataKey="needed" fill="#10B981" name="Optimal Demand" radius={[8, 8, 0, 0]} />
              <Bar dataKey="gap" fill="#F59E0B" name="Skill Gap" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Skill Mix Radar */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 text-lg">Skill Mix Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillMixData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="skill" stroke="#D1D5DB" tick={{ fill: '#F3F4F6' }} />
                <PolarRadiusAxis stroke="#D1D5DB" tick={{ fill: '#F3F4F6' }} />
                <Radar name="Current Mix" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.5} />
                <Radar name="Optimal Mix" dataKey="optimal" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Radar name="Market Avg" dataKey="market" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '2px solid #3B82F6',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Comparison */}
          <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Salary Cost Analysis
            </h3>
            <div className="space-y-4">
              {costOptimization.map((item, index) => (
                <div key={index} className="bg-black/80/50 border border-[#B58342]/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium text-sm">{item.category}</h4>
                    <span className="text-gray-400 text-xs">{item.count} employees</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="text-gray-400">Current: ${(item.currentCost / 1000).toFixed(0)}K</p>
                      <p className="text-gray-400">Market: ${(item.marketCost / 1000).toFixed(0)}K</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-semibold ${
                      item.difference > 0 ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {item.difference > 0 ? '+' : ''}{(item.difference / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROI: Train vs Hire */}
        <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-2 border-green-600 rounded-xl p-6">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-400" />
            Cost Savings Strategy: Upskill vs External Hire
          </h3>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-green-300 text-sm mb-2">Skill Gap</p>
              <p className="text-4xl font-bold text-white">{skillGapEmployees}</p>
              <p className="text-gray-400 text-xs mt-1">positions needed</p>
            </div>
            <div className="text-center">
              <p className="text-blue-300 text-sm mb-2">Upskill Cost</p>
              <p className="text-3xl font-bold text-blue-400">${(trainROI.upskillCost / 1000).toFixed(0)}K</p>
              <p className="text-gray-400 text-xs mt-1">$2.5K per employee</p>
            </div>
            <div className="text-center">
              <p className="text-orange-300 text-sm mb-2">External Hire Cost</p>
              <p className="text-3xl font-bold text-orange-400">${(trainROI.hireCost / 1000).toFixed(0)}K</p>
              <p className="text-gray-400 text-xs mt-1">$50K per hire</p>
            </div>
            <div className="text-center">
              <p className="text-green-300 text-sm mb-2">Potential Savings</p>
              <p className="text-4xl font-bold text-green-400">${(trainROI.savings / 1000).toFixed(0)}K</p>
              <p className="text-gray-400 text-xs mt-1">by upskilling</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#B58342]/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-semibold mb-2">✅ Upskilling Benefits</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• 95% cost reduction vs external hiring</li>
                  <li>• Retain institutional knowledge</li>
                  <li>• Boost employee morale & engagement</li>
                  <li>• Faster ramp-up time (already know culture)</li>
                  <li>• Lower attrition risk</li>
                </ul>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <h4 className="text-orange-400 font-semibold mb-2">⚠️ External Hire Costs</h4>
                <ul className="space-y-1 text-gray-300 text-sm">
                  <li>• Recruitment fees ($10K-$15K)</li>
                  <li>• Onboarding & training ($8K-$12K)</li>
                  <li>• Lost productivity during ramp-up</li>
                  <li>• Higher turnover risk (first year)</li>
                  <li>• Cultural fit uncertainties</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="bg-black/50 border border-[#B58342]/10 rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-purple-500" />
            Strategic Workforce Planning Recommendations
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-2">🎯 Priority Actions</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Launch technical upskilling program for {supplyDemandData[0].gap} employees</li>
                <li>• Create leadership pipeline (internal promotions)</li>
                <li>• Balance junior/senior ratio to optimal levels</li>
              </ul>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-medium mb-2">💰 Cost Optimization</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Potential annual savings: ${(potentialSavings / 1000).toFixed(0)}K</li>
                <li>• Focus on internal mobility over external hiring</li>
                <li>• Leverage online learning platforms</li>
              </ul>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2">📈 Long-term Strategy</h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Build succession plans for senior roles</li>
                <li>• Establish mentorship programs</li>
                <li>• Track skill progression quarterly</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
