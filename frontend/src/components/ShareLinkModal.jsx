import { useState } from 'react'
import { useToastStore } from '../stores/useToastStore'

export default function ShareLinkModal({ onClose, categoryId }) {
  const [copied, setCopied] = useState(false)
  const toast = useToastStore((s) => s.show)

  const shareUrl = `${window.location.origin}/chart/${categoryId || 'custom'}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast('Link copied to clipboard')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast('Failed to copy link')
    }
  }

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
          maxWidth: 400,
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
          {'\uD83D\uDD17'}
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: '#E8ECF1',
            textAlign: 'center',
            margin: '0 0 8px',
          }}
        >
          Share this chart
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 13,
            color: 'rgba(232,236,241,0.5)',
            textAlign: 'center',
            margin: '0 0 24px',
            lineHeight: 1.5,
          }}
        >
          Anyone with this link can view the chart.
        </p>

        {/* Link field */}
        <input
          type="text"
          readOnly
          value={shareUrl}
          style={{
            width: '100%',
            fontSize: 12,
            fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
            padding: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            color: 'rgba(232,236,241,0.6)',
            outline: 'none',
            boxSizing: 'border-box',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        />

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            marginTop: 12,
            padding: 12,
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            color: '#E8ECF1',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? 'Copied \u2713' : 'Copy Link'}
        </button>

        {/* Note */}
        <p
          style={{
            fontSize: 11,
            color: 'rgba(232,236,241,0.55)',
            textAlign: 'center',
            margin: '14px 0 0',
          }}
        >
          Link expires in 30 days.
        </p>
      </div>
    </div>
  )
}
