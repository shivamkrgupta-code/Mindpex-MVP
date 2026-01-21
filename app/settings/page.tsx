'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Globe2, MapPin, Clock, Building, Briefcase, Code, Database, Webhook, CheckCircle, TrendingUp, Activity, Zap, Shield, Sliders, Timer, BookOpen, AlertCircle, Users2 } from 'lucide-react'

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [sensitivityLevel, setSensitivityLevel] = useState('standard')
  const [cooldownPeriod, setCooldownPeriod] = useState('7')
  const [playbooks, setPlaybooks] = useState({
    lowPerformance: true,
    overworkBurnout: true,
    promotionOverdue: true,
    lowSatisfaction: true,
    longCommute: false
  })

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const togglePlaybook = (key: string) => {
    setPlaybooks(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  return (
    <div className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Organization Settings</h1>
        <p className="text-slate-300 text-xs sm:text-base mt-2">
          Configure your organization profile, detection preferences, and system integrations
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Main Settings (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detection & Intervention Preferences - NEW SECTION */}
          <Card className="bg-white/5 backdrop-blur-xl border-2 border-[#B58342] shadow-2xl">
            <CardHeader className="border-b border-[#B58342]/20 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Detection & Intervention Preferences</CardTitle>
                  <CardDescription className="text-slate-400 text-sm mt-1">
                    Configure how the system detects risk patterns and suggests interventions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Sensitivity Levels */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-[#B58342]" />
                  <h4 className="text-white font-semibold text-base">Detection Sensitivity</h4>
                </div>
                <p className="text-slate-400 text-sm">
                  How sensitive the system is to detecting risk patterns in cohort-level data
                </p>

                <div className="grid gap-3">
                  <div
                    onClick={() => setSensitivityLevel('low')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      sensitivityLevel === 'low'
                        ? 'bg-blue-500/10 border-blue-500/50'
                        : 'bg-black/40 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1">Low Sensitivity</h5>
                        <p className="text-slate-400 text-sm">
                          Only flags severe patterns affecting large cohorts. Fewer interventions, higher confidence thresholds.
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        sensitivityLevel === 'low' ? 'border-blue-500 bg-blue-500' : 'border-slate-500'
                      }`}>
                        {sensitivityLevel === 'low' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSensitivityLevel('standard')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      sensitivityLevel === 'standard'
                        ? 'bg-[#B58342]/10 border-[#B58342]/50'
                        : 'bg-black/40 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1 flex items-center gap-2">
                          Standard Sensitivity
                          <span className="text-xs px-2 py-0.5 bg-[#B58342]/20 text-[#B58342] rounded-full">Recommended</span>
                        </h5>
                        <p className="text-slate-400 text-sm">
                          Balanced detection for meaningful patterns. Optimal mix of early detection and intervention precision.
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        sensitivityLevel === 'standard' ? 'border-[#B58342] bg-[#B58342]' : 'border-slate-500'
                      }`}>
                        {sensitivityLevel === 'standard' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSensitivityLevel('high')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      sensitivityLevel === 'high'
                        ? 'bg-purple-500/10 border-purple-500/50'
                        : 'bg-black/40 border-slate-600/30 hover:border-slate-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-white font-semibold mb-1">High Sensitivity</h5>
                        <p className="text-slate-400 text-sm">
                          Detects subtle patterns early. More interventions suggested, proactive approach to risk management.
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                        sensitivityLevel === 'high' ? 'border-purple-500 bg-purple-500' : 'border-slate-500'
                      }`}>
                        {sensitivityLevel === 'high' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intervention Cooldown */}
              <div className="pt-6 border-t border-slate-600/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-purple-400" />
                  <h4 className="text-white font-semibold text-base">Intervention Cooldown Period</h4>
                </div>
                <p className="text-slate-400 text-sm">
                  Minimum days between repeated interventions for the same pattern type
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['3', '7', '14', '30'].map((days) => (
                    <div
                      key={days}
                      onClick={() => setCooldownPeriod(days)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                        cooldownPeriod === days
                          ? 'bg-purple-500/10 border-purple-500/50'
                          : 'bg-black/40 border-slate-600/30 hover:border-slate-500/50'
                      }`}
                    >
                      <p className="text-2xl font-bold text-white mb-1">{days}</p>
                      <p className="text-slate-400 text-xs">days</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-xs">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  Prevents intervention fatigue while maintaining engagement effectiveness
                </p>
              </div>

              {/* Playbook Toggles */}
              <div className="pt-6 border-t border-slate-600/30 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-400" />
                  <h4 className="text-white font-semibold text-base">Intervention Playbooks</h4>
                </div>
                <p className="text-slate-400 text-sm">
                  Enable or disable specific intervention playbooks based on your organization's needs
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-600/30">
                    <div>
                      <h5 className="text-white font-medium">Low Performance Detection</h5>
                      <p className="text-slate-400 text-xs mt-1">Identifies cohorts with declining performance ratings</p>
                    </div>
                    <button
                      onClick={() => togglePlaybook('lowPerformance')}
                      className={`w-12 h-6 rounded-full transition-all ${
                        playbooks.lowPerformance ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        playbooks.lowPerformance ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-600/30">
                    <div>
                      <h5 className="text-white font-medium">Overwork & Burnout Signals</h5>
                      <p className="text-slate-400 text-xs mt-1">Detects overtime patterns with declining work-life balance</p>
                    </div>
                    <button
                      onClick={() => togglePlaybook('overworkBurnout')}
                      className={`w-12 h-6 rounded-full transition-all ${
                        playbooks.overworkBurnout ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        playbooks.overworkBurnout ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-600/30">
                    <div>
                      <h5 className="text-white font-medium">Promotion Overdue Alerts</h5>
                      <p className="text-slate-400 text-xs mt-1">Flags high performers overdue for career advancement</p>
                    </div>
                    <button
                      onClick={() => togglePlaybook('promotionOverdue')}
                      className={`w-12 h-6 rounded-full transition-all ${
                        playbooks.promotionOverdue ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        playbooks.promotionOverdue ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-600/30">
                    <div>
                      <h5 className="text-white font-medium">Job Satisfaction Monitoring</h5>
                      <p className="text-slate-400 text-xs mt-1">Tracks satisfaction trends across role categories</p>
                    </div>
                    <button
                      onClick={() => togglePlaybook('lowSatisfaction')}
                      className={`w-12 h-6 rounded-full transition-all ${
                        playbooks.lowSatisfaction ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        playbooks.lowSatisfaction ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-slate-600/30">
                    <div>
                      <h5 className="text-white font-medium">Commute Distance Analysis</h5>
                      <p className="text-slate-400 text-xs mt-1">Analyzes work-location distance impact on engagement</p>
                    </div>
                    <button
                      onClick={() => togglePlaybook('longCommute')}
                      className={`w-12 h-6 rounded-full transition-all ${
                        playbooks.longCommute ? 'bg-green-500' : 'bg-slate-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        playbooks.longCommute ? 'translate-x-6' : 'translate-x-1'
                      }`}></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-blue-300 font-semibold text-sm mb-1">Privacy-First Design</h5>
                    <p className="text-blue-200 text-xs">
                      All detections operate on aggregated cohort data (minimum 15 employees). No individual employee tracking.
                      Interventions are suggested at the pattern level, never at the person level.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization Profile */}
          <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
            <CardHeader className="border-b border-[#B58342]/20 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Organization Profile</CardTitle>
                  <CardDescription className="text-slate-400 text-sm mt-1">
                    Core identity and business information
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-400" />
                    Organization Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Mindpex Intelligence Platform"
                    className="w-full px-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20 transition-all"
                  />
                  <p className="text-xs text-slate-500">Legal entity name for contracts and invoices</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    Industry Sector
                  </label>
                  <select className="w-full px-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20 transition-all">
                    <option>Technology & Software</option>
                    <option>Financial Services & Banking</option>
                    <option>Healthcare & Life Sciences</option>
                    <option>Manufacturing & Industrial</option>
                    <option>Retail & E-commerce</option>
                    <option>Professional Services</option>
                  </select>
                  <p className="text-xs text-slate-500">Used for industry benchmarking (aggregated only)</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-slate-400" />
                    Organization Size
                  </label>
                  <select className="w-full px-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20 transition-all">
                    <option>51-200 employees</option>
                    <option>201-500 employees</option>
                    <option>501-1,000 employees</option>
                    <option>1,001-5,000 employees</option>
                    <option>5,001+ employees</option>
                  </select>
                  <p className="text-xs text-slate-500">Current full-time employee headcount</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Headquarters Location
                  </label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA, USA"
                    className="w-full px-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20 transition-all"
                  />
                  <p className="text-xs text-slate-500">Primary business location</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional & Localization */}
          <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
            <CardHeader className="border-b border-[#B58342]/20 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-xl">Regional & Localization</CardTitle>
                  <CardDescription className="text-slate-400 text-sm mt-1">
                    Time zones, formats, and locale preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    Primary Timezone
                  </label>
                  <select className="w-full px-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20 transition-all">
                    <option>US Pacific (PST/PDT) - UTC-8/-7</option>
                    <option>US Eastern (EST/EDT) - UTC-5/-4</option>
                    <option>US Central (CST/CDT) - UTC-6/-5</option>
                    <option>Europe/London (GMT/BST) - UTC+0/+1</option>
                  </select>
                  <p className="text-xs text-slate-500">Used for scheduling and time-based analytics</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-slate-400" />
                    Date Format
                  </label>
                  <select className="w-full px-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20 transition-all">
                    <option>MM/DD/YYYY (US Format)</option>
                    <option>DD/MM/YYYY (European Format)</option>
                    <option>YYYY-MM-DD (ISO 8601)</option>
                  </select>
                  <p className="text-xs text-slate-500">How dates are displayed throughout the platform</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations & API */}
          <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
            <CardHeader className="border-b border-[#B58342]/20 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-xl">Integrations & Developer Tools</CardTitle>
                    <CardDescription className="text-slate-400 text-sm mt-1">
                      API access, webhooks, and third-party integrations
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="border-[#B58342] text-[#B58342] hover:bg-[#B58342]/10"
                >
                  View API Docs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-black/40 rounded-lg p-5 border border-slate-600/30 hover:border-[#B58342]/40 transition-all cursor-pointer group">
                  <Database className="h-8 w-8 mb-3 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <h4 className="text-white font-semibold text-base mb-2">REST API Access</h4>
                  <p className="text-slate-400 text-sm mb-3">Programmatic access to aggregated analytics</p>
                  <span className="text-green-400 text-xs font-semibold">ACTIVE</span>
                </div>

                <div className="bg-black/40 rounded-lg p-5 border border-slate-600/30 hover:border-[#B58342]/40 transition-all cursor-pointer group">
                  <Webhook className="h-8 w-8 mb-3 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <h4 className="text-white font-semibold text-base mb-2">Webhooks</h4>
                  <p className="text-slate-400 text-sm mb-3">Real-time event notifications for your systems</p>
                  <span className="text-slate-400 text-xs font-semibold">CONFIGURE</span>
                </div>

                <div className="bg-black/40 rounded-lg p-5 border border-slate-600/30 hover:border-[#B58342]/40 transition-all cursor-pointer group">
                  <Database className="h-8 w-8 mb-3 text-orange-400 group-hover:text-orange-300 transition-colors" />
                  <h4 className="text-white font-semibold text-base mb-2">Data Export</h4>
                  <p className="text-slate-400 text-sm mb-3">Bulk export to CSV, JSON (aggregated data only)</p>
                  <span className="text-slate-400 text-xs font-semibold">AVAILABLE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 pt-4 pb-8">
            <p className="text-slate-400 text-xs sm:text-sm">
              Changes are saved automatically and take effect immediately
            </p>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 sm:h-12 px-6 sm:px-8 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white text-sm sm:text-base font-semibold disabled:opacity-50 whitespace-nowrap"
            >
              {isSaving ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </div>

        {/* Right Column - Live Preview & Status (1/3 width) */}
        <div className="space-y-6">
          {/* Configuration Status */}
          <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl sticky top-6">
            <CardHeader className="border-b border-[#B58342]/20 pb-4">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#B58342]" />
                Configuration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-200 text-sm">Detection & Intervention</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-200 text-sm">Organization Profile</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-slate-200 text-sm">Regional Settings</span>
                  </div>
                  <span className="text-green-400 text-xs font-semibold">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-200 text-sm">API & Integrations</span>
                  </div>
                  <span className="text-blue-400 text-xs font-semibold">Active</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-600/30">
                <h4 className="text-white font-semibold mb-3 text-sm">Setup Progress</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Overall Completion</span>
                    <span className="text-white font-semibold">100%</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#B58342] to-[#d4a05a] h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview - Current Configuration */}
          <Card className="bg-white/5 backdrop-blur-xl border border-purple-500/20 shadow-xl">
            <CardHeader className="border-b border-purple-500/20 pb-4">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                Impact Preview
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-1">
                How your settings affect the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Detection Mode</span>
                  <Sliders className="h-4 w-4 text-[#B58342]" />
                </div>
                <p className="text-white text-base font-semibold capitalize">{sensitivityLevel} Sensitivity</p>
                <p className="text-slate-500 text-xs mt-1">
                  {sensitivityLevel === 'low' && 'Only severe patterns affecting large cohorts'}
                  {sensitivityLevel === 'standard' && 'Balanced detection with optimal precision'}
                  {sensitivityLevel === 'high' && 'Proactive early detection of subtle patterns'}
                </p>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Intervention Cooldown</span>
                  <Timer className="h-4 w-4 text-purple-400" />
                </div>
                <p className="text-white text-base font-semibold">{cooldownPeriod} Days</p>
                <p className="text-slate-500 text-xs mt-1">Between repeated interventions of same type</p>
              </div>

              <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300 text-sm">Active Playbooks</span>
                  <BookOpen className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-white text-base font-semibold">
                  {Object.values(playbooks).filter(Boolean).length} / 5 Enabled
                </p>
                <p className="text-slate-500 text-xs mt-1">Detection strategies currently active</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
            <CardHeader className="border-b border-[#B58342]/20 pb-4">
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-white/10 hover:border-[#B58342]/40"
              >
                <Code className="h-4 w-4 mr-2" />
                Generate API Key
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-white/10 hover:border-[#B58342]/40"
              >
                <Database className="h-4 w-4 mr-2" />
                Export Aggregated Data
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-slate-600 text-slate-300 hover:bg-white/10 hover:border-[#B58342]/40"
              >
                <Activity className="h-4 w-4 mr-2" />
                View Audit Logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
