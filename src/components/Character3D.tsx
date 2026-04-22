import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Custom GLB Character ─── */
function CustomCharacter({ mouse, isHovered }: { mouse: React.MutableRefObject<{ x: number; y: number }>; isHovered: React.MutableRefObject<boolean> }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const waveStrengthRef = useRef(0);
  const fittedRef = useRef(false);
  const { scene, animations } = useGLTF("/models/character.glb");
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const { actions, names, mixer } = useAnimations(animations, groupRef);

  // Play all embedded animations from the GLB
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

  // Update animation mixer every frame + auto-fit on first frames
  useFrame((state, delta) => {
    if (!groupRef.current || !innerRef.current) return;
    mixer?.update(delta);

    // Auto-fit AFTER skeleton has posed: measure rendered bbox, then scale + center
    // so the full character fits regardless of internal GLB transforms.
    if (!fittedRef.current && state.clock.elapsedTime > 0.15) {
      innerRef.current.scale.set(1, 1, 1);
      innerRef.current.position.set(0, 0, 0);
      innerRef.current.updateMatrixWorld(true);

      const box = new THREE.Box3().setFromObject(clonedScene);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      const targetSize = 3.2; // fits camera at z=8, fov=35
      const s = targetSize / maxDim;
      innerRef.current.scale.setScalar(s);
      innerRef.current.position.set(-center.x * s, -box.min.y * s - 1.6, -center.z * s);
      fittedRef.current = true;
    }

    const t = state.clock.elapsedTime;
    const target = isHovered.current ? 1 : 0;
    waveStrengthRef.current = THREE.MathUtils.lerp(waveStrengthRef.current, target, delta * 4);
    const ws = waveStrengthRef.current;

    const waveZ = ws * Math.sin(t * 10) * 0.12;
    const waveX = ws * 0.08;
    const waveBounce = ws * Math.abs(Math.sin(t * 8)) * 0.06;

    groupRef.current.position.y = Math.sin(t * 1.2) * 0.04 + waveBounce;
    groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.03 + waveZ;
    groupRef.current.rotation.x = Math.sin(t * 0.6) * 0.02 + waveX;

    const mouseInfluence = 1 - ws * 0.7;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (mouse.current.x * 0.3 + Math.sin(t * 0.4) * 0.1) * mouseInfluence - 0.15,
      0.04
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.15, 0]}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
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

      {/* Minimal lighting: one ambient + one directional */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 2]} intensity={0.8} />

      <Suspense fallback={<LoadingFallback />}>
        <CustomCharacter mouse={mouse} isHovered={isHovered} />
      </Suspense>
      <FloatingAccents />
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
      style={{ height: isMobile ? "350px" : "520px" }}
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
          const interval = setInterval(() => { invalidate(); }, 33);
          return () => { clearInterval(interval); };
        }}
      >
        <CharacterScene isHovered={isHovered} />
      </Canvas>
    </div>
  );
};

useGLTF.preload("/models/character.glb");

export default Character3D;
