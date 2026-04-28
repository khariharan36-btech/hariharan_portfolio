import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus } from '@react-three/drei';

const NODE_COUNT = 6;

function AtomNodes({ hovered }) {
  const groupRef  = useRef();
  const nodesRef  = useRef([]);
  const coreRef   = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = hovered ? 1.8 : 0.8;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.3 * speed;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.25;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.08);
    }
    nodesRef.current.forEach((n, i) => {
      if (n) {
        const angle = (i / NODE_COUNT) * Math.PI * 2 + t * speed * 0.5;
        n.position.x = Math.cos(angle) * 1.6;
        n.position.z = Math.sin(angle) * 1.6;
        n.position.y = Math.sin(t + i) * 0.25;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Orbital rings */}
      <Torus args={[1.6, 0.015, 16, 100]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} transparent opacity={0.6} />
      </Torus>
      <Torus args={[1.6, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.4} transparent opacity={0.4} />
      </Torus>

      {/* Core nucleus */}
      <Sphere ref={coreRef} args={[0.42, 32, 32]}>
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1} />
      </Sphere>

      {/* Orbiting nodes */}
      {Array.from({ length: NODE_COUNT }).map((_, i) => {
        const angle = (i / NODE_COUNT) * Math.PI * 2;
        return (
          <Sphere
            key={i}
            ref={(el) => (nodesRef.current[i] = el)}
            args={[0.14, 16, 16]}
            position={[Math.cos(angle) * 1.6, 0, Math.sin(angle) * 1.6]}
          >
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ec4899' : '#a855f7'}
              emissive={i % 2 === 0 ? '#ec4899' : '#a855f7'}
              emissiveIntensity={1.2}
            />
          </Sphere>
        );
      })}
    </group>
  );
}

export default function SkillNodes({ hovered }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]}   intensity={2}   color="#ec4899" />
      <pointLight position={[-3, -3, 3]}  intensity={1.5} color="#a855f7" />
      <AtomNodes hovered={hovered} />
    </Canvas>
  );
}
