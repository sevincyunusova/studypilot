"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function DeskScene() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={2}
        castShadow
      />

      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[6, 0.3, 4]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.5, 1.5, 0.2]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      <mesh position={[0, 0.5, 0.3]} castShadow>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#dbeafe" />
      </mesh>

      <mesh position={[-2, -0.3, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      <OrbitControls enableDamping />
    </>
  );
}

export default function StudyScene() {
  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl">
      <Canvas
        shadows
        camera={{ position: [7, 5, 7], fov: 45 }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#f8fafc"]} />
        <DeskScene />
      </Canvas>
    </div>
  );
}