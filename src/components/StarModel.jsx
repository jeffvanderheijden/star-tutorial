import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

const MODEL_PATH = "/models/star_planks.glb";

export default function StarModel({ currentStep }) {
    const { camera } = useThree();
    const groupRef = useRef();
    const { nodes } = useGLTF(MODEL_PATH);

    // Alle plank meshes
    const planks = useMemo(
        () => Object.values(nodes).filter((n) => n.isMesh),
        [nodes]
    );

    // Opslag voor korte / lange planken
    const [shortPlanks, setShortPlanks] = useState([]);
    const [longPlanks, setLongPlanks] = useState([]);

    // Materialen
    const defaultMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#c8a36a",
                roughness: 0.55,
                metalness: 0.05,
                envMapIntensity: 0.25,
                flatShading: true
            }),
        []
    );

    const highlightMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#ffd24a",
                roughness: 0.4,
                metalness: 0.2,
                emissive: new THREE.Color("#ffb300"),
                emissiveIntensity: 0.5
            }),
        []
    );

    const shortRedMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#ff5555",
                roughness: 0.55,
                metalness: 0.05,
                flatShading: true
            }),
        []
    );

    const longYellowMaterial = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#ffd100",
                roughness: 0.55,
                metalness: 0.05,
                flatShading: true
            }),
        []
    );

    // ---------------------------------------------------------
    // 1) Detecteer korte vs lange planken via bounding box
    // ---------------------------------------------------------
    useEffect(() => {
        if (!planks.length) return;

        const lengths = planks.map((p) => {
            const box = new THREE.Box3().setFromObject(p);
            const size = new THREE.Vector3();
            box.getSize(size);
            return size.length();
        });

        const sorted = [...lengths].sort((a, b) => a - b);
        const cutoff = sorted[Math.floor(sorted.length / 2)];

        const shorts = [];
        const longs = [];

        lengths.forEach((len, i) => {
            if (len < cutoff) shorts.push(i);
            else longs.push(i);
        });

        setShortPlanks(shorts);
        setLongPlanks(longs);
    }, [planks]);

    // ---------------------------------------------------------
    // 2) Per-stap gedrag: materialen + camera
    // ---------------------------------------------------------
    useEffect(() => {
        if (!planks.length) return;

        // 0) Reset alle planken eerst naar default
        planks.forEach((p) => {
            p.material = defaultMaterial;
        });

        // Helper: reset camera + modelrotatie naar “overzicht”
        const resetCameraAndModel = (duration = 1.0) => {
            gsap.to(camera.position, {
                x: 2,
                y: 2.2,
                z: 5,
                duration,
                ease: "power2.inOut",
                onUpdate: () => {
                    camera.lookAt(0, 1.4, 0);
                }
            });

            if (groupRef.current) {
                gsap.to(groupRef.current.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration,
                    ease: "power2.inOut"
                });
            }
        };

        // ---------------------------------------------
        // Overzicht / reset: currentStep === null
        // ---------------------------------------------
        if (currentStep === null) {
            resetCameraAndModel(0.8);
            // planken zijn al default gezet
            return;
        }

        // ---------------------------------------------
        // Stap 1 (index 0): korte / lange planken markeren
        // ---------------------------------------------
        if (currentStep === 0) {
            // Bij stap 1 wil je vaak ook “overzichts-view”
            resetCameraAndModel(0.8);

            planks.forEach((p, i) => {
                if (shortPlanks.includes(i)) {
                    p.material = shortRedMaterial;
                } else if (longPlanks.includes(i)) {
                    p.material = longYellowMaterial;
                } else {
                    p.material = defaultMaterial;
                }
            });
            return;
        }

        // ---------------------------------------------
        // Stap 2 (index 1): V-vorm uitleg (plank 0 & 9 + camera animatie)
        // ---------------------------------------------
        if (currentStep === 1) {
            planks.forEach((p, i) => {
                if (i === 0 || i === 9) {
                    p.material = highlightMaterial;
                } else {
                    p.material = defaultMaterial;
                }
            });

            const targetCamPos = {
                x: 2.697,
                y: 3.585,
                z: -4.194
            };

            gsap.to(camera.position, {
                x: targetCamPos.x,
                y: targetCamPos.y,
                z: targetCamPos.z,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: () => {
                    camera.lookAt(0, 1.4, 0);
                }
            });

            return;
        }

        // ---------------------------------------------
        // Stap 3 (index 2): zelfde highlight (plank 0 & 9), géén camera-animatie
        // ---------------------------------------------
        if (currentStep === 2) {
            planks.forEach((p, i) => {
                if (i === 0 || i === 9) {
                    p.material = highlightMaterial;
                } else {
                    p.material = defaultMaterial;
                }
            });
            return;
        }

        // ---------------------------------------------
        // Stap 4 (index 3): camera animatie + elke plank eigen kleur
        // ---------------------------------------------
        if (currentStep === 3) {

            // CAMERA ANIMATIE
            const targetCamPos = {
                x: -0.290,
                y: 1.540,
                z: 5.434
            };

            gsap.to(camera.position, {
                x: targetCamPos.x,
                y: targetCamPos.y,
                z: targetCamPos.z,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: () => {
                    camera.lookAt(0, 1.4, 0);
                }
            });

            const PAIRS = [
                [0, 9], // paar 1
                [1, 2], // paar 2
                [3, 6], // paar 3
                [7, 4], // paar 4
                [5, 8]  // paar 5
            ];

            // Een kleur per paar
            const PAIR_COLORS = [
                "#3cb44b", // groen
                "#4363d8", // blauw
                "#f58231", // oranje
                "#911eb4", // paars
                "#fabed4"  // roze
            ];

            // Eerst alles resetten
            planks.forEach((p) => {
                p.material = defaultMaterial;
            });

            // Paren kleuren toepassen
            PAIRS.forEach((pair, index) => {
                const color = PAIR_COLORS[index];
                pair.forEach((plankIndex) => {
                    if (planks[plankIndex]) {
                        planks[plankIndex].material = new THREE.MeshStandardMaterial({
                            color,
                            roughness: 0.55,
                            metalness: 0.05,
                            flatShading: true
                        });
                    }
                });
            });

            return;
        }

        // ---------------------------------------------
        // Vanaf stap 4 (index 3+): “normale” per-plank highlight
        // ---------------------------------------------
        if (currentStep === 4) {
            planks.forEach((p) => {
                p.material = defaultMaterial;
            });
            return;
        }
        if (currentStep > 4) {
            planks.forEach((p, i) => {
                if (i === currentStep) {
                    p.material = highlightMaterial;
                } else {
                    p.material = defaultMaterial;
                }
            });
            return;
        }

    }, [
        currentStep,
        planks,
        shortPlanks,
        longPlanks,
        defaultMaterial,
        highlightMaterial,
        shortRedMaterial,
        longYellowMaterial,
        camera
    ]);

    // ---------------------------------------------------------
    // RENDER
    // ---------------------------------------------------------
    return (
        <group
            ref={groupRef}
            scale={0.01}
            position={[0, 0.92, 0]}
            castShadow
            receiveShadow
        >
            {planks.map((mesh, i) => (
                <primitive
                    key={mesh.uuid || i}
                    object={mesh}
                    castShadow
                    receiveShadow
                />
            ))}
        </group>
    );
}

useGLTF.preload(MODEL_PATH);
