"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/news", label: "News" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("bo_user");
      if (stored) setUser(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  function logout() {
    localStorage.removeItem("bo_user");
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(13,27,42,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 select-none">
              <span className="text-xl font-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                <span style={{ color: "#fff" }}>FIFA</span>
                <span style={{ color: "#D4AF37" }}>WC</span>
                <span style={{ color: "#fff" }}>PREDICT</span>
              </span>
              <span className="text-lg football-roll">⚽</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold transition-colors relative pb-0.5"
                  style={{ color: pathname === link.href ? "#D4AF37" : "rgba(255,255,255,0.7)" }}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span style={{
                      position: "absolute", bottom: -4, left: 0, right: 0,
                      height: 2, background: "#D4AF37", borderRadius: 1,
                    }} />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: user chip or Play Now */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Avatar chip */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                      style={{ background: "linear-gradient(135deg,#D4AF37,#C5A059)", color: "#06040f" }}>
                      {initials}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#D4AF37", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {user.name || user.email}
                    </span>
                  </div>
                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-bold rounded-full transition-all"
                    style={{
                      border: "1px solid rgba(239,68,68,0.35)",
                      color: "rgba(252,165,165,0.8)",
                      background: "rgba(239,68,68,0.07)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.18)";
                      (e.currentTarget as HTMLElement).style.color = "#fca5a5";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(252,165,165,0.8)";
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="px-5 py-2 text-sm font-bold rounded-full transition-all hover:scale-105"
                  style={{ border: "1px solid rgba(212,175,55,0.45)", color: "#D4AF37", background: "rgba(212,175,55,0.08)" }}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div
            className="menu-slide fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{
              width: 280,
              background: "rgba(13,27,42,0.97)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              borderLeft: "1px solid rgba(212,175,55,0.2)",
              padding: "24px 0",
            }}
          >
            {/* Close */}
            <div className="flex justify-end px-6 mb-6">
              <button onClick={() => setMenuOpen(false)} className="text-white p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Logo */}
            <div className="px-6 mb-8">
              <span className="text-lg font-black">
                <span style={{ color: "#fff" }}>FIFA</span>
                <span style={{ color: "#D4AF37" }}>WC</span>
                <span style={{ color: "#fff" }}>PREDICT</span>
              </span>
            </div>

            {/* User chip */}
            {user && (
              <div className="mx-4 mb-4 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#D4AF37,#C5A059)", color: "#06040f" }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "#D4AF37" }}>{user.name}</p>
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.35)" }}>{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="flex flex-col px-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
                  style={{
                    color: pathname === link.href ? "#D4AF37" : "rgba(255,255,255,0.8)",
                    background: pathname === link.href ? "rgba(212,175,55,0.12)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Footer action */}
            <div className="px-6 mt-auto pt-6 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-full font-bold text-sm"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center py-3 rounded-full font-bold text-sm"
                  style={{ border: "1px solid rgba(212,175,55,0.45)", color: "#D4AF37", background: "rgba(212,175,55,0.08)" }}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}


