import { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import AmbientSmoke from '../components/AmbientSmoke'

export default function Explore() {
  const { dim, value, dim2, value2 } = useParams()

  useEffect(() => {
    const base = 'Custom Builder — Brief Room'
    if (dim && value && dim2 && value2) document.title = `${value} × ${value2} | ${base}`
    else if (dim && value) document.title = `${value} | ${base}`
    else document.title = base
  }, [dim, value, dim2, value2])

  // targetFocus = 0 on Screen 1 (no dim picked), 1 once Screen 2 is reached.
  const targetFocus = dim && value ? 1 : 0

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 70 }}>
      {/* Responsive 3-col grid shared by every stat section in the wizard.
          Cards span 1/2/3 columns based on their card_style (number/chart/quote).
          dense packing prevents span-3 items from leaving trailing gaps. */}
      <style>{`
        .slice-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-flow: dense;
          gap: 14px;
        }
        @media (max-width: 900px) {
          .slice-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 560px) {
          .slice-grid { grid-template-columns: 1fr; }
          .slice-grid > * { grid-column: span 1 !important; }
        }
      `}</style>
      <AmbientSmoke
        targetFocus={targetFocus}
        intensity={0.7}
        timeRate={0.8}
        lerpSpeed={0.05}
        particleCap={200}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Outlet />
      </div>
    </div>
  )
}
