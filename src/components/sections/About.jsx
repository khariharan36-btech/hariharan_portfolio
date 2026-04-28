import { useEffect, useRef } from 'react';
import { timeline } from '../../data/timeline';
import '../styles/about.css';

export default function About() {
  const timelineRef = useRef(null);

  useEffect(() => {
    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.3 }
    );
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section about">
      <h2 className="section-title">About Me</h2>
      <p className="section-subtitle">// system.profile —— loaded</p>

      <div className="about-grid">
        {/* Left – holographic avatar */}
        <div className="about-avatar-panel">
          <div className="about-avatar-frame">
            <div className="about-avatar-glyph">
              HK
            </div>
            <div className="about-orbit">
              <div className="about-orbit-dot" />
            </div>
            <div className="about-orbit about-orbit--2">
              <div className="about-orbit-dot about-orbit-dot--2" />
            </div>
          </div>
          <div className="about-info-tags">
            {['AI & DS', 'Python Dev', 'UI/UX', 'Pre-Final'].map(t => (
              <span key={t} className="about-tag">{t}</span>
            ))}
          </div>
        </div>

        {/* Right – info */}
        <div className="about-info">
          <p className="about-intro">
            Hey, I'm <strong>Hariharan K</strong> — a curious mind studying <strong>Artificial Intelligence &amp; Data Science</strong> in my pre-final year of B.Tech. I blend analytical thinking with creative design to build solutions that actually work and feel great to use.
          </p>

          <div className="about-details-grid">
            {[
              { label: 'Name',    value: 'Hariharan K' },
              { label: 'Degree',  value: 'B.Tech (Pre-final)' },
              { label: 'Branch',  value: 'AI & Data Science' },
              { label: 'Status',  value: '🟢 Open to Work' },
              { label: 'Focus',   value: 'AI · Design · Web' },
              { label: 'Location',value: 'India' },
            ].map(({ label, value }) => (
              <div key={label} className="about-detail-item">
                <span className="about-detail-label">{label}</span>
                <span className="about-detail-value">{value}</span>
              </div>
            ))}
          </div>

          <p className="about-timeline-title">// journey.log</p>

          <div className="timeline-list" ref={timelineRef}>
            {timeline.map((item, i) => (
              <div key={i} className="timeline-item" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="timeline-dot-wrap">
                  <div className="timeline-dot" style={{ borderColor: item.color, boxShadow: `0 0 12px ${item.color}60` }} />
                  <span className="timeline-icon">{item.icon}</span>
                </div>
                <div className="timeline-body">
                  <span className="timeline-year">{item.year}</span>
                  <p className="timeline-title-text">{item.title}</p>
                  <p className="timeline-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
