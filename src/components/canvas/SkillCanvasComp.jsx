import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Plane, Sphere } from '@react-three/drei';

const PALETTE = ['#a855f7', '#ec4899', '#00d4ff', '#06b6d4', '#f59e0b'];

function DesignCanvas({ hovered }) {
  const canvasRef = useRef();
  const brushes = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (canvasRef.current) {
      canvasRef.current.rotation.y = Math.sin(t * 0.5) * (hovered ? 0.4 : 0.15);
      canvasRef.current.rotation.x = Math.sin(t * 0.3) * 0.06;
    }
    brushes.current.forEach((b, i) => {
      if (b) {
        const speed = hovered ? 1.5 : 0.5;
        b.position.x = Math.sin(t * speed + i * 1.2) * 0.8;
        b.position.y = Math.cos(t * speed * 0.7 + i * 0.8) * 0.6;
        b.position.z = 0.15 + Math.sin(t + i) * 0.1;
      }
    });
  });

  return (
    <group>
      {/* Main canvas panel */}
      <Plane ref={canvasRef} args={[2.4, 1.8]}>
        <meshStandardMaterial
          color="#0a0a1a"
          emissive="#a855f7"
          emissiveIntensity={0.06}
          metalness={0.2}
          roughness={0.8}
        />
      </Plane>
      {/* Canvas border */}
      <Plane args={[2.5, 1.9]}>
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.3} transparent opacity={0.25} wireframe />
      </Plane>
      {/* Floating color swatches */}
      {PALETTE.map((col, i) => (
        <Sphere
          key={i}
          ref={(el) => (brushes.current[i] = el)}
          args={[0.1, 16, 16]}
          position={[Math.sin(i * 1.26) * 0.8, Math.cos(i * 1.26) * 0.5, 0.15]}
        >
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1.2} />
        </Sphere>
      ))}
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
