'use client'

import { useState } from 'react'
import { X, MessageSquare, Mail, Phone, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SupportDrawerProps {
  isOpen: boolean
  onClose: () => void
  context?: {
    page?: string
    section?: string
    orgId?: string
    userId?: string
  }
}

export default function SupportDrawer({ isOpen, onClose, context }: SupportDrawerProps) {
  const [messageText, setMessageText] = useState('')
  const [callName, setCallName] = useState('')
  const [callPhone, setCallPhone] = useState('')
  const [callDate, setCallDate] = useState('')
  const [callTime, setCallTime] = useState('')
  const [activeTab, setActiveTab] = useState<'message' | 'email' | 'call'>('message')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmitMessage = () => {
    // In production, this would send the message with context
    console.log('Message submitted:', { messageText, context })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setMessageText('')
      onClose()
    }, 2000)
  }

  const handleRequestCall = () => {
    // In production, this would submit the call request with context
    console.log('Call requested:', { callName, callPhone, callDate, callTime, context })
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setCallName('')
      setCallPhone('')
      setCallDate('')
      setCallTime('')
      onClose()
    }, 2000)
  }

  const supportEmail = 'support@mindpex.com'

  const copyEmail = () => {
    navigator.clipboard.writeText(supportEmail)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-l border-[#B58342]/30 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-[#B58342]/30 p-5 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-lg flex items-center justify-center">
                <Headphones className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Support & Help</h2>
                <p className="text-xs text-slate-400 mt-0.5">We're here to help you</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="m-5 bg-green-500/10 border border-green-500/30 rounded-lg p-4 animate-in fade-in">
            <p className="text-green-300 text-sm font-semibold">✓ Submitted successfully</p>
            <p className="text-green-200 text-xs mt-1">Our tech team usually responds within 1 business day.</p>
          </div>
        )}

        {/* Context Info (if available) */}
        {context?.page && !submitted && (
          <div className="m-5 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-300 text-xs">
              Context: {context.page}{context.section ? ` → ${context.section}` : ''}
            </p>
          </div>
        )}

        {/* Tab Selector */}
        <div className="px-5 pt-5">
          <div className="flex gap-2 bg-black/40 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('message')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'message'
                  ? 'bg-[#B58342] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Message
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'email'
                  ? 'bg-[#B58342] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setActiveTab('call')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                activeTab === 'call'
                  ? 'bg-[#B58342] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Call
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Message Support */}
          {activeTab === 'message' && !submitted && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-[#B58342]" />
                  <h3 className="text-white font-semibold text-lg">Message Support</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Send us a message and we'll get back to you. Our tech team usually responds within 1 business day.
                </p>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Describe what you need help with..."
                  className="w-full h-40 bg-black/40 border border-slate-600/30 rounded-lg p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B58342] resize-none"
                />
                <Button
                  onClick={handleSubmitMessage}
                  disabled={!messageText.trim()}
                  className="w-full mt-4 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </Button>
              </div>
            </div>
          )}

          {/* Email Support */}
          {activeTab === 'email' && !submitted && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-6 w-6 text-[#B58342]" />
                  <h3 className="text-white font-semibold text-lg">Email Support</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Prefer email? Send us a message directly at:
                </p>
                <div className="bg-black/40 border border-slate-600/30 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-white font-mono text-sm">{supportEmail}</span>
                  <Button
                    onClick={copyEmail}
                    variant="outline"
                    className="border-[#B58342] text-[#B58342] hover:bg-[#B58342]/10 text-xs h-8"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-slate-500 text-xs mt-4">
                  Our tech team usually responds within 1 business day.
                </p>
              </div>
            </div>
          )}

          {/* Request Call */}
          {activeTab === 'call' && !submitted && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-[#B58342]/20 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-[#B58342]" />
                  <h3 className="text-white font-semibold text-lg">Request a Call</h3>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  Need to talk? We'll call you back at a time that works for you.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Your Name</label>
                    <input
                      type="text"
                      value={callName}
                      onChange={(e) => setCallName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-black/40 border border-slate-600/30 rounded-lg p-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B58342]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1 block">Phone Number</label>
                    <input
                      type="tel"
                      value={callPhone}
                      onChange={(e) => setCallPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full bg-black/40 border border-slate-600/30 rounded-lg p-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[#B58342]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Preferred Date</label>
                      <input
                        type="date"
                        value={callDate}
                        onChange={(e) => setCallDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-black/40 border border-slate-600/30 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#B58342]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-1 block">Preferred Time (IST)</label>
                      <select
                        value={callTime}
                        onChange={(e) => setCallTime(e.target.value)}
                        className="w-full bg-black/40 border border-slate-600/30 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#B58342]"
                      >
                        <option value="">Select time</option>
                        <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
                        <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                        <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                        <option value="12:00-13:00">12:00 PM - 1:00 PM</option>
                        <option value="13:00-14:00">1:00 PM - 2:00 PM</option>
                        <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
                        <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
                        <option value="16:00-17:00">4:00 PM - 5:00 PM</option>
                        <option value="17:00-18:00">5:00 PM - 6:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleRequestCall}
                  disabled={!callName.trim() || !callPhone.trim() || !callDate || !callTime}
                  className="w-full mt-4 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white h-11 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request Call Back
                </Button>
                <p className="text-slate-500 text-xs mt-3">
                  Our tech team usually responds within 1 business day.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        {!submitted && (
          <div className="px-5 pb-5">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 text-xs leading-relaxed">
                <strong>Technical context is attached automatically.</strong> No need to explain your organization details or which page you're on—we can see that.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
