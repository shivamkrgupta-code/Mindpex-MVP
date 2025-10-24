'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Shield, Users, Target } from 'lucide-react'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [employeeCost, setEmployeeCost] = useState(0)
  const [riskScore, setRiskScore] = useState(0)
  const [savings, setSavings] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Animated counters
    const animateValue = (start: number, end: number, duration: number, setter: (val: number) => void) => {
      const startTime = performance.now()
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const value = Math.floor(start + (end - start) * progress)
        setter(value)
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    const timer = setTimeout(() => {
      animateValue(0, 247000, 2000, setEmployeeCost)
      animateValue(0, 73, 2000, setRiskScore)
      animateValue(0, 4200000, 2500, setSavings)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? 'bg-[#000000]/90 backdrop-blur-xl border-b border-[#B58342]/30 shadow-lg shadow-[#B58342]/10'
          : 'bg-[#000000]/80 backdrop-blur-sm border-b border-[#B58342]/20'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-white">Mindpex</div>
            <div className="hidden lg:block text-sm bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent border-l border-[#B58342]/30 pl-3 ml-3">
              Retention Intelligence Platform
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Platform Demo
            </Link>
            <a
              href="#strategy-session"
              onClick={(e) => smoothScroll(e, 'strategy-session')}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] rounded-lg shadow-lg shadow-[#B58342]/30 transition-all"
            >
              Book Strategy Session
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section - Above Fold */}
      <section className="relative bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#000000] overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(181, 131, 66, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(181, 131, 66, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Pulse Animation on Risk Score */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#B58342] rounded-full opacity-5 blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-block px-4 py-2 bg-[#B58342]/10 border border-[#B58342]/30 rounded-full mb-6">
                <span className="text-[#B58342] text-sm font-semibold">Executive Retention Intelligence</span>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                Your High-Value Talent<br />
                Attrition is Costing You<br />
                <span className="text-[#B58342]">${employeeCost.toLocaleString()}</span> Per Employee
              </h1>

              <p className="text-lg lg:text-xl text-slate-300 mb-8 leading-relaxed max-w-xl">
                Most enterprises lose 15-20% of critical talent annually to <span className="text-white font-semibold">invisible disengagement signals</span>.
                Mindpex predicts attrition 6-12 months in advance, protecting revenue continuity and reducing replacement costs by up to 40%.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a
                  href="#strategy-session"
                  onClick={(e) => smoothScroll(e, 'strategy-session')}
                  className="group px-8 py-4 text-base font-semibold text-[#000000] bg-[#B58342] hover:bg-[#c9924a] rounded-lg shadow-xl shadow-[#B58342]/30 transition-all flex items-center justify-center"
                >
                  Quantify Your Attrition Risk
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link
                  href="/dashboard"
                  className="px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all flex items-center justify-center"
                >
                  View Live Dashboard
                </Link>
              </div>

              {/* C-Level Testimonial */}
              <div className="border-l-4 border-[#B58342] pl-6 py-2 bg-white/5 backdrop-blur-sm rounded-r-lg">
                <p className="text-slate-200 italic text-sm lg:text-base mb-2">
                  "Mindpex identified $2.1M in attrition risk we couldn't see. Their predictive model saved us 22% on annual turnover costs in year one."
                </p>
                <p className="text-slate-400 text-sm font-semibold">
                  — Sarah Chen, CFO, Fortune 500 Technology Company
                </p>
              </div>
            </div>

            {/* Right: Dashboard Visual */}
            <div className="relative">
              {/* Predictive Dashboard Mockup */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-lg">High-Value Attrition Forecast</h3>
                  <div className="px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
                    <span className="text-red-300 text-xs font-semibold">CRITICAL RISK</span>
                  </div>
                </div>

                {/* Risk Score Gauge */}
                <div className="mb-8">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-slate-300 text-sm">Predicted Attrition Risk</span>
                    <span className="text-5xl font-bold text-[#B58342]">{riskScore}%</span>
                  </div>
                  <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#B58342] to-red-500 rounded-full transition-all duration-2000"
                      style={{ width: `${riskScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Critical</span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 rounded-lg p-4 border border-[#B58342]/20">
                    <div className="text-slate-400 text-xs mb-1">At-Risk Employees</div>
                    <div className="text-white text-2xl font-bold">127</div>
                    <div className="text-red-400 text-xs mt-1">↑ 18% vs last quarter</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-[#B58342]/20">
                    <div className="text-slate-400 text-xs mb-1">Projected Loss</div>
                    <div className="text-white text-2xl font-bold">${(savings / 1000).toFixed(1)}M</div>
                    <div className="text-orange-400 text-xs mt-1">Next 12 months</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-[#B58342]/20">
                    <div className="text-slate-400 text-xs mb-1">Critical Roles</div>
                    <div className="text-white text-2xl font-bold">23</div>
                    <div className="text-red-400 text-xs mt-1">Executive/Leadership</div>
                  </div>
                  <div className="bg-black/40 rounded-lg p-4 border border-[#B58342]/20">
                    <div className="text-slate-400 text-xs mb-1">Prediction Accuracy</div>
                    <div className="text-white text-2xl font-bold">94%</div>
                    <div className="text-green-400 text-xs mt-1">Validated model</div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Cards */}
              <div className="absolute -left-6 top-1/4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 border border-slate-200 animate-pulse">
                <div className="text-xs text-slate-600 mb-1">Early Warning Signal</div>
                <div className="text-red-600 font-bold text-lg">⚠ High Risk</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Intelligence Description */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#000000] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B58342]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B58342]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Predict. Prevent. Protect Revenue Continuity.
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Mindpex uses predictive AI to forecast high-value attrition risk 6-12 months before voluntary departure,
              quantifying financial exposure and enabling proactive retention strategies that protect your bottom line.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-[#B58342]/20 hover:border-[#B58342]/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-[#B58342]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Predictive Modeling</h3>
              <p className="text-slate-300 leading-relaxed">
                Advanced AI analyzes 47+ behavioral signals to identify invisible disengagement patterns before traditional exit indicators appear.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-[#B58342]/20 hover:border-[#B58342]/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-[#B58342]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Financial Risk Quantification</h3>
              <p className="text-slate-300 leading-relaxed">
                Real-time dashboards translate talent risk into financial exposure, showing exact replacement costs and revenue impact by role.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl rounded-xl p-8 border border-[#B58342]/20 hover:border-[#B58342]/50 transition-all shadow-xl hover:shadow-2xl hover:shadow-[#B58342]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Retention ROI</h3>
              <p className="text-slate-300 leading-relaxed">
                Track intervention effectiveness with measurable retention lift, cost avoidance metrics, and business continuity preservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Pillar System */}
      <section className="py-20 bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#000000] relative">
        {/* Decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B58342]/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              The Four Pillars of Retention Intelligence
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              An integrated system that transforms workforce data into strategic foresight
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[#B58342] via-[#B58342] to-[#B58342] opacity-30" />

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Pillar 1 */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border-2 border-[#B58342]/30 hover:border-[#B58342] transition-all group hover:shadow-2xl hover:shadow-[#B58342]/20">
                <div className="absolute -top-4 left-8 bg-gradient-to-br from-[#B58342] to-[#d4a05a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-2">Competency Modeling</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Map critical skills and identify competency gaps that drive attrition risk.
                </p>
                <div className="text-sm text-[#B58342] font-semibold">
                  → Financial Benefit: Reduce mis-hires by 35%
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border-2 border-[#B58342]/30 hover:border-[#B58342] transition-all group hover:shadow-2xl hover:shadow-[#B58342]/20">
                <div className="absolute -top-4 left-8 bg-gradient-to-br from-[#B58342] to-[#d4a05a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-2">Performance Risk Scoring</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Quantify attrition probability using 47+ behavioral and performance signals.
                </p>
                <div className="text-sm text-[#B58342] font-semibold">
                  → Strategic Benefit: 6-12 month early warning
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border-2 border-[#B58342]/30 hover:border-[#B58342] transition-all group hover:shadow-2xl hover:shadow-[#B58342]/20">
                <div className="absolute -top-4 left-8 bg-gradient-to-br from-[#B58342] to-[#d4a05a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-2">Succession Continuity</h3>
                <p className="text-slate-300 text-sm mb-4">
                  AI-powered succession planning ensures zero critical role exposure.
                </p>
                <div className="text-sm text-[#B58342] font-semibold">
                  → Risk Mitigation: Protect business continuity
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="relative bg-black/40 backdrop-blur-xl rounded-xl p-8 border-2 border-[#B58342]/30 hover:border-[#B58342] transition-all group hover:shadow-2xl hover:shadow-[#B58342]/20">
                <div className="absolute -top-4 left-8 bg-gradient-to-br from-[#B58342] to-[#d4a05a] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-white mb-3 mt-2">Retention ROI</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Measure intervention effectiveness and track cost avoidance metrics.
                </p>
                <div className="text-sm text-[#B58342] font-semibold">
                  → ROI: 400% average return on retention investment
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority & Social Proof */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted by Fortune 500 Leadership</h2>
            <p className="text-slate-400 text-lg">Protecting revenue continuity for enterprises worldwide</p>
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-10">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[#B58342] rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  SC
                </div>
                <div>
                  <p className="text-xl lg:text-2xl text-white mb-6 leading-relaxed italic">
                    "Mindpex saved us 20% on annual turnover costs in year one. Their predictive model identified $4.2M in
                    attrition risk we had zero visibility on. The ROI was immediate and measurable."
                  </p>
                  <div>
                    <p className="text-white font-bold text-lg">Sarah Chen</p>
                    <p className="text-slate-400">Chief Financial Officer, Fortune 500 Technology Company</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Metrics */}
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-[#B58342] mb-2">$127M</div>
              <div className="text-slate-400">Total Cost Avoidance</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#B58342] mb-2">94%</div>
              <div className="text-slate-400">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#B58342] mb-2">6-12</div>
              <div className="text-slate-400">Months Early Warning</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-[#B58342] mb-2">400%</div>
              <div className="text-slate-400">Average ROI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk-Free CTA Section - Dark Mode */}
      <section id="strategy-session" className="py-24 bg-gradient-to-br from-[#000000] to-[#1a1a1a] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(181, 131, 66, 0.3) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Stop Managing Risk.<br />
            Start Predicting Continuity.
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get your free High-Value Attrition Diagnostic Report and discover exactly where your revenue is at risk.
            15-minute strategy session with our retention intelligence team.
          </p>

          {/* Offer Box */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 mb-10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-[#B58342]/20 rounded-full px-6 py-2">
                <span className="text-[#B58342] font-bold text-sm">FREE DIAGNOSTIC OFFER</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">What You'll Receive:</h3>
            <ul className="text-left text-slate-200 space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-[#B58342] mr-3 text-xl">✓</span>
                <span>Quantified attrition risk analysis for your organization</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#B58342] mr-3 text-xl">✓</span>
                <span>Financial exposure assessment by critical role</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#B58342] mr-3 text-xl">✓</span>
                <span>Customized retention ROI projection</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#B58342] mr-3 text-xl">✓</span>
                <span>15-minute strategy session with retention intelligence expert</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:strategy@mindpex.com?subject=Strategy Session Request"
              className="group px-10 py-5 text-lg font-bold text-[#000000] bg-[#B58342] hover:bg-[#c9924a] rounded-lg shadow-2xl shadow-[#B58342]/40 transition-all inline-flex items-center justify-center"
            >
              Book Your Strategy Session
              <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/dashboard"
              className="px-10 py-5 text-lg font-bold text-white bg-black/60 hover:bg-black/80 border-2 border-[#B58342] hover:border-[#d4a05a] rounded-lg shadow-xl transition-all inline-flex items-center justify-center"
            >
              Explore Live Dashboard
            </Link>
          </div>

          <p className="text-slate-400 text-sm mt-8">
            No credit card required • No software installation • Completely confidential
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-[#B58342]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="text-2xl font-bold text-white mb-2">Mindpex</div>
              <div className="text-slate-400 text-sm max-w-md">
                Predictive retention intelligence that protects revenue continuity and reduces critical talent attrition risk.
              </div>
              <div className="text-slate-500 text-sm mt-3">
                © 2025 Mindpex Intelligence Systems. All rights reserved.
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 text-slate-400 text-sm">
              <a href="mailto:contact@mindpex.com" className="hover:text-white transition-colors">
                contact@mindpex.com
              </a>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Platform Demo
              </Link>
              <a href="#strategy-session" onClick={(e) => smoothScroll(e, 'strategy-session')} className="hover:text-white transition-colors">
                Book Strategy Session
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
