"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-black text-white mb-2">Something went wrong</h2>
      <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-full font-bold text-sm"
        style={{ background: "#EF9F27", color: "#0a0014" }}
      >
        Try again
      </button>
    </div>
  );
}
