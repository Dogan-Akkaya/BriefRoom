import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`
        .br-nav-link {
          font-size: 13px;
          color: rgba(232,236,241,0.38);
          cursor: pointer;
          transition: color 0.2s;
          font-weight: 500;
          background: none;
          border: none;
          font-family: 'Satoshi','DM Sans',sans-serif;
        }
        .br-nav-link:hover { color: #E8ECF1; }
        @media(max-width:900px) { .br-nav-desktop { display: none !important; } }
      `}</style>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(180deg,rgba(10,14,26,0.97) 0%,rgba(10,14,26,0.85) 60%,rgba(10,14,26,0) 100%)",
          backdropFilter: "blur(20px)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s 0.1s",
        }}
      >
        {/* Left — Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 28 28">
            <circle cx="14" cy="14" r="12.5" fill="none" stroke="#FF4562" strokeWidth="1.2" opacity="0.5" />
            <circle cx="14" cy="14" r="5.5" fill="#FF4562" opacity="0.75" />
            <circle cx="14" cy="14" r="2" fill="#0A0E1A" />
          </svg>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(232,236,241,0.4)",
                letterSpacing: "0.05em",
              }}
            >
              SOCRadar
            </span>
            <span style={{ color: "rgba(255,255,255,0.08)", fontSize: 16 }}>/</span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: "#E8ECF1",
                letterSpacing: "-0.02em",
              }}
            >
              Brief Room
            </span>
          </div>
        </div>

        {/* Right — Nav links + CTA */}
        <div
          className="br-nav-desktop"
          style={{ display: "flex", gap: 28, alignItems: "center" }}
        >
          <span className="br-nav-link">Popular Charts</span>
          <span className="br-nav-link" onClick={() => navigate("/builder")}>
            Custom Builder
          </span>
          <span className="br-nav-link">Methodology</span>
          <button
            onClick={() => navigate("/builder")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 20px",
              fontFamily: "'Satoshi','DM Sans',sans-serif",
              fontSize: 12,
              fontWeight: 600,
              border: "none",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
              background: "#FF4562",
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#FF5A75";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,69,98,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FF4562";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Create Free Chart
          </button>
        </div>
      </nav>
    </>
  );
}
