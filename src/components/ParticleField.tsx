import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const purple = new THREE.Color("#7C3AED");
    const cyan = new THREE.Color("#06B6D4");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const t = Math.random();
      const c = purple.clone().lerp(cyan, t);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(state.clock.elapsedTime * 0.5 + i * 2) * 0.5;
      child.rotation.x = state.clock.elapsedTime * 0.2 + i;
      child.rotation.z = state.clock.elapsedTime * 0.1 + i;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-3, 0, -2]}>
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial color="#7C3AED" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh position={[3, 1, -3]}>
        <icosahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#06B6D4" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh position={[0, -2, -1]}>
        <torusGeometry args={[0.5, 0.15, 8, 20]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.2} wireframe />
      </mesh>
      <mesh position={[-2, 2, -4]}>
        <dodecahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#7C3AED" transparent opacity={0.25} wireframe />
      </mesh>
    </group>
  );
}

const ParticleField = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} color="#7C3AED" intensity={0.5} />
        <pointLight position={[-5, -5, 5]} color="#06B6D4" intensity={0.3} />
        <Particles />
        <FloatingShapes />
      </Canvas>
    </div>
  );
};

export default ParticleField;
