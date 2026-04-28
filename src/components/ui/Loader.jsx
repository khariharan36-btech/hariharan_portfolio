import { useEffect, useRef, useState } from 'react';
import '../styles/ui.css';

const BOOT_LINES = [
  '> Initializing AI Core...             [OK]',
  '> Loading Neural Network modules...   [OK]',
  '> Mounting holographic interface...   [OK]',
  '> Calibrating 3D renderer...          [OK]',
  '> Syncing skill database...           [OK]',
  '> Establishing secure connection...   [OK]',
  '> All systems operational.',
  '',
  '  Welcome to HARIHARAN K // AI Lab v2.5',
];

export default function Loader({ onDone }) {
  const [lines,    setLines]    = useState([]);
  const [barWidth, setBarWidth] = useState(0);
  const [done,     setDone]     = useState(false);

  // Use a ref so the effect never needs onDone as a dep — avoids Strict Mode re-runs
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);

  // Boot sequence — runs once only
  useEffect(() => {
    let i = 0;
    let stopped = false;

    const interval = setInterval(() => {
      if (stopped) return;
      if (i < BOOT_LINES.length) {
        const captured = i;
        setLines(prev => [...prev, BOOT_LINES[captured]]);
        setBarWidth(Math.round(((captured + 1) / BOOT_LINES.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        // Fade out
        setTimeout(() => {
          if (!stopped) setDone(true);
        }, 400);
        // Unmount loader
        setTimeout(() => {
          if (!stopped) onDoneRef.current?.();
        }, 1100);
      }
    }, 150);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, []); // empty deps — intentional

  return (
    <div className={`loader-overlay ${done ? 'loader-exit' : ''}`}>
      <div className="loader-content">
        <div className="loader-logo">
          <span className="loader-logo-text">H<span>.</span>K</span>
          <div className="loader-logo-ring" />
          <div className="loader-logo-ring loader-logo-ring--2" />
        </div>

        <div className="loader-terminal">
          {lines.map((line, i) => (
            <div key={i} className="loader-line">
              <span className="loader-line-text">{line}</span>
            </div>
          ))}
          <span className="loader-cursor" />
        </div>

        <div className="loader-bar-wrap">
          <div className="loader-bar" style={{ width: `${barWidth}%` }} />
          <span className="loader-bar-pct">{barWidth}%</span>
        </div>
      </div>
    </div>
  );
}
