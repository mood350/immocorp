'use client'
import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative w-full ${widths[size]} rounded-2xl shadow-2xl animate-fade-up`}
        style={{background: 'var(--bg-card)', border: '1px solid var(--border)'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{borderColor: 'var(--border)'}}>
          <h2 className="font-bold text-base" style={{color: 'var(--text-primary)'}}>{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
            <X size={16}/>
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
