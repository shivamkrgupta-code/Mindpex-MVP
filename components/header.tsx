'use client'

import { Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-[#B58342]/30 px-6 py-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent">Retention Intelligence Platform</h1>
          <p className="text-xs text-slate-400 mt-0.5">Predictive workforce analytics & succession planning</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative">
            <Bell className="h-5 w-5 text-slate-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors border border-[#B58342]/30">
            <User className="h-5 w-5 text-[#B58342]" />
            <span className="text-sm font-medium text-white">Admin</span>
          </button>
        </div>
      </div>
    </header>
  )
}
