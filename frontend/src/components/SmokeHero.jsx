import { useEffect, useRef } from 'react';

export default function SmokeHero() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -500, y: -500, px: -500, py: -500, moving: false });

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let w, h;

    const resize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const noise = (x, y, t) =>
      Math.sin(x * 0.007 + t * 0.0011) *
        Math.cos(y * 0.009 + t * 0.0013) *
        Math.sin((x + y) * 0.005 + t * 0.0007) +
      Math.sin(x * 0.013 + y * 0.011 + t * 0.0019) * 0.5;

    const mkP = (x, y, cfg = {}) => {
      const a = cfg.angle != null ? cfg.angle : Math.random() * Math.PI * 2;
      const s = cfg.speed || (Math.random() * 0.6 + 0.1);
      return {
        x: x + (Math.random() - 0.5) * (cfg.spread || 30),
        y: y + (Math.random() - 0.5) * (cfg.spread || 30),
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - (cfg.rise || 0.15),
        life: 1,
        decay: cfg.decay || (0.0008 + Math.random() * 0.0025),
        radius: Math.random() * (cfg.maxR || 70) + (cfg.minR || 25),
        growRate: cfg.grow || (Math.random() * 0.25 + 0.05),
        color: cfg.color || [199, 44, 65],
        opacity: cfg.opacity || 0.05,
        wobbleSpeed: Math.random() * 0.015 + 0.003,
        phase: Math.random() * Math.PI * 2,
        noiseOffX: Math.random() * 1000,
        noiseOffY: Math.random() * 1000,
        drag: 0.996 + Math.random() * 0.003,
      };
    };

    const ems = [
      { bx: 0.12, by: 0.55, color: [199, 44, 65], rate: 0.15, opacity: 0.045, maxR: 110 },
      { bx: 0.5, by: 0.65, color: [140, 35, 60], rate: 0.12, opacity: 0.035, maxR: 130 },
      { bx: 0.85, by: 0.5, color: [30, 58, 138], rate: 0.15, opacity: 0.045, maxR: 110 },
      { bx: 0.3, by: 0.75, color: [25, 45, 110], rate: 0.1, opacity: 0.035, maxR: 100 },
      { bx: 0.7, by: 0.45, color: [180, 40, 65], rate: 0.1, opacity: 0.04, maxR: 100 },
      { bx: 0.45, by: 0.35, color: [50, 35, 100], rate: 0.08, opacity: 0.03, maxR: 120 },
    ];

    const onMM = (e) => {
      const r = c.getBoundingClientRect();
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX - r.left;
      mouseRef.current.y = e.clientY - r.top;
      mouseRef.current.moving = true;
    };
    c.addEventListener('mousemove', onMM);
    c.addEventListener('mouseleave', () => {
      mouseRef.current.moving = false;
    });

    const draw = () => {
      timeRef.current++;
      const t = timeRef.current;
      ctx.fillStyle = 'rgba(10,14,26,0.04)';
      ctx.fillRect(0, 0, w, h);
      if (t % 90 === 0) {
        ctx.fillStyle = 'rgba(10,14,26,0.12)';
        ctx.fillRect(0, 0, w, h);
      }

      ems.forEach((em, idx) => {
        const wx = noise(idx * 100, 0, t) * 150;
        const wy = noise(0, idx * 100, t) * 100;
        const ex = em.bx * w + wx;
        const ey = em.by * h + wy;
        if (
          Math.random() <
          em.rate * (0.3 + Math.max(0, noise(idx * 50 + 500, t * 0.01, 0) + 0.7))
        ) {
          particlesRef.current.push(
            mkP(ex, ey, {
              color: em.color,
              opacity: em.opacity,
              maxR: em.maxR,
              minR: 20,
              speed: 0.2 + Math.random() * 0.4,
              rise: 0.1 + Math.random() * 0.15,
              angle:
                noise(ex * 0.01, ey * 0.01, t * 0.5) * Math.PI +
                (Math.random() - 0.5) * 1.2,
              spread: 50,
              decay: 0.0008 + Math.random() * 0.002,
            })
          );
        }
      });

      if (Math.random() < 0.003) {
        const bx = Math.random() * w;
        const by = 0.3 * h + Math.random() * 0.5 * h;
        const cols = [
          [199, 44, 65],
          [160, 38, 58],
          [30, 58, 138],
          [50, 40, 120],
        ];
        const bc = cols[Math.floor(Math.random() * cols.length)];
        for (let i = 0; i < 8 + Math.floor(Math.random() * 12); i++) {
          particlesRef.current.push(
            mkP(bx, by, {
              color: bc,
              opacity: 0.04 + Math.random() * 0.025,
              maxR: 60 + Math.random() * 80,
              minR: 15,
              speed: 0.3 + Math.random() * 0.8,
              angle: Math.random() * Math.PI * 2,
              rise: 0.05,
              spread: 20,
              decay: 0.001 + Math.random() * 0.002,
              grow: 0.15 + Math.random() * 0.2,
            })
          );
        }
      }

      if (Math.random() < 0.008) {
        const cx = Math.random() * w;
        const cy = 0.2 * h + Math.random() * 0.6 * h;
        particlesRef.current.push(
          mkP(cx, cy, {
            color: [140, 35, 60],
            opacity: 0.025,
            maxR: 140 + Math.random() * 80,
            minR: 80,
            speed: 0.05,
            rise: 0,
            angle: Math.random() * Math.PI * 2,
            decay: 0.0004 + Math.random() * 0.0006,
            grow: 0.08 + Math.random() * 0.1,
            spread: 10,
          })
        );
      }

      if (mouseRef.current.moving) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = mx - mouseRef.current.px;
        const dy = my - mouseRef.current.py;
        const sp = Math.sqrt(dx * dx + dy * dy);
        if (sp > 2) {
          const ma = Math.atan2(dy, dx);
          for (let i = 0; i < Math.min(Math.floor(sp / 5), 4); i++) {
            const cols = [
              [199, 44, 65],
              [160, 38, 58],
              [30, 58, 138],
            ];
            particlesRef.current.push(
              mkP(mx, my, {
                color: cols[Math.floor(Math.random() * cols.length)],
                opacity: 0.055,
                maxR: 45 + sp * 0.4,
                minR: 12,
                speed: 0.5 + Math.random() * 0.6,
                rise: 0.05,
                angle: ma + Math.PI + (Math.random() - 0.5) * 1.8,
                spread: 15,
                decay: 0.002 + Math.random() * 0.002,
              })
            );
          }
        }
      }

      const alive = [];
      particlesRef.current.forEach((p) => {
        p.life -= p.decay;
        if (p.life <= 0) return;
        const nf = noise(
          p.x * 0.008 + p.noiseOffX,
          p.y * 0.008 + p.noiseOffY,
          t * 0.4
        );
        p.vx += nf * 0.008;
        p.vy += Math.cos(nf * 3) * 0.005;
        p.x += p.vx;
        p.y += p.vy;
        p.radius += p.growRate;
        p.vx *= p.drag;
        p.vy *= p.drag;
        const al =
          p.life * p.opacity * (p.life > 0.8 ? (1 - p.life) / 0.2 + 0.01 : 1);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        g.addColorStop(0, `rgba(${p.color},${al * 1.4})`);
        g.addColorStop(0.35, `rgba(${p.color},${al * 0.6})`);
        g.addColorStop(0.7, `rgba(${p.color},${al * 0.15})`);
        g.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        alive.push(p);
      });

      particlesRef.current = alive.length > 400 ? alive.slice(-400) : alive;
      const vig = ctx.createRadialGradient(
        w / 2, h / 2, h * 0.15,
        w / 2, h / 2, h * 0.85
      );
      vig.addColorStop(0, 'rgba(10,14,26,0)');
      vig.addColorStop(1, 'rgba(10,14,26,0.55)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
      animRef.current = requestAnimationFrame(draw);
    };

    ctx.fillStyle = '#0A0E1A';
    ctx.fillRect(0, 0, w, h);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  );
}
