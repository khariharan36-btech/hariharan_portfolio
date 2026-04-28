import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Sphere } from '@react-three/drei';

// React atom — 3 elliptical orbital rings at 60° angles, nucleus in the centre
const RING_ANGLES = [0, Math.PI / 3, (2 * Math.PI) / 3]; // 0°, 60°, 120°
const REACT_CYAN = '#61dafb';
const REACT_DARK = '#20232a';

function ReactAtom({ hovered }) {
  const groupRef = useRef();
  const electronsRef = useRef([null, null, null]);
  const nucleusRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const speed = hovered ? 1.6 : 0.7;

    // Slow y-axis rotation of the whole atom
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }

    // Pulse nucleus
    if (nucleusRef.current) {
      nucleusRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.1);
    }

    // Each electron orbits its own ring
    electronsRef.current.forEach((el, i) => {
      if (el) {
        const angle = t * speed + (i * Math.PI * 2) / 3;
        const a = 1.55; // semi-major axis (matches Torus radius)
        const b = 0.55; // semi-minor axis
        // Parametric ellipse in local ring space
        const lx = a * Math.cos(angle);
        const ly = b * Math.sin(angle);

        // Rotate the local (lx, ly) point by the ring's tilt angle
        const tilt = RING_ANGLES[i];
        el.position.x = lx * Math.cos(tilt);
        el.position.y = ly;
        el.position.z = lx * Math.sin(tilt);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Three orbital rings, each rotated 60° around Y */}
      {RING_ANGLES.map((angle, i) => (
        <Torus
          key={i}
          args={[1.55, 0.022, 16, 120]}
          rotation={[Math.PI / 2, 0, angle]}
        >
          <meshStandardMaterial
            color={REACT_CYAN}
            emissive={REACT_CYAN}
            emissiveIntensity={0.55}
            transparent
            opacity={0.75}
          />
        </Torus>
      ))}

      {/* Nucleus */}
      <Sphere ref={nucleusRef} args={[0.32, 32, 32]}>
        <meshStandardMaterial
          color={REACT_CYAN}
          emissive={REACT_CYAN}
          emissiveIntensity={1.4}
        />
      </Sphere>

      {/* Electrons — one per ring */}
      {RING_ANGLES.map((_, i) => (
        <Sphere
          key={i}
          ref={(el) => (electronsRef.current[i] = el)}
          args={[0.1, 16, 16]}
        >
          <meshStandardMaterial
            color={REACT_CYAN}
            emissive={REACT_CYAN}
            emissiveIntensity={2}
          />
        </Sphere>
      ))}
    </group>
  );
}

export default function SkillNodes({ hovered }) {
  return (
    <Canvas camera={{ position: [0, 0.4, 5], fov: 48 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[3, 3, 3]}  intensity={2.5} color={REACT_CYAN} />
      <pointLight position={[-3, -2, 2]} intensity={1}   color="#a855f7" />
      <ReactAtom hovered={hovered} />
    </Canvas>
  );
}
