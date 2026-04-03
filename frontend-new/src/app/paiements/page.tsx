'use client'
import { useEffect, useState } from 'react'
import { CreditCard, Plus, Trash2, Search, Download } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import { api } from '@/lib/api'
import { formatMontant, formatDate } from '@/lib/utils'
import type { Paiement, Bail } from '@/types/models'

const EMPTY: Paiement = { datePaiement:'', montant:0, moisConcerne:'', moyenPaiement:'ESPECES', bailId:0 }

const moyens: Paiement['moyenPaiement'][] = ['ESPECES','VIREMENT','MOBILE_MONEY','CHEQUE']
const moyenLabels: Record<string, string> = {
  ESPECES: 'Espèces', VIREMENT: 'Virement', MOBILE_MONEY: 'Mobile Money', CHEQUE: 'Chèque'
}
const moyenColors: Record<string, string> = {
  ESPECES: 'badge-gray', VIREMENT: 'badge-blue', MOBILE_MONEY: 'badge-green', CHEQUE: 'badge-yellow'
}

export default function PaiementsPage() {
  const [items, setItems] = useState<Paiement[]>([])
  const [baux, setBaux] = useState<Bail[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Paiement>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([api.get<Paiement[]>('/paiements'), api.get<Bail[]>('/baux')])
      .then(([p,b]) => { setItems(p.data); setBaux(b.data) })
      .catch(()=>{}).finally(()=>setLoading(false))
  }
  useEffect(load, [])

  function openNew() { setEditing(EMPTY); setModal(true) }

  async function save() {
    setSaving(true)
    try {
      await api.post('/paiements', editing)
      setModal(false); load()
    } finally { setSaving(false) }
  }

  async function remove(id: number) {
    if (!confirm('Supprimer ce paiement ?')) return
    await api.delete(`/paiements/${id}`); load()
  }

  async function downloadQuittance(id: number) {
    const { data } = await api.get(`/quittances/${id}`, { responseType: 'blob' })
    const url = URL.createObjectURL(data)
    const a = document.createElement('a'); a.href = url; a.download = `quittance-${id}.pdf`; a.click()
    URL.revokeObjectURL(url)
  }

  const u = (k: keyof Paiement) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditing(f => ({...f, [k]: ['montant','bailId'].includes(k) ? +e.target.value : e.target.value}))

  const filtered = items.filter(p =>
    p.moisConcerne.toLowerCase().includes(search.toLowerCase()) ||
    p.moyenPaiement.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{color:'var(--text-primary)'}}>Paiements</h1>
            <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>{items.length} paiement(s) enregistré(s)</p>
          </div>
          <button onClick={openNew} className="btn-primary"><Plus size={15}/> Enregistrer</button>
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
                <CreditCard size={24} style={{color:'var(--text-muted)'}}/>
              </div>
              <p className="font-semibold mb-1" style={{color:'var(--text-primary)'}}>Aucun paiement</p>
              <p className="text-sm mb-4" style={{color:'var(--text-muted)'}}>Enregistrez votre premier paiement de loyer</p>
              <button onClick={openNew} className="btn-primary text-sm"><Plus size={14}/> Enregistrer un paiement</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Montant</th><th>Mois concerné</th><th>Moyen</th><th>Référence</th><th>Bail</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td>{formatDate(p.datePaiement)}</td>
                      <td className="font-bold" style={{color:'var(--text-primary)'}}>{formatMontant(p.montant)}</td>
                      <td>{p.moisConcerne}</td>
                      <td>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${moyenColors[p.moyenPaiement]}`}>
                          {moyenLabels[p.moyenPaiement]}
                        </span>
                      </td>
                      <td className="text-xs font-mono">{p.referencePaiement || '—'}</td>
                      <td>Bail #{p.bailId}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={()=>downloadQuittance(p.id!)} title="Télécharger quittance"
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-brand-500 transition-all">
                            <Download size={13}/>
                          </button>
                          <button onClick={()=>remove(p.id!)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/50 text-[var(--text-muted)] hover:text-red-500 transition-all"><Trash2 size={13}/></button>
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

      <Modal open={modal} onClose={()=>setModal(false)} title="Enregistrer un paiement" size="md">
        <div className="space-y-4">
          <div>
            <label className="form-label">Bail</label>
            <select value={editing.bailId} onChange={u('bailId')} className="form-input">
              <option value={0}>Sélectionner un bail…</option>
              {baux.map(b => <option key={b.id} value={b.id}>Bail #{b.id} — {b.propriete?.adresse || `Propriété ${b.proprieteId}`}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Date de paiement</label><input type="date" value={editing.datePaiement} onChange={u('datePaiement')} className="form-input"/></div>
            <div><label className="form-label">Montant (FCFA)</label><input type="number" value={editing.montant} onChange={u('montant')} className="form-input"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="form-label">Mois concerné</label><input placeholder="ex: Janvier 2025" value={editing.moisConcerne} onChange={u('moisConcerne')} className="form-input"/></div>
            <div>
              <label className="form-label">Moyen de paiement</label>
              <select value={editing.moyenPaiement} onChange={u('moyenPaiement')} className="form-input">
                {moyens.map(m => <option key={m} value={m}>{moyenLabels[m]}</option>)}
              </select>
            </div>
          </div>
          <div><label className="form-label">Référence (optionnel)</label><input value={editing.referencePaiement||''} onChange={u('referencePaiement')} placeholder="N° transaction…" className="form-input"/></div>
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
