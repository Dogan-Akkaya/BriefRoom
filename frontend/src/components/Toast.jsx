import { useToastStore } from '../stores/useToastStore'

const icons = { success: '✓', info: 'ℹ', warn: '⚠' }

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="absolute bottom-4 right-4 z-50 flex flex-col gap-1.5 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[7px] px-4 py-2.5 text-xs text-[var(--color-text-1)] flex items-center gap-2 shadow-lg animate-[slideUp_0.25s_ease-out]"
        >
          <span className="text-sm">{icons[t.type] || '✓'}</span>
          <span dangerouslySetInnerHTML={{ __html: t.message }} />
        </div>
      ))}
    </div>
  )
}
