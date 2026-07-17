'use client'
import { useEffect, useState } from 'react'
import { Building2, Plus, Pencil, Trash2, Search } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import { api } from '@/lib/api'
import { formatMontant } from '@/lib/utils'
import type { Propriete } from '@/types/models'

const EMPTY: Propriete = { type: '', adresse: '', ville: '', superficie: 0, loyer: 0 }

export default function ProprietesPage() {
  const [items, setItems] = useState<Propriete[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Propriete>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    api.get<Propriete[]>('/proprietes').then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openNew() { setEditing(EMPTY); setModal(true) }
  function openEdit(p: Propriete) { setEditing(p); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      if (editing.id) await api.put(`/proprietes/${editing.id}`, editing)
      else await api.post('/proprietes', editing)
      setModal(false); load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    if (!confirm('Supprimer cette propriété ?')) return
    await api.delete(`/proprietes/${id}`); load()
  }

  const filtered = items.filter(p =>
    p.adresse.toLowerCase().includes(search.toLowerCase()) ||
    p.ville.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{color:'var(--text-primary)'}}>Propriétés</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>{items.length} bien(s) enregistré(s)</p>
          </div>
          <button onClick={openNew} className="btn-primary">
            <Plus size={15}/> Ajouter
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:'var(--text-muted)'}}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…" className="form-input pl-10"/>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{background:'var(--bg-tertiary)'}}>
                <Building2 size={24} style={{color:'var(--text-muted)'}}/>
              </div>
              <p className="font-semibold mb-1" style={{color:'var(--text-primary)'}}>Aucune propriété</p>
              <p className="text-sm mb-4" style={{color:'var(--text-muted)'}}>Commencez par ajouter votre premier bien</p>
              <button onClick={openNew} className="btn-primary text-sm"><Plus size={14}/> Ajouter une propriété</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th><th>Adresse</th><th>Ville</th><th>Superficie</th><th>Loyer</th><th>Statut</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td className="font-medium" style={{color:'var(--text-primary)'}}>{p.type}</td>
                      <td>{p.adresse}</td>
                      <td>{p.ville}</td>
                      <td>{p.superficie} m²</td>
                      <td className="font-semibold" style={{color:'var(--text-primary)'}}>{formatMontant(p.loyer)}</td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                          p.statut === 'DISPONIBLE' ? 'badge-green' : 'badge-blue'
                        }`}>
                          {p.statut === 'DISPONIBLE' ? 'Disponible' : 'Occupée'}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                            <Pencil size={13}/>
                          </button>
                          <button onClick={() => remove(p.id!)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-[var(--text-muted)] hover:text-red-500 transition-all">
                            <Trash2 size={13}/>
                          </button>
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

      {/* Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editing.id ? 'Modifier la propriété' : 'Nouvelle propriété'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Type</label>
              <input value={editing.type} onChange={e => setEditing(f=>({...f,type:e.target.value}))} placeholder="Appartement, Maison…" className="form-input"/>
            </div>
            <div>
              <label className="form-label">Ville</label>
              <input value={editing.ville} onChange={e => setEditing(f=>({...f,ville:e.target.value}))} placeholder="Lomé" className="form-input"/>
            </div>
          </div>
          <div>
            <label className="form-label">Adresse</label>
            <input value={editing.adresse} onChange={e => setEditing(f=>({...f,adresse:e.target.value}))} placeholder="Quartier, rue…" className="form-input"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Superficie (m²)</label>
              <input type="number" value={editing.superficie} onChange={e => setEditing(f=>({...f,superficie:+e.target.value}))} className="form-input"/>
            </div>
            <div>
              <label className="form-label">Loyer mensuel (FCFA)</label>
              <input type="number" value={editing.loyer} onChange={e => setEditing(f=>({...f,loyer:+e.target.value}))} className="form-input"/>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setModal(false)} className="btn-secondary">Annuler</button>
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Enregistrer'}
            </button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
