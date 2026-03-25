import { useState, useEffect } from 'react'
import { useToastStore } from '../stores/useToastStore'

export default function EmailGate() {
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [savedEmail, setSavedEmail] = useState('')
  const toast = useToastStore((s) => s.show)

  useEffect(() => {
    const stored = sessionStorage.getItem('briefroom_unlocked')
    if (stored) { setUnlocked(true); setSavedEmail(stored) }
  }, [])

  const unlock = () => {
    if (!email || !email.includes('@') || !email.split('@')[1]?.includes('.')) {
      toast('Please enter a valid work email', 'warn')
      return
    }
    sessionStorage.setItem('briefroom_unlocked', email)
    setUnlocked(true)
    setSavedEmail(email)
    toast('Full access unlocked', 'success')
  }

  if (unlocked) {
    return (
      <div className="mt-3.5 bg-[rgba(45,212,168,0.06)] border border-[rgba(45,212,168,0.15)] rounded-lg p-3.5 px-4">
        <p className="text-xs text-[var(--color-accent-teal)]">
          <strong>✓ Unlocked!</strong> Full export access enabled for <strong>{savedEmail}</strong>.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-3.5 bg-[var(--color-brand-dim)] border border-[rgba(232,70,58,0.1)] rounded-lg p-3.5 px-4 flex items-center gap-2.5">
      <p className="text-xs text-[var(--color-text-2)] flex-1 leading-[1.4]">
        <strong className="text-[var(--color-text-1)] font-medium">Unlock unlimited exports.</strong> Enter your work email for free full access — no spam, just monthly data updates.
      </p>
      <div className="flex gap-[5px]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && unlock()}
          placeholder="you@company.com"
          className="bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-1)] text-xs font-[var(--font-sans)] py-[7px] px-3 rounded-[5px] w-[170px] outline-none focus:border-[rgba(232,70,58,0.4)] placeholder:text-[var(--color-text-3)]"
        />
        <button onClick={unlock} className="bg-[var(--color-brand)] text-white text-xs font-semibold py-[7px] px-3.5 rounded-[5px] border-none cursor-pointer whitespace-nowrap hover:opacity-90">
          Unlock
        </button>
      </div>
    </div>
  )
}
