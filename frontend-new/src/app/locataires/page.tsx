'use client'
import { useEffect, useState } from 'react'
import { Users, Plus, Pencil, Trash2, Search } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Locataire } from '@/types/models'

const EMPTY: Locataire = { nom:'', prenom:'', telephone:'', email:'', pieceIdentite:'', dateEntree:'' }

export default function LocatairesPage() {
  const [items, setItems] = useState<Locataire[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Locataire>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get<Locataire[]>('/locataires').then(r => setItems(r.data)).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  function openNew() { setEditing(EMPTY); setModal(true) }
  function openEdit(l: Locataire) { setEditing(l); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      if (editing.id) await api.put(`/locataires/${editing.id}`, editing)
      else await api.post('/locataires', editing)
      setModal(false); load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    if (!confirm('Supprimer ce locataire ?')) return
    await api.delete(`/locataires/${id}`); load()
  }

  const filtered = items.filter(l =>
    `${l.prenom} ${l.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    l.telephone.includes(search)
  )

  const u = (k: keyof Locataire) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setEditing(f => ({...f, [k]: e.target.value}))

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{color:'var(--text-primary)'}}>Locataires</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>{items.length} locataire(s)</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus size={15}/> Ajouter</button>
        </div>

        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:'var(--text-muted)'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher…" className="form-input pl-10"/>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{background:'var(--bg-tertiary)'}}>
                <Users size={24} style={{color:'var(--text-muted)'}}/>
              </div>
              <p className="font-semibold mb-1" style={{color:'var(--text-primary)'}}>Aucun locataire</p>
              <p className="text-sm mb-4" style={{color:'var(--text-muted)'}}>Ajoutez votre premier locataire</p>
              <button onClick={openNew} className="btn-primary text-sm"><Plus size={14}/> Ajouter un locataire</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Nom complet</th><th>Téléphone</th><th>Email</th><th>Pièce d'identité</th><th>Date d'entrée</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(l => (
                    <tr key={l.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {l.prenom?.[0]?.toUpperCase()}
                          </div>
                          <span className="font-medium" style={{color:'var(--text-primary)'}}>{l.prenom} {l.nom}</span>
                        </div>
                      </td>
                      <td>{l.telephone}</td>
                      <td>{l.email}</td>
                      <td>{l.pieceIdentite}</td>
                      <td>{formatDate(l.dateEntree)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={()=>openEdit(l)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"><Pencil size={13}/></button>
                          <button onClick={()=>remove(l.id!)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 size={13}/></button>
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

      <Modal open={modal} onClose={()=>setModal(false)} title={editing.id ? 'Modifier le locataire' : 'Nouveau locataire'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Nom</label><input value={editing.nom} onChange={u('nom')} className="form-input"/></div>
            <div><label className="form-label">Prénom</label><input value={editing.prenom} onChange={u('prenom')} className="form-input"/></div>
          </div>
          <div><label className="form-label">Email</label><input type="email" value={editing.email} onChange={u('email')} className="form-input"/></div>
          <div><label className="form-label">Téléphone</label><input value={editing.telephone} onChange={u('telephone')} className="form-input"/></div>
          <div><label className="form-label">Pièce d'identité</label><input value={editing.pieceIdentite} onChange={u('pieceIdentite')} className="form-input"/></div>
          <div><label className="form-label">Date d'entrée</label><input type="date" value={editing.dateEntree} onChange={u('dateEntree')} className="form-input"/></div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={()=>setModal(false)} className="btn-secondary">Annuler</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
