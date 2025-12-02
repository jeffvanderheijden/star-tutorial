// src/components/CameraLogger.jsx
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

export default function CameraLogger({ controlsRef }) {
    const { camera } = useThree();

    useEffect(() => {
        const controls = controlsRef.current;
        if (!controls) return;

        const onEnd = () => {
            const pos = camera.position;
            const rot = camera.rotation;

            console.log("=== CAMERA VIEW SAVED ===");
            console.log("Camera Position:", {
                x: pos.x.toFixed(3),
                y: pos.y.toFixed(3),
                z: pos.z.toFixed(3),
            });

            console.log("Camera Rotation (deg):", {
                x: THREE.MathUtils.radToDeg(rot.x).toFixed(2),
                y: THREE.MathUtils.radToDeg(rot.y).toFixed(2),
                z: THREE.MathUtils.radToDeg(rot.z).toFixed(2),
            });
        };

        controls.addEventListener("end", onEnd);

        return () => controls.removeEventListener("end", onEnd);
    }, [controlsRef, camera]);

    return null;
}
