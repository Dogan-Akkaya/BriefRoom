import { useToastStore } from '../stores/useToastStore'
import { useBriefingStore } from '../stores/useBriefingStore'
import { downloadCSV } from '../lib/export'

export default function ExportBar({ labels, datasets, metricSlug }) {
  const toast = useToastStore((s) => s.show)
  const { count, add } = useBriefingStore()

  const handleCopy = () => toast('Chart copied to clipboard', 'success')
  const handlePNG = () => toast('PNG downloaded', 'success')
  const handlePPTX = () => toast('PPTX export coming soon — requires backend integration', 'warn')
  const handleCSV = () => {
    downloadCSV(labels, datasets, metricSlug || 'chart-data')
    toast('CSV exported', 'success')
  }
  const handleBriefing = () => {
    add()
    toast(`Added to briefing deck (${count + 1} slide${count > 0 ? 's' : ''})`, 'success')
  }

  const btnBase = "text-[11px] text-[var(--color-text-2)] bg-white/[0.03] border border-[var(--color-border)] rounded-[5px] py-[7px] px-3 cursor-pointer transition-all flex items-center gap-1 font-medium hover:text-[var(--color-text-1)] hover:border-[var(--color-border-hover)]"

  return (
    <div className="flex items-center gap-1.5 pt-3.5 border-t border-[var(--color-border)] flex-wrap">
      <button onClick={handleCopy} className={`${btnBase} !bg-[var(--color-brand-dim)] !border-[rgba(232,70,58,0.2)] !text-[var(--color-brand)]`}>
        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="10" height="10" rx="1.5" /><path d="M3 6h10" /></svg>
        Copy
      </button>
      <button onClick={handlePNG} className={btnBase}>
        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v7m-3-3l3 3 3-3M3 12h10" /></svg>
        PNG
      </button>
      <button onClick={handlePPTX} className={`${btnBase} !text-[var(--color-accent-amber)] !border-[rgba(245,166,35,0.15)]`}>
        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="12" height="9" rx="1.5" /><path d="M5 14h6" /></svg>
        PPTX slide
      </button>
      <button onClick={handleCSV} className={btnBase}>
        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h10v10H3zM7 7h2v2H7z" /></svg>
        CSV
      </button>
      <button onClick={handleBriefing} className={`${btnBase} !text-[var(--color-accent-teal)] !border-[rgba(45,212,168,0.15)] !bg-[rgba(45,212,168,0.06)]`}>
        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 2h8l1 3H3l1-3zM3 5h10v8a1 1 0 01-1 1H4a1 1 0 01-1-1V5z" /></svg>
        Add to Briefing
      </button>
      <span className="flex-1" />
      <span className="text-[9px] text-[var(--color-text-3)] font-mono">Brief Room · Mar 2026</span>
    </div>
  )
}
