'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Users, Lock, FileText, CheckCircle } from 'lucide-react'

export default function AccessSecurityPage() {
  return (
    <div className="flex-1 p-6 space-y-6 bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a] min-h-screen overflow-y-auto">
      {/* Header - No Card */}
      <div>
        <h1 className="text-3xl font-bold text-white">Access & Security</h1>
        <p className="text-slate-300 text-sm mt-2">Manage user roles, permissions, compliance, and audit logs</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Access & Roles */}
        <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
          <CardHeader className="border-b border-[#B58342]/20 pb-4">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-slate-400" />
              <div>
                <CardTitle className="text-white text-lg">User Access & Roles</CardTitle>
                <CardDescription className="text-slate-400 text-sm mt-1">Manage team permissions and access levels</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-medium text-base truncate">Admin User</p>
                  <p className="text-sm text-slate-400 truncate">admin@company.com</p>
                </div>
                <span className="text-[#B58342] text-sm font-semibold">ADMIN</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-medium text-base truncate">Manager User</p>
                  <p className="text-sm text-slate-400 truncate">manager@company.com</p>
                </div>
                <span className="text-blue-300 text-sm font-semibold">MANAGER</span>
              </div>
            </div>
            <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-medium text-base truncate">Viewer User</p>
                  <p className="text-sm text-slate-400 truncate">viewer@company.com</p>
                </div>
                <span className="text-slate-300 text-sm font-semibold">VIEWER</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-[#B58342] to-[#d4a05a] hover:from-[#d4a05a] hover:to-[#B58342] text-white">
              + Invite New User
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl">
          <CardHeader className="border-b border-[#B58342]/20 pb-4">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-slate-400" />
              <div>
                <CardTitle className="text-white text-lg">Security Settings</CardTitle>
                <CardDescription className="text-slate-400 text-sm mt-1">Authentication and data protection</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between py-3 px-4 bg-black/40 rounded-lg border border-slate-600/30">
              <div>
                <p className="text-white font-medium text-base">Two-Factor Authentication</p>
                <p className="text-sm text-slate-400 mt-1">Enhanced security for all users</p>
              </div>
              <span className="text-green-300 text-sm font-semibold">ENABLED</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-black/40 rounded-lg border border-slate-600/30">
              <div>
                <p className="text-white font-medium text-base">Data Encryption</p>
                <p className="text-sm text-slate-400 mt-1">End-to-end encryption</p>
              </div>
              <span className="text-green-300 text-sm font-semibold">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-black/40 rounded-lg border border-slate-600/30">
              <div>
                <p className="text-white font-medium text-base">Session Management</p>
                <p className="text-sm text-slate-400 mt-1">Auto-logout after 30 minutes</p>
              </div>
              <span className="text-green-300 text-sm font-semibold">ACTIVE</span>
            </div>
          </CardContent>
        </Card>

        {/* Compliance & Audit */}
        <Card className="bg-white/5 backdrop-blur-xl border border-[#B58342]/20 shadow-xl lg:col-span-2">
          <CardHeader className="border-b border-[#B58342]/20 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-slate-400" />
                <div>
                  <CardTitle className="text-white text-lg">Compliance & Audit Logs</CardTitle>
                  <CardDescription className="text-slate-400 text-sm mt-1">Track all system actions and maintain compliance</CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-[#B58342] text-[#B58342] hover:bg-[#B58342]/10"
              >
                Export Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
                <Shield className="h-8 w-8 mb-3 text-green-400" />
                <p className="text-2xl font-bold text-white mb-1">100%</p>
                <p className="text-slate-400 text-sm">Compliance Rate</p>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
                <FileText className="h-8 w-8 mb-3 text-blue-400" />
                <p className="text-2xl font-bold text-white mb-1">1,247</p>
                <p className="text-slate-400 text-sm">Audit Events (30d)</p>
              </div>
              <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
                <CheckCircle className="h-8 w-8 mb-3 text-purple-400" />
                <p className="text-2xl font-bold text-white mb-1">SOC 2</p>
                <p className="text-slate-400 text-sm">Type II Certified</p>
              </div>
            </div>

            {/* Recent Audit Entries */}
            <div className="bg-black/40 rounded-lg p-4 border border-slate-600/30">
              <h4 className="text-white font-semibold mb-4 text-base">Recent Audit Events</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-600/20">
                  <div>
                    <p className="text-white text-sm">User login</p>
                    <p className="text-slate-400 text-xs mt-1">admin@company.com · 192.168.1.1</p>
                  </div>
                  <span className="text-slate-400 text-xs">2 min ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-600/20">
                  <div>
                    <p className="text-white text-sm">Data export</p>
                    <p className="text-slate-400 text-xs mt-1">manager@company.com · employees.csv</p>
                  </div>
                  <span className="text-slate-400 text-xs">1 hour ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-600/20">
                  <div>
                    <p className="text-white text-sm">Permission change</p>
                    <p className="text-slate-400 text-xs mt-1">admin@company.com · viewer@company.com promoted</p>
                  </div>
                  <span className="text-slate-400 text-xs">3 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-white text-sm">Security scan completed</p>
                    <p className="text-slate-400 text-xs mt-1">System · No vulnerabilities found</p>
                  </div>
                  <span className="text-slate-400 text-xs">12 hours ago</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 border-slate-600 text-slate-300 hover:bg-white/10"
            >
              View Full Audit Log
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
