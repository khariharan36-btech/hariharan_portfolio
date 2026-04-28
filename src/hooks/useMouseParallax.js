import { useRef, useEffect } from 'react';

export function useMouseParallax(strength = 0.02) {
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Normalize to -1 … +1
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Returns smoothly lerped values — call inside useFrame or rAF loop
  const getSmoothed = () => {
    targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * strength;
    targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * strength;
    return { ...targetRef.current };
  };

  return { raw: mouseRef, getSmoothed };
}
