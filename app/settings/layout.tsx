import Sidebar from '@/components/sidebar'
import Header from '@/components/header'
import AuthGuard from '@/components/AuthGuard'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#000000] via-[#1a1a1a] to-[#2a2a2a]">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
