'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts'

interface BenchmarkSystemProps {
  employees: any[]
}

export default function BenchmarkSystem({ employees }: BenchmarkSystemProps) {
  // Calculate company attrition rate
  const attritionCount = employees.filter(emp => emp.Attrition === 'Yes').length
  const companyAttritionRate = ((attritionCount / employees.length) * 100).toFixed(1)

  // Industry benchmarks (real-world averages)
  const industryBenchmarks = {
    'Research & Development': 13.2,
    'Sales': 34.9,
    'Human Resources': 19.1,
    'Manufacturing': 22.8,
    'Technology': 13.2,
    'Healthcare': 17.8,
    'Finance': 10.9,
    'Overall': 16.1
  }

  // Calculate department-wise attrition
  const departmentStats = employees.reduce((acc: any, emp) => {
    if (!acc[emp.Department]) {
      acc[emp.Department] = { total: 0, attrition: 0 }
    }
    acc[emp.Department].total++
    if (emp.Attrition === 'Yes') {
      acc[emp.Department].attrition++
    }
    return acc
  }, {})

  const departmentData = Object.keys(departmentStats).map(dept => ({
    department: dept,
    companyRate: ((departmentStats[dept].attrition / departmentStats[dept].total) * 100).toFixed(1),
    industryAvg: industryBenchmarks[dept as keyof typeof industryBenchmarks] || industryBenchmarks.Overall
  }))

  // Performance comparison data
  const performanceData = [
    {
      metric: 'Attrition Rate',
      company: parseFloat(companyAttritionRate),
      industry: industryBenchmarks.Overall,
      target: 12.0
    },
    {
      metric: 'Avg Performance',
      company: (employees.reduce((sum, emp) => sum + emp.PerformanceRating, 0) / employees.length).toFixed(1),
      industry: 3.0,
      target: 3.5
    },
    {
      metric: 'Training Hours',
      company: (employees.reduce((sum, emp) => sum + (emp.TrainingTimesLastYear || 0), 0) / employees.length).toFixed(1),
      industry: 2.5,
      target: 4.0
    },
    {
      metric: 'Job Satisfaction',
      company: (employees.reduce((sum, emp) => sum + emp.JobSatisfaction, 0) / employees.length).toFixed(1),
      industry: 2.7,
      target: 3.5
    }
  ]

  const isAboveIndustry = parseFloat(companyAttritionRate) < industryBenchmarks.Overall

  return (
    <div className="space-y-6">
      {/* Main Benchmark Card */}
      <Card className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] border-[#B58342]/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-500" />
                Industry Benchmark Comparison
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                Real-time performance vs. industry averages
              </CardDescription>
            </div>
            <div className={`px-4 py-2 rounded-lg border-2 ${isAboveIndustry ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
              <div className="flex items-center space-x-2">
                {isAboveIndustry ? (
                  <TrendingDown className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-red-500" />
                )}
                <span className={`text-sm font-medium ${isAboveIndustry ? 'text-green-500' : 'text-red-500'}`}>
                  {isAboveIndustry ? 'Below' : 'Above'} Industry Avg
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Attrition Rate Comparison */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
              <p className="text-gray-400 text-sm mb-1">Company Attrition Rate</p>
              <p className="text-3xl font-bold text-white">{companyAttritionRate}%</p>
              <p className="text-xs text-gray-500 mt-1">{attritionCount} of {employees.length} employees</p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
              <p className="text-gray-400 text-sm mb-1">Industry Average</p>
              <p className="text-3xl font-bold text-blue-400">{industryBenchmarks.Overall}%</p>
              <p className="text-xs text-gray-500 mt-1">Across all sectors</p>
            </div>
            <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
              <p className="text-gray-400 text-sm mb-1">Difference</p>
              <p className={`text-3xl font-bold ${isAboveIndustry ? 'text-green-400' : 'text-red-400'}`}>
                {isAboveIndustry ? '-' : '+'}{Math.abs(parseFloat(companyAttritionRate) - industryBenchmarks.Overall).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isAboveIndustry ? 'Better than average' : 'Needs improvement'}
              </p>
            </div>
          </div>

          {/* Department-wise Comparison Chart */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 rounded-xl border border-[#B58342]/10">
            <h3 className="text-white font-semibold mb-6 text-lg">Department-wise Attrition vs Industry Average</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={departmentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
              >
                <defs>
                  <linearGradient id="companyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  </linearGradient>
                  <linearGradient id="industryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="department"
                  stroke="#D1D5DB"
                  angle={-35}
                  textAnchor="end"
                  height={120}
                  interval={0}
                  tick={{ fill: '#F3F4F6', fontSize: 13, fontWeight: 500 }}
                />
                <YAxis
                  stroke="#D1D5DB"
                  label={{ value: 'Attrition Rate (%)', angle: -90, position: 'insideLeft', fill: '#F3F4F6', fontSize: 14, fontWeight: 600 }}
                  tick={{ fill: '#F3F4F6', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '2px solid #3B82F6',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }}
                  labelStyle={{ color: '#F3F4F6', fontWeight: 600, marginBottom: '8px' }}
                  itemStyle={{ color: '#D1D5DB', padding: '4px 0' }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                  formatter={(value) => <span style={{ color: '#F3F4F6', fontSize: '14px', fontWeight: 500 }}>{value}</span>}
                />
                <Bar
                  dataKey="companyRate"
                  fill="url(#companyGradient)"
                  name="Company Rate (%)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
                <Bar
                  dataKey="industryAvg"
                  fill="url(#industryGradient)"
                  name="Industry Avg (%)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Comparison */}
      <Card className="bg-[#000000] border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white">Key Performance Indicators</CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive comparison across critical metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {performanceData.map((metric, index) => {
              const companyValue = parseFloat(metric.company.toString())
              const industryValue = parseFloat(metric.industry.toString())
              const isPerformingWell = metric.metric === 'Attrition Rate'
                ? companyValue < industryValue
                : companyValue > industryValue

              return (
                <div key={index} className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">{metric.metric}</h4>
                    {isPerformingWell ? (
                      <div className="px-2 py-1 bg-green-500/10 border border-green-500 rounded text-xs text-green-500 font-medium">
                        Above Target
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-yellow-500/10 border border-yellow-500 rounded text-xs text-yellow-500 font-medium">
                        Below Target
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Company</span>
                      <span className="text-white font-bold text-lg">{metric.company}{metric.metric === 'Attrition Rate' || metric.metric.includes('Avg') ? '' : ''}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Industry</span>
                      <span className="text-blue-400 font-medium">{metric.industry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Target</span>
                      <span className="text-green-400 font-medium">{metric.target}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-2 bg-black/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isPerformingWell ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min((companyValue / parseFloat(metric.target.toString())) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <Card className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] border-[#B58342]/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center text-xl">
            <AlertCircle className="h-6 w-6 mr-2 text-yellow-500" />
            Strategic Insights & Recommendations
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">
            AI-powered analysis based on your workforce data and industry benchmarks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parseFloat(companyAttritionRate) > industryBenchmarks.Overall && (
              <div className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">High Attrition Alert</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Company attrition rate is {(parseFloat(companyAttritionRate) - industryBenchmarks.Overall).toFixed(1)}% above industry average.
                    Consider implementing retention programs and conducting exit interviews.
                  </p>
                </div>
              </div>
            )}

            {departmentData.some(d => parseFloat(d.companyRate) > d.industryAvg * 1.5) && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Department-Specific Action Required</p>
                  <p className="text-gray-300 text-sm mt-1">
                    {departmentData.filter(d => parseFloat(d.companyRate) > d.industryAvg * 1.5).map(d => d.department).join(', ')}
                    {' '}showing significantly higher attrition. Recommend targeted interventions.
                  </p>
                </div>
              </div>
            )}

            {isAboveIndustry && (
              <div className="flex items-start space-x-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <TrendingDown className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-medium">Positive Performance</p>
                  <p className="text-gray-300 text-sm mt-1">
                    Company is performing {(industryBenchmarks.Overall - parseFloat(companyAttritionRate)).toFixed(1)}% better than industry average.
                    Continue current retention strategies and document best practices.
                  </p>
                </div>
              </div>
            )}

            {/* Additional Insights - Always Show */}
            <div className="mt-6 pt-4 border-t border-[#B58342]/10">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Key Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommendation 1 */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="text-blue-400 font-medium mb-2">📊 Regular Performance Reviews</h5>
                  <p className="text-gray-300 text-sm">
                    Conduct quarterly reviews to identify at-risk employees early. Focus on departments with higher attrition rates.
                  </p>
                </div>

                {/* Recommendation 2 */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="text-purple-400 font-medium mb-2">💰 Competitive Compensation</h5>
                  <p className="text-gray-300 text-sm">
                    Benchmark salaries against industry standards. Consider performance bonuses to retain top talent.
                  </p>
                </div>

                {/* Recommendation 3 */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h5 className="text-green-400 font-medium mb-2">📚 Learning & Development</h5>
                  <p className="text-gray-300 text-sm">
                    Invest in training programs. Employees with development opportunities are 34% less likely to leave.
                  </p>
                </div>

                {/* Recommendation 4 */}
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <h5 className="text-orange-400 font-medium mb-2">🎯 Career Progression</h5>
                  <p className="text-gray-300 text-sm">
                    Create clear career paths and promotion criteria. Internal mobility reduces attrition by up to 25%.
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Projection */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-white font-semibold mb-2">💡 Projected ROI</h5>
                  <p className="text-gray-300 text-sm mb-3">
                    Reducing attrition by 5% could save approximately <span className="text-green-400 font-bold">${(employees.length * 0.05 * 50000).toLocaleString()}</span> in recruitment and training costs annually.
                  </p>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                      <span className="text-gray-400">Cost per hire: $50K</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                      <span className="text-gray-400">5% reduction target</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
