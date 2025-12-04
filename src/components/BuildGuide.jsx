import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import StarModel from "./StarModel.jsx";
// import CameraLogger from "./CameraLogger.jsx";
import ConfettiTrigger from "./ConfettiTrigger.jsx";

const STEP_TEXT = [
    "Check eerst of je alle planken hebt. We hebben er 10 nodig. 5 lange en 5 korte. (5 keer geel en 5 keer rood zoals op het voorbeeld hiernaast.)",
    "We beginnen met het maken van een V-vorm. Zorg dat je een korte en een lange plank gebruikt. Let goed op hoe de planken aan elkaar bevestigd worden in het voorbeeld hiernaast!",
    "We gaan deze nu aan elkaar lijmen. Zorg dat je lijm gebruikt die geschikt is voor hout en gebruik niet teveel lijm! Een stuk tape helpt om de planken bij elkaar te houden tijdens dit proces.",
    "Doe dit tot we vijf V-vormen hebben. Deze vormen de punten van onze ster. Wanneer de V vormen droog zijn, gaan we verder en lijmen we ze éen voor één aan elkaar. (Gebruik ook hier weer tape om ze op hun plek te houden tijdens het drogen.)",
    "Gefeliciteerd! Je hebt een super coole houten ster gebouwd. Nu kun je hem nog verven of beitsen om hem helemaal af te maken."
];

export default function BuildGuide() {
    const totalSteps = STEP_TEXT.length;
    const [step, setStep] = useState(null);
    const controlsRef = useRef();

    const handlePrev = () => {
        if (step === null) return;
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleNext = () => {
        if (step === null) {
            setStep(0);
        } else {
            setStep((s) => (s < totalSteps - 1 ? s + 1 : s));
        }
    };

    const handleReset = () => setStep(null);

    const stepLabel = step === null ? "0 (overzicht)" : `${step + 1}`;

    return (
        <div className="workshop-container">

            {/* LEFT PANEL */}
            <section className="workshop-panel workshop-panel--left">
                <header className="workshop-header">
                    <h1>Workshop: Houten Ster Bouwen</h1>
                    <p className="workshop-subtitle">
                        Interactieve 3D handleiding — stap voor stap
                    </p>
                </header>

                <div className="workshop-step-info">
                    <div className="step-indicator">
                        <span>Stap</span>
                        <strong>{stepLabel} / {totalSteps}</strong>
                    </div>

                    <div className="step-text">
                        {step === null ? (
                            <p>
                                Hier zie je het eindproduct dat we gaan bouwen.
                                Klik op <strong>Start</strong> om stap voor stap de ster op te bouwen.
                            </p>
                        ) : (
                            <>
                                <p>{STEP_TEXT[step]}</p>
                                {step === 0 && (
                                    <img
                                        src="/img/step1.png"
                                        style={{ width: "100%", marginTop: "20px" }}
                                    />
                                )}
                                {step === 1 && (
                                    <img
                                        src="/img/step2.png"
                                        style={{ width: "100%", marginTop: "20px" }}
                                    />
                                )}
                                {step === 2 && (
                                    <img
                                        src="/img/step3.png"
                                        style={{ width: "100%", marginTop: "20px" }}
                                    />
                                )}
                                {step === 3 && (
                                    <img
                                        src="/img/step4.png"
                                        style={{ width: "100%", marginTop: "20px" }}
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="workshop-controls">
                    <button className="btn" onClick={handlePrev} disabled={step === null || step === 0}>
                        Vorige
                    </button>
                    {step !== 4 && (
                        <button className="btn btn--primary" onClick={handleNext}>
                            {step === null
                                ? "Start"
                                : step === totalSteps - 2
                                    ? "Laatste stap"
                                    : "Volgende"}
                        </button>
                    )}

                    <button className="btn btn--ghost" onClick={handleReset}>
                        Reset
                    </button>
                </div>

                <footer className="workshop-footer">
                    <p>Gebruik de muis om het model te draaien</p>
                </footer>
            </section>

            {/* RIGHT PANEL */}
            <section className="workshop-panel workshop-panel--right">
                <Canvas
                    shadows
                    camera={{ position: [2, 2.2, 5], fov: 40 }}
                    style={{ background: "#f2f2f2" }}
                >
                    {/* <CameraLogger controlsRef={controlsRef} /> */}

                    {/* Lights */}
                    <ambientLight intensity={0.55} />
                    <directionalLight
                        castShadow
                        position={[2, 3, 3]}
                        intensity={1.45}
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                        shadow-bias={-0.0002}
                    />
                    <directionalLight
                        position={[-3, 1.5, -2]}
                        intensity={0.55}
                        color="#dce9ff"
                    />
                    <directionalLight
                        position={[0, 2, -4]}
                        intensity={0.35}
                    />

                    <OrbitControls
                        enableRotate={true}
                        enableZoom={false}
                        enablePan={false}
                        enableDamping
                        dampingFactor={0.12}
                        // minPolarAngle={0.5}      // optioneel: voorkomt dat je “onder” het model kijkt
                        // maxPolarAngle={2.2}      // optioneel
                        target={[0, 1.4, 0]}
                    />
                    <StarModel currentStep={step} />
                </Canvas>
            </section>
            <ConfettiTrigger active={step === 4} />
        </div>
    );
}
