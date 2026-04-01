import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Custom GLB Character ─── */
function CustomCharacter({ mouse, isHovered }: { mouse: React.MutableRefObject<{ x: number; y: number }>; isHovered: React.MutableRefObject<boolean> }) {
  const groupRef = useRef<THREE.Group>(null);
  const waveStrengthRef = useRef(0);
  const { scene, animations } = useGLTF("/models/character.glb");
  const { actions, names } = useAnimations(animations, groupRef);

  const { normalizedScale, modelOffset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const safeHeight = Math.max(size.y, 0.001);
    const targetHeight = 1.2;
    return {
      normalizedScale: targetHeight / safeHeight,
      modelOffset: [-center.x, -box.min.y, -center.z] as [number, number, number],
    };
  }, [scene]);

  useEffect(() => {
    if (names.length > 0) {
      names.forEach((name) => {
        const action = actions[name];
        if (action) {
          action.reset().fadeIn(0.5).play();
          action.setLoop(THREE.LoopRepeat, Infinity);
        }
      });
    }
    return () => {
      names.forEach((name) => actions[name]?.fadeOut(0.5));
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Smoothly ramp waveStrength toward 1 on hover, 0 otherwise
    const target = isHovered.current ? 1 : 0;
    waveStrengthRef.current = THREE.MathUtils.lerp(waveStrengthRef.current, target, delta * 4);
    const ws = waveStrengthRef.current;

    // Wave: tilt side-to-side + bounce
    const waveZ = ws * Math.sin(t * 10) * 0.12;
    const waveX = ws * 0.08;
    const waveBounce = ws * Math.abs(Math.sin(t * 8)) * 0.06;

    // Idle bobbing
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.04 - 0.5 + waveBounce;
    groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03 + waveZ;
    groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.02 + waveX;

    // Mouse follow (reduced during wave)
    const mouseInfluence = 1 - ws * 0.7;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (mouse.current.x * 0.3 + Math.sin(t * 0.4) * 0.1) * mouseInfluence,
      0.04
    );
  });

  return (
    <group ref={groupRef} scale={normalizedScale} position={[0, -0.9, 0]}>
      <primitive object={scene} position={modelOffset} />
    </group>
  );
}

/* ─── Floating creative accents ─── */
function FloatingAccents() {
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
      <mesh position={[-1.1, 0.3, -0.3]}>
        <octahedronGeometry args={[0.07]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
      <mesh position={[1, -0.2, 0.3]}>
        <torusGeometry args={[0.06, 0.015, 8, 12]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.5} />
      </mesh>
      <mesh position={[1.1, 0.5, -0.4]}>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshStandardMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.2} wireframe />
      </mesh>
    </group>
  );
}

/* ─── Loading fallback ─── */
function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = state.clock.elapsedTime;
  });
  return (
    <mesh ref={meshRef}>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#7C3AED" wireframe transparent opacity={0.5} />
    </mesh>
  );
}

/* ─── Scene ─── */
function CharacterScene({ isHovered }: { isHovered: React.MutableRefObject<boolean> }) {
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

      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1} />

      <Suspense fallback={<LoadingFallback />}>
        <CustomCharacter mouse={mouse} isHovered={isHovered} />
      </Suspense>
      <FloatingAccents />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
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
  const isHovered = useRef(false);

  return (
    <div
      className="relative w-full"
      style={{ height: isMobile ? "320px" : "480px" }}
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
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
        camera={{ position: [0, 0.8, 4], fov: 45 }}
        dpr={isMobile ? [1, 1] : [1, 1.25]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        frameloop="demand"
        style={{ cursor: "pointer" }}
        onCreated={({ invalidate }) => {
          // Render at ~30fps instead of 60 to reduce GPU load
          let raf: number;
          const loop = () => {
            invalidate();
            raf = requestAnimationFrame(loop);
          };
          const interval = setInterval(() => { invalidate(); }, 33);
          return () => { clearInterval(interval); cancelAnimationFrame(raf); };
        }}
      >
        <CharacterScene isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

useGLTF.preload("/models/character.glb");

export default Character3D;
