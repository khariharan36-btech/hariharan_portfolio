import { useState, useEffect, useRef } from 'react';
import { skills } from '../../data/skills';
import SkillOrb        from '../canvas/SkillOrb';
import SkillGear       from '../canvas/SkillGear';
import SkillCanvasComp from '../canvas/SkillCanvasComp';
import SkillNodes      from '../canvas/SkillNodes';
import '../styles/skills.css';

const CANVAS_MAP = {
  orb:    SkillOrb,
  gear:   SkillGear,
  canvas: SkillCanvasComp,
  nodes:  SkillNodes,
};

function SkillCard({ skill }) {
  const [hovered, setHovered] = useState(false);
  const barRef = useRef(null);
  const CanvasComp = CANVAS_MAP[skill.type];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && barRef.current) {
          barRef.current.classList.add('animated');
        }
      },
      { threshold: 0.4 }
    );
    if (barRef.current) observer.observe(barRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="skill-card"
      style={{ '--skill-color': skill.color }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="skill-canvas-wrap">
        <CanvasComp hovered={hovered} />
      </div>

      <div className="skill-info">
        <div className="skill-name" style={{ color: skill.color }}>
          {skill.name}
        </div>
        <p className="skill-desc">{skill.description}</p>

        <div className="skill-bar-wrap">
          <div className="skill-bar-bg">
            <div
              ref={barRef}
              className="skill-bar-fill"
              style={{
                '--level': `${skill.level}%`,
                background: `linear-gradient(90deg, ${skill.color}, ${skill.color}99)`,
                boxShadow: `0 0 8px ${skill.color}80`,
              }}
            />
          </div>
          <span className="skill-pct" style={{ color: skill.color }}>{skill.level}%</span>
        </div>

        <div className="skill-tags">
          {skill.tags.map(tag => (
            <span key={tag} className="skill-tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section skills">
      <h2 className="section-title">Skills</h2>
      <p className="section-subtitle">// skill_matrix.load() —— interactive</p>
      <div className="skills-grid">
        {skills.map(skill => <SkillCard key={skill.id} skill={skill} />)}
      </div>
    </section>
  );
}
