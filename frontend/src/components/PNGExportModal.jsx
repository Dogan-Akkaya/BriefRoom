import { useState } from 'react'
import { useToastStore } from '../stores/useToastStore'

export default function PNGExportModal({ onClose, categoryId }) {
  const [email, setEmail] = useState('')
  const addToast = useToastStore((s) => s.addToast)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    sessionStorage.setItem('briefroom_email', email)
    addToast(`Chart sent to ${email}`)
    onClose()
  }

  const benefits = [
    { icon: '\u2726', text: 'Full chart with headline, infographics & key findings' },
    { icon: '\uD83C\uDFA8', text: 'Brand the chart in your company colors' },
    { icon: '\uD83D\uDCCA', text: 'Us vs. Average industry comparison' },
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: 440,
          background: 'rgba(16,20,34,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 40,
          boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: 2,
            background: 'linear-gradient(90deg, transparent, #FF4562, transparent)',
            borderRadius: '0 0 2px 2px',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            color: 'rgba(232,236,241,0.5)',
            fontSize: 16,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        {/* Icon */}
        <div style={{ textAlign: 'center', fontSize: 36, marginBottom: 16 }}>
          {'\uD83D\uDCCA'}
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: '#E8ECF1',
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          Get your chart &mdash; and more
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 14,
            color: 'rgba(232,236,241,0.5)',
            textAlign: 'center',
            margin: '0 0 24px',
            lineHeight: 1.5,
          }}
        >
          Enter your work email to receive a presentation-ready chart.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{
              width: '100%',
              fontSize: 15,
              padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              color: '#E8ECF1',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />

          {/* Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '20px 0 24px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    minWidth: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,69,98,0.08)',
                    borderRadius: '50%',
                    fontSize: 12,
                  }}
                >
                  {b.icon}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(232,236,241,0.5)', lineHeight: 1.4 }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '14px 0',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              border: 'none',
              borderRadius: 12,
              cursor: isValid ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              ...(isValid
                ? {
                    background: 'linear-gradient(135deg, #FF4562, #FF4562CC)',
                    color: '#fff',
                    boxShadow: '0 4px 24px rgba(255,69,98,0.25)',
                  }
                : {
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(232,236,241,0.3)',
                  }),
            }}
          >
            Send me the chart
          </button>
        </form>

        {/* Note */}
        <p
          style={{
            fontSize: 11,
            color: 'rgba(232,236,241,0.25)',
            textAlign: 'center',
            margin: '14px 0 0',
          }}
        >
          We'll email your chart instantly. No spam.
        </p>
      </div>
    </div>
  )
}
