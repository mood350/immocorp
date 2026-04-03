'use client'
import { useEffect, useState } from 'react'
import { Bell, CheckCheck, AlertTriangle, Clock, XCircle, Info } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Alerte } from '@/types/models'

const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  RETARD_PAIEMENT: { label: 'Retard paiement', icon: XCircle,        color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  FIN_BAIL_PROCHE: { label: 'Fin de bail',     icon: Clock,          color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  LOYER_IMPAYE:    { label: 'Loyer impayé',    icon: AlertTriangle,  color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ECHEANCE_BAIL:   { label: 'Échéance bail',   icon: Info,           color: '#3272f5', bg: 'rgba(50,114,245,0.1)' },
}

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const load = () => {
    setLoading(true)
    api.get<Alerte[]>('/alertes').then(r => setAlertes(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  async function markRead(id: number) {
    await api.put(`/alertes/${id}/lire`)
    setAlertes(a => a.map(x => x.id === id ? {...x, estLue: true} : x))
  }

  async function markAllRead() {
    await api.put('/alertes/lire-tout').catch(()=>{})
    setAlertes(a => a.map(x => ({...x, estLue: true})))
  }

  const nonLues = alertes.filter(a => !a.estLue).length
  const filtered = filter === 'unread' ? alertes.filter(a => !a.estLue) : alertes

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{color:'var(--text-primary)'}}>Alertes</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>{nonLues} alerte(s) non lue(s)</p>
          </div>
          {nonLues > 0 && (
            <button onClick={markAllRead} className="btn-secondary text-sm flex items-center gap-2">
              <CheckCheck size={14}/> Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{background:'var(--bg-tertiary)'}}>
          {([['all', 'Toutes'], ['unread', 'Non lues']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === val
                  ? 'bg-white dark:bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}>
              {label} {val === 'unread' && nonLues > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-brand-600 text-white text-xs font-bold">{nonLues}</span>
              )}
            </button>
          ))}
        </div>

        {/* Alertes list */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center card">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{background:'var(--bg-tertiary)'}}>
              <Bell size={24} style={{color:'var(--text-muted)'}}/>
            </div>
            <p className="font-semibold mb-1" style={{color:'var(--text-primary)'}}>Aucune alerte</p>
            <p className="text-sm" style={{color:'var(--text-muted)'}}>Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(a => {
              const cfg = typeConfig[a.type] || { label: a.type, icon: Bell, color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
              const Icon = cfg.icon
              return (
                <div key={a.id}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    a.estLue
                      ? 'opacity-60'
                      : 'border-l-2'
                  }`}
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: a.estLue ? 'var(--border)' : cfg.color,
                    borderLeftColor: a.estLue ? 'var(--border)' : cfg.color,
                  }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: cfg.bg}}>
                    <Icon size={16} style={{color: cfg.color}}/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold" style={{color: cfg.color}}>{cfg.label}</span>
                      {!a.estLue && <span className="w-1.5 h-1.5 rounded-full bg-brand-500"/>}
                    </div>
                    <p className="text-sm font-medium" style={{color:'var(--text-primary)'}}>{a.message}</p>
                    <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>{formatDate(a.dateAlerte)}</p>
                  </div>
                  {!a.estLue && (
                    <button onClick={() => markRead(a.id!)}
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-500 transition-all"
                      title="Marquer comme lu">
                      <CheckCheck size={14}/>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
