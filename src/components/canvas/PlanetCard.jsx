import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Ring } from '@react-three/drei';

function Planet({ color, ringColor, hovered }) {
  const groupRef = useRef();
  const ringRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006;
      groupRef.current.position.y = Math.sin(t * 0.8) * (hovered ? 0.15 : 0.08);
    }
    if (ringRef.current) ringRef.current.rotation.z += 0.004;
  });

  return (
    <group ref={groupRef}>
      {/* Planet body */}
      <Sphere args={[1.1, 32, 32]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.4 : 0.18}
          roughness={0.6}
          metalness={0.4}
        />
      </Sphere>
      {/* Orbital ring */}
      <Torus ref={ringRef} args={[1.7, 0.04, 8, 80]} rotation={[Math.PI / 3, 0, 0]}>
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={hovered ? 1.2 : 0.7} transparent opacity={0.8} />
      </Torus>
      {/* Atmosphere glow */}
      <Sphere args={[1.22, 32, 32]}>
        <meshStandardMaterial color={ringColor} emissive={ringColor} emissiveIntensity={0.15} transparent opacity={hovered ? 0.25 : 0.1} />
      </Sphere>
    </group>
  );
}

export default function PlanetCard({ planetColor, ringColor, hovered }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[4, 4, 4]}   intensity={2}   color={ringColor} />
      <pointLight position={[-4, -2, 2]}  intensity={0.8} color="#a855f7" />
      <Planet color={planetColor} ringColor={ringColor} hovered={hovered} />
    </Canvas>
  );
}
