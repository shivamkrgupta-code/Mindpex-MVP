'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!supabase) {
        setError('Authentication service is not configured')
        setLoading(false)
        return
      }

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.session) {
        // Store session info in localStorage for backward compatibility
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', formData.email)

        // Redirect to dashboard
        router.push('/today')
      } else {
        setError('Failed to create session')
        setLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      {/* Header */}
      <nav className="bg-[#000000]/90 backdrop-blur-xl border-b border-[#B58342]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#B58342]" />
            <div className="text-xl sm:text-2xl font-bold text-white">Mindpex</div>
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
        <Card className="max-w-md w-full bg-white/5 backdrop-blur-xl border-2 border-[#B58342]/30 shadow-2xl">
          <CardHeader className="border-b border-[#B58342]/20 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#B58342] to-[#d4a05a] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <CardTitle className="text-white text-2xl sm:text-3xl">Admin Login</CardTitle>
            <CardDescription className="text-slate-400 text-sm sm:text-base mt-2">
              Sign in to access the Retention Intelligence Dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 sm:pt-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                    placeholder="admin@mindpex.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 text-base bg-black/40 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-[#B58342] focus:outline-none focus:ring-2 focus:ring-[#B58342]/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Authentication Info */}
              <div className="bg-[#B58342]/10 border border-[#B58342]/30 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-300">
                  <span className="font-semibold text-[#B58342]">Secure Authentication:</span>
                  <br />
                  Sign in with your registered HR credentials to access the Retention Intelligence Dashboard.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-base font-semibold bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Footer Links */}
              <div className="text-center pt-4 border-t border-slate-600/30">
                <p className="text-sm text-slate-400">
                  Need help accessing your account? Contact your administrator.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
