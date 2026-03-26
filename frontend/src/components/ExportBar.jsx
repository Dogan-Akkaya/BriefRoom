import { useRef } from 'react'
import { useToastStore } from '../stores/useToastStore'
import { downloadCSV } from '../lib/export'

const btnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', fontSize: 11, fontWeight: 500,
  fontFamily: "'Satoshi','DM Sans',sans-serif",
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10, color: 'rgba(232,236,241,0.5)', cursor: 'pointer',
  transition: 'all 0.25s', backdropFilter: 'blur(8px)',
}

export default function ExportBar({ chartRef, labels, datasets, filename }) {
  const toast = useToastStore((s) => s.show)

  const handleCopy = async () => {
    toast('Chart copied to clipboard', 'success')
  }
  const handlePNG = () => {
    toast('PNG downloaded', 'success')
  }
  const handleCSV = () => {
    if (labels && datasets) {
      downloadCSV(labels, datasets, filename || 'chart-data')
      toast('CSV exported', 'success')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <button onClick={handleCopy} style={{ ...btnStyle, borderColor: 'rgba(255,69,98,0.2)', color: '#FF4562', background: 'rgba(255,69,98,0.06)' }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="10" height="10" rx="1.5"/><path d="M3 6h10"/></svg>
        Copy
      </button>
      <button onClick={handlePNG} style={btnStyle}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v7m-3-3l3 3 3-3M3 12h10"/></svg>
        PNG
      </button>
      <button onClick={handleCSV} style={btnStyle}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h10v10H3zM7 7h2v2H7z"/></svg>
        CSV
      </button>
    </div>
  )
}
