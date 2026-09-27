"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Book({
  position,
  rotation,
  color,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[1.4, 0.12, 1]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
    </mesh>
  );
}

function DeskScene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={1.3} color="#fbe6c8" />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2.2}
        color="#fff4e0"
      />

      <pointLight
        position={[-2.5, 1.1, -0.6]}
        intensity={1.6}
        color="#fbbf24"
        distance={4}
      />

      <directionalLight
        position={[-5, 3, -4]}
        intensity={0.35}
        color="#34d399"
      />

      {/* Ground shadow catcher */}
      <mesh position={[0, -2.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.4, 48]} />
        <meshStandardMaterial
          color="#0d0906"
          roughness={1}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Desk */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[7, 0.35, 4.5]} />
        <meshStandardMaterial color="#7a5233" roughness={0.75} metalness={0.04} />
      </mesh>

      {/* Desk legs */}
      <mesh position={[-3, -2, -1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#4a3f33" roughness={0.6} metalness={0.15} />
      </mesh>

      <mesh position={[3, -2, -1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#4a3f33" roughness={0.6} metalness={0.15} />
      </mesh>

      <mesh position={[-3, -2, 1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#4a3f33" roughness={0.6} metalness={0.15} />
      </mesh>

      <mesh position={[3, -2, 1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#4a3f33" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* Monitor bezel */}
      <mesh position={[0, 0.25, -0.9]}>
        <boxGeometry args={[3, 1.8, 0.18]} />
        <meshStandardMaterial color="#241c14" roughness={0.4} metalness={0.35} />
      </mesh>

      {/* Screen (glows with the selected accent color) */}
      <mesh position={[0, 0.25, -0.79]}>
        <boxGeometry args={[2.7, 1.5, 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          roughness={0.25}
        />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0, -0.8, -0.9]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#3a2f24" roughness={0.5} metalness={0.3} />
      </mesh>

      <mesh position={[0, -1.1, -0.9]}>
        <boxGeometry args={[1.1, 0.12, 0.7]} />
        <meshStandardMaterial color="#3a2f24" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, -0.95, 0.45]}>
        <boxGeometry args={[2.5, 0.12, 0.8]} />
        <meshStandardMaterial color="#f2ead9" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Mouse */}
      <mesh position={[1.6, -0.95, 0.45]}>
        <boxGeometry args={[0.45, 0.15, 0.6]} />
        <meshStandardMaterial color="#d9cbb0" roughness={0.5} metalness={0.1} />
      </mesh>

      {/* Notebook */}
      <mesh position={[-0.9, -0.94, 0.9]} rotation={[0, 0.12, 0]}>
        <boxGeometry args={[0.9, 0.06, 0.65]} />
        <meshStandardMaterial color="#eadcc0" roughness={0.8} />
      </mesh>

      {/* Pen */}
      <mesh position={[-0.55, -0.88, 0.95]} rotation={[0, 0, Math.PI / 2.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 10]} />
        <meshStandardMaterial color="#d97706" roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Books */}
      <Book
        position={[-2.2, -0.95, 0.5]}
        rotation={[0, 0.08, 0]}
        color="#d97706"
      />

      <Book
        position={[-2.15, -0.78, 0.5]}
        rotation={[0, -0.05, 0]}
        color="#db2777"
      />

      <Book
        position={[-2.1, -0.61, 0.5]}
        color="#059669"
      />

      {/* Coffee cup */}
      <mesh position={[2.3, -0.65, 0.8]}>
        <cylinderGeometry args={[0.35, 0.3, 0.6, 24]} />
        <meshStandardMaterial color="#f5ecd8" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* Plant pot */}
      <mesh position={[2.6, -0.7, -0.8]}>
        <cylinderGeometry args={[0.45, 0.35, 0.55, 20]} />
        <meshStandardMaterial color="#c2540a" roughness={0.75} />
      </mesh>

      {/* Plant */}
      <mesh position={[2.6, -0.05, -0.8]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color="#059669" roughness={0.8} />
      </mesh>

      {/* Desk lamp */}
      <mesh position={[-2.5, -0.2, -0.8]}>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
        <meshStandardMaterial color="#6b5f4a" roughness={0.4} metalness={0.5} />
      </mesh>

      <mesh position={[-2.5, 0.65, -0.8]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>

      <OrbitControls
        enableDamping
        enablePan={false}
        minDistance={6}
        maxDistance={11}
      />
    </>
  );
}

export default function StudyScene() {
  const [color, setColor] = useState("#d97706");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const swatches = [
    { hex: "#d97706", label: "Amber screen" },
    { hex: "#059669", label: "Emerald screen" },
    { hex: "#db2777", label: "Pink screen" },
    { hex: "#ea580c", label: "Orange screen" },
  ];

  return (
    <section className="sp-panel rounded-3xl p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            3D Study Desk
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Rotate the scene and customize your study setup.
          </p>
        </div>

        {!reducedMotion && (
          <div className="flex gap-2">
            {swatches.map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => setColor(swatch.hex)}
                style={{ backgroundColor: swatch.hex }}
                className={`h-8 w-8 rounded-full border-2 transition ${color === swatch.hex
                    ? "border-white scale-110"
                    : "border-white/20 hover:border-white/50"
                  }`}
                aria-label={swatch.label}
              />
            ))}
          </div>
        )}
      </div>

      {reducedMotion ? (
        <div className="flex h-[300px] items-center justify-center rounded-2xl bg-slate-950 p-6 text-center sm:h-[400px]">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-600 text-2xl">
              📚
            </div>

            <h3 className="font-semibold text-white">
              3D preview disabled
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Your reduced-motion preference is enabled.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[300px] w-full overflow-hidden rounded-2xl sm:h-[400px]">
          <Canvas
            camera={{ position: [7, 5, 8], fov: 45 }}
            dpr={[1, 1]}
          >
            <color attach="background" args={["#17120c"]} />
            <fog attach="fog" args={["#17120c", 10, 22]} />
            <DeskScene color={color} />
          </Canvas>
        </div>
      )}
    </section>
  );
}