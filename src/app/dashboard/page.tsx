'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Building2, Users, FileText, CreditCard, Bell, ArrowUpRight, TrendingUp } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { api } from '@/lib/api'
import { formatMontant } from '@/lib/utils'
import type { DashboardStats } from '@/types/models'

const cards = [
  { key: 'totalProprietes', label: 'Propriétés',      icon: Building2,       color: '#3272f5', bg: 'rgba(50,114,245,0.1)',  href: '/proprietes' },
  { key: 'totalLocataires', label: 'Locataires',      icon: Users,           color: '#10b981', bg: 'rgba(16,185,129,0.1)', href: '/locataires' },
  { key: 'bauxActifs',      label: 'Baux actifs',     icon: FileText,         color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', href: '/baux' },
  { key: 'alertesNonLues', label: 'Alertes non lues', icon: Bell,            color: '#ef4444', bg: 'rgba(239,68,68,0.1)',  href: '/alertes' },
]

const quickActions = [
  { href: '/proprietes', icon: Building2, label: 'Nouvelle propriété',   color: '#3272f5' },
  { href: '/locataires', icon: Users,     label: 'Nouveau locataire',    color: '#10b981' },
  { href: '/baux',       icon: FileText,  label: 'Nouveau bail',         color: '#8b5cf6' },
  { href: '/paiements',  icon: CreditCard,label: 'Enregistrer paiement', color: '#f59e0b' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<DashboardStats>('/dashboard/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function getVal(key: string): string {
    if (!stats) return '—'
    const v = (stats as any)[key]
    return key === 'totalLoyersPercus' ? formatMontant(v) : v?.toString() ?? '0'
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{color: 'var(--text-primary)'}}>Tableau de bord</h1>
          <p className="text-sm mt-1" style={{color: 'var(--text-muted)'}}>Vue d'ensemble de votre portefeuille immobilier</p>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="stat-card animate-pulse">
                <div className="h-8 w-8 rounded-lg mb-4" style={{background:'var(--bg-tertiary)'}}/>
                <div className="h-3 w-20 rounded mb-2" style={{background:'var(--bg-tertiary)'}}/>
                <div className="h-7 w-12 rounded" style={{background:'var(--bg-tertiary)'}}/>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(c => (
              <Link key={c.key} href={c.href} className="stat-card block group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background: c.bg}}>
                    <c.icon size={18} style={{color: c.color}}/>
                  </div>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{color: 'var(--text-muted)'}}/>
                </div>
                <div className="text-2xl font-extrabold mb-1" style={{color: 'var(--text-primary)'}}>{getVal(c.key)}</div>
                <div className="text-xs font-medium" style={{color: 'var(--text-muted)'}}>{c.label}</div>
              </Link>
            ))}
          </div>
        )}

        {/* Revenue card */}
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #1340d8, #3272f5, #8b5cf6)'}}>
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)'}}/>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70 mb-1 font-medium">Total loyers perçus</p>
              <p className="text-4xl font-extrabold text-white tracking-tight">
                {loading ? '…' : formatMontant(stats?.totalLoyersPercus ?? 0)}
              </p>
              <p className="text-white/50 text-xs mt-2">Tous baux confondus</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              <TrendingUp size={24} className="text-white"/>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{color: 'var(--text-muted)'}}>Actions rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map(a => (
              <Link key={a.href} href={a.href}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all hover:-translate-y-0.5 hover:shadow-md group"
                style={{background: 'var(--bg-card)', borderColor: 'var(--border)'}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{background: a.color + '15'}}>
                  <a.icon size={18} style={{color: a.color}}/>
                </div>
                <span className="text-xs font-semibold" style={{color: 'var(--text-secondary)'}}>{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
