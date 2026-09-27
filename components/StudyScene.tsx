"use client";

import { useEffect, useMemo, useState } from "react";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Book({
  position,
  rotation,
  color,
  selected,
  onClick,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <mesh
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      scale={selected ? 1.08 : 1}
    >
      <boxGeometry args={[1.4, 0.12, 1]} />
      <meshStandardMaterial
        color={color}
        roughness={0.7}
        metalness={0.05}
        emissive={selected ? color : "#000000"}
        emissiveIntensity={selected ? 0.25 : 0}
      />
    </mesh>
  );
}

function Steam({ visible }: { visible: boolean }) {
  const steamRef = useMemo(() => new THREE.Group(), []);

  useFrame(({ clock }) => {
    if (!steamRef) return;

    const time = clock.getElapsedTime();

    steamRef.children.forEach((child, index) => {
      const offset = index * 0.8;
      child.position.x = Math.sin(time * 1.5 + offset) * 0.08;
      child.position.y = Math.sin(time * 1.1 + offset) * 0.08;
      child.scale.setScalar(
        0.75 + Math.sin(time * 1.8 + offset) * 0.15
      );
    });
  });

  if (!visible) return null;

  return (
    <group ref={(node) => node && steamRef.add(node)}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.28}
        />
      </mesh>

      <mesh position={[0.14, 0.55, 0]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.22}
        />
      </mesh>

      <mesh position={[-0.12, 0.75, 0]}>
        <sphereGeometry args={[0.05, 10, 10]} />
        <meshStandardMaterial
          color="#f8fafc"
          transparent
          opacity={0.16}
        />
      </mesh>
    </group>
  );
}

function FloatingParticles({
  color,
  active,
}: {
  color: string;
  active: boolean;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        x: ((index * 37) % 100) / 10 - 5,
        y: ((index * 23) % 60) / 10 - 1,
        z: ((index * 17) % 50) / 10 - 2.5,
        speed: 0.25 + (index % 4) * 0.08,
        size: 0.018 + (index % 3) * 0.012,
      })),
    []
  );

  const groupRef = useMemo(() => new THREE.Group(), []);

  useFrame(({ clock }) => {
    if (!active) return;

    const time = clock.getElapsedTime();

    groupRef.children.forEach((particle, index) => {
      const data = particles[index];

      particle.position.y =
        data.y + Math.sin(time * data.speed + index) * 0.12;

      particle.position.x =
        data.x + Math.cos(time * data.speed * 0.7 + index) * 0.05;
    });
  });

  if (!active) return null;

  return (
    <group ref={(node) => node && groupRef.add(node)}>
      {particles.map((particle, index) => (
        <mesh
          key={index}
          position={[
            particle.x,
            particle.y,
            particle.z,
          ]}
        >
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function MonitorScreen({
  color,
  focusMode,
  timerRunning,
  seconds,
}: {
  color: string;
  focusMode: boolean;
  timerRunning: boolean;
  seconds: number;
}) {
  const screenRef = useMemo(() => new THREE.MeshStandardMaterial(), []);

  useEffect(() => {
    screenRef.color.set(color);
    screenRef.emissive.set(color);
    screenRef.emissiveIntensity = focusMode ? 0.9 : 0.5;
  }, [color, focusMode, screenRef]);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <group position={[0, 0.25, -0.79]}>
      <mesh material={screenRef}>
        <boxGeometry args={[2.7, 1.5, 0.05]} />
      </mesh>

      <mesh position={[-0.72, 0.72, 0.035]}>
        <boxGeometry args={[1.1, 0.08, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      <mesh position={[-0.72, 0.56, 0.035]}>
        <boxGeometry args={[0.75, 0.045, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
      </mesh>

      <mesh position={[-0.82, 0.18, 0.035]}>
        <boxGeometry args={[1.45, 0.04, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      <mesh position={[-0.82, 0.02, 0.035]}>
        <boxGeometry args={[1.15, 0.04, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>

      <mesh position={[0.78, 0.55, 0.035]}>
        <circleGeometry args={[0.16, 20]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>

      <mesh position={[0.78, -0.28, 0.035]}>
        <boxGeometry args={[0.75, 0.18, 0.01]} />
        <meshBasicMaterial
          color={focusMode ? "#ffffff" : "#111827"}
          transparent
          opacity={focusMode ? 0.8 : 0.35}
        />
      </mesh>

      <mesh position={[-0.62, -0.48, 0.035]}>
        <boxGeometry args={[1.35, 0.08, 0.01]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>

      <mesh position={[0.6, -0.48, 0.035]}>
        <boxGeometry args={[0.4, 0.08, 0.01]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={timerRunning ? 0.9 : 0.45}
        />
      </mesh>

      <group position={[0.1, -0.05, 0.05]}>
        <mesh>
          <planeGeometry args={[0.95, 0.28]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.28}
          />
        </mesh>
      </group>

      <pointLight
        position={[0, 0, 0.3]}
        color={color}
        intensity={focusMode ? 1.4 : 0.7}
        distance={3}
      />
    </group>
  );
}

function Keyboard({
  color,
  active,
}: {
  color: string;
  active: boolean;
}) {
  const keys = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        x: -0.95 + (index % 8) * 0.27,
        z: 0.18 + Math.floor(index / 8) * 0.22,
      })),
    []
  );

  return (
    <group position={[0, -0.95, 0.45]}>
      <mesh>
        <boxGeometry args={[2.5, 0.12, 0.8]} />
        <meshStandardMaterial
          color="#f2ead9"
          roughness={0.6}
          metalness={0.05}
        />
      </mesh>

      {keys.map((key, index) => (
        <mesh
          key={index}
          position={[key.x, 0.08, key.z]}
          scale={
            active && index % 5 === Math.floor(Date.now() / 400) % 5
              ? [1, 0.75, 1]
              : [1, 1, 1]
          }
        >
          <boxGeometry args={[0.19, 0.035, 0.14]} />
          <meshStandardMaterial
            color={active ? color : "#d6cbb8"}
            emissive={active ? color : "#000000"}
            emissiveIntensity={active ? 0.15 : 0}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function DeskScene({
  color,
  lampOn,
  setLampOn,
  focusMode,
  timerRunning,
  seconds,
  selectedObject,
  setSelectedObject,
}: {
  color: string;
  lampOn: boolean;
  setLampOn: (value: boolean) => void;
  focusMode: boolean;
  timerRunning: boolean;
  seconds: number;
  selectedObject: string;
  setSelectedObject: (value: string) => void;
}) {
  const plantRef = useMemo(() => new THREE.Group(), []);
  const cupRef = useMemo(() => new THREE.Group(), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (plantRef) {
      plantRef.rotation.z = Math.sin(time * 0.8) * 0.035;
      plantRef.rotation.x = Math.cos(time * 0.6) * 0.025;
    }

    if (cupRef) {
      cupRef.position.y =
        Math.sin(time * 0.5) * 0.008;
    }
  });

  return (
    <>
      <ambientLight
        intensity={focusMode ? 0.75 : 1.3}
        color="#fbe6c8"
      />

      <directionalLight
        position={[4, 7, 5]}
        intensity={focusMode ? 1.2 : 2.2}
        color="#fff4e0"
      />

      <pointLight
        position={[-2.5, 1.1, -0.6]}
        intensity={lampOn ? 2.4 : 0.45}
        color={lampOn ? "#fbbf24" : "#6b7280"}
        distance={4}
      />

      <directionalLight
        position={[-5, 3, -4]}
        intensity={focusMode ? 0.12 : 0.35}
        color="#34d399"
      />

      <mesh
        position={[0, -2.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[5.4, 48]} />
        <meshStandardMaterial
          color="#0d0906"
          roughness={1}
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[7, 0.35, 4.5]} />
        <meshStandardMaterial
          color="#7a5233"
          roughness={0.75}
          metalness={0.04}
        />
      </mesh>

      {[
        [-3, -2, -1.7],
        [3, -2, -1.7],
        [-3, -2, 1.7],
        [3, -2, 1.7],
      ].map((position, index) => (
        <mesh
          key={index}
          position={position as [number, number, number]}
        >
          <boxGeometry args={[0.3, 1.7, 0.3]} />
          <meshStandardMaterial
            color="#4a3f33"
            roughness={0.6}
            metalness={0.15}
          />
        </mesh>
      ))}

      <group
        onClick={(event) => {
          event.stopPropagation();
          setSelectedObject(
            selectedObject === "monitor"
              ? ""
              : "monitor"
          );
        }}
      >
        <mesh position={[0, 0.25, -0.9]}>
          <boxGeometry args={[3, 1.8, 0.18]} />
          <meshStandardMaterial
            color="#241c14"
            roughness={0.4}
            metalness={0.35}
          />
        </mesh>

        <MonitorScreen
          color={color}
          focusMode={focusMode}
          timerRunning={timerRunning}
          seconds={seconds}
        />

        <mesh position={[0, -0.8, -0.9]}>
          <boxGeometry args={[0.25, 0.7, 0.25]} />
          <meshStandardMaterial
            color="#3a2f24"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>

        <mesh position={[0, -1.1, -0.9]}>
          <boxGeometry args={[1.1, 0.12, 0.7]} />
          <meshStandardMaterial
            color="#3a2f24"
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
      </group>

      <Keyboard
        color={color}
        active={focusMode}
      />

      <mesh
        position={[1.6, -0.95, 0.45]}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedObject(
            selectedObject === "mouse"
              ? ""
              : "mouse"
          );
        }}
      >
        <boxGeometry args={[0.45, 0.15, 0.6]} />
        <meshStandardMaterial
          color="#d9cbb0"
          roughness={0.5}
          metalness={0.1}
          emissive={
            selectedObject === "mouse"
              ? color
              : "#000000"
          }
          emissiveIntensity={
            selectedObject === "mouse"
              ? 0.3
              : 0
          }
        />
      </mesh>

      <mesh
        position={[-0.9, -0.94, 0.9]}
        rotation={[0, 0.12, 0]}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedObject(
            selectedObject === "notebook"
              ? ""
              : "notebook"
          );
        }}
      >
        <boxGeometry args={[0.9, 0.06, 0.65]} />
        <meshStandardMaterial
          color={
            selectedObject === "notebook"
              ? "#fff7ed"
              : "#eadcc0"
          }
          roughness={0.8}
        />
      </mesh>

      <mesh
        position={[-0.55, -0.88, 0.95]}
        rotation={[0, 0, Math.PI / 2.2]}
      >
        <cylinderGeometry args={[0.03, 0.03, 0.8, 10]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      <Book
        position={[-2.2, -0.95, 0.5]}
        rotation={[0, 0.08, 0]}
        color="#d97706"
        selected={selectedObject === "book1"}
        onClick={() =>
          setSelectedObject(
            selectedObject === "book1" ? "" : "book1"
          )
        }
      />

      <Book
        position={[-2.15, -0.78, 0.5]}
        rotation={[0, -0.05, 0]}
        color="#db2777"
        selected={selectedObject === "book2"}
        onClick={() =>
          setSelectedObject(
            selectedObject === "book2" ? "" : "book2"
          )
        }
      />

      <Book
        position={[-2.1, -0.61, 0.5]}
        color="#059669"
        selected={selectedObject === "book3"}
        onClick={() =>
          setSelectedObject(
            selectedObject === "book3" ? "" : "book3"
          )
        }
      />

      <group
        ref={(node) => node && cupRef.add(node)}
        position={[2.3, -0.65, 0.8]}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedObject(
            selectedObject === "coffee"
              ? ""
              : "coffee"
          );
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.35, 0.3, 0.6, 24]} />
          <meshStandardMaterial
            color="#f5ecd8"
            roughness={0.25}
            metalness={0.1}
            emissive={
              selectedObject === "coffee"
                ? color
                : "#000000"
            }
            emissiveIntensity={
              selectedObject === "coffee"
                ? 0.2
                : 0
            }
          />
        </mesh>

        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.025, 24]} />
          <meshStandardMaterial
            color="#3b2418"
            roughness={0.3}
          />
        </mesh>

        <mesh
          position={[0.38, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.2, 0.05, 12, 24]} />
          <meshStandardMaterial
            color="#f5ecd8"
            roughness={0.25}
          />
        </mesh>

        <Steam visible />
      </group>

      <group
        ref={(node) => node && plantRef.add(node)}
        position={[2.6, -0.7, -0.8]}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedObject(
            selectedObject === "plant"
              ? ""
              : "plant"
          );
        }}
      >
        <mesh>
          <cylinderGeometry args={[0.45, 0.35, 0.55, 20]} />
          <meshStandardMaterial
            color="#c2540a"
            roughness={0.75}
          />
        </mesh>

        <group position={[0, 0.65, 0]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.65, 16, 16]} />
            <meshStandardMaterial
              color="#059669"
              roughness={0.8}
              emissive={
                selectedObject === "plant"
                  ? "#059669"
                  : "#000000"
              }
              emissiveIntensity={
                selectedObject === "plant"
                  ? 0.25
                  : 0
              }
            />
          </mesh>

          <mesh
            position={[-0.35, 0.18, 0]}
            scale={[0.7, 1.2, 0.6]}
          >
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshStandardMaterial
              color="#10b981"
              roughness={0.8}
            />
          </mesh>

          <mesh
            position={[0.35, 0.12, 0]}
            scale={[0.7, 1.1, 0.6]}
          >
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshStandardMaterial
              color="#047857"
              roughness={0.8}
            />
          </mesh>
        </group>
      </group>

      <group
        onClick={(event) => {
          event.stopPropagation();
          setLampOn(!lampOn);
          setSelectedObject("lamp");
        }}
      >
        <mesh position={[-2.5, -0.2, -0.8]}>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 12]} />
          <meshStandardMaterial
            color="#6b5f4a"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>

        <mesh position={[-2.5, 0.65, -0.8]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color={lampOn ? "#fbbf24" : "#6b7280"}
            emissive={lampOn ? "#fbbf24" : "#000000"}
            emissiveIntensity={lampOn ? 0.8 : 0}
            roughness={0.3}
          />
        </mesh>
      </group>

      <FloatingParticles
        color={color}
        active={focusMode}
      />

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

  const [lampOn, setLampOn] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [selectedObject, setSelectedObject] = useState("");

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
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          setTimerRunning(false);
          return 25 * 60;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [timerRunning]);

  const swatches = [
    { hex: "#d97706", label: "Amber screen" },
    { hex: "#059669", label: "Emerald screen" },
    { hex: "#db2777", label: "Pink screen" },
    { hex: "#ea580c", label: "Orange screen" },
  ];

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const remainingSeconds = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  }, [seconds]);

  const selectedLabel = useMemo(() => {
    const labels: Record<string, string> = {
      monitor: "StudyPilot monitor",
      mouse: "Wireless mouse",
      notebook: "Study notebook",
      book1: "Frontend book",
      book2: "JavaScript book",
      book3: "React book",
      coffee: "Coffee break",
      plant: "Study plant",
      lamp: "Desk lamp",
    };

    return labels[selectedObject] || "Click an object on the desk";
  }, [selectedObject]);

  const toggleFocusMode = () => {
    setFocusMode((current) => {
      const next = !current;

      if (next) {
        setLampOn(true);
        setTimerRunning(true);
      } else {
        setTimerRunning(false);
      }

      return next;
    });
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setSeconds(25 * 60);
  };

  return (
    <section className="sp-panel rounded-3xl p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-white">
                3D Study Desk
              </h2>

              {focusMode && (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  Focus Mode
                </span>
              )}
            </div>

            <p className="mt-1 text-sm text-slate-400">
              Explore your virtual workspace and interact with the
              objects.
            </p>
          </div>

          {!reducedMotion && (
            <div className="flex items-center gap-2">
              <span className="mr-1 text-xs text-slate-500">
                Screen
              </span>

              {swatches.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => setColor(swatch.hex)}
                  style={{
                    backgroundColor: swatch.hex,
                  }}
                  className={`h-8 w-8 rounded-full border-2 transition ${
                    color === swatch.hex
                      ? "scale-110 border-white"
                      : "border-white/20 hover:border-white/50"
                  }`}
                  aria-label={swatch.label}
                />
              ))}
            </div>
          )}
        </div>

        {!reducedMotion && (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={() => setLampOn((current) => !current)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                lampOn
                  ? "border-amber-500/30 bg-amber-500/10"
                  : "border-slate-800 bg-slate-950/50"
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                Lamp
              </span>

              <span
                className={`mt-1 block text-sm font-semibold ${
                  lampOn
                    ? "text-amber-400"
                    : "text-slate-500"
                }`}
              >
                {lampOn ? "ON" : "OFF"}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleFocusMode}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                focusMode
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-slate-800 bg-slate-950/50"
              }`}
            >
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                Mode
              </span>

              <span
                className={`mt-1 block text-sm font-semibold ${
                  focusMode
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {focusMode ? "FOCUS" : "NORMAL"}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                setTimerRunning((current) => !current)
              }
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-left transition hover:border-slate-700"
            >
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                Pomodoro
              </span>

              <span className="mt-1 block text-sm font-semibold text-white">
                {timerLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-left transition hover:border-slate-700"
            >
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">
                Reset
              </span>

              <span className="mt-1 block text-sm font-semibold text-slate-400">
                25:00
              </span>
            </button>
          </div>
        )}

        {!reducedMotion && (
          <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/40 px-4 py-2.5">
            <span className="text-xs text-slate-500">
              Desk interaction
            </span>

            <span className="text-xs font-medium text-amber-400">
              {selectedLabel}
            </span>
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
            camera={{
              position: [7, 5, 8],
              fov: 45,
            }}
            dpr={[1, 1]}
          >
            <color
              attach="background"
              args={["#17120c"]}
            />

            <fog
              attach="fog"
              args={["#17120c", 10, 22]}
            />

            <DeskScene
              color={color}
              lampOn={lampOn}
              setLampOn={setLampOn}
              focusMode={focusMode}
              timerRunning={timerRunning}
              seconds={seconds}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />
          </Canvas>
        </div>
      )}

      {!reducedMotion && (
        <div className="mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Drag to rotate · Scroll to zoom · Click objects to
            interact
          </span>

          <span className="text-slate-600">
            StudyPilot virtual workspace
          </span>
        </div>
      )}
    </section>
  );
}