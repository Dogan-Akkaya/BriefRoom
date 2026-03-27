import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(t);
  }, []);

  const links = [
    { label: "Popular Charts", path: "/popular" },
    { label: "Global Reports", path: "/reports" },
    { label: "Custom Builder", path: "/builder" },
    { label: "Methodology", path: "/methodology" },
  ];

  return (
    <>
      <style>{`
        .br-nav-link {
          font-size: 13px;
          color: rgba(232,236,241,0.7);
          cursor: pointer;
          transition: color 0.2s;
          font-weight: 500;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          padding-bottom: 4px;
          font-family: 'Satoshi','DM Sans',sans-serif;
        }
        .br-nav-link:hover { color: #E8ECF1; }
        .br-nav-link.active {
          color: #E8ECF1;
          border-bottom-color: #FF4562;
        }
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
          justifyContent: "center",
          background:
            "linear-gradient(180deg,rgba(10,14,26,0.97) 0%,rgba(10,14,26,0.85) 60%,rgba(10,14,26,0) 100%)",
          backdropFilter: "blur(20px)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s 0.1s",
        }}
      >
        <div
          className="br-nav-desktop"
          style={{ display: "flex", gap: 28, alignItems: "center" }}
        >
          {links.map((link) => (
            <span
              key={link.path}
              className={`br-nav-link${location.pathname.startsWith(link.path) ? " active" : ""}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </span>
          ))}
        </div>
      </nav>
    </>
  );
}
