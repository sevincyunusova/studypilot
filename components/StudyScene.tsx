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
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function DeskScene({ color }: { color: string }) {
  return (
    <>
      <ambientLight intensity={2} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={2}
      />

      {/* Desk */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[7, 0.35, 4.5]} />
        <meshStandardMaterial color="#8b5e3c" />
      </mesh>

      {/* Desk legs */}
      <mesh position={[-3, -2, -1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      <mesh position={[3, -2, -1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      <mesh position={[-3, -2, 1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      <mesh position={[3, -2, 1.7]}>
        <boxGeometry args={[0.3, 1.7, 0.3]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Monitor */}
      <mesh position={[0, 0.25, -0.9]}>
        <boxGeometry args={[3, 1.8, 0.18]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.25, -0.79]}>
        <boxGeometry args={[2.7, 1.5, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Monitor stand */}
      <mesh position={[0, -0.8, -0.9]}>
        <boxGeometry args={[0.25, 0.7, 0.25]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <mesh position={[0, -1.1, -0.9]}>
        <boxGeometry args={[1.1, 0.12, 0.7]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Keyboard */}
      <mesh position={[0, -0.95, 0.45]}>
        <boxGeometry args={[2.5, 0.12, 0.8]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Mouse */}
      <mesh position={[1.6, -0.95, 0.45]}>
        <boxGeometry args={[0.45, 0.15, 0.6]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Books */}
      <Book
        position={[-2.2, -0.95, 0.5]}
        rotation={[0, 0.08, 0]}
        color="#2563eb"
      />

      <Book
        position={[-2.15, -0.78, 0.5]}
        rotation={[0, -0.05, 0]}
        color="#a855f7"
      />

      <Book
        position={[-2.1, -0.61, 0.5]}
        color="#22c55e"
      />

      {/* Coffee cup */}
      <mesh position={[2.3, -0.65, 0.8]}>
        <cylinderGeometry args={[0.35, 0.3, 0.6, 24]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Plant pot */}
      <mesh position={[2.6, -0.7, -0.8]}>
        <cylinderGeometry args={[0.45, 0.35, 0.55, 20]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>

      {/* Plant */}
      <mesh position={[2.6, -0.05, -0.8]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Desk lamp */}
      <mesh position={[-2.5, -0.2, -0.8]}>
        <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>

      <mesh position={[-2.5, 0.65, -0.8]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
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
  const [color, setColor] = useState("#2563eb");
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

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            3D Study Desk
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Rotate the scene and customize your study setup.
          </p>
        </div>

        {!reducedMotion && (
          <div className="flex gap-2">
            <button
              onClick={() => setColor("#2563eb")}
              className="h-8 w-8 rounded-full border-2 border-white bg-blue-600"
              aria-label="Blue screen"
            />

            <button
              onClick={() => setColor("#22c55e")}
              className="h-8 w-8 rounded-full bg-green-500"
              aria-label="Green screen"
            />

            <button
              onClick={() => setColor("#a855f7")}
              className="h-8 w-8 rounded-full bg-purple-500"
              aria-label="Purple screen"
            />

            <button
              onClick={() => setColor("#f97316")}
              className="h-8 w-8 rounded-full bg-orange-500"
              aria-label="Orange screen"
            />
          </div>
        )}
      </div>

      {reducedMotion ? (
        <div className="flex h-[300px] items-center justify-center rounded-xl bg-slate-950 p-6 text-center sm:h-[400px]">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-2xl">
              📚
            </div>

            <h3 className="font-semibold">
              3D preview disabled
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Your reduced-motion preference is enabled.
            </p>
          </div>
        </div>
      ) : (
        <div className="h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Canvas
            camera={{ position: [7, 5, 8], fov: 45 }}
            dpr={[1, 1]}
          >
            <color attach="background" args={["#020617"]} />
            <DeskScene color={color} />
          </Canvas>
        </div>
      )}
    </section>
  );
}