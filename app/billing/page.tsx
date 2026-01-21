'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Calendar, Headphones } from 'lucide-react'
import Link from 'next/link'
import SupportDrawer from '@/components/SupportDrawer'

const subscriptionPlans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    period: 'per month',
    description: 'Perfect for small teams getting started',
    features: [
      'Up to 50 employees',
      'Basic analytics dashboard',
      'Email support',
      'Monthly reports',
      '1 GB data storage'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$149',
    period: 'per month',
    description: 'For growing organizations',
    features: [
      'Up to 250 employees',
      'Advanced predictive analytics',
      'Priority email & chat support',
      'Weekly reports',
      'Custom integrations',
      '10 GB data storage',
      'API access'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact sales',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited employees',
      'Full retention intelligence suite',
      '24/7 dedicated support',
      'Real-time alerts',
      'Custom AI model training',
      'Unlimited data storage',
      'White-label options',
      'SLA guarantee'
    ]
  }
]

export default function BillingPage() {
  const [currentPlan] = useState('professional')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly' | 'half-yearly' | 'yearly'>('monthly')
  const [activeEmployees] = useState(247)
  const pepmRate = 75 // ₹75 per employee per month
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false)

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] min-h-screen overflow-y-auto">
      {/* Header with Support Link */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Billing & Subscription</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>
        <button
          onClick={() => setIsSupportDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-white/10 hover:border-slate-500 transition-all text-xs sm:text-sm whitespace-nowrap"
        >
          <Headphones className="h-4 w-4" />
          <span className="hidden sm:inline">Need help?</span>
        </button>
      </div>

      {/* Billing Agreement - Primary Section */}
      <Card className="bg-white/5 backdrop-blur-xl border-[3px] border-[#B58342] shadow-2xl">
        <CardHeader className="border-b border-[#B58342]/20 pb-5 sm:pb-6 p-5 sm:p-7">
          <CardTitle className="text-white text-2xl sm:text-4xl flex items-center gap-3">
            <CreditCard className="h-7 w-7 sm:h-10 sm:w-10 text-[#B58342]" />
            Billing Agreement
          </CardTitle>
          <CardDescription className="text-slate-400 mt-2 sm:mt-3 text-sm sm:text-base">
            Active subscription managed through Zoho Subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-7 pb-7 sm:pt-9 sm:pb-9 p-5 sm:p-7">
          {/* PEPM Rate - Dominant */}
          <div className="mb-8">
            <p className="text-slate-400 text-sm mb-2">Price per employee</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-bold text-[#B58342]">₹75</span>
              <span className="text-slate-400 text-lg sm:text-xl">/ employee / month</span>
            </div>
          </div>

          {/* Grid of Billing Details */}
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-slate-400 text-sm mb-2">Active employees (billed count)</p>
              <p className="text-3xl sm:text-4xl font-bold text-white">{activeEmployees}</p>
              <p className="text-slate-500 text-xs mt-1">As of Jan 9, 2026</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Billing frequency</p>
              <p className="text-3xl sm:text-4xl font-bold text-white capitalize">{billingCycle}</p>
              <p className="text-slate-500 text-xs mt-1">Can be adjusted below</p>
            </div>
          </div>

          {/* Next Billing Info */}
          <div className="bg-black/40 rounded-lg p-5 border border-[#B58342]/30 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Next billing date</p>
                <p className="text-xl sm:text-2xl font-bold text-white">Feb 9, 2026</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-slate-400 text-sm mb-1">Estimated next invoice</p>
                <p className="text-3xl sm:text-4xl font-bold text-[#B58342]">₹{(activeEmployees * pepmRate).toLocaleString()}</p>
                <p className="text-slate-500 text-xs mt-1">{activeEmployees} employees × ₹{pepmRate}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button className="w-full sm:w-auto bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white h-11 px-6 text-base">
            Request billing adjustment
          </Button>
        </CardContent>
      </Card>

      {/* Billing Frequency Control */}
      <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
        <CardHeader className="border-b border-[#B58342]/20 py-4 px-5 sm:px-6">
          <CardTitle className="text-white text-lg sm:text-xl">Billing Frequency</CardTitle>
          <CardDescription className="text-slate-400 text-xs sm:text-sm">
            Change how often you're billed. Changes apply from next billing cycle.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 pb-5 px-5 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                billingCycle === 'monthly'
                  ? 'bg-[#B58342] border-[#B58342] text-white shadow-lg'
                  : 'bg-black/40 border-slate-600/30 text-slate-400 hover:border-slate-500'
              }`}
            >
              <p className="text-sm sm:text-base font-bold">Monthly</p>
              <p className="text-xs mt-1 opacity-80">Standard</p>
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                billingCycle === 'quarterly'
                  ? 'bg-[#B58342] border-[#B58342] text-white shadow-lg'
                  : 'bg-black/40 border-slate-600/30 text-slate-400 hover:border-slate-500'
              }`}
            >
              <p className="text-sm sm:text-base font-bold">Quarterly</p>
              <p className="text-xs mt-1 opacity-80">Every 3 months</p>
            </button>
            <button
              onClick={() => setBillingCycle('half-yearly')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                billingCycle === 'half-yearly'
                  ? 'bg-[#B58342] border-[#B58342] text-white shadow-lg'
                  : 'bg-black/40 border-slate-600/30 text-slate-400 hover:border-slate-500'
              }`}
            >
              <p className="text-sm sm:text-base font-bold">Half-Yearly</p>
              <p className="text-xs mt-1 opacity-80">Every 6 months</p>
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-3 rounded-lg font-semibold transition-all border-2 ${
                billingCycle === 'yearly'
                  ? 'bg-[#B58342] border-[#B58342] text-white shadow-lg'
                  : 'bg-black/40 border-slate-600/30 text-slate-400 hover:border-slate-500'
              }`}
            >
              <p className="text-sm sm:text-base font-bold">Yearly</p>
              <p className="text-xs mt-1 opacity-80">Every 12 months</p>
            </button>
          </div>

          {/* Preview of changes */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-300 text-sm font-semibold mb-2">Preview: {billingCycle.charAt(0).toUpperCase() + billingCycle.slice(1)} billing</p>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-slate-300">Invoice amount</span>
              <span className="text-white font-bold">
                ₹{(activeEmployees * pepmRate * (billingCycle === 'monthly' ? 1 : billingCycle === 'quarterly' ? 3 : billingCycle === 'half-yearly' ? 6 : 12)).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm mt-2">
              <span className="text-slate-300">Billed every</span>
              <span className="text-white font-semibold">
                {billingCycle === 'monthly' ? '1 month' : billingCycle === 'quarterly' ? '3 months' : billingCycle === 'half-yearly' ? '6 months' : '12 months'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Count & MRR Visibility */}
      <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
        <CardHeader className="border-b border-[#B58342]/20 py-4 px-5 sm:px-6">
          <CardTitle className="text-white text-lg sm:text-xl">Billing Basis</CardTitle>
          <CardDescription className="text-slate-400 text-xs sm:text-sm">
            Your monthly recurring revenue is calculated based on active employee count
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 pb-5 px-5 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-5">
            {/* Billable Employee Count */}
            <div className="bg-black/40 rounded-lg p-5 border border-slate-600/30">
              <p className="text-slate-400 text-xs mb-2">Billable employees</p>
              <p className="text-4xl font-bold text-white mb-1">{activeEmployees}</p>
              <p className="text-slate-500 text-xs">Active as of Jan 9, 2026</p>
            </div>

            {/* PEPM Rate */}
            <div className="bg-black/40 rounded-lg p-5 border border-slate-600/30">
              <p className="text-slate-400 text-xs mb-2">Rate per employee</p>
              <p className="text-4xl font-bold text-[#B58342] mb-1">₹{pepmRate}</p>
              <p className="text-slate-500 text-xs">Per employee / month</p>
            </div>

            {/* Calculated MRR */}
            <div className="bg-gradient-to-br from-[#B58342]/10 to-[#B58342]/5 rounded-lg p-5 border-2 border-[#B58342]/40">
              <p className="text-slate-400 text-xs mb-2">Monthly Recurring Revenue</p>
              <p className="text-4xl font-bold text-[#B58342] mb-1">₹{(activeEmployees * pepmRate).toLocaleString()}</p>
              <p className="text-slate-400 text-xs">{activeEmployees} × ₹{pepmRate}</p>
            </div>
          </div>

          {/* Last Billing Cycle Info */}
          <div className="mt-5 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-sm font-semibold mb-1">Last billing cycle</p>
                <p className="text-slate-300 text-xs">
                  Billed {activeEmployees} employees on Jan 9, 2026 for ₹{(activeEmployees * pepmRate).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods - Primary & Backup */}
      <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
        <CardHeader className="border-b border-[#B58342]/20 py-4 px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white text-lg sm:text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#B58342]" />
                Payment Methods
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs sm:text-sm mt-1">
                Primary method is charged automatically. Backup is used if primary fails.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="border-[#B58342] text-[#B58342] hover:bg-[#B58342]/10 w-full sm:w-auto text-sm h-10"
            >
              Add payment method
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-5 pb-5 px-5 sm:px-6 space-y-4">
          {/* Primary Payment Method */}
          <div className="bg-gradient-to-br from-[#B58342]/10 to-[#B58342]/5 border-2 border-[#B58342]/40 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-[#B58342] text-white text-xs font-bold px-2 py-1 rounded">PRIMARY</span>
              </div>
              <button className="text-slate-400 hover:text-white text-xs">Edit</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-9 bg-gradient-to-r from-slate-600 to-slate-700 rounded flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm sm:text-base">Visa •••• 1499</p>
                <p className="text-slate-400 text-xs">Expires 12/2025</p>
              </div>
              <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
            </div>
          </div>

          {/* Backup Payment Method */}
          <div className="bg-black/40 border border-slate-600/30 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-slate-600 text-slate-300 text-xs font-bold px-2 py-1 rounded">BACKUP</span>
              </div>
              <button className="text-slate-400 hover:text-white text-xs">Edit</button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-9 bg-gradient-to-r from-slate-600 to-slate-700 rounded flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-slate-300" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm sm:text-base">Mastercard •••• 8832</p>
                <p className="text-slate-400 text-xs">Expires 08/2026</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Terms - Enterprise Only (Read-only) */}
      <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
        <CardHeader className="border-b border-[#B58342]/20 py-4 px-5 sm:px-6">
          <CardTitle className="text-white text-lg sm:text-xl">Payment Terms</CardTitle>
          <CardDescription className="text-slate-400 text-xs sm:text-sm">
            Enterprise billing agreement terms (view only)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 pb-5 px-5 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Payment Method Type */}
            <div>
              <p className="text-slate-400 text-xs mb-2">Payment method</p>
              <p className="text-white font-semibold text-base">Invoice-based</p>
              <p className="text-slate-500 text-xs mt-1">Manual invoice processing</p>
            </div>

            {/* Payment Terms */}
            <div>
              <p className="text-slate-400 text-xs mb-2">Payment terms</p>
              <p className="text-white font-semibold text-base">Net 30</p>
              <p className="text-slate-500 text-xs mt-1">Payment due 30 days after invoice</p>
            </div>

            {/* Billing Contact */}
            <div>
              <p className="text-slate-400 text-xs mb-2">Billing contact</p>
              <p className="text-white font-semibold text-base">finance@company.com</p>
              <p className="text-slate-500 text-xs mt-1">Primary billing email</p>
            </div>

            {/* Account Manager */}
            <div>
              <p className="text-slate-400 text-xs mb-2">Account manager</p>
              <p className="text-white font-semibold text-base">Priya Sharma</p>
              <p className="text-slate-500 text-xs mt-1">priya.sharma@mindpex.com</p>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-5 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-300 text-xs">
              To modify payment terms or billing contact, please reach out to your account manager or email billing@mindpex.com
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Invoices - With Filters */}
      <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
        <CardHeader className="border-b border-[#B58342]/20 py-4 px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-white text-lg sm:text-xl">Invoices</CardTitle>
              <button
                onClick={() => setIsSupportDrawerOpen(true)}
                className="text-slate-400 hover:text-[#B58342] text-xs mt-1 flex items-center gap-1"
              >
                <Headphones className="h-3 w-3" />
                Need help with an invoice?
              </button>
            </div>
            <Button
              variant="outline"
              className="border-[#B58342] text-[#B58342] hover:bg-[#B58342]/10 w-full sm:w-auto text-sm h-10"
            >
              Download all invoices
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-5 pb-5 px-5 sm:px-6">
          {/* Date Range Filter */}
          <div className="mb-5 flex flex-col sm:flex-row gap-3">
            <select className="bg-black/40 border border-slate-600/30 rounded-lg px-4 py-2 text-white text-sm flex-1 sm:flex-none focus:outline-none focus:border-[#B58342]">
              <option>Last 3 months</option>
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>All time</option>
            </select>
            <select className="bg-black/40 border border-slate-600/30 rounded-lg px-4 py-2 text-white text-sm flex-1 sm:flex-none focus:outline-none focus:border-[#B58342]">
              <option>All statuses</option>
              <option>Paid</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
          </div>

          {/* Invoices Table */}
          <div className="overflow-x-auto -mx-5 sm:mx-0">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-[#B58342]/20">
                  <th className="text-left text-slate-400 font-semibold pb-3 text-xs sm:text-sm px-5 sm:px-0">Invoice Date</th>
                  <th className="text-left text-slate-400 font-semibold pb-3 text-xs sm:text-sm px-5 sm:px-0">Amount</th>
                  <th className="text-left text-slate-400 font-semibold pb-3 text-xs sm:text-sm px-5 sm:px-0">Employees</th>
                  <th className="text-left text-slate-400 font-semibold pb-3 text-xs sm:text-sm px-5 sm:px-0">Status</th>
                  <th className="text-left text-slate-400 font-semibold pb-3 text-xs sm:text-sm px-5 sm:px-0">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B58342]/10">
                <tr>
                  <td className="py-3 text-slate-300 text-xs sm:text-sm px-5 sm:px-0">Jan 9, 2026</td>
                  <td className="py-3 text-white font-semibold text-xs sm:text-sm px-5 sm:px-0">₹18,525</td>
                  <td className="py-3 text-slate-400 text-xs sm:text-sm px-5 sm:px-0">247</td>
                  <td className="py-3 px-5 sm:px-0">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">Paid</span>
                  </td>
                  <td className="py-3 px-5 sm:px-0">
                    <button className="text-[#B58342] text-xs hover:underline font-semibold">
                      Download PDF
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-300 text-xs sm:text-sm px-5 sm:px-0">Dec 9, 2025</td>
                  <td className="py-3 text-white font-semibold text-xs sm:text-sm px-5 sm:px-0">₹18,300</td>
                  <td className="py-3 text-slate-400 text-xs sm:text-sm px-5 sm:px-0">244</td>
                  <td className="py-3 px-5 sm:px-0">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">Paid</span>
                  </td>
                  <td className="py-3 px-5 sm:px-0">
                    <button className="text-[#B58342] text-xs hover:underline font-semibold">
                      Download PDF
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-slate-300 text-xs sm:text-sm px-5 sm:px-0">Nov 9, 2025</td>
                  <td className="py-3 text-white font-semibold text-xs sm:text-sm px-5 sm:px-0">₹17,925</td>
                  <td className="py-3 text-slate-400 text-xs sm:text-sm px-5 sm:px-0">239</td>
                  <td className="py-3 px-5 sm:px-0">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold">Paid</span>
                  </td>
                  <td className="py-3 px-5 sm:px-0">
                    <button className="text-[#B58342] text-xs hover:underline font-semibold">
                      Download PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Billing Support - Relationship Continuity */}
      <Card className="bg-white/5 backdrop-blur-xl border border-slate-600/20 shadow-xl">
        <CardContent className="pt-5 pb-5 px-5 sm:px-6">
          <p className="text-slate-400 text-sm mb-4">Need help with your billing?</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 px-4 py-2 bg-black/40 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-white/5 hover:border-slate-500 transition-all text-sm">
              Pause billing temporarily
            </button>
            <button className="flex-1 px-4 py-2 bg-black/40 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-white/5 hover:border-slate-500 transition-all text-sm">
              Request billing review
            </button>
            <button className="flex-1 px-4 py-2 bg-black/40 border border-slate-600/30 rounded-lg text-slate-300 hover:bg-white/5 hover:border-slate-500 transition-all text-sm">
              Contact billing support
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Support Drawer */}
      <SupportDrawer
        isOpen={isSupportDrawerOpen}
        onClose={() => setIsSupportDrawerOpen(false)}
        context={{
          page: 'Billing & Subscription',
          section: 'Invoices',
          orgId: 'demo-org-001',
          userId: 'demo-user-001'
        }}
      />
    </div>
  )
}
