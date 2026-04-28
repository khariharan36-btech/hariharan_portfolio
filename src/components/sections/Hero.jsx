import { useState, useEffect, useRef } from 'react';
import HeroCanvas from '../canvas/HeroCanvas';
import NeuralBackground from '../canvas/NeuralBackground';
import '../styles/hero.css';

const TYPEWRITER_STRINGS = [
  'Initializing AI System...',
  'B.Tech — AI & Data Science',
  'Building Digital Universes',
  'Python · C · React · UI/UX',
];

function useTypewriter(strings, speed = 65) {
  const [display, setDisplay] = useState('');
  const [strIdx, setStrIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = strings[strIdx];
    const delay = deleting ? speed / 2 : speed;
    const timer = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1800);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setStrIdx(s => (s + 1) % strings.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, strIdx, strings, speed]);

  return display;
}

export default function Hero() {
  const text = useTypewriter(TYPEWRITER_STRINGS);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero">
      {/* Neural network background */}
      <div className="hero-canvas-bg">
        <NeuralBackground />
      </div>

      <div className="hero-content">
        {/* Left: Text */}
        <div className="hero-text">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for Internships &amp; Projects
          </div>

          <h1 className="hero-name">
            Hariharan K
          </h1>

          <div className="hero-typewriter">
            <span>{text}</span>
            <span className="hero-typewriter-cursor" />
          </div>

          <p className="hero-description">
            Pre-final year B.Tech student specialising in <strong>Artificial Intelligence &amp; Data Science</strong>. I craft intelligent systems, beautiful interfaces, and immersive experiences.
          </p>

          <div className="hero-actions">
            <button className="btn-neon" onClick={() => scrollTo('projects')}>
              View Projects
            </button>
            <button className="btn-neon btn-neon-purple" onClick={() => scrollTo('contact')}>
              Get In Touch
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <span className="hero-stat-value">8+</span>
              <span className="hero-stat-label">Projects</span>
            </div>
            <div>
              <span className="hero-stat-value">4</span>
              <span className="hero-stat-label">Core Skills</span>
            </div>
            <div>
              <span className="hero-stat-value">2025</span>
              <span className="hero-stat-label">Pre-final Year</span>
            </div>
          </div>
        </div>

        {/* Right: 3D Canvas */}
        <div className="hero-canvas-col">
          <HeroCanvas />
          <div className="hero-chip">⚡ Python · TensorFlow</div>
          <div className="hero-chip">🎨 UI/UX Design</div>
          <div className="hero-chip">⚛️ React Basics</div>
          <div className="hero-chip">⚙️ C Programming</div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  );
}
