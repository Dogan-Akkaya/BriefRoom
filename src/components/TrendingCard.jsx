import { useNavigate } from 'react-router-dom'
import { useToastStore } from '../stores/useToastStore'

export default function TrendingCard({ chart }) {
  const navigate = useNavigate()
  const toast = useToastStore((s) => s.show)

  return (
    <div
      onClick={() => navigate(`/builder/${chart.topic}`)}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[9px] p-4 cursor-pointer transition-all hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-hover)]"
    >
      <div className="flex items-center justify-between mb-[3px]">
        <span className="text-xs font-semibold">{chart.title}</span>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-[3px]" style={{ background: `${chart.tagColor}14`, color: chart.tagColor }}>
          {chart.tag}
        </span>
      </div>
      <div className="text-[10px] text-[var(--color-text-3)] mb-3">{chart.sub}</div>
      <div className="h-[100px] bg-[var(--color-bg-input)] rounded-md mb-2.5 flex items-center justify-center text-[var(--color-text-3)] text-[10px] font-mono">
        Chart preview
      </div>
      <div className="flex gap-1 pt-2.5 border-t border-[var(--color-border)]">
        <button onClick={(e) => { e.stopPropagation(); toast('Chart copied to clipboard', 'success') }} className="text-[9px] font-mono text-[var(--color-text-3)] bg-white/[0.02] border border-[var(--color-border)] rounded-[3px] px-[7px] py-[3px] cursor-pointer hover:text-[var(--color-text-2)] hover:border-[var(--color-border-hover)] transition-all">Copy</button>
        <button onClick={(e) => { e.stopPropagation(); toast('PNG downloaded', 'success') }} className="text-[9px] font-mono text-[var(--color-text-3)] bg-white/[0.02] border border-[var(--color-border)] rounded-[3px] px-[7px] py-[3px] cursor-pointer hover:text-[var(--color-text-2)] hover:border-[var(--color-border-hover)] transition-all">PNG</button>
        <button onClick={(e) => { e.stopPropagation(); toast('PPTX export coming soon', 'warn') }} className="text-[9px] font-mono text-[var(--color-accent-amber)] bg-white/[0.02] border border-[rgba(245,166,35,0.12)] rounded-[3px] px-[7px] py-[3px] cursor-pointer hover:border-[var(--color-border-hover)] transition-all">PPTX</button>
      </div>
    </div>
  )
}
