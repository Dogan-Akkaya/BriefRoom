import { useState } from "react";

const CATEGORIES = [
  { id: "ransomware", label: "Ransomware", svgPath: "M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2v2H10V6a2 2 0 0 1 2-2zm0 10a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z", desc: "Attack frequency, ransom demands, targeted sectors and recovery metrics" },
  { id: "phishing", label: "Phishing", svgPath: "M21 10a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7zM3 10l9 4 9-4M7 4h10l2 4H5l2-4z", desc: "Campaign volumes, click-through rates, delivery vectors and targets" },
  { id: "infostealer", label: "Infostealer Logs", svgPath: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z", desc: "Stolen credential volumes, affected domains and malware families" },
  { id: "logs_on_sale", label: "Logs on Sale", svgPath: "M3 3h18v4H3V3zm1 6h6v12H4V9zm8 0h8v5h-8V9zm0 7h8v5h-8v-5z", desc: "Dark web marketplace activity, pricing trends and access types" },
  { id: "data_leaks", label: "Data Leaks", svgPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-4 9h8v1c0 2.21-1.79 4-4 4s-4-1.79-4-4v-1z", desc: "Breach volumes, exposed record counts and leak sources" },
  { id: "employee_exposure", label: "Employee Data Exposure", svgPath: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-6 8a6 6 0 0 1 12 0H6z", desc: "Compromised corporate credentials and exposed PII" },
  { id: "dark_web_mentions", label: "Dark Web Mentions", svgPath: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7a5 5 0 0 0-3.54 1.46l1.42 1.42A3 3 0 0 1 15 12h2a5 5 0 0 0-5-5zm0 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2z", desc: "Brand mentions, threat actor chatter and sentiment tracking" },
  { id: "vulnerability", label: "Vulnerability Exploits", svgPath: "M12 2L4 7v6c0 5.25 3.4 10.15 8 11.35 4.6-1.2 8-6.1 8-11.35V7l-8-5zM11 10v4h2v-4h-2zm0 5v2h2v-2h-2z", desc: "CVE trends, exploit availability and patch gaps" },
  { id: "ddos", label: "DDoS Attacks", svgPath: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", desc: "Attack volumes, peak bandwidth and duration trends" },
  { id: "supply_chain", label: "Supply Chain Threats", svgPath: "M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.414-1.414m-1.414-8.486a4 4 0 0 1 5.656 0l4 4a4 4 0 1 1-5.656 5.656l-1.414-1.414", desc: "Third-party compromises and software supply chain attacks" },
];

const AVAILABLE_IDS = new Set([
  "ransomware",
  "phishing",
  "data_leaks",
  "vulnerability",
  "supply_chain",
  "dark_web_mentions",
]);

const CatIcon = ({ path, size = 20, color = "#FF4562" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={path} />
  </svg>
);

export default function CategoryPicker({ onSelect }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <>
      <style>{`
        @keyframes catCardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          gap: 14,
        }}
      >
        {CATEGORIES.map((cat, i) => {
          const available = AVAILABLE_IDS.has(cat.id);
          const hovered = hoveredId === cat.id;

          return (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredId(cat.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => available && onSelect(cat)}
              style={{
                background: !available ? "rgba(255,255,255,0.008)" : hovered
                  ? "rgba(255,255,255,0.035)"
                  : "rgba(255,255,255,0.015)",
                border: !available ? "1px solid rgba(255,255,255,0.03)" : hovered
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(255,255,255,0.06)",
                borderRadius: 18,
                padding: 26,
                cursor: available ? "pointer" : "default",
                opacity: available ? 1 : 0.45,
                transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
                backdropFilter: "blur(16px)",
                position: "relative",
                overflow: "hidden",
                animation: `catCardIn 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
                transform: available && hovered ? "translateY(-4px)" : "translateY(0)",
                boxShadow: available && hovered
                  ? "0 20px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,69,98,0.06)"
                  : "none",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,69,98,0.25), transparent)",
                  opacity: hovered ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              />

              {/* Icon + Label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "rgba(255,69,98,0.06)",
                    border: "1px solid rgba(255,69,98,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(255,69,98,0.05)",
                    flexShrink: 0,
                  }}
                >
                  <CatIcon path={cat.svgPath} size={20} color="#FF4562" />
                </div>
                <h3
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#E8ECF1",
                    margin: 0,
                  }}
                >
                  {cat.label}
                </h3>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(232,236,241,0.3)",
                  lineHeight: 1.55,
                  margin: 0,
                  fontFamily: "'Satoshi','DM Sans',sans-serif",
                }}
              >
                {cat.desc}
              </p>

              {/* Footer — Select or Coming soon */}
              <div
                style={{
                  marginTop: 14,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {available ? (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      color: "#FF4562",
                      opacity: 0.5,
                    }}
                  >
                    Select &rarr;
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10,
                      letterSpacing: "0.06em",
                      color: "rgba(232,236,241,0.25)",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 6,
                      padding: "3px 10px",
                    }}
                  >
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export { CatIcon, CATEGORIES, AVAILABLE_IDS };
