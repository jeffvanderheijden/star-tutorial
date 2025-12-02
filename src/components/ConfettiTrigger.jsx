import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiTrigger({ active }) {
    useEffect(() => {
        if (!active) return;

        // Groot knal
        confetti({
            particleCount: 150,
            spread: 160,
            origin: { y: 0.6 }
        });

        // Extra bursts
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 120,
                startVelocity: 40,
                origin: { y: 0.6 }
            });
        }, 350);

        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 100,
                startVelocity: 45,
                origin: { y: 0.6 }
            });
        }, 700);

    }, [active]);

    return null;
}
