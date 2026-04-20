import { useState } from 'react'

export default function EmailGate({ onClose, catColor = '#FF4562' }) {
  const [email, setEmail] = useState('')

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(10,14,26,0.8)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'rgba(16,20,34,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '44px 40px', maxWidth: 420, width: '90%', boxShadow: `0 32px 100px rgba(0,0,0,0.5),0 0 60px ${catColor}06`, position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 2, background: `linear-gradient(90deg,transparent,${catColor}50,transparent)`, borderRadius: 1 }} />
        <div style={{ fontSize: 32, marginBottom: 18, textAlign: 'center' }}>📊</div>
        <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em', color: '#E8ECF1' }}>Your chart is ready</h3>
        <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.4)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>Enter your work email to export as PNG, SVG, or get an embed code. Completely free.</p>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          type="email"
          style={{ width: '100%', padding: '15px 20px', fontSize: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, color: '#E8ECF1', outline: 'none', marginBottom: 14, backdropFilter: 'blur(8px)' }}
        />
        <button
          onClick={() => { if (email.includes('@')) { sessionStorage.setItem('briefroom_unlocked', email); onClose() } }}
          style={{ width: '100%', padding: 15, background: email.includes('@') ? `linear-gradient(135deg,${catColor},${catColor}CC)` : 'rgba(255,255,255,0.04)', color: email.includes('@') ? '#fff' : 'rgba(232,236,241,0.3)', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', boxShadow: email.includes('@') ? `0 8px 28px ${catColor}30` : 'none' }}
        >
          Export Chart — Free
        </button>
        <p style={{ fontSize: 11, color: 'rgba(232,236,241,0.5)', textAlign: 'center', marginTop: 16 }}>No spam. We'll send your chart and occasional threat intel updates.</p>
      </div>
    </div>
  )
}
