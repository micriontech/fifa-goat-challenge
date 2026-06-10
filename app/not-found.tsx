import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-4">⚽</div>
      <h1 className="text-4xl font-black mb-2" style={{ color: "#EF9F27" }}>404</h1>
      <h2 className="text-xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.45)" }}>
        This page doesn&apos;t exist. Head back to the challenge.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full font-bold text-sm"
        style={{ background: "#EF9F27", color: "#0a0014" }}
      >
        Back to Home
      </Link>
    </div>
  );
}
