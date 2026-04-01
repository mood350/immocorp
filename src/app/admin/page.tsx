'use client'
import { useEffect, useState } from 'react'
import { Shield, Users, CheckCircle, XCircle, Trash2, Search } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import { api } from '@/lib/api'
import type { Utilisateur } from '@/types/models'

export default function AdminPage() {
  const [users, setUsers] = useState<Utilisateur[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api.get<Utilisateur[]>('/admin/utilisateurs').then(r => setUsers(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  async function toggleActif(id: number, actif: boolean) {
    await api.put(`/admin/utilisateurs/${id}/statut`, { actif: !actif }).catch(()=>{})
    setUsers(u => u.map(x => x.id === id ? {...x, actif: !actif} : x))
  }

  async function remove(id: number) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    await api.delete(`/admin/utilisateurs/${id}`); load()
  }

  const filtered = users.filter(u =>
    `${u.prenom} ${u.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center">
            <Shield size={18} className="text-violet-600 dark:text-violet-400"/>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{color:'var(--text-primary)'}}>Administration</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>Gestion des utilisateurs de la plateforme</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total utilisateurs', value: users.length, icon: Users, color: '#3272f5' },
            { label: 'Comptes actifs',     value: users.filter(u=>u.actif).length, icon: CheckCircle, color: '#10b981' },
            { label: 'Comptes inactifs',   value: users.filter(u=>!u.actif).length, icon: XCircle, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="text-2xl font-extrabold mb-1" style={{color:'var(--text-primary)'}}>{s.value}</div>
              <div className="text-xs font-medium" style={{color:'var(--text-muted)'}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:'var(--text-muted)'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un utilisateur…" className="form-input pl-10"/>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"/>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Utilisateur</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-brand-500 flex items-center justify-center text-white text-xs font-bold">
                            {u.prenom?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium" style={{color:'var(--text-primary)'}}>{u.prenom} {u.nom}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.telephone}</td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${u.role === 'ADMIN' ? 'badge-blue' : 'badge-gray'}`}>
                          {u.role === 'ADMIN' ? 'Admin' : 'Propriétaire'}
                        </span>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${u.actif ? 'badge-green' : 'badge-red'}`}>
                          {u.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={()=>toggleActif(u.id, u.actif)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-all"
                            style={{color: u.actif ? '#ef4444' : '#10b981'}}
                            title={u.actif ? 'Désactiver' : 'Activer'}>
                            {u.actif ? <XCircle size={14}/> : <CheckCircle size={14}/>}
                          </button>
                          <button onClick={()=>remove(u.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
