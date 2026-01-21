'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        // Fallback to localStorage if Supabase is not configured
        const authStatus = localStorage.getItem('isAuthenticated')
        if (authStatus === 'true') {
          setIsAuthenticated(true)
          setIsLoading(false)
        } else {
          router.push('/login')
        }
        return
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setIsAuthenticated(true)
        setIsLoading(false)
      } else {
        router.push('/login')
      }
    }

    checkAuth()

    // Listen for auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setIsAuthenticated(true)
          setIsLoading(false)
        } else {
          setIsAuthenticated(false)
          router.push('/login')
        }
      })

      return () => subscription.unsubscribe()
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B58342] mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
