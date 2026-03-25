import { useNavigate } from 'react-router-dom'

export default function TopicCard({ topic }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/builder/${topic.slug}`)}
      className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[9px] p-4 cursor-pointer transition-all hover:bg-[var(--color-bg-card-hover)] hover:border-[var(--color-border-hover)] relative overflow-hidden group"
      style={{ '--tc-color': topic.color }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: topic.color }} />
      <div className="flex items-center justify-between mb-2.5">
        <div className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[13px]" style={{ background: `${topic.color}14`, color: topic.color }}>
          {topic.icon}
        </div>
        <span className="text-[9px] text-[var(--color-text-3)] font-mono">{topic.chartCount} charts</span>
      </div>
      <div className="text-[13px] font-semibold mb-[3px]">{topic.name}</div>
      <div className="text-[10.5px] text-[var(--color-text-3)] leading-[1.45] mb-3">{topic.description}</div>
      <div className="pt-2.5 border-t border-[var(--color-border)] flex items-baseline gap-1.5">
        <span className="text-base font-bold font-mono" style={{ color: topic.color }}>{topic.statVal}</span>
        <span className={`text-[9px] font-mono px-1 rounded-[3px] ${topic.statDeltaUp ? 'text-[var(--color-brand)] bg-[var(--color-brand-dim)]' : 'text-[var(--color-accent-teal)] bg-[rgba(45,212,168,0.08)]'}`}>
          {topic.statDelta}
        </span>
        <span className="text-[9px] text-[var(--color-text-3)]">{topic.statLabel}</span>
      </div>
    </div>
  )
}
