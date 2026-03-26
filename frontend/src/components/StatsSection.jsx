import { useState, useEffect, useRef } from "react";

/* ── AnimNum ──
   Counts up from 0 to `end` over ~1.8s with an ease-out-cubic curve.
   Triggers once when the element scrolls into view. */
const AnimNum = ({ end, suffix = "" }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const ran = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !ran.current) {
          ran.current = true;
          const s = performance.now();
          const tick = (now) => {
            const p = Math.min((now - s) / 1800, 1);
            setVal(Math.round((1 - Math.pow(1 - p, 3)) * end));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ── Reveal ──
   Fade-in + slide-up when scrolled into view. */
const Reveal = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [v, setV] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setV(true);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(28px)",
        transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const STATS = [
  { n: 2400, s: "+", l: "CISOs using Brief Room" },
  { n: 47, s: "", l: "Countries covered" },
  { n: 180, s: "+", l: "Ready-made charts" },
  { n: 12, s: "s", l: "Avg. time to first chart" },
];

export default function StatsSection() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "60px 24px 80px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      {/* Top divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,69,98,0.1), transparent)",
          marginBottom: 56,
        }}
      />

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 12,
          textAlign: "center",
        }}
      >
        {STATS.map((stat, i) => (
          <Reveal key={i} delay={i * 70}>
            <div style={{ padding: "28px 8px" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#FF4562",
                  lineHeight: 1,
                  marginBottom: 6,
                  letterSpacing: "-0.02em",
                }}
              >
                <AnimNum end={stat.n} />
                {stat.s}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "rgba(232,236,241,0.25)",
                  textTransform: "uppercase",
                }}
              >
                {stat.l}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Bottom divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(255,69,98,0.1), transparent)",
          marginTop: 56,
        }}
      />
    </section>
  );
}

export { AnimNum, Reveal };
