import React from "react";
import Spark from "./Spark";

const styles = {
  card: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 28,
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
  },
  cardHovered: {
    borderColor: "rgba(255,69,98,0.18)",
    transform: "translateY(-4px)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
    background: "rgba(255,255,255,0.035)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tagPill: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    background: "rgba(255,255,255,0.04)",
    color: "rgba(232,236,241,0.35)",
    padding: "4px 10px",
    borderRadius: 6,
  },
  viewsWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  views: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: "rgba(232,236,241,0.18)",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  updated: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: "rgba(232,236,241,0.12)",
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 4,
    lineHeight: 1.3,
    color: "#E8ECF1",
  },
  detail: {
    fontSize: 13,
    color: "rgba(232,236,241,0.35)",
    lineHeight: 1.6,
    marginTop: 12,
    marginBottom: 16,
  },
  metricsRow: {
    display: "flex",
    gap: 10,
    marginBottom: 18,
  },
  metricBox: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.04)",
    flex: 1,
    minWidth: 100,
  },
  metricLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9,
    color: "rgba(232,236,241,0.2)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sparkMonths: {
    fontFamily: "'JetBrains Mono', monospace",
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
    fontSize: 9,
    color: "rgba(232,236,241,0.1)",
  },
  bottomRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid rgba(255,255,255,0.04)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceText: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    color: "rgba(232,236,241,0.15)",
  },
  openBtn: {
    padding: "6px 14px",
    fontSize: 11,
    borderRadius: 8,
    background: "rgba(255,255,255,0.04)",
    color: "rgba(232,236,241,0.45)",
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 500,
    transition: "all 0.2s",
  },
};

export default function PopularChartCard({
  title,
  views,
  tag,
  trend,
  up,
  color,
  data,
  sources,
  updated,
  detail,
  metrics,
  isHovered,
  onHover,
  onLeave,
  onClick,
}) {
  const cardStyle = {
    ...styles.card,
    ...(isHovered ? styles.cardHovered : {}),
  };

  const trendStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 500,
    color: up ? "#FF4562" : "#10B981",
  };

  const metricValueStyle = (c) => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: c,
  });

  const sparkWrapStyle = {
    transform: isHovered ? "scaleY(1.06)" : "scaleY(1)",
    transformOrigin: "bottom",
    transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Top row */}
      <div style={styles.topRow}>
        <span style={styles.tagPill}>{tag}</span>
        <div style={styles.viewsWrap}>
          <span style={styles.views}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {views}
          </span>
          <span style={styles.updated}>Updated {updated}</span>
        </div>
      </div>

      {/* Title */}
      <h4 style={styles.title}>{title}</h4>

      {/* Trend */}
      <span style={trendStyle}>
        {up ? "▲" : "▼"} {trend}
      </span>

      {/* Detail */}
      <p style={styles.detail}>{detail}</p>

      {/* Metrics */}
      <div style={styles.metricsRow}>
        {metrics &&
          metrics.map((m, mi) => (
            <div key={mi} style={styles.metricBox}>
              <div style={styles.metricLabel}>{m.label}</div>
              <div style={metricValueStyle(color)}>{m.value}</div>
            </div>
          ))}
      </div>

      {/* Spark chart */}
      <div style={sparkWrapStyle}>
        <Spark data={data} color={color} />
      </div>
      <div style={styles.sparkMonths}>
        <span>JAN 2025</span>
        <span>DEC 2025</span>
      </div>

      {/* Bottom */}
      <div style={styles.bottomRow}>
        <span style={styles.sourceText}>Source: {sources}</span>
        <span style={styles.openBtn}>Open →</span>
      </div>
    </div>
  );
}
