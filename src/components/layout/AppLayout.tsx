'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, FileText,
  CreditCard, Bell, Shield, LogOut, Menu, X, ChevronRight
} from 'lucide-react'
import { getUser, clearSession, isLoggedIn } from '@/lib/auth'
import ThemeToggle from '@/components/ui/ThemeToggle'

const navItems = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Tableau de bord' },
  { href: '/proprietes', icon: Building2,        label: 'Propriétés' },
  { href: '/locataires', icon: Users,            label: 'Locataires' },
  { href: '/baux',       icon: FileText,          label: 'Baux' },
  { href: '/paiements',  icon: CreditCard,        label: 'Paiements' },
  { href: '/alertes',    icon: Bell,              label: 'Alertes' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = getUser()

  useEffect(() => {
    if (!isLoggedIn()) router.push('/login')
  }, [router])

  function logout() {
    clearSession()
    router.push('/login')
  }

  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="flex h-screen overflow-hidden page-wrapper">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col sidebar transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{borderColor: 'var(--border)'}}>
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-md shadow-brand-600/30">
              <Building2 size={15} className="text-white"/>
            </div>
            <span className="font-bold text-[15px] tracking-tight" style={{color: 'var(--text-primary)'}}>ImmoCorp</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost p-1.5">
            <X size={16}/>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-0.5">
            {navItems.map(item => {
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                    active
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                  }`}>
                  <item.icon size={16} className={active ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}/>
                  {item.label}
                  {active && <ChevronRight size={14} className="ml-auto opacity-70"/>}
                </Link>
              )
            })}
          </div>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t" style={{borderColor: 'var(--border)'}}>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider" style={{color: 'var(--text-muted)'}}>Administration</p>
              <Link href="/admin" onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  pathname === '/admin'
                    ? 'bg-brand-600 text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}>
                <Shield size={16}/>
                Administration
              </Link>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t" style={{borderColor: 'var(--border)'}}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{background: 'var(--bg-tertiary)'}}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {user?.nom?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{color: 'var(--text-primary)'}}>{user?.prenom} {user?.nom}</div>
              <div className="text-xs truncate" style={{color: 'var(--text-muted)'}}>{user?.email}</div>
            </div>
            <button onClick={logout} title="Déconnexion"
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all">
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0" style={{background: 'var(--bg-card)', borderColor: 'var(--border)'}}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost p-1.5">
            <Menu size={18}/>
          </button>
          <div className="lg:hidden"/>
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle/>
            <Link href="/alertes" className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all">
              <Bell size={16}/>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
