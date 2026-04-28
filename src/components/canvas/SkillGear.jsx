import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Sphere, Cylinder } from '@react-three/drei';

// C Programming — Pointer arrow + memory blocks
function MemoryBlock({ position, color, delay }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() + delay;
      ref.current.scale.y = 0.6 + Math.abs(Math.sin(t * 1.2)) * 0.8;
      ref.current.position.y = position[1] + (ref.current.scale.y - 0.6) * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.28, 0.5, 0.15]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function PointerArrow({ hovered }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      const speed = hovered ? 1.6 : 0.6;
      ref.current.position.x = Math.sin(t * speed) * 1.1;
      ref.current.position.y = Math.cos(t * speed * 0.7) * 0.4;
      ref.current.rotation.z = Math.sin(t * speed) * 0.4;
    }
  });
  return (
    <group ref={ref}>
      {/* Arrow head */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.18, 0.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.2} />
      </mesh>
      {/* Arrow shaft */}
      <mesh position={[0.2, -0.08, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function CProgramScene({ hovered }) {
  const blocks = [
    { pos: [-1.6, 0, 0], color: '#06b6d4', delay: 0 },
    { pos: [-1.1, 0, 0], color: '#00d4ff', delay: 0.5 },
    { pos: [-0.6, 0, 0], color: '#a855f7', delay: 1.0 },
    { pos: [-0.1, 0, 0], color: '#06b6d4', delay: 1.5 },
    { pos: [ 0.4, 0, 0], color: '#00d4ff', delay: 2.0 },
    { pos: [ 0.9, 0, 0], color: '#a855f7', delay: 0.3 },
    { pos: [ 1.4, 0, 0], color: '#06b6d4', delay: 0.8 },
  ];
  return (
    <group>
      {/* Memory address bar */}
      <mesh position={[0, -0.7, -0.05]}>
        <boxGeometry args={[3.6, 0.06, 0.06]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} transparent opacity={0.5} />
      </mesh>
      {blocks.map((b, i) => (
        <MemoryBlock key={i} position={b.pos} color={b.color} delay={b.delay} />
      ))}
      <PointerArrow hovered={hovered} />
    </group>
  );
}

export default function SkillGear({ hovered }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.5], fov: 52 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]}  intensity={2}   color="#06b6d4" />
      <pointLight position={[-3, -3, 2]} intensity={1.5} color="#a855f7" />
      <CProgramScene hovered={hovered} />
    </Canvas>
  );
}
