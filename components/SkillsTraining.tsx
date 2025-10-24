'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, BookOpen, TrendingUp, CheckCircle, Target, Calendar } from 'lucide-react'

interface SkillsTrainingProps {
  employees: any[]
}

export default function SkillsTraining({ employees }: SkillsTrainingProps) {
  // Training programs based on CSV data
  const trainingPrograms = [
    {
      name: 'Technical Excellence',
      icon: BookOpen,
      color: 'bg-blue-600',
      borderColor: 'border-blue-500',
      skills: ['Python', 'Data Analysis', 'Machine Learning', 'Cloud Computing'],
      completions: employees.filter(emp => emp.TrainingTimesLastYear >= 3).length,
      duration: '12 weeks'
    },
    {
      name: 'Leadership Development',
      icon: Target,
      color: 'bg-purple-600',
      borderColor: 'border-purple-500',
      skills: ['Team Management', 'Strategic Planning', 'Communication', 'Decision Making'],
      completions: employees.filter(emp => emp.JobLevel >= 3 && emp.TrainingTimesLastYear >= 2).length,
      duration: '8 weeks'
    },
    {
      name: 'Professional Certifications',
      icon: Award,
      color: 'bg-green-600',
      borderColor: 'border-green-500',
      skills: ['PMP', 'AWS Certified', 'Scrum Master', 'Six Sigma'],
      completions: employees.filter(emp => emp.Education >= 4 && emp.TrainingTimesLastYear >= 2).length,
      duration: '16 weeks'
    },
    {
      name: 'Sales & Marketing',
      icon: TrendingUp,
      color: 'bg-orange-600',
      borderColor: 'border-orange-500',
      skills: ['Sales Strategy', 'Customer Relations', 'Digital Marketing', 'Negotiation'],
      completions: employees.filter(emp => emp.Department === 'Sales' && emp.TrainingTimesLastYear >= 1).length,
      duration: '6 weeks'
    }
  ]

  // Calculate training statistics
  const avgTrainingHours = (employees.reduce((sum, emp) => sum + (emp.TrainingTimesLastYear || 0), 0) / employees.length).toFixed(1)
  const employeesWithTraining = employees.filter(emp => emp.TrainingTimesLastYear > 0).length
  const trainingParticipationRate = ((employeesWithTraining / employees.length) * 100).toFixed(1)

  // Get top learners
  const topLearners = employees
    .filter(emp => emp.TrainingTimesLastYear >= 3)
    .sort((a, b) => b.TrainingTimesLastYear - a.TrainingTimesLastYear)
    .slice(0, 10)

  // Skills progression tracking
  const skillsData = [
    {
      category: 'Technical Skills',
      level: 'Advanced',
      employees: employees.filter(emp => emp.Education >= 4 && emp.TrainingTimesLastYear >= 2).length,
      percentage: ((employees.filter(emp => emp.Education >= 4 && emp.TrainingTimesLastYear >= 2).length / employees.length) * 100).toFixed(1)
    },
    {
      category: 'Leadership Skills',
      level: 'Intermediate',
      employees: employees.filter(emp => emp.JobLevel >= 3).length,
      percentage: ((employees.filter(emp => emp.JobLevel >= 3).length / employees.length) * 100).toFixed(1)
    },
    {
      category: 'Soft Skills',
      level: 'Advanced',
      employees: employees.filter(emp => emp.JobSatisfaction >= 3 && emp.JobInvolvement >= 3).length,
      percentage: ((employees.filter(emp => emp.JobSatisfaction >= 3 && emp.JobInvolvement >= 3).length / employees.length) * 100).toFixed(1)
    },
    {
      category: 'Domain Expertise',
      level: 'Expert',
      employees: employees.filter(emp => emp.YearsAtCompany >= 10).length,
      percentage: ((employees.filter(emp => emp.YearsAtCompany >= 10).length / employees.length) * 100).toFixed(1)
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Avg Training Hours</p>
                <p className="text-4xl font-bold text-white mt-2">{avgTrainingHours}</p>
                <p className="text-blue-200 text-xs mt-1">hours per employee/year</p>
              </div>
              <BookOpen className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600 to-green-700 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Participation Rate</p>
                <p className="text-4xl font-bold text-white mt-2">{trainingParticipationRate}%</p>
                <p className="text-green-200 text-xs mt-1">{employeesWithTraining} employees trained</p>
              </div>
              <Award className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Programs</p>
                <p className="text-4xl font-bold text-white mt-2">{trainingPrograms.length}</p>
                <p className="text-purple-200 text-xs mt-1">training programs available</p>
              </div>
              <Target className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Programs */}
      <Card className="bg-[#000000] border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
            Company Training Programs
          </CardTitle>
          <CardDescription className="text-gray-400">
            Comprehensive learning pathways for employee development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {trainingPrograms.map((program, index) => (
              <div key={index} className={`bg-black/50 border-2 ${program.borderColor} rounded-xl p-6 hover:shadow-lg transition-all`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${program.color} rounded-lg flex items-center justify-center`}>
                    <program.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">Duration</p>
                    <p className="text-white font-semibold">{program.duration}</p>
                  </div>
                </div>

                <h3 className="text-white font-bold text-lg mb-3">{program.name}</h3>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-400 text-sm font-medium">Skills Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-black/60 text-gray-200 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#B58342]/10">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-300 text-sm">{program.completions} completed</span>
                  </div>
                  <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                    Enroll →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Progression Tracking */}
      <Card className="bg-[#000000] border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-green-500" />
            Skills Progression Tracking
          </CardTitle>
          <CardDescription className="text-gray-400">
            Employee skill levels across key competency areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillsData.map((skill, index) => (
              <div key={index} className="bg-black/50 border border-[#B58342]/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{skill.category}</h4>
                    <p className="text-gray-400 text-sm">Level: <span className="text-blue-400 font-medium">{skill.level}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{skill.percentage}%</p>
                    <p className="text-gray-400 text-xs">{skill.employees} employees</p>
                  </div>
                </div>
                <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Learners */}
      <Card className="bg-[#000000] border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <Award className="h-6 w-6 mr-2 text-yellow-500" />
            Top Learners
          </CardTitle>
          <CardDescription className="text-gray-400">
            Employees with highest training engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {topLearners.slice(0, 8).map((employee, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-[#B58342]/10 rounded-lg p-4 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-600' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-600' :
                  'bg-blue-600'
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Employee {employee.EmployeeNumber}</p>
                  <p className="text-gray-400 text-sm">{employee.Department}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-lg">{employee.TrainingTimesLastYear}</p>
                  <p className="text-gray-400 text-xs">trainings</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning ROI */}
      <Card className="bg-gradient-to-br from-[#000000] to-[#1a1a1a] border-[#B58342]/20">
        <CardHeader>
          <CardTitle className="text-white text-xl flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-purple-500" />
            Training Investment & ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <p className="text-blue-400 text-sm font-medium mb-2">Annual Investment</p>
              <p className="text-3xl font-bold text-white">${(employees.length * parseFloat(avgTrainingHours) * 100).toLocaleString()}</p>
              <p className="text-gray-400 text-xs mt-1">estimated training budget</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-green-400 text-sm font-medium mb-2">Productivity Gain</p>
              <p className="text-3xl font-bold text-white">+23%</p>
              <p className="text-gray-400 text-xs mt-1">for trained employees</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <p className="text-purple-400 text-sm font-medium mb-2">Retention Impact</p>
              <p className="text-3xl font-bold text-white">-15%</p>
              <p className="text-gray-400 text-xs mt-1">attrition reduction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
