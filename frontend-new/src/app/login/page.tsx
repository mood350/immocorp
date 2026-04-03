'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { saveSession } from '@/lib/auth'
import type { AuthResponse } from '@/types/models'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
      saveSession(data)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants incorrects. Vérifiez votre email et mot de passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#09090b]">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 to-violet-700">
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage: 'radial-gradient(circle at 30% 40%, white 0%, transparent 60%)'}} />
        <div className="absolute inset-0"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/accueil" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Building2 size={18} className="text-white"/>
            </div>
            <span className="font-bold text-xl text-white">ImmoCorp</span>
          </Link>
          <div>
            <blockquote className="text-white/90 text-xl font-medium leading-relaxed mb-4">
              "ImmoCorp a complètement transformé ma gestion locative. Je gagne des heures chaque semaine."
            </blockquote>
            <div className="text-white/60 text-sm">Kossi A. — Propriétaire, Lomé</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['500+', 'Propriétaires'], ['2400+', 'Propriétés'], ['98%', 'Satisfaction'], ['5 min', 'Pour démarrer']].map(([v, l]) => (
              <div key={l} className="p-4 rounded-2xl bg-white/10 backdrop-blur">
                <div className="text-2xl font-extrabold text-white">{v}</div>
                <div className="text-white/60 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-600/30">
              <Building2 size={18} className="text-white"/>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">ImmoCorp</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Bon retour 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Connectez-vous à votre espace propriétaire</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0"/>
                {error}
              </div>
            )}

            <div>
              <label className="form-label">Adresse email</label>
              <div className="input-icon-wrapper">
                <Mail size={15} className="input-icon" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com" required
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Mot de passe</label>
              <div className="input-icon-wrapper">
                <Lock size={15} className="input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="form-input has-suffix"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="input-suffix text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPwd ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Connexion…
                </span>
              ) : (
                <span className="flex items-center gap-2">Se connecter <ArrowRight size={15}/></span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              Créer un compte
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 text-center">
            <Link href="/accueil" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}