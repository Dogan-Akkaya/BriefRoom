import { useToastStore } from '../stores/useToastStore'

const icons = { success: '\u2713', info: '\u2139', warn: '\u26A0' }

export default function Toast() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none' }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: 'auto',
            background: 'rgba(14,18,32,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '10px 16px',
            fontSize: 12,
            color: '#E8ECF1',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(16px)',
            animation: 'slideUp 0.25s ease-out',
            fontFamily: "'Satoshi','DM Sans',sans-serif",
          }}
        >
          <span style={{ fontSize: 14 }}>{icons[t.type] || '\u2713'}</span>
          <span dangerouslySetInnerHTML={{ __html: t.message }} />
        </div>
      ))}
    </div>
  )
}
