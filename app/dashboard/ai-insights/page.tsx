'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AttritionInsights from '@/components/AttritionInsights'

export default function AIInsightsPage() {
  const [allEmployees, setAllEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEmployees() {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        let allEmployees: any[] = []
        let page = 0
        const pageSize = 1000
        let hasMore = true

        while (hasMore) {
          const { data: employees, error } = await supabase
            .from('employees')
            .select('*')
            .range(page * pageSize, (page + 1) * pageSize - 1)

          if (error) throw error

          if (employees && employees.length > 0) {
            allEmployees = [...allEmployees, ...employees]
            page++
            hasMore = employees.length === pageSize
          } else {
            hasMore = false
          }
        }

        setAllEmployees(allEmployees)
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
        <div className="text-white">Loading AI Insights...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-[#B58342]/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B58342] to-[#d4a05a] bg-clip-text text-transparent">AI-Powered Attrition Insights</h1>
        <p className="text-slate-300 mt-2">Predictive analytics and machine learning-driven workforce intelligence</p>
      </div>

      <AttritionInsights employees={allEmployees} />
    </div>
  )
}
