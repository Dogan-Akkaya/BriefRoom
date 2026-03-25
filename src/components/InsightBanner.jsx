import { useState, useEffect } from 'react'
import { insights } from '../lib/data'

export default function InsightBanner() {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIdx((i) => (i + 1) % insights.length)
        setFading(false)
      }, 300)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const goTo = (i) => {
    setFading(true)
    setTimeout(() => { setIdx(i); setFading(false) }, 300)
  }

  return (
    <div className="mx-7 mt-4 bg-gradient-to-br from-[rgba(232,70,58,0.06)] to-[rgba(75,131,238,0.06)] border border-[rgba(232,70,58,0.1)] rounded-lg p-3.5 px-[18px]">
      <div className="text-[9px] font-mono text-[var(--color-brand)] uppercase tracking-wider mb-1.5 flex items-center gap-[5px]">
        <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 1v4M5 7v1" /><circle cx="5" cy="5" r="4" /></svg>
        Key Intelligence Insight
      </div>
      <div
        className={`text-[13px] text-[var(--color-text-1)] leading-[1.5] font-medium transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
        dangerouslySetInnerHTML={{ __html: insights[idx] }}
      />
      <div className="flex gap-1 mt-2">
        {insights.map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 rounded-sm cursor-pointer transition-all ${i === idx ? 'w-3 bg-[var(--color-brand)]' : 'w-1 bg-[var(--color-text-3)]'}`}
          />
        ))}
      </div>
    </div>
  )
}
