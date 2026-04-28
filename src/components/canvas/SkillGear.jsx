import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Cylinder } from '@react-three/drei';

function GearMesh({ radius, tubeRadius, teeth, speed, position, color }) {
  const ref = useRef();
  useFrame(() => { if (ref.current) ref.current.rotation.z += speed; });
  return (
    <group ref={ref} position={position}>
      <Torus args={[radius, tubeRadius, 6, teeth]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.2} />
      </Torus>
      <Cylinder args={[radius * 0.3, radius * 0.3, tubeRadius * 3, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={1} roughness={0.1} />
      </Cylinder>
    </group>
  );
}

function GearSystem({ hovered }) {
  const speed = hovered ? 0.025 : 0.01;
  return (
    <group>
      <GearMesh radius={0.9}  tubeRadius={0.12} teeth={20} speed={speed}   position={[0, 0, 0]}      color="#06b6d4" />
      <GearMesh radius={0.55} tubeRadius={0.09} teeth={12} speed={-speed * 1.6} position={[1.45, 0, 0.1]} color="#00d4ff" />
      <GearMesh radius={0.4}  tubeRadius={0.07} teeth={9}  speed={speed * 2.2}  position={[-1.3, 0, 0.1]} color="#a855f7" />
    </group>
  );
}

export default function SkillGear({ hovered }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]}   intensity={2}   color="#06b6d4" />
      <pointLight position={[-3, -3, 2]}  intensity={1.5} color="#a855f7" />
      <GearSystem hovered={hovered} />
    </Canvas>
  );
}
