import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Icosahedron } from '@react-three/drei';

function EnergyOrb({ hovered }) {
  const outerRef = useRef();
  const innerRef = useRef();
  const coreRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = hovered ? 2.5 : 1;
    if (outerRef.current) {
      outerRef.current.rotation.y += 0.008 * speed;
      outerRef.current.rotation.z += 0.004 * speed;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += 0.012 * speed;
      innerRef.current.rotation.y -= 0.006 * speed;
    }
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 2) * 0.06;
      coreRef.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      {/* Outer wireframe icosahedron */}
      <Icosahedron ref={outerRef} args={[1.3, 1]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} wireframe transparent opacity={0.5} />
      </Icosahedron>
      {/* Inner icosahedron */}
      <Icosahedron ref={innerRef} args={[0.9, 0]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} wireframe transparent opacity={0.35} />
      </Icosahedron>
      {/* Glowing core */}
      <Sphere ref={coreRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={hovered ? 2 : 1} roughness={0} metalness={0.5} transparent opacity={0.9} />
      </Sphere>
      {/* Particle ring */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <Sphere key={i} args={[0.05, 8, 8]} position={[Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0]}>
            <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={1.5} />
          </Sphere>
        );
      })}
    </group>
  );
}

export default function SkillOrb({ hovered }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 3, 3]} intensity={2} color="#00d4ff" />
      <pointLight position={[-3, -3, 3]} intensity={1} color="#06b6d4" />
      <EnergyOrb hovered={hovered} />
    </Canvas>
  );
}
