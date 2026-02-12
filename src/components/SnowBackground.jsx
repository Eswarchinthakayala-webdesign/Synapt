import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 600;

const SnowParticles = () => {
    const meshRef = useRef();

    const { positions, speeds, drifts, sizes } = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const speeds = new Float32Array(PARTICLE_COUNT);
        const drifts = new Float32Array(PARTICLE_COUNT);
        const sizes = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;      // x
            positions[i * 3 + 1] = Math.random() * 20 - 5;      // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;  // z
            speeds[i] = 0.003 + Math.random() * 0.008;
            drifts[i] = (Math.random() - 0.5) * 0.003;
            sizes[i] = 0.02 + Math.random() * 0.06;
        }
        return { positions, speeds, drifts, sizes };
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const posArr = meshRef.current.geometry.attributes.position.array;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            // Fall down
            posArr[i * 3 + 1] -= speeds[i];
            // Drift sideways with sine wave
            posArr[i * 3] += drifts[i] + Math.sin(time * 0.5 + i) * 0.001;
            // Slight z drift
            posArr[i * 3 + 2] += Math.cos(time * 0.3 + i * 0.5) * 0.0005;

            // Reset particle when it falls below view
            if (posArr[i * 3 + 1] < -8) {
                posArr[i * 3 + 1] = 15;
                posArr[i * 3] = (Math.random() - 0.5) * 30;
                posArr[i * 3 + 2] = (Math.random() - 0.5) * 20;
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={PARTICLE_COUNT}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#ffffff"
                transparent
                opacity={0.4}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

const FloatingOrbs = () => {
    const group = useRef();

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = state.clock.elapsedTime * 0.03;
            group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
        }
    });

    return (
        <group ref={group}>
            {/* Ambient glow orbs */}
            {[
                { pos: [5, 3, -8], color: '#ff4444', size: 0.8 },
                { pos: [-6, -2, -5], color: '#4488ff', size: 0.5 },
                { pos: [3, -4, -10], color: '#44ff88', size: 0.6 },
                { pos: [-4, 5, -6], color: '#ff8844', size: 0.4 },
            ].map((orb, i) => (
                <mesh key={i} position={orb.pos}>
                    <sphereGeometry args={[orb.size, 16, 16]} />
                    <meshBasicMaterial
                        color={orb.color}
                        transparent
                        opacity={0.06}
                    />
                </mesh>
            ))}
        </group>
    );
};

export const SnowBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                style={{ background: 'transparent' }}
                gl={{ alpha: true, antialias: false }}
                dpr={[1, 1.5]}
            >
                <ambientLight intensity={0.3} />
                <SnowParticles />
                <FloatingOrbs />
            </Canvas>
        </div>
    );
};
