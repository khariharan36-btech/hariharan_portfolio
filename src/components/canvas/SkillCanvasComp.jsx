import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// UI/UX Design — Figma-style layered frames with pen tool cursor
function FigmaFrame({ position, rotation, color, scale, delay }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() + delay;
      ref.current.position.z = position[2] + Math.sin(t * 0.8) * 0.08;
      ref.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.03;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.25}
        transparent
        opacity={0.35}
        metalness={0.1}
        roughness={0.8}
      />
    </mesh>
  );
}

function FrameBorder({ position, size, color }) {
  const points = [
    [-size[0]/2, -size[1]/2, 0],
    [ size[0]/2, -size[1]/2, 0],
    [ size[0]/2,  size[1]/2, 0],
    [-size[0]/2,  size[1]/2, 0],
    [-size[0]/2, -size[1]/2, 0],
  ];
  return (
    <group position={position}>
      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        const dx = next[0] - p[0];
        const dy = next[1] - p[1];
        const len = Math.sqrt(dx*dx + dy*dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={i} position={[(p[0]+next[0])/2, (p[1]+next[1])/2, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[len, 0.025, 0.01]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
          </mesh>
        );
      })}
      {/* Corner handles */}
      {[[-size[0]/2, -size[1]/2], [size[0]/2, -size[1]/2], [size[0]/2, size[1]/2], [-size[0]/2, size[1]/2]].map(([x,y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function PenCursor({ hovered }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const speed = hovered ? 1.2 : 0.5;
      ref.current.position.x = Math.sin(t * speed) * 0.9;
      ref.current.position.y = Math.cos(t * speed * 0.7) * 0.6;
      ref.current.rotation.z = -0.4 + Math.sin(t * speed) * 0.3;
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.04, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.4} />
      </mesh>
    </group>
  );
}

function DesignCanvas({ hovered }) {
  return (
    <group>
      {/* Background layer */}
      <FigmaFrame position={[0, 0, -0.3]} rotation={[0.05, 0.08, 0]}  color="#1a0a2e" scale={[2.4, 1.8, 1]} delay={0} />
      {/* Mid layer */}
      <FigmaFrame position={[-0.3, 0.1, -0.1]} rotation={[-0.05, -0.06, 0.05]} color="#a855f7" scale={[1.2, 0.9, 1]} delay={0.6} />
      {/* Front layer */}
      <FigmaFrame position={[0.3, -0.1, 0.1]} rotation={[0.04, 0.05, -0.04]} color="#ec4899" scale={[0.9, 0.7, 1]} delay={1.2} />

      {/* Frame borders */}
      <FrameBorder position={[0, 0, -0.28]}       size={[2.4, 1.8]} color="#a855f730" />
      <FrameBorder position={[-0.3, 0.1, -0.08]}  size={[1.2, 0.9]} color="#a855f7" />
      <FrameBorder position={[0.3, -0.1, 0.12]}   size={[0.9, 0.7]} color="#ec4899" />

      <PenCursor hovered={hovered} />
    </group>
  );
}

export default function SkillCanvasComp({ hovered }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[2, 2, 2]}  intensity={2}   color="#a855f7" />
      <pointLight position={[-2, -2, 2]} intensity={1.5} color="#ec4899" />
      <DesignCanvas hovered={hovered} />
    </Canvas>
  );
}
