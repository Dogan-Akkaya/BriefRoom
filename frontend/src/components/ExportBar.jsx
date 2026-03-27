export default function ExportBar({ onPNGClick, onShareClick }) {
  return (
    <div style={{ display: 'flex', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      {/* PNG — Primary */}
      <button onClick={onPNGClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 20px', fontSize: 13, fontWeight: 600,
        fontFamily: "'Satoshi','DM Sans',sans-serif",
        background: 'rgba(255,69,98,0.1)', border: '1px solid rgba(255,69,98,0.25)',
        borderRadius: 10, color: '#FF4562', cursor: 'pointer',
        transition: 'all 0.25s', backdropFilter: 'blur(8px)',
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v7m-3-3l3 3 3-3M3 12h10"/></svg>
        Export PNG
      </button>
      {/* Share — Secondary */}
      <button onClick={onShareClick} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '10px 20px', fontSize: 13, fontWeight: 500,
        fontFamily: "'Satoshi','DM Sans',sans-serif",
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10, color: 'rgba(232,236,241,0.5)', cursor: 'pointer',
        transition: 'all 0.25s', backdropFilter: 'blur(8px)',
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="4" cy="8" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="12" r="2"/><path d="M6 7l4-2M6 9l4 2"/></svg>
        Share Link
      </button>
    </div>
  )
}
