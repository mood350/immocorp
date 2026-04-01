'use client'
import { useEffect, useState } from 'react'
import { FileText, Plus, Pencil, Trash2, Search } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import { api } from '@/lib/api'
import { formatMontant, formatDate } from '@/lib/utils'
import type { Bail, Propriete, Locataire } from '@/types/models'

const EMPTY: Bail = { dateDebut:'', montantLoyer:0, jourEcheance:1, proprieteId:0, locataireId:0 }

const statutColors: Record<string, string> = {
  ACTIF: 'badge-green', RESILIE: 'badge-red', EXPIRE: 'badge-gray'
}
const statutLabels: Record<string, string> = {
  ACTIF: 'Actif', RESILIE: 'Résilié', EXPIRE: 'Expiré'
}

export default function BauxPage() {
  const [items, setItems] = useState<Bail[]>([])
  const [proprietes, setProprietes] = useState<Propriete[]>([])
  const [locataires, setLocataires] = useState<Locataire[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Bail>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get<Bail[]>('/baux'),
      api.get<Propriete[]>('/proprietes'),
      api.get<Locataire[]>('/locataires'),
    ]).then(([b,p,l]) => {
      setItems(b.data); setProprietes(p.data); setLocataires(l.data)
    }).catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  function openNew() { setEditing(EMPTY); setModal(true) }
  function openEdit(b: Bail) { setEditing(b); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      if (editing.id) await api.put(`/baux/${editing.id}`, editing)
      else await api.post('/baux', editing)
      setModal(false); load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    if (!confirm('Supprimer ce bail ?')) return
    await api.delete(`/baux/${id}`); load()
  }

  const u = (k: keyof Bail) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditing(f => ({...f, [k]: ['montantLoyer','jourEcheance','proprieteId','locataireId'].includes(k) ? +e.target.value : e.target.value}))

  const filtered = items.filter(b =>
    (b.propriete?.adresse || '').toLowerCase().includes(search.toLowerCase()) ||
    (`${b.locataire?.prenom} ${b.locataire?.nom}`).toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{color:'var(--text-primary)'}}>Baux</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>{items.length} bail(s) enregistré(s)</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus size={15}/> Nouveau bail</button>
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
                <FileText size={24} style={{color:'var(--text-muted)'}}/>
              </div>
              <p className="font-semibold mb-1" style={{color:'var(--text-primary)'}}>Aucun bail</p>
              <p className="text-sm mb-4" style={{color:'var(--text-muted)'}}>Créez votre premier contrat de bail</p>
              <button onClick={openNew} className="btn-primary text-sm"><Plus size={14}/> Nouveau bail</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Propriété</th><th>Locataire</th><th>Loyer</th><th>Début</th><th>Fin</th><th>Échéance</th><th>Statut</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b.id}>
                      <td className="font-medium" style={{color:'var(--text-primary)'}}>{b.propriete?.adresse || `ID ${b.proprieteId}`}</td>
                      <td>{b.locataire ? `${b.locataire.prenom} ${b.locataire.nom}` : `ID ${b.locataireId}`}</td>
                      <td className="font-semibold" style={{color:'var(--text-primary)'}}>{formatMontant(b.montantLoyer)}</td>
                      <td>{formatDate(b.dateDebut)}</td>
                      <td>{b.dateFin ? formatDate(b.dateFin) : '—'}</td>
                      <td>Jour {b.jourEcheance}</td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${statutColors[b.statut||'ACTIF']}`}>
                          {statutLabels[b.statut||'ACTIF']}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={()=>openEdit(b)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"><Pencil size={13}/></button>
                          <button onClick={()=>remove(b.id!)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 size={13}/></button>
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

      <Modal open={modal} onClose={()=>setModal(false)} title={editing.id ? 'Modifier le bail' : 'Nouveau bail'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Propriété</label>
              <select value={editing.proprieteId} onChange={u('proprieteId')} className="form-input">
                <option value={0}>Sélectionner…</option>
                {proprietes.map(p => <option key={p.id} value={p.id}>{p.adresse} — {p.ville}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Locataire</label>
              <select value={editing.locataireId} onChange={u('locataireId')} className="form-input">
                <option value={0}>Sélectionner…</option>
                {locataires.map(l => <option key={l.id} value={l.id}>{l.prenom} {l.nom}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Montant loyer (FCFA)</label><input type="number" value={editing.montantLoyer} onChange={u('montantLoyer')} className="form-input"/></div>
            <div><label className="form-label">Jour d'échéance</label><input type="number" min={1} max={31} value={editing.jourEcheance} onChange={u('jourEcheance')} className="form-input"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Date de début</label><input type="date" value={editing.dateDebut} onChange={u('dateDebut')} className="form-input"/></div>
            <div><label className="form-label">Date de fin (optionnel)</label><input type="date" value={editing.dateFin||''} onChange={u('dateFin')} className="form-input"/></div>
          </div>
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
