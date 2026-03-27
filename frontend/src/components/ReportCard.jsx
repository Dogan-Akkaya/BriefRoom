import React, { useState, useCallback } from 'react'
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, ResponsiveContainer,
} from 'recharts'

const styles = {
  card: {
    background: 'rgba(59,130,246,0.03)',
    border: '1px solid rgba(59,130,246,0.08)',
    borderRadius: 20,
    padding: 24,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
  },
  cardHovered: {
    borderColor: 'rgba(59,130,246,0.15)',
    transform: 'translateY(-4px)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sourceBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 600,
    background: 'rgba(59,130,246,0.08)',
    color: 'rgba(232,236,241,0.6)',
    padding: '3px 9px',
    borderRadius: 6,
  },
  year: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: 'rgba(232,236,241,0.25)',
  },
  categoryTag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    color: 'rgba(232,236,241,0.3)',
    background: 'rgba(255,255,255,0.03)',
    padding: '3px 8px',
    borderRadius: 5,
    letterSpacing: '0.04em',
  },
  externalBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(232,236,241,0.25)',
    padding: '2px 7px',
    borderRadius: 4,
    letterSpacing: '0.04em',
  },
  chartArea: {
    height: 180,
    marginBottom: 16,
    marginLeft: -12,
    marginRight: -4,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#E8ECF1',
    lineHeight: 1.35,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: 'rgba(232,236,241,0.35)',
    lineHeight: 1.6,
    marginBottom: 16,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTop: '1px solid rgba(59,130,246,0.06)',
  },
  sourceText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: 'rgba(232,236,241,0.18)',
  },
  downloadBtn: {
    padding: '5px 12px',
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 7,
    background: 'rgba(59,130,246,0.08)',
    color: '#60A5FA',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Satoshi', sans-serif",
    transition: 'all 0.2s',
  },
}

export default function ReportCard({ report, onClick }) {
  const [hovered, setHovered] = useState(false)

  const chartData = report.dummyLabels.map((label, i) => ({
    name: label,
    value: report.dummyData[i],
  }))

  const cardStyle = {
    ...styles.card,
    ...(hovered ? styles.cardHovered : {}),
  }

  const handleDownload = useCallback((e) => {
    e.stopPropagation()
    // placeholder for PNG export
  }, [])

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* External source watermark */}
      <span style={styles.externalBadge}>External Source</span>

      {/* Top row: source badge + year + category */}
      <div style={styles.topRow}>
        <span style={styles.sourceBadge}>{report.sourceShort}</span>
        <span style={styles.year}>{report.year}</span>
        <span style={styles.categoryTag}>{report.category}</span>
      </div>

      {/* Mini chart */}
      <div style={styles.chartArea}>
        <ResponsiveContainer width="100%" height="100%">
          {report.chartType === 'line' ? (
            <LineChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: 'rgba(232,236,241,0.2)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke={report.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: 'rgba(232,236,241,0.2)' }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis hide />
              <Bar
                dataKey="value"
                fill={report.color}
                radius={[3, 3, 0, 0]}
                isAnimationActive={false}
                fillOpacity={0.7}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Title */}
      <h4 style={styles.title}>{report.title}</h4>

      {/* Description */}
      <p style={styles.description}>{report.description}</p>

      {/* Bottom row */}
      <div style={styles.bottomRow}>
        <span style={styles.sourceText}>Source: {report.source}</span>
        <button style={styles.downloadBtn} onClick={handleDownload}>
          Download PNG
        </button>
      </div>
    </div>
  )
}
