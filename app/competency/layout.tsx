import Sidebar from '@/components/sidebar'
import Header from '@/components/header'

export default function CompetencyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#0a0b0f]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0b0f]">
          {children}
        </main>
      </div>
    </div>
  )
}
