'use client'

import { useState } from 'react'
import { Bell, LogOut, X, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  // Initialize notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'New High-Risk Pattern Detected',
      message: '3 employees showing burnout signals in Sales department',
      time: '5 minutes ago',
      unread: true,
      link: '/today'
    },
    {
      id: 2,
      type: 'success',
      title: 'Intervention Completed',
      message: 'Manager completed intervention for Employee ID-1234',
      time: '2 hours ago',
      unread: true,
      link: '/today'
    },
    {
      id: 3,
      type: 'info',
      title: 'Weekly Insights Ready',
      message: 'Your weekly retention analytics report is available',
      time: '1 day ago',
      unread: false,
      link: '/insights'
    }
  ])

  const handleLogout = async () => {
    // Sign out from Supabase if configured
    if (supabase) {
      await supabase.auth.signOut()
    }

    // Clear localStorage for backward compatibility
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')

    // Set flag to skip splash animation and go directly to login
    sessionStorage.setItem('skipSplash', 'true')

    // Clear the second animation flag so it plays again on next login
    sessionStorage.removeItem('hasSeenIntro')

    // Redirect to home page (will show login directly)
    router.push('/')
  }

  const unreadCount = notifications.filter(n => n.unread).length

  const handleNotificationClick = (notificationId: number, link: string) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, unread: false } : n
      )
    )

    setShowNotifications(false)
    router.push(link)
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    )
  }

  return (
    <>
      <header className="bg-black/40 backdrop-blur-xl border-b border-[#B58342]/30 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 shadow-xl relative z-50">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="hidden xl:inline">Retention Intelligence Platform</span>
              <span className="xl:hidden">MindPex Platform</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 hidden sm:block">Predictive workforce analytics</p>
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-colors relative"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                </>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 sm:space-x-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-500/10 transition-colors border border-red-500/30"
              title="Logout"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
              <span className="text-xs sm:text-sm font-medium text-red-400 hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      {showNotifications && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />

          {/* Notification Dropdown */}
          <div className="fixed top-16 sm:top-20 right-4 sm:right-8 lg:right-10 w-[calc(100vw-2rem)] sm:w-96 bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#B58342]/30 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-semibold text-sm">Notifications</h3>
                <p className="text-slate-400 text-xs mt-0.5">{unreadCount} unread</p>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[70vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification.id, notification.link)}
                      className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          notification.type === 'alert' ? 'bg-red-500/10' :
                          notification.type === 'success' ? 'bg-green-500/10' :
                          'bg-blue-500/10'
                        }`}>
                          {notification.type === 'alert' && (
                            <AlertCircle className="h-4 w-4 text-red-400" />
                          )}
                          {notification.type === 'success' && (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          )}
                          {notification.type === 'info' && (
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-white text-sm font-medium leading-snug">
                              {notification.title}
                            </h4>
                            {notification.unread && (
                              <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-slate-500 text-[10px] mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={markAllAsRead}
                  className="w-full text-center text-[#B58342] hover:text-[#d4a05a] text-xs font-medium py-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
