'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { saveSession } from '@/lib/auth'
import type { AuthResponse } from '@/types/models'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Le mot de passe doit faire au moins 6 caractères.'); return }
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', form)
      saveSession(data)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription. Vérifiez vos informations.')
    } finally {
      setLoading(false)
    }
  }

  const perks = ['Gratuit pour démarrer', 'Quittances PDF automatiques', 'Alertes SMS & Email', 'Support local Togo']

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#09090b]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-brand-900 to-brand-600">
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'radial-gradient(circle at 70% 60%, white 0%, transparent 60%)'}} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/accueil" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 size={18} className="text-white"/>
            </div>
            <span className="font-bold text-xl text-white">ImmoCorp</span>
          </Link>
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight leading-tight">
              La gestion locative<br/>réinventée pour le Togo
            </h2>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Rejoignez des centaines de propriétaires qui ont simplifié leur quotidien avec ImmoCorp.
            </p>
            <div className="space-y-3">
              {perks.map(p => (
                <div key={p} className="flex items-center gap-3 text-white/80 text-sm">
                  <CheckCircle size={16} className="text-emerald-400 flex-shrink-0"/>
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className="text-white/40 text-xs">© 2026 ImmoCorp</div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
              <Building2 size={18} className="text-white"/>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">ImmoCorp</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Créer votre compte</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Commencez à gérer vos biens en quelques minutes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
  {error && (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm">
      <AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>
      {error}
    </div>
  )}

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="form-label">Nom</label>
      {/* Pas d'icône → padding normal */}
      <input type="text" value={form.nom} onChange={update('nom')} placeholder="Dupont" required className="form-input"/>
    </div>
    <div>
      <label className="form-label">Prénom</label>
      <input type="text" value={form.prenom} onChange={update('prenom')} placeholder="Jean" required className="form-input"/>
    </div>
  </div>

  <div>
    <label className="form-label">Adresse email</label>
    <div className="input-icon-wrapper">
      <Mail size={15} className="input-icon"/>
      <input type="email" value={form.email} onChange={update('email')} placeholder="votre@email.com" required className="form-input"/>
    </div>
  </div>

  <div>
    <label className="form-label">Téléphone</label>
    <div className="input-icon-wrapper">
      <Phone size={15} className="input-icon"/>
      <input type="tel" value={form.telephone} onChange={update('telephone')} placeholder="+228 90 00 00 00" className="form-input"/>
    </div>
  </div>

  <div>
    <label className="form-label">Mot de passe</label>
    <div className="input-icon-wrapper">
      <Lock size={15} className="input-icon"/>
      <input
        type={showPwd ? 'text' : 'password'} value={form.password}
        onChange={update('password')} placeholder="Min. 6 caractères" required minLength={6}
        className="form-input has-suffix"
      />
      <button type="button" onClick={() => setShowPwd(!showPwd)}
        className="input-suffix text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
        {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
      </button>
    </div>
    {form.password.length > 0 && (
      <div className="mt-1.5 flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
            form.password.length >= i * 3 ? i <= 2 ? 'bg-brand-500' : 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'
          }`}/>
        ))}
      </div>
    )}
  </div>

  <button type="submit" disabled={loading}
    className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2">
    {loading ? (
      <span className="flex items-center gap-2">
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
        Création du compte…
      </span>
    ) : (
      <span className="flex items-center gap-2">Créer mon compte <ArrowRight size={15}/></span>
    )}
  </button>
</form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Déjà un compte ?{' '}
            <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Se connecter
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/8 text-center">
            <Link href="/accueil" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
