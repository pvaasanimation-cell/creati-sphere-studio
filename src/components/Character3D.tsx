import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Stylized Robot Character built from primitives ─── */
function CharacterBody({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const clickAnim = useRef(0);

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    const t = state.clock.elapsedTime;

    // Idle breathing
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05 - 0.3;

    // Head follows mouse
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.current.x * 0.4, 0.05);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.current.y * 0.2, 0.05);

    // Click jump animation
    if (clicked) {
      clickAnim.current += 0.15;
      groupRef.current.position.y += Math.sin(clickAnim.current) * 0.3;
      groupRef.current.rotation.y += 0.12;
      if (clickAnim.current > Math.PI) {
        setClicked(false);
        clickAnim.current = 0;
        groupRef.current.rotation.y = 0;
      }
    }

    // Hover wave (right arm)
    const rightArm = groupRef.current.children.find((c) => c.name === "rightArm");
    if (rightArm) {
      const targetZ = hovered ? -1.2 + Math.sin(t * 4) * 0.3 : 0;
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, targetZ, 0.08);
    }
  });

  const purpleMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#7C3AED", metalness: 0.3, roughness: 0.6 }), []);
  const cyanMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#06B6D4", metalness: 0.4, roughness: 0.5 }), []);
  const darkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1a1a2e", metalness: 0.5, roughness: 0.4 }), []);
  const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 0.5 }), []);
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#F59E0B", metalness: 0.6, roughness: 0.3 }), []);

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(true)}
    >
      {/* Body (hoodie) */}
      <mesh position={[0, -0.1, 0]} material={purpleMat}>
        <capsuleGeometry args={[0.35, 0.5, 8, 16]} />
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 0.7, 0]}>
        <mesh material={darkMat}>
          <sphereGeometry args={[0.32, 16, 16]} />
        </mesh>
        {/* Visor / face screen */}
        <mesh position={[0, 0, 0.25]} material={cyanMat}>
          <boxGeometry args={[0.4, 0.18, 0.08]} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.1, 0.02, 0.3]} material={whiteMat}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        <mesh position={[0.1, 0.02, 0.3]} material={whiteMat}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        {/* Headphones */}
        <mesh position={[-0.34, 0.05, 0]} material={purpleMat}>
          <sphereGeometry args={[0.1, 8, 8]} />
        </mesh>
        <mesh position={[0.34, 0.05, 0]} material={purpleMat}>
          <sphereGeometry args={[0.1, 8, 8]} />
        </mesh>
        <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} material={darkMat}>
          <torusGeometry args={[0.3, 0.03, 8, 16, Math.PI]} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0, 0.35, 0]} material={goldMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.12, 6]} />
        </mesh>
        <mesh position={[0, 0.42, 0]} material={goldMat}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>
      </group>

      {/* Left arm */}
      <mesh position={[-0.45, -0.05, 0]} rotation={[0, 0, 0.2]} material={cyanMat}>
        <capsuleGeometry args={[0.08, 0.35, 6, 8]} />
      </mesh>

      {/* Right arm (waves on hover) */}
      <mesh name="rightArm" position={[0.45, -0.05, 0]} rotation={[0, 0, -0.2]} material={cyanMat}>
        <capsuleGeometry args={[0.08, 0.35, 6, 8]} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -0.65, 0]} material={darkMat}>
        <capsuleGeometry args={[0.08, 0.3, 6, 8]} />
      </mesh>
      <mesh position={[0.15, -0.65, 0]} material={darkMat}>
        <capsuleGeometry args={[0.08, 0.3, 6, 8]} />
      </mesh>

      {/* Tablet in left hand */}
      <mesh position={[-0.55, -0.3, 0.1]} rotation={[0.3, 0.5, 0.2]} material={darkMat}>
        <boxGeometry args={[0.2, 0.15, 0.02]} />
      </mesh>
      <mesh position={[-0.55, -0.3, 0.12]} rotation={[0.3, 0.5, 0.2]} material={cyanMat}>
        <boxGeometry args={[0.16, 0.11, 0.01]} />
      </mesh>
    </group>
  );
}

/* ─── Floating Tools ─── */
function FloatingTools() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.8 + i * 1.5) * 0.2 + (i % 2 ? 0.5 : -0.2);
      child.rotation.y = t * 0.3 + i;
      child.rotation.x = Math.sin(t * 0.5 + i) * 0.2;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Pencil */}
      <mesh position={[1.2, 0.5, -0.5]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 6]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Star */}
      <mesh position={[-1.3, 0.3, -0.3]}>
        <octahedronGeometry args={[0.08]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.3} transparent opacity={0.8} />
      </mesh>
      {/* Cube */}
      <mesh position={[1, -0.3, 0.5]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.2} wireframe />
      </mesh>
      {/* Ring */}
      <mesh position={[-1, -0.1, 0.4]}>
        <torusGeometry args={[0.08, 0.02, 8, 16]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ─── Floor Glow ─── */
function GlowFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <circleGeometry args={[2, 32]} />
      <meshStandardMaterial color="#7C3AED" transparent opacity={0.08} />
    </mesh>
  );
}

/* ─── Mini Particles ─── */
function MiniParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 60;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#7C3AED" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ─── Scene ─── */
function CharacterScene() {
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  return (
    <group
      onPointerMove={(e) => {
        mouse.current.x = (e.point.x / viewport.width) * 2;
        mouse.current.y = (e.point.y / viewport.height) * 2;
      }}
    >
      {/* Invisible plane for mouse tracking */}
      <mesh position={[0, 0, 1]} visible={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>

      <ambientLight intensity={0.3} color="#06B6D4" />
      <pointLight position={[3, 3, 3]} color="#7C3AED" intensity={0.8} />
      <pointLight position={[-3, 2, 2]} color="#06B6D4" intensity={0.5} />
      <spotLight position={[0, 4, 2]} angle={0.5} penumbra={0.5} intensity={0.8} color="#ffffff" />

      <CharacterBody mouse={mouse} />
      <FloatingTools />
      <GlowFloor />
      <MiniParticles />
    </group>
  );
}

/* ─── Speech Bubble ─── */
const greetings = [
  "Welcome to PVAAS Animation Studio! 🎬",
  "Ready to bring creativity to life? ✨",
  "Let's create something amazing! 🚀",
];

/* ─── Main Export ─── */
const Character3D = () => {
  const isMobile = useIsMobile();
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);
  const [showBubble, setShowBubble] = useState(true);

  return (
    <div className="relative w-full" style={{ height: isMobile ? "300px" : "450px" }}>
      {/* Speech bubble */}
      {showBubble && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-20 glass rounded-xl px-4 py-2.5 max-w-[250px] text-center cursor-pointer"
          onClick={() => setShowBubble(false)}
        >
          <p className="text-sm text-foreground">{greeting}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 glass rotate-45" />
        </motion.div>
      )}

      <Canvas
        camera={{ position: [0, 0.3, 3.5], fov: 45 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        style={{ cursor: "pointer" }}
      >
        <CharacterScene />
      </Canvas>
    </div>
  );
};

export default Character3D;
