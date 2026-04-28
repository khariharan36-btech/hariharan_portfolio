import { useEffect, useRef, useState } from 'react';
import '../styles/ui.css';

export default function Cursor() {
  const dotRef   = useRef(null);
  const ringRef  = useRef(null);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Initialise at centre so ring doesn't fly from (0,0) on first click
    let mx = window.innerWidth  / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let rafId;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };

    const animate = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      rafId = requestAnimationFrame(animate);
    };

    const down = () => setClicking(true);
    const up   = () => setClicking(false);

    const over = (e) => {
      if (e.target.closest('a, button, [data-cursor="pointer"]')) setHovering(true);
    };
    const out = () => setHovering(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);
    window.addEventListener('mouseover', over);
    window.addEventListener('mouseout',  out);
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup',   up);
      window.removeEventListener('mouseover', over);
      window.removeEventListener('mouseout',  out);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className={`cursor-dot   ${clicking ? 'clicking' : ''} ${hovering ? 'hovering' : ''}`} />
      <div ref={ringRef} className={`cursor-ring  ${clicking ? 'clicking' : ''} ${hovering ? 'hovering' : ''}`} />
    </>
  );
}
