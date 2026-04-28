import { useState, useCallback } from 'react';
import Cursor       from './components/ui/Cursor';
import Loader       from './components/ui/Loader';
import Navbar       from './components/ui/Navbar';
import Hero         from './components/sections/Hero';
import About        from './components/sections/About';
import Skills       from './components/sections/Skills';
import Projects     from './components/sections/Projects';
import Achievements from './components/sections/Achievements';
import Contact      from './components/sections/Contact';
import { useLenis } from './hooks/useLenis';
import './styles/index.css';

function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      borderTop: '1px solid rgba(0,212,255,0.08)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
    }}>
      <span style={{ color: 'var(--neon-blue)' }}>Hariharan K</span>
      {' '}·{' '}
      Built with React + Three.js
      {' '}·{' '}
      <span style={{ color: 'var(--neon-purple)' }}>AI &amp; DS</span>
      {' '}·{' '}
      {new Date().getFullYear()}
    </footer>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <>
      <Cursor />
      {!loaded && <Loader onDone={handleLoaded} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Achievements />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
