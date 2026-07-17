'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Building2, FileText, Bell, CreditCard, BarChart3, Shield,
  ArrowRight, CheckCircle, Star, ChevronRight, Sun, Moon,
  Zap, Users, Smartphone
} from 'lucide-react'

function ThemeToggleInline() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')) }, [])
  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('immocorp_theme', next ? 'dark' : 'light')
  }
  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-zinc-800"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

const features = [
  { icon: FileText,   color: '#3272f5', bg: 'rgba(50,114,245,0.12)',  title: 'Quittances PDF',      desc: "Générez et envoyez vos quittances de loyer en un clic. Archivage automatique inclus." },
  { icon: Bell,       color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  title: 'Alertes SMS & Email', desc: "Recevez des alertes automatiques pour les retards de paiement et les fins de bail." },
  { icon: CreditCard, color: '#10b981', bg: 'rgba(16,185,129,0.12)',  title: 'Suivi des paiements', desc: "Tracez chaque loyer perçu — Mobile Money, virement, espèces. Historique complet." },
  { icon: BarChart3,  color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  title: 'Tableau de bord',     desc: "Vue d'ensemble de votre portefeuille avec statistiques clés en temps réel." },
  { icon: Shield,     color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   title: 'Gestion des baux',    desc: "Créez, gérez et résiliez vos baux en toute légalité. Suivi des échéances automatique." },
  { icon: Smartphone, color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   title: 'Mobile & Web',        desc: "Accédez à votre gestion depuis n'importe quel appareil, n'importe où au Togo." },
]

const steps = [
  { num: '01', title: 'Créez votre compte', desc: 'Inscription en 2 minutes. Aucune carte de crédit requise pour démarrer.' },
  { num: '02', title: 'Ajoutez vos biens',  desc: 'Enregistrez vos propriétés, locataires et contrats de bail facilement.' },
  { num: '03', title: 'Automatisez tout',   desc: 'Laissez ImmoCorp gérer les alertes, quittances et rappels à votre place.' },
]

const stats = [
  { value: '500+',   label: 'Propriétaires actifs' },
  { value: '2 400+', label: 'Propriétés gérées' },
  { value: '98%',    label: 'Satisfaction client' },
  { value: '5 min',  label: 'Pour démarrer' },
]

const testimonials = [
  { name: 'Kossi A.', role: 'Propriétaire, Lomé',     text: "ImmoCorp a transformé ma gestion locative. Je reçois mes loyers à l'heure et les rappels sont automatiques.", stars: 5 },
  { name: 'Abla M.',  role: 'Gestionnaire, Kara',      text: "Les quittances PDF et les alertes SMS m'économisent des heures chaque mois. Indispensable.", stars: 5 },
  { name: 'Edem K.',  role: 'Investisseur immobilier', text: "Le tableau de bord me donne une vue claire sur mes 12 appartements. Je recommande fortement.", stars: 5 },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-slate-900 dark:text-white overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-zinc-800' : ''
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/accueil" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/30">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-slate-900 dark:text-white">ImmoCorp</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[['#features','Fonctionnalités'],['#how','Comment ça marche'],['#testimonials','Témoignages']].map(([href, label]) => (
              <a key={href} href={href} className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggleInline />
            <Link href="/login" className="hidden md:flex px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all">
              Connexion
            </Link>
            <Link href="/register" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all hover:-translate-y-px">
              Démarrer <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(50,114,245,0.15) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px]"
            style={{ background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
          <div className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(rgba(50,114,245,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(50,114,245,0.05) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-medium">
            <Zap size={13} className="fill-current" />
            Plateforme de gestion locative #1 au Togo
            <ChevronRight size={13} />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.04] mb-6 text-slate-900 dark:text-white">
            Gérez vos biens<br />
            <span className="gradient-text">sans effort.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            ImmoCorp automatise votre gestion locative — quittances PDF, alertes SMS,
            suivi des paiements et pilotage de votre portefeuille en temps réel.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <Link href="/register" className="group flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-0.5 text-sm">
              Créer mon compte gratuit
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-slate-300 dark:hover:border-zinc-600 shadow-sm transition-all hover:-translate-y-0.5">
              J'ai déjà un compte
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
                <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-0.5">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="relative mt-20 max-w-4xl mx-auto w-full animate-float">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-20 rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #3272f5, #8b5cf6)' }} />
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-slate-900/20 dark:shadow-black/60 border border-slate-200 dark:border-zinc-800">
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs text-slate-400 dark:text-zinc-500 text-center font-mono">
                app.immocorp.tg/dashboard
              </div>
            </div>
            {/* Content */}
            <div className="bg-slate-50 dark:bg-zinc-900 flex" style={{ height: '320px' }}>
              {/* Sidebar */}
              <div className="w-16 bg-blue-600 flex flex-col items-center py-4 gap-3 flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-xs font-bold mb-2">IC</div>
                {[Building2, Users, FileText, CreditCard, Bell].map((Icon, i) => (
                  <div key={i} className={`w-9 h-9 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-white/20 text-white' : 'text-white/50'}`}>
                    <Icon size={16} />
                  </div>
                ))}
              </div>
              {/* Main */}
              <div className="flex-1 p-5 overflow-hidden">
                <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-3">Tableau de bord</div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { n: '12',   l: 'Propriétés', c: 'from-blue-500 to-blue-600' },
                    { n: '8',    l: 'Locataires',  c: 'from-emerald-500 to-emerald-600' },
                    { n: '340K', l: 'FCFA/mois',   c: 'from-violet-500 to-violet-600' },
                    { n: '2',    l: 'Alertes',     c: 'from-red-500 to-red-600' },
                  ].map(card => (
                    <div key={card.l} className={`p-3 rounded-xl bg-gradient-to-br ${card.c} text-white`}>
                      <div className="text-lg font-bold">{card.n}</div>
                      <div className="text-[10px] text-white/80 mt-0.5">{card.l}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-700 text-xs font-semibold text-slate-500 dark:text-zinc-400">Derniers paiements</div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-50 dark:border-zinc-700/50 last:border-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-600 dark:to-zinc-700" />
                      <div className="flex-1 space-y-1">
                        <div className="h-2 bg-slate-200 dark:bg-zinc-700 rounded w-28" />
                        <div className="h-1.5 bg-slate-100 dark:bg-zinc-700/50 rounded w-20" />
                      </div>
                      <div className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">Payé</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-zinc-600">
          <div className="w-5 h-8 rounded-full border border-current flex justify-center pt-1.5">
            <div className="w-1 h-1.5 bg-current rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className="py-12 border-y border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-sm text-slate-400 dark:text-zinc-500 mb-8 font-medium uppercase tracking-wider">
            Fait confiance par des propriétaires partout au Togo
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            {['Lomé', 'Kara', 'Sokodé', 'Atakpamé', 'Kpalimé', 'Tsévié'].map(city => (
              <div key={city} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                <Building2 size={14} /> {city}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Fonctionnalités
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Une suite complète pensée pour les propriétaires togolais. Simple, puissante, fiable.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <div key={f.title} className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-lg dark:hover:shadow-black/40 transition-all duration-300 hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center" style={{ background: f.bg }}>
                  <f.icon size={20} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-base mb-2 text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 px-6 bg-slate-50 dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Comment ça marche
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
              Opérationnel en 5 minutes
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">Un processus guidé pour démarrer rapidement</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%_-_16px)] w-[calc(100%_-_64px)] h-px bg-gradient-to-r from-blue-200 dark:from-blue-800 to-transparent z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-600/30">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Témoignages
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
              Ils nous font confiance
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-zinc-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 relative overflow-hidden shadow-2xl shadow-blue-600/30">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%)' }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                Prêt à simplifier votre gestion ?
              </h2>
              <p className="text-white/75 mb-8 text-lg">Rejoignez des centaines de propriétaires qui font confiance à ImmoCorp.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-blue-700 bg-white hover:bg-blue-50 shadow-lg transition-all hover:-translate-y-0.5 text-sm">
                  Créer mon compte gratuit <ArrowRight size={15} />
                </Link>
                <Link href="/login" className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-white border border-white/30 hover:bg-white/10 transition-all hover:-translate-y-0.5">
                  Se connecter
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-5">
                {['Gratuit pour démarrer', 'Aucune carte requise', 'Support local'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-white/70 text-sm">
                    <CheckCircle size={13} className="text-white/60" /> {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Building2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">ImmoCorp</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-zinc-500">© 2026 ImmoCorp — Gestion locative intelligente au Togo</p>
          <div className="flex gap-4">
            <Link href="/login"    className="text-sm text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">Connexion</Link>
            <Link href="/register" className="text-sm text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-colors">Inscription</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}