'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, CheckCircle2, ArrowLeft, Building2, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function BookSessionPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    companySize: '',
    role: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, this would send to your booking system
    console.log('Booking submitted:', formData)

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-4 sm:p-6">
        <Card className="max-w-2xl w-full bg-white/5 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl">
          <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <CheckCircle2 className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-4">Session Booked Successfully!</h2>
            <p className="text-slate-300 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-4">
              Thank you, {formData.firstName}! We've received your strategy session request. Our team will contact you at{' '}
              <span className="text-[#B58342] font-semibold">{formData.email}</span> within 24 hours to confirm your preferred time.
            </p>

            <div className="bg-black/40 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 max-w-lg mx-auto border border-[#B58342]/20">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">What Happens Next?</h3>
              <div className="space-y-2 sm:space-y-3 text-left text-slate-300 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#B58342]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#B58342] font-bold text-xs">1</span>
                  </div>
                  <p>Confirmation email sent to your inbox with calendar invite</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#B58342]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#B58342] font-bold text-xs">2</span>
                  </div>
                  <p>Pre-session questionnaire to understand your specific challenges</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#B58342]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#B58342] font-bold text-xs">3</span>
                  </div>
                  <p>15-minute video call with our retention intelligence specialist</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#B58342]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#B58342] font-bold text-xs">4</span>
                  </div>
                  <p>Custom attrition risk diagnostic report delivered within 48 hours</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="default" className="px-6 sm:px-8 w-full sm:w-auto">
                  Return to Home
                </Button>
              </Link>
              <Link href="/today" className="w-full sm:w-auto">
                <Button variant="outline" className="px-6 sm:px-8 w-full sm:w-auto">
                  View Live Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <nav className="bg-[#000000]/90 backdrop-blur-xl border-b border-[#B58342]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#B58342]" />
            <div className="text-xl sm:text-2xl font-bold text-white">Mindpex</div>
          </Link>
          <Link href="/today" className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors">
            View Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                Book Your Free Strategy Session
              </h1>
              <p className="text-slate-300 text-base sm:text-lg mb-6 sm:mb-8">
                Get a personalized attrition risk assessment and discover how Mindpex can help protect your revenue continuity.
              </p>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">15-Minute Session</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Quick, focused conversation with our retention intelligence expert
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Free Diagnostic Report</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Quantified attrition risk analysis specific to your organization
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">No Obligation</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      No credit card required. No sales pressure. Just valuable insights.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 bg-[#B58342]/10 border border-[#B58342]/30 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-300">
                  <span className="font-semibold text-[#B58342]">Trusted by Fortune 500:</span> Join 200+ enterprise leaders who've used Mindpex to reduce attrition costs by an average of 40%.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <Card className="bg-white/5 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl">
              <CardHeader className="border-b border-[#B58342]/20">
                <CardTitle className="text-white text-xl sm:text-2xl">Schedule Your Session</CardTitle>
                <CardDescription className="text-slate-400 text-sm sm:text-base">
                  Fill out the form below and we'll confirm your preferred time within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        First Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                        <input
                          type="text"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        Last Name <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                        <input
                          type="text"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        Work Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                          placeholder="john.doe@company.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                      Company Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                      <input
                        type="text"
                        name="company"
                        required
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                        placeholder="Acme Corporation"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        Company Size <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="companySize"
                        required
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                      >
                        <option value="">Select size</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        Your Role <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                      >
                        <option value="">Select role</option>
                        <option value="ceo">CEO / Founder</option>
                        <option value="cfo">CFO</option>
                        <option value="chro">CHRO / VP HR</option>
                        <option value="coo">COO</option>
                        <option value="hr-director">HR Director</option>
                        <option value="talent-leader">Talent Leader</option>
                        <option value="other">Other Executive</option>
                      </select>
                    </div>
                  </div>

                  {/* Scheduling Preferences */}
                  <div className="border-t border-slate-600/30 pt-4 sm:pt-6">
                    <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Scheduling Preferences</h3>
                    <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                          Preferred Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          required
                          value={formData.preferredDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                          Preferred Time <span className="text-red-400">*</span>
                        </label>
                        <select
                          name="preferredTime"
                          required
                          value={formData.preferredTime}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                        >
                          <option value="">Select time</option>
                          <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                          <option value="afternoon">Afternoon (12:00 PM - 3:00 PM)</option>
                          <option value="evening">Evening (3:00 PM - 6:00 PM)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                        Timezone <span className="text-red-400">*</span>
                      </label>
                      <select
                        name="timezone"
                        required
                        value={formData.timezone}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                      >
                        <option value="">Select timezone</option>
                        <option value="PST">Pacific Time (PST)</option>
                        <option value="MST">Mountain Time (MST)</option>
                        <option value="CST">Central Time (CST)</option>
                        <option value="EST">Eastern Time (EST)</option>
                        <option value="GMT">GMT</option>
                        <option value="CET">Central European Time (CET)</option>
                        <option value="IST">India Standard Time (IST)</option>
                        <option value="AEST">Australian Eastern Time (AEST)</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
                      What challenges are you facing? (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                        placeholder="Tell us about your current attrition challenges or specific questions..."
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-slate-600/30 pt-4 sm:pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        'Book My Strategy Session'
                      )}
                    </Button>
                    <p className="text-xs sm:text-sm text-slate-400 text-center mt-3 sm:mt-4">
                      By submitting this form, you agree to our privacy policy and consent to be contacted by Mindpex.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
