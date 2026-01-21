'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  CreditCard,
  Shield,
  Headphones
} from 'lucide-react'
import SupportDrawer from './SupportDrawer'

interface NavItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
}

const navigation: NavItem[] = [
  {
    name: 'Today',
    href: '/today',
    icon: Calendar,
    description: 'Action Hub - Immediate tasks and urgent items'
  },
  {
    name: 'Insights',
    href: '/insights',
    icon: BarChart3,
    description: 'Aggregated cohort-level patterns'
  },
  {
    name: 'Billing',
    href: '/billing',
    icon: CreditCard,
    description: 'Plan · Invoices · Payment'
  },
  {
    name: 'Access & Security',
    href: '/access',
    icon: Shield,
    description: 'User roles · Compliance · Audit'
  },
]

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isSupportDrawerOpen, setIsSupportDrawerOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileOpen) {
      const handleClickOutside = () => setMobileOpen(false)
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile Menu Button - Fixed */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setMobileOpen(!mobileOpen)
        }}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-[#B58342] text-white shadow-lg hover:bg-[#d4a05a] transition-colors"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
      )}

      {/* Sidebar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-gradient-to-b from-[#000000] to-[#1a1a1a]
          flex flex-col h-screen border-r-2 border-[#B58342]/20
          transition-all duration-300
          w-64

          /* Mobile: Fixed, slide in from left */
          lg:relative fixed inset-y-0 left-0 z-40
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b-2 border-[#B58342]/20">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Mindpex</h1>
          <p className="text-xs text-[#B58342] mt-0.5">Intelligence Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 sm:py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-500/10 text-white border-l-2 border-blue-400'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings & Support at Bottom */}
      <div className="p-3 sm:p-4 border-t-2 border-[#B58342]/20 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center space-x-3 px-3 py-2.5 sm:py-2 rounded-lg transition-all ${
            pathname === '/settings'
              ? 'bg-blue-500/10 text-white border-l-2 border-blue-400'
              : 'text-slate-300 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Settings</span>
        </Link>

        <button
          onClick={() => setIsSupportDrawerOpen(true)}
          className="w-full flex items-center space-x-3 px-3 py-2.5 sm:py-2 rounded-lg transition-all text-slate-300 hover:bg-white/10 hover:text-white"
        >
          <Headphones className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Support & Help</span>
        </button>
      </div>

    </div>

    {/* Support Drawer */}
    <SupportDrawer
      isOpen={isSupportDrawerOpen}
      onClose={() => setIsSupportDrawerOpen(false)}
      context={{
        page: pathname,
        orgId: 'demo-org-001',
        userId: 'demo-user-001'
      }}
    />
    </>
  )
}
