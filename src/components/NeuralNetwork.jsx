import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from './theme-provider';

function SnowParticles({ mouse, color }) {
    const pointsRef = useRef();
    const { viewport } = useThree();
    const particlesCount = 5000; // Dense snow for cinematic feel

    // Store positions and individual particle properties
    const [positions, velocities, phases] = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        const vel = new Float32Array(particlesCount);
        const pha = new Float32Array(particlesCount);
        
        for (let i = 0; i < particlesCount; i++) {
            // Randomly distributed starting points
            pos[i * 3] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            // Random fall velocity (gravity)
            vel[i] = Math.random() * 0.05 + 0.02;
            // Random phase for horizontal swaying (wind)
            pha[i] = Math.random() * Math.PI * 2;
        }
        return [pos, vel, pha];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const posAttr = pointsRef.current.geometry.attributes.position;
        const mouseX = mouse.current.x * 5; // Influence of mouse on wind

        for (let i = 0; i < particlesCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // 1. Constant Downward Falling
            posAttr.array[iy] -= velocities[i];

            // 2. Horizontal Swaying (Wind Effect)
            // Combined sine wave with mouse horizontal influence
            posAttr.array[ix] += Math.sin(time + phases[i]) * 0.01 + (mouseX * 0.005);

            // 3. Reset when out of bounds (infinite loop)
            if (posAttr.array[iy] < -15) {
                posAttr.array[iy] = 15;
                posAttr.array[ix] = (Math.random() - 0.5) * 30;
            }

            // Boundary wrapping for X
            if (posAttr.array[ix] > 15) posAttr.array[ix] = -15;
            if (posAttr.array[ix] < -15) posAttr.array[ix] = 15;
        }
        
        posAttr.needsUpdate = true;
        
        // Slight rotation to add volume
        pointsRef.current.rotation.y = time * 0.05;
    });

    return (
        <group>
            <Points ref={pointsRef} positions={positions} stride={3}>
                <PointMaterial
                    transparent
                    color={color}
                    size={0.06}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function GridBackground({ color }) {
    const gridRef = useRef();
    
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        gridRef.current.position.z = (time * 2) % 10;
    });

    return (
        <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
            <gridHelper args={[100, 50, color, color]} position={[0, 0, 0]}>
                <meshBasicMaterial transparent opacity={0.05} color={color} />
            </gridHelper>
        </group>
    );
}

export const NeuralNetwork = () => {
    const mouse = useRef({ x: 0, y: 0 });
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const color = isDark ? "#ffffff" : "#000000";

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-background overflow-hidden">
            <div className="absolute inset-0 opacity-[0.1] text-foreground grid-pattern"></div>
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 2]}>
                <fog attach="fog" args={[isDark ? '#000' : '#fff', 5, 25]} />
                <ambientLight intensity={0.5} />
                <SnowParticles mouse={mouse} color={color} />
                <GridBackground color={color} />
            </Canvas>
            <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-transparent via-background/20 to-background' : 'from-transparent via-background/20 to-background'} pointer-events-none`}></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-30 pointer-events-none"></div>
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                <div className="w-full h-[2px] bg-foreground animate-scan-y"></div>
            </div>
        </div>
    );
};
