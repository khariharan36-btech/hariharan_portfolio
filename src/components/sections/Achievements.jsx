import { useEffect, useRef, useState } from 'react';
import { achievements, certifications } from '../../data/timeline';
import '../styles/achievements.css';

/* ── Count-up stat ─────────────────────────────────────────── */
function CountUp({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref     = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const start = performance.now();
          const tick = (now) => {
            const p    = Math.min((now - start) / duration, 1);
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

/* ── Spider radar chart ────────────────────────────────────── */
const RADAR_SKILLS = [
  { label: 'Python',  value: 82, color: '#00d4ff' },
  { label: 'UI/UX',  value: 78, color: '#a855f7' },
  { label: 'C Prog', value: 75, color: '#06b6d4' },
  { label: 'React',  value: 60, color: '#61dafb' },
  { label: 'AI/ML',  value: 70, color: '#10b981' },
  { label: 'DSA',    value: 72, color: '#f59e0b' },
];

function SpiderRadarChart({ activeIndex, onHover }) {
  const size = 260;
  const cx = size / 2, cy = size / 2, r = 95;
  const n = RADAR_SKILLS.length;

  const toXY = (i, pct) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const dist  = r * (pct / 100);
    return [cx + dist * Math.cos(angle), cy + dist * Math.sin(angle)];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const labelPts   = RADAR_SKILLS.map((_, i) => toXY(i, 120));
  const dataPts    = RADAR_SKILLS.map((s, i) => toXY(i, s.value));
  const dataPath   = dataPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';

  /* Spider body — starts at centre, moves toward active vertex */
  const [spiderPos, setSpiderPos] = useState({ x: cx, y: cy });
  const spiderAnimRef = useRef(null);

  useEffect(() => {
    const target =
      activeIndex !== null
        ? { x: dataPts[activeIndex][0], y: dataPts[activeIndex][1] }
        : { x: cx, y: cy };

    let sx = spiderPos.x, sy = spiderPos.y;
    cancelAnimationFrame(spiderAnimRef.current);

    const animate = () => {
      sx += (target.x - sx) * 0.1;
      sy += (target.y - sy) * 0.1;
      setSpiderPos({ x: sx, y: sy });
      if (Math.abs(target.x - sx) > 0.3 || Math.abs(target.y - sy) > 0.3) {
        spiderAnimRef.current = requestAnimationFrame(animate);
      } else {
        setSpiderPos(target);
      }
    };
    spiderAnimRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(spiderAnimRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  /* Spider SVG legs */
  const legAngles = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  const legLen = 10;

  return (
    <div className="hud-radar">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: 'visible' }}
      >
        {/* Grid rings */}
        {gridLevels.map((lvl, gi) => {
          const pts = RADAR_SKILLS.map((_, i) => toXY(i, lvl * 100));
          const d   = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
          return (
            <path
              key={gi}
              d={d}
              fill="none"
              stroke={`rgba(0,212,255,${0.06 + gi * 0.04})`}
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        {RADAR_SKILLS.map((_, i) => {
          const [x, y] = toXY(i, 100);
          const isActive = activeIndex === i;
          return (
            <line
              key={i}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={isActive ? RADAR_SKILLS[i].color : 'rgba(0,212,255,0.18)'}
              strokeWidth={isActive ? 1.5 : 1}
            />
          );
        })}

        {/* Data polygon */}
        <path
          d={dataPath}
          fill="rgba(0,212,255,0.08)"
          stroke="#00d4ff"
          strokeWidth="1.5"
        />

        {/* Silk thread from spider to vertices */}
        {activeIndex !== null &&
          dataPts.map(([x, y], i) => (
            <line
              key={i}
              x1={spiderPos.x}
              y1={spiderPos.y}
              x2={x}
              y2={y}
              stroke={`${RADAR_SKILLS[i].color}40`}
              strokeWidth="0.8"
              strokeDasharray="3 4"
            />
          ))}

        {/* Active data point highlight */}
        {activeIndex !== null && (
          <circle
            cx={dataPts[activeIndex][0]}
            cy={dataPts[activeIndex][1]}
            r="6"
            fill={RADAR_SKILLS[activeIndex].color}
            opacity="0.9"
          />
        )}

        {/* All data dots */}
        {dataPts.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={activeIndex === i ? 5 : 3}
            fill={RADAR_SKILLS[i].color}
            style={{ transition: 'r 0.2s' }}
          />
        ))}

        {/* Labels — clickable / hoverable */}
        {labelPts.map(([x, y], i) => (
          <text
            key={i}
            x={x}
            y={y}
            fill={activeIndex === i ? RADAR_SKILLS[i].color : 'rgba(148,163,184,0.85)'}
            fontSize="9"
            fontWeight={activeIndex === i ? '700' : '400'}
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="monospace"
            style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onHover(i)}
          >
            {RADAR_SKILLS[i].label}
          </text>
        ))}

        {/* ── Spider ── */}
        <g>
          {/* Legs */}
          {legAngles.map((angle, i) => {
            const bent = activeIndex !== null
              ? angle + Math.sin(Date.now() * 0.002 + i) * 0.3
              : angle;
            return (
              <line
                key={i}
                x1={spiderPos.x}
                y1={spiderPos.y}
                x2={spiderPos.x + Math.cos(bent) * legLen}
                y2={spiderPos.y + Math.sin(bent) * legLen}
                stroke={activeIndex !== null ? '#a855f7' : '#00d4ff'}
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            );
          })}
          {/* Body segments */}
          <ellipse
            cx={spiderPos.x}
            cy={spiderPos.y - 2}
            rx="4.5"
            ry="3.5"
            fill={activeIndex !== null ? '#a855f7' : '#00d4ff'}
            opacity="0.95"
          />
          <ellipse
            cx={spiderPos.x}
            cy={spiderPos.y + 3.5}
            rx="3.5"
            ry="4.5"
            fill={activeIndex !== null ? '#7c3aed' : '#0891b2'}
            opacity="0.95"
          />
          {/* Eyes */}
          <circle cx={spiderPos.x - 1.5} cy={spiderPos.y - 3} r="1" fill="#fff" />
          <circle cx={spiderPos.x + 1.5} cy={spiderPos.y - 3} r="1" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}

/* ── Skill progress bar row ────────────────────────────────── */
function SkillBar({ name, val, color, isActive, onHover }) {
  const barRef   = useRef(null);
  const started  = useRef(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          // Small delay so CSS transition has time to attach
          setTimeout(() => setWidth(parseInt(val, 10)), 120);
        }
      },
      { threshold: 0.3 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, [val]);

  return (
    <div
      className={`hud-label-item ${isActive ? 'hud-label-active' : ''}`}
      onMouseEnter={() => onHover(RADAR_SKILLS.findIndex(s => s.label === name))}
      onMouseLeave={() => onHover(null)}
      onClick={() => onHover(RADAR_SKILLS.findIndex(s => s.label === name))}
      style={{ cursor: 'pointer' }}
    >
      <div className="hud-label-dot" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
      <span className="hud-label-name">{name}</span>
      <span className="hud-label-val">{val}</span>

      {/* Progress bar */}
      <div className="hud-bar-bg" ref={barRef}>
        <div
          className="hud-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            boxShadow: `0 0 6px ${color}80`,
            transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  );
}

/* ── Main section ──────────────────────────────────────────── */
export default function Achievements() {
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <section id="achievements" className="section achievements">
      <h2 className="section-title">Achievements</h2>
      <p className="section-subtitle">// dashboard.metrics —— live</p>

      <div className="achievements-inner">
        {/* Stat counters */}
        <div className="achievements-stats">
          {achievements.map(a => (
            <div key={a.id} className="stat-card">
              <div className="stat-icon-wrap" style={{ color: a.color || 'var(--neon-blue)' }}>
                {a.symbol}
              </div>
              <CountUp target={a.value} suffix={a.suffix} />
              <p className="stat-label">{a.label}</p>
            </div>
          ))}
        </div>

        {/* HUD — radar + skill bars */}
        <div className="achievements-hud">
          <SpiderRadarChart activeIndex={activeIdx} onHover={setActiveIdx} />

          <div className="hud-labels">
            {RADAR_SKILLS.map(({ label, value, color }, i) => (
              <SkillBar
                key={label}
                name={label}
                val={`${value}%`}
                color={color}
                isActive={activeIdx === i}
                onHover={setActiveIdx}
              />
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
