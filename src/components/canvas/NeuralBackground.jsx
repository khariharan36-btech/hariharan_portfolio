import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function NeuralParticles() {
  const pointsRef = useRef();
  const linesRef  = useRef();

  const { positions, linePositions } = useMemo(() => {
    const count = 120;
    const spread = 28;
    const nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 14
      ));
    }

    const positions = new Float32Array(count * 3);
    nodes.forEach((n, i) => { positions[i*3]=n.x; positions[i*3+1]=n.y; positions[i*3+2]=n.z; });

    // Connect nearby nodes
    const lineVerts = [];
    const threshold = 7;
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (nodes[i].distanceTo(nodes[j]) < threshold) {
          lineVerts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          lineVerts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    return { positions, linePositions: new Float32Array(lineVerts) };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = clock.getElapsedTime() * 0.04;
      linesRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#00d4ff" transparent opacity={0.7} sizeAttenuation />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </lineSegments>
    </>
  );
}

export default function NeuralBackground() {
  return (
    <Canvas
      camera={{ position: [0, 0, 16], fov: 75 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false, alpha: true }}
    >
      <NeuralParticles />
    </Canvas>
  );
}
