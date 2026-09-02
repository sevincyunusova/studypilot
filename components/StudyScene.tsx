"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function DeskScene({ color }: { color: string }) {
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
                <meshStandardMaterial color="#334155" />
            </mesh>

            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[2.5, 1.5, 0.2]} />
                <meshStandardMaterial color={color} />
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
                            aria-label="Blue desk"
                        />

                        <button
                            onClick={() => setColor("#22c55e")}
                            className="h-8 w-8 rounded-full bg-green-500"
                            aria-label="Green desk"
                        />

                        <button
                            onClick={() => setColor("#a855f7")}
                            className="h-8 w-8 rounded-full bg-purple-500"
                            aria-label="Purple desk"
                        />

                        <button
                            onClick={() => setColor("#f97316")}
                            className="h-8 w-8 rounded-full bg-orange-500"
                            aria-label="Orange desk"
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
                        shadows
                        camera={{ position: [7, 5, 7], fov: 45 }}
                        dpr={[1, 1.5]}
                    >
                        <color attach="background" args={["#020617"]} />
                        <DeskScene color={color} />
                    </Canvas>
                </div>
            )}
        </section>
    );
}