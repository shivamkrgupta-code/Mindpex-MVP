'use client'

import { Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Talent Intelligence Platform</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <Bell className="h-5 w-5 text-gray-300" />
          </button>
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors">
            <User className="h-5 w-5 text-gray-300" />
            <span className="text-gray-300">User</span>
          </button>
        </div>
      </div>
    </header>
  )
}
