import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Cute Chibi Mascot ─── */
function ChibiCharacter({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const clickAnim = useRef(0);

  // Materials (memoized)
  const mats = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({ color: "#FFD5C2", roughness: 0.8, metalness: 0 }),
    hair: new THREE.MeshStandardMaterial({ color: "#7C3AED", roughness: 0.5, metalness: 0.1 }),
    hairHighlight: new THREE.MeshStandardMaterial({ color: "#A78BFA", roughness: 0.5, metalness: 0.1 }),
    hoodie: new THREE.MeshStandardMaterial({ color: "#1E1B4B", roughness: 0.7, metalness: 0.05 }),
    hoodieAccent: new THREE.MeshStandardMaterial({ color: "#7C3AED", roughness: 0.6, metalness: 0.1 }),
    pants: new THREE.MeshStandardMaterial({ color: "#0F172A", roughness: 0.8, metalness: 0 }),
    shoe: new THREE.MeshStandardMaterial({ color: "#06B6D4", roughness: 0.4, metalness: 0.2 }),
    eyeWhite: new THREE.MeshStandardMaterial({ color: "#FFFFFF", roughness: 0.3 }),
    iris: new THREE.MeshStandardMaterial({ color: "#06B6D4", emissive: "#06B6D4", emissiveIntensity: 0.4, roughness: 0.2 }),
    pupil: new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.5 }),
    eyeShine: new THREE.MeshStandardMaterial({ color: "#FFFFFF", emissive: "#FFFFFF", emissiveIntensity: 1 }),
    mouth: new THREE.MeshStandardMaterial({ color: "#FF6B9D", roughness: 0.6 }),
    blush: new THREE.MeshStandardMaterial({ color: "#FFB3BA", transparent: true, opacity: 0.4, roughness: 1 }),
    headphone: new THREE.MeshStandardMaterial({ color: "#1E1B4B", roughness: 0.3, metalness: 0.4 }),
    headphoneGlow: new THREE.MeshStandardMaterial({ color: "#7C3AED", emissive: "#7C3AED", emissiveIntensity: 0.6, roughness: 0.2 }),
    tablet: new THREE.MeshStandardMaterial({ color: "#1E293B", roughness: 0.3, metalness: 0.3 }),
    tabletScreen: new THREE.MeshStandardMaterial({ color: "#06B6D4", emissive: "#06B6D4", emissiveIntensity: 0.5 }),
    stylus: new THREE.MeshStandardMaterial({ color: "#F59E0B", metalness: 0.5, roughness: 0.3 }),
  }), []);

  useFrame((state) => {
    if (!groupRef.current || !headRef.current) return;
    const t = state.clock.elapsedTime;

    // Gentle breathing
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.04 - 0.2;

    // Head follows mouse softly
    headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouse.current.x * 0.35, 0.04);
    headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouse.current.y * 0.15, 0.04);

    // Click bounce
    if (clicked) {
      clickAnim.current += 0.15;
      groupRef.current.position.y += Math.sin(clickAnim.current) * 0.25;
      groupRef.current.rotation.z = Math.sin(clickAnim.current * 2) * 0.1;
      if (clickAnim.current > Math.PI) {
        setClicked(false);
        clickAnim.current = 0;
        groupRef.current.rotation.z = 0;
      }
    }

    // Hover wave (right arm)
    const rightArm = groupRef.current.children.find((c) => c.name === "rightArm");
    if (rightArm) {
      const targetZ = hovered ? -1.0 + Math.sin(t * 5) * 0.25 : 0.15;
      rightArm.rotation.z = THREE.MathUtils.lerp(rightArm.rotation.z, targetZ, 0.06);
    }

    // Left arm gentle sway
    const leftArm = groupRef.current.children.find((c) => c.name === "leftArm");
    if (leftArm) {
      leftArm.rotation.z = 0.15 + Math.sin(t * 0.8) * 0.05;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(true)}
    >
      {/* ── Body (hoodie) ── */}
      <mesh position={[0, -0.05, 0]} material={mats.hoodie}>
        <capsuleGeometry args={[0.3, 0.4, 12, 20]} />
      </mesh>
      {/* Hoodie pocket stripe */}
      <mesh position={[0, -0.15, 0.28]} material={mats.hoodieAccent}>
        <boxGeometry args={[0.25, 0.06, 0.02]} />
      </mesh>
      {/* Hoodie logo circle */}
      <mesh position={[0, 0.05, 0.3]} material={mats.hoodieAccent}>
        <circleGeometry args={[0.06, 16]} />
      </mesh>

      {/* ── Head ── */}
      <group ref={headRef} position={[0, 0.65, 0]}>
        {/* Main head - larger for chibi proportions */}
        <mesh material={mats.skin}>
          <sphereGeometry args={[0.38, 24, 24]} />
        </mesh>

        {/* ── Hair ── */}
        {/* Main hair volume */}
        <mesh position={[0, 0.12, -0.02]} material={mats.hair}>
          <sphereGeometry args={[0.39, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        </mesh>
        {/* Fringe/bangs */}
        <mesh position={[0, 0.18, 0.22]} material={mats.hair} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.55, 0.15, 0.15]} />
        </mesh>
        {/* Side hair tufts */}
        <mesh position={[-0.32, 0.05, 0.1]} material={mats.hair} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.06, 0.15, 6, 8]} />
        </mesh>
        <mesh position={[0.32, 0.05, 0.1]} material={mats.hair} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.06, 0.15, 6, 8]} />
        </mesh>
        {/* Hair highlight streak */}
        <mesh position={[0.1, 0.28, 0.18]} material={mats.hairHighlight} rotation={[0.4, 0.2, 0]}>
          <boxGeometry args={[0.08, 0.1, 0.12]} />
        </mesh>

        {/* ── Eyes ── */}
        {/* Left eye */}
        <group position={[-0.12, -0.02, 0.32]}>
          <mesh material={mats.eyeWhite}>
            <sphereGeometry args={[0.08, 12, 12]} />
          </mesh>
          <mesh position={[0, 0, 0.04]} material={mats.iris}>
            <sphereGeometry args={[0.055, 10, 10]} />
          </mesh>
          <mesh position={[0, 0, 0.07]} material={mats.pupil}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.02, 0.025, 0.08]} material={mats.eyeShine}>
            <sphereGeometry args={[0.012, 6, 6]} />
          </mesh>
        </group>
        {/* Right eye */}
        <group position={[0.12, -0.02, 0.32]}>
          <mesh material={mats.eyeWhite}>
            <sphereGeometry args={[0.08, 12, 12]} />
          </mesh>
          <mesh position={[0, 0, 0.04]} material={mats.iris}>
            <sphereGeometry args={[0.055, 10, 10]} />
          </mesh>
          <mesh position={[0, 0, 0.07]} material={mats.pupil}>
            <sphereGeometry args={[0.03, 8, 8]} />
          </mesh>
          <mesh position={[0.02, 0.025, 0.08]} material={mats.eyeShine}>
            <sphereGeometry args={[0.012, 6, 6]} />
          </mesh>
        </group>

        {/* ── Blush spots ── */}
        <mesh position={[-0.2, -0.08, 0.3]} rotation={[0, -0.3, 0]} material={mats.blush}>
          <circleGeometry args={[0.045, 12]} />
        </mesh>
        <mesh position={[0.2, -0.08, 0.3]} rotation={[0, 0.3, 0]} material={mats.blush}>
          <circleGeometry args={[0.045, 12]} />
        </mesh>

        {/* ── Smile ── */}
        <mesh position={[0, -0.12, 0.35]} rotation={[0.1, 0, 0]} material={mats.mouth}>
          <torusGeometry args={[0.04, 0.012, 8, 12, Math.PI]} />
        </mesh>

        {/* ── Headphones ── */}
        <mesh position={[-0.38, 0, 0]} material={mats.headphone}>
          <capsuleGeometry args={[0.08, 0.06, 8, 12]} />
        </mesh>
        <mesh position={[0.38, 0, 0]} material={mats.headphone}>
          <capsuleGeometry args={[0.08, 0.06, 8, 12]} />
        </mesh>
        {/* Headphone glow rings */}
        <mesh position={[-0.39, 0, 0.04]} material={mats.headphoneGlow}>
          <torusGeometry args={[0.05, 0.01, 8, 16]} />
        </mesh>
        <mesh position={[0.39, 0, 0.04]} material={mats.headphoneGlow}>
          <torusGeometry args={[0.05, 0.01, 8, 16]} />
        </mesh>
        {/* Headband */}
        <mesh position={[0, 0.32, -0.05]} rotation={[0, 0, Math.PI / 2]} material={mats.headphone}>
          <torusGeometry args={[0.32, 0.025, 8, 20, Math.PI]} />
        </mesh>
      </group>

      {/* ── Arms ── */}
      {/* Left arm */}
      <group name="leftArm" position={[-0.38, -0.02, 0]}>
        <mesh rotation={[0, 0, 0.15]} material={mats.hoodie}>
          <capsuleGeometry args={[0.07, 0.28, 8, 10]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.02, -0.22, 0]} material={mats.skin}>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
      </group>

      {/* Right arm (waves) */}
      <group name="rightArm" position={[0.38, -0.02, 0]}>
        <mesh rotation={[0, 0, -0.15]} material={mats.hoodie}>
          <capsuleGeometry args={[0.07, 0.28, 8, 10]} />
        </mesh>
        {/* Hand with stylus */}
        <mesh position={[-0.02, -0.22, 0]} material={mats.skin}>
          <sphereGeometry args={[0.06, 8, 8]} />
        </mesh>
        <mesh position={[-0.02, -0.32, 0.02]} rotation={[0.2, 0, -0.3]} material={mats.stylus}>
          <cylinderGeometry args={[0.01, 0.015, 0.18, 6]} />
        </mesh>
      </group>

      {/* ── Legs ── */}
      <mesh position={[-0.12, -0.55, 0]} material={mats.pants}>
        <capsuleGeometry args={[0.07, 0.22, 8, 10]} />
      </mesh>
      <mesh position={[0.12, -0.55, 0]} material={mats.pants}>
        <capsuleGeometry args={[0.07, 0.22, 8, 10]} />
      </mesh>

      {/* ── Shoes ── */}
      <mesh position={[-0.12, -0.75, 0.03]} material={mats.shoe}>
        <boxGeometry args={[0.12, 0.06, 0.16]} />
      </mesh>
      <mesh position={[0.12, -0.75, 0.03]} material={mats.shoe}>
        <boxGeometry args={[0.12, 0.06, 0.16]} />
      </mesh>
    </group>
  );
}

/* ─── Floating creative tools ─── */
function FloatingTools() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.6 + i * 1.8) * 0.2 + (i % 2 ? 0.4 : -0.1);
      child.rotation.y = t * 0.2 + i;
    });
  });

  return (
    <group ref={groupRef}>
      {/* Star */}
      <mesh position={[-1.1, 0.3, -0.3]}>
        <octahedronGeometry args={[0.07]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
      {/* Ring */}
      <mesh position={[1, -0.2, 0.3]}>
        <torusGeometry args={[0.06, 0.015, 8, 12]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.5} />
      </mesh>
      {/* Cube */}
      <mesh position={[1.1, 0.5, -0.4]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.2} wireframe />
      </mesh>
    </group>
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
      <mesh position={[0, 0, 1]} visible={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial />
      </mesh>

      <ambientLight intensity={0.5} color="#FFF5EE" />
      <pointLight position={[3, 3, 3]} color="#7C3AED" intensity={0.6} />
      <pointLight position={[-3, 2, 2]} color="#06B6D4" intensity={0.4} />
      <spotLight position={[0, 4, 3]} angle={0.5} penumbra={0.5} intensity={0.7} color="#ffffff" />

      <ChibiCharacter mouse={mouse} />
      <FloatingTools />

      {/* Floor glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <circleGeometry args={[1.5, 24]} />
        <meshStandardMaterial color="#7C3AED" transparent opacity={0.06} />
      </mesh>
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
    <div className="relative w-full" style={{ height: isMobile ? "280px" : "420px" }}>
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
        camera={{ position: [0, 0.3, 3.2], fov: 45 }}
        dpr={isMobile ? [1, 1] : [1, 1.25]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        style={{ cursor: "pointer" }}
      >
        <CharacterScene />
      </Canvas>
    </div>
  );
};

export default Character3D;
