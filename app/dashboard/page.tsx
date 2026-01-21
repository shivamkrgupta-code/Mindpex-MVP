'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to /today (legacy /dashboard support)
    router.replace('/today')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B58342] mx-auto mb-4"></div>
        <p className="text-slate-300">Redirecting to Today...</p>
      </div>
    </div>
  )
}
