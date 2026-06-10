"use client";
import { useEffect } from "react";

export default function ConfettiEffect() {
  useEffect(() => {
    let confetti: typeof import("canvas-confetti") | null = null;

    import("canvas-confetti").then((mod) => {
      confetti = mod.default;

      const fire = (opts: object) =>
        confetti!({
          particleCount: 80,
          spread: 90,
          colors: ["#EF9F27", "#F5BC5C", "#ffffff", "#ffd700", "#ffaa00"],
          ...opts,
        });

      fire({ origin: { x: 0.2, y: 0.6 }, angle: 60 });
      fire({ origin: { x: 0.8, y: 0.6 }, angle: 120 });

      setTimeout(() => {
        fire({ origin: { x: 0.5, y: 0.4 } });
      }, 500);
      setTimeout(() => {
        fire({ origin: { x: 0.3, y: 0.5 }, angle: 75 });
        fire({ origin: { x: 0.7, y: 0.5 }, angle: 105 });
      }, 1000);
    });
  }, []);

  return null;
}
