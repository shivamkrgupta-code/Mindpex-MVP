'use client'

import { X, Briefcase, Building2, TrendingUp, Award, Calendar, DollarSign, Clock, Target } from 'lucide-react'

interface EmployeeDialogProps {
  employee: any
  isOpen: boolean
  onClose: () => void
}

export default function EmployeeDialog({ employee, isOpen, onClose }: EmployeeDialogProps) {
  if (!isOpen || !employee) return null

  const calculateRiskScore = (emp: any) => {
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

  const riskScore = calculateRiskScore(employee)
  const getRiskLevel = (score: number) => {
    if (score >= 60) return { level: 'High Risk', color: 'text-red-500 bg-red-500/10 border-red-500' }
    if (score >= 30) return { level: 'Medium Risk', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500' }
    return { level: 'Low Risk', color: 'text-green-500 bg-green-500/10 border-green-500' }
  }

  const risk = getRiskLevel(riskScore)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#000000] border border-[#B58342]/20 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>

          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
              <span className="text-3xl font-bold text-white">{employee.EmployeeNumber.toString().slice(0, 2)}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">Employee {employee.EmployeeNumber}</h2>
              <p className="text-blue-100 text-lg">{employee.JobRole}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${risk.color}`}>
                  {risk.level} - {riskScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-500" />
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm">Department</p>
                <p className="text-white font-medium">{employee.Department}</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm">Job Role</p>
                <p className="text-white font-medium">{employee.JobRole}</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm">Job Level</p>
                <p className="text-white font-medium">Level {employee.JobLevel}</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm">Education</p>
                <p className="text-white font-medium">
                  {employee.Education === 5 ? 'Doctorate' :
                   employee.Education === 4 ? 'Masters' :
                   employee.Education === 3 ? 'Bachelors' :
                   employee.Education === 2 ? 'Associate' : 'High School'}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
              Performance Metrics
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm mb-2">Performance Rating</p>
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Award
                        key={star}
                        className={`h-5 w-5 ${star <= employee.PerformanceRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-white font-medium">{employee.PerformanceRating}/4</span>
                </div>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm">Job Involvement</p>
                <p className="text-white font-medium text-2xl">{employee.JobInvolvement}/4</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <p className="text-gray-400 text-sm">Job Satisfaction</p>
                <p className="text-white font-medium text-2xl">{employee.JobSatisfaction}/4</p>
              </div>
            </div>
          </div>

          {/* Work Details */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-purple-500" />
              Work Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Years at Company</p>
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-white font-medium text-xl">{employee.YearsAtCompany} years</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Years in Current Role</p>
                  <Clock className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-white font-medium text-xl">{employee.YearsInCurrentRole} years</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Years Since Promotion</p>
                  <Target className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-white font-medium text-xl">{employee.YearsSinceLastPromotion} years</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400 text-sm">Monthly Income</p>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </div>
                <p className="text-white font-medium text-xl">${employee.MonthlyIncome?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Work-Life Balance */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Work-Life Indicators</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10 text-center">
                <p className="text-gray-400 text-sm mb-1">Work-Life Balance</p>
                <p className="text-white font-medium text-xl">{employee.WorkLifeBalance}/4</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10 text-center">
                <p className="text-gray-400 text-sm mb-1">Environment Satisfaction</p>
                <p className="text-white font-medium text-xl">{employee.EnvironmentSatisfaction}/4</p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10 text-center">
                <p className="text-gray-400 text-sm mb-1">Overtime</p>
                <p className={`font-medium text-xl ${employee.OverTime === 'Yes' ? 'text-red-400' : 'text-green-400'}`}>
                  {employee.OverTime || 'No'}
                </p>
              </div>
              <div className="bg-black/50 p-4 rounded-lg border border-[#B58342]/10 text-center">
                <p className="text-gray-400 text-sm mb-1">Training Times</p>
                <p className="text-white font-medium text-xl">{employee.TrainingTimesLastYear || 0}</p>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className={`p-4 rounded-lg border-2 ${risk.color}`}>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Attrition Risk Analysis
            </h3>
            <div className="space-y-2">
              {employee.Attrition === 'Yes' && (
                <div className="flex items-center text-red-400 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                  Currently marked for attrition
                </div>
              )}
              {employee.PerformanceRating <= 2 && (
                <div className="flex items-center text-yellow-400 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Low performance rating
                </div>
              )}
              {employee.OverTime === 'Yes' && (
                <div className="flex items-center text-yellow-400 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Frequent overtime - potential burnout risk
                </div>
              )}
              {employee.YearsSinceLastPromotion > 3 && (
                <div className="flex items-center text-yellow-400 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  No promotion in {employee.YearsSinceLastPromotion} years
                </div>
              )}
              {employee.JobSatisfaction <= 2 && (
                <div className="flex items-center text-yellow-400 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                  Low job satisfaction
                </div>
              )}
              {riskScore < 30 && (
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Employee shows strong retention indicators
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
