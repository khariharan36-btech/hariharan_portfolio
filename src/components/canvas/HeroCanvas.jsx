import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Sphere } from '@react-three/drei';
import { useMouseParallax } from '../../hooks/useMouseParallax';

function HologramAvatar({ mouse }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const coreRef  = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { getSmoothed } = mouse;
    const { x, y } = getSmoothed();

    if (groupRef.current) {
      groupRef.current.rotation.y = x * 0.4;
      groupRef.current.rotation.x = -y * 0.2;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += 0.008;
    if (ring2Ref.current) ring2Ref.current.rotation.x += 0.006;
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += 0.005;
      ring3Ref.current.rotation.z += 0.003;
    }
    if (coreRef.current) {
      coreRef.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe sphere */}
      <Sphere args={[1.15, 20, 20]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.12}
          wireframe
        />
      </Sphere>

      {/* Inner solid core */}
      <Sphere ref={coreRef} args={[0.88, 32, 32]}>
        <meshStandardMaterial
          color="#0a1628"
          emissive="#00d4ff"
          emissiveIntensity={0.12}
          roughness={0.1}
          metalness={0.9}
        />
      </Sphere>

      {/* Middle glow sphere */}
      <Sphere args={[0.92, 32, 32]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.08}
          transparent
          opacity={0.18}
        />
      </Sphere>

      {/* Orbit ring 1 */}
      <Torus ref={ring1Ref} args={[1.8, 0.018, 16, 100]}>
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.9} />
      </Torus>

      {/* Orbit ring 2 – tilted */}
      <Torus ref={ring2Ref} args={[2.2, 0.012, 16, 100]} rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.9} />
      </Torus>

      {/* Orbit ring 3 */}
      <Torus ref={ring3Ref} args={[2.6, 0.01, 16, 100]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.7} transparent opacity={0.8} />
      </Torus>

      {/* Floating data node dots on rings */}
      {[
        [1.8,  0,    0,  '#00d4ff'],
        [-1.8, 0,    0,  '#a855f7'],
        [0,    1.8,  0,  '#06b6d4'],
        [0,   -1.8,  0,  '#ec4899'],
      ].map(([x, y, z, col], i) => (
        <Sphere key={i} args={[0.09, 16, 16]} position={[x, y, z]}>
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1.5} />
        </Sphere>
      ))}
    </group>
  );
}

export default function HeroCanvas() {
  const mouse = useMouseParallax(0.15);
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[4,  4,  4]} intensity={1.5} color="#00d4ff" />
      <pointLight position={[-4, -4, 4]} intensity={1.0} color="#a855f7" />
      <HologramAvatar mouse={mouse} />
    </Canvas>
  );
}
