import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Sliders, Palette, RotateCcw, Sparkles } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import SectionHeading from "@/components/SectionHeading";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Controllable scene ─── */
function PlaygroundScene({
  speed,
  hue,
  rotationSpeed,
  showParticles,
}: {
  speed: number;
  hue: number;
  rotationSpeed: number;
  showParticles: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const icosaRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const color1 = useMemo(() => new THREE.Color().setHSL(hue / 360, 0.8, 0.55), [hue]);
  const color2 = useMemo(() => new THREE.Color().setHSL((hue + 180) / 360, 0.7, 0.5), [hue]);

  const particlePositions = useMemo(() => {
    const count = 80;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    const r = rotationSpeed * 0.01;

    if (meshRef.current) {
      meshRef.current.rotation.x = t * r;
      meshRef.current.rotation.y = t * r * 1.3;
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = t * r * 0.7;
      torusRef.current.rotation.z = t * r;
      torusRef.current.position.x = Math.cos(t * 0.3) * 1.5;
      torusRef.current.position.y = Math.sin(t * 0.4) * 0.5;
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.y = t * r * 0.5;
      icosaRef.current.position.x = Math.sin(t * 0.2) * -1.5;
      icosaRef.current.position.y = Math.cos(t * 0.3) * 0.5;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[3, 3, 3]} color={color1} intensity={1} />
      <pointLight position={[-3, -2, 2]} color={color2} intensity={0.6} />

      {/* Central shape */}
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color={color1} wireframe transparent opacity={0.7} emissive={color1} emissiveIntensity={0.2} />
      </mesh>

      {/* Orbiting torus */}
      <mesh ref={torusRef} position={[1.5, 0, 0]}>
        <torusGeometry args={[0.4, 0.12, 12, 32]} />
        <meshStandardMaterial color={color2} transparent opacity={0.6} emissive={color2} emissiveIntensity={0.15} />
      </mesh>

      {/* Icosahedron */}
      <mesh ref={icosaRef} position={[-1.5, 0, 0]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={color1} wireframe transparent opacity={0.5} />
      </mesh>

      {/* Particles */}
      {showParticles && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.025} color={color1} transparent opacity={0.5} sizeAttenuation />
        </points>
      )}
    </>
  );
}

/* ─── Slider Control ─── */
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  icon: Icon,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <Icon size={14} className="text-primary" />
        <span className="text-muted-foreground">{label}</span>
        <span className="ml-auto text-foreground font-mono text-xs">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-muted
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(124,58,237,0.5)]
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

/* ─── Main Component ─── */
const InteractivePlayground = () => {
  const [speed, setSpeed] = useState(1);
  const [hue, setHue] = useState(263);
  const [rotationSpeed, setRotationSpeed] = useState(50);
  const [showParticles, setShowParticles] = useState(true);
  const isMobile = useIsMobile();

  return (
    <section className="py-[15vh] relative z-10">
      <div className="container mx-auto px-6">
        <SectionHeading
          tag="Playground"
          title="Create & Control"
          description="Interact with animation elements in real-time."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Canvas */}
          <div className="lg:col-span-2">
            <GlassCard className="p-0 overflow-hidden" hover={false}>
              <div style={{ height: isMobile ? "300px" : "450px" }}>
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }} dpr={isMobile ? [1, 1] : [1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance" }}>
                  <PlaygroundScene
                    speed={speed}
                    hue={hue}
                    rotationSpeed={rotationSpeed}
                    showParticles={showParticles}
                  />
                </Canvas>
              </div>
            </GlassCard>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
                <Sliders size={16} className="text-primary" />
                Controls
              </h3>
              <div className="flex flex-col gap-5">
                <SliderControl label="Speed" value={speed} min={0} max={3} step={0.1} onChange={setSpeed} icon={Sliders} />
                <SliderControl label="Color Hue" value={hue} min={0} max={360} step={1} onChange={setHue} icon={Palette} />
                <SliderControl label="Rotation" value={rotationSpeed} min={0} max={100} step={1} onChange={setRotationSpeed} icon={RotateCcw} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Sparkles size={14} className="text-primary" />
                    <span className="text-muted-foreground">Particles</span>
                  </div>
                  <button
                    onClick={() => setShowParticles(!showParticles)}
                    className={`w-10 h-5 rounded-full transition-all duration-300 relative ${
                      showParticles ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-primary-foreground absolute top-0.5 transition-all duration-300 ${
                        showParticles ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6" hover={false}>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drag the sliders to manipulate the 3D scene in real-time. Change colors, speed, and toggle particle effects.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePlayground;
