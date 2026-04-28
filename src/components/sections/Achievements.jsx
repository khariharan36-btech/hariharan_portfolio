import { useEffect, useRef, useState } from 'react';
import { achievements, certifications } from '../../data/timeline';
import '../styles/achievements.css';

function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(ease * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref} className="stat-value">{count}{suffix}</span>;
}

// Simple SVG radar chart
function RadarChart() {
  const skills = [
    { label: 'Python',  value: 82, color: '#00d4ff' },
    { label: 'UI/UX',   value: 78, color: '#a855f7' },
    { label: 'C Prog',  value: 75, color: '#06b6d4' },
    { label: 'React',   value: 60, color: '#ec4899' },
    { label: 'AI/ML',   value: 70, color: '#10b981' },
  ];
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 70;
  const n = skills.length;

  const toXY = (i, pct) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const dist  = r * (pct / 100);
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const labelPts = skills.map((_, i) => toXY(i, 115));
  const dataPts  = skills.map((s, i) => toXY(i, s.value));
  const dataPath = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';

  return (
    <div className="hud-radar">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {gridLevels.map((lvl, gi) => {
          const pts = skills.map((_, i) => toXY(i, lvl * 100));
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
          return <path key={gi} d={d} fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />;
        })}
        {/* Axes */}
        {skills.map((_, i) => {
          const [x, y] = toXY(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(0,212,255,0.15)" strokeWidth="1" />;
        })}
        {/* Data polygon */}
        <path d={dataPath} fill="rgba(0,212,255,0.12)" stroke="#00d4ff" strokeWidth="1.5" />
        {/* Dots */}
        {dataPts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={skills[i].color} />
        ))}
        {/* Labels */}
        {labelPts.map(([x, y], i) => (
          <text key={i} x={x} y={y} fill="rgba(148,163,184,0.8)" fontSize="9" textAnchor="middle" dominantBaseline="middle" fontFamily="monospace">
            {skills[i].label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function Achievements() {
  return (
    <section id="achievements" className="section achievements">
      <h2 className="section-title">Achievements</h2>
      <p className="section-subtitle">// dashboard.metrics —— live</p>

      <div className="achievements-inner">
        {/* Stat counters */}
        <div className="achievements-stats">
          {achievements.map(a => (
            <div key={a.id} className="stat-card">
              <div className="stat-icon">{a.icon}</div>
              <CountUp target={a.value} suffix={a.suffix} />
              <p className="stat-label">{a.label}</p>
            </div>
          ))}
        </div>

        {/* HUD with Radar */}
        <div className="achievements-hud">
          <RadarChart />
          <div className="hud-labels">
            {[
              { name: 'Python',   val: '82%', color: '#00d4ff' },
              { name: 'UI/UX',    val: '78%', color: '#a855f7' },
              { name: 'C Prog.',  val: '75%', color: '#06b6d4' },
              { name: 'React',    val: '60%', color: '#ec4899' },
              { name: 'AI / ML',  val: '70%', color: '#10b981' },
            ].map(({ name, val, color }) => (
              <div key={name} className="hud-label-item">
                <div className="hud-label-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                <span className="hud-label-name">{name}</span>
                <span className="hud-label-val">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <p className="achievements-certs-title">// certifications.log</p>
          <div className="certs-grid">
            {certifications.map((c, i) => (
              <div key={i} className="cert-card">
                <div className="cert-bar" style={{ background: c.color, boxShadow: `0 0 8px ${c.color}80` }} />
                <div className="cert-info">
                  <p className="cert-title">{c.title}</p>
                  <p className="cert-issuer">{c.issuer}</p>
                  <p className="cert-year">{c.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
