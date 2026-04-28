import { useState, useEffect } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import '../styles/ui.css';

const NAV_LINKS = [
  { id: 'hero',         label: 'Home' },
  { id: 'about',        label: 'About' },
  { id: 'skills',       label: 'Skills' },
  { id: 'projects',     label: 'Projects' },
  { id: 'achievements', label: 'Achieve' },
  { id: 'contact',      label: 'Contact' },
];

export default function Navbar() {
  const { section } = useScrollProgress();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => scrollTo('hero')}>
          <span className="navbar-logo-bracket">[</span>
          HK
          <span className="navbar-logo-bracket">]</span>
        </button>

        {/* Desktop Links */}
        <ul className="navbar-links">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id}>
              <button
                className={`navbar-link ${section === id ? 'navbar-link--active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                <span className="navbar-link-num">{String(NAV_LINKS.indexOf({ id, label }) + 1).padStart(2,'0')}.</span>
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a href="#contact" className="navbar-cta btn-neon" onClick={e => { e.preventDefault(); scrollTo('contact'); }}>
          Hire Me
        </a>

        {/* Hamburger */}
        <button
          className={`navbar-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${menuOpen ? 'navbar-mobile--open' : ''}`}>
        {NAV_LINKS.map(({ id, label }) => (
          <button key={id} className="navbar-mobile-link" onClick={() => scrollTo(id)}>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
