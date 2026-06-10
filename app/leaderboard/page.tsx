"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLAYERS, type Player } from "@/lib/players";
import { AvatarCircle } from "@/components/PlayerAvatar";

interface PlayerRanked extends Player { rank: number; }
type FilterTab = "All" | "Active" | "Legend";

/* ─── Canvas card generator ────────────────────────────────────────────────── */
async function loadImageFromUrl(src: string): Promise<HTMLImageElement> {
  const res = await fetch(src);
  const blob = await res.blob();
  const objUrl = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => { URL.revokeObjectURL(objUrl); resolve(img); };
    img.onerror = reject;
    img.src = objUrl;
  });
}

async function generateGoatCard(player: Player, appUrl: string): Promise<Blob | null> {
  const SIZE = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bgGrad.addColorStop(0, "#0D1B2A");
  bgGrad.addColorStop(0.5, "#1a2f45");
  bgGrad.addColorStop(1, "#0D1B2A");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Player image
  try {
    const img = await loadImageFromUrl(player.imagePath);
    const scale = Math.max(SIZE / img.naturalWidth, 820 / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    ctx.drawImage(img, (SIZE - drawW) / 2, 0, drawW, drawH);
  } catch { /* continue without image */ }

  // Gradient fade bottom
  const fade = ctx.createLinearGradient(0, 380, 0, SIZE);
  fade.addColorStop(0, "rgba(13,27,42,0)");
  fade.addColorStop(0.45, "rgba(13,27,42,0.9)");
  fade.addColorStop(1, "rgba(13,27,42,1)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Gold border
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, SIZE - 10, SIZE - 10);

  ctx.strokeStyle = "rgba(212,175,55,0.25)";
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, SIZE - 44, SIZE - 44);

  // Crown emoji
  ctx.font = "70px serif";
  ctx.textAlign = "center";
  ctx.fillText("👑", SIZE / 2, 90);

  // Brand
  ctx.fillStyle = "rgba(212,175,55,0.75)";
  ctx.font = "bold 26px system-ui, sans-serif";
  ctx.fillText("FIFAWCPREDICT · FIFA 2026", SIZE / 2, 132);

  // Player name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 82px system-ui, sans-serif";
  ctx.fillText(player.name, SIZE / 2, 706);

  // Country
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "44px system-ui, sans-serif";
  ctx.fillText(`${player.flag}  ${player.country}`, SIZE / 2, 768);

  // Gold divider
  const divGrad = ctx.createLinearGradient(160, 0, SIZE - 160, 0);
  divGrad.addColorStop(0, "transparent");
  divGrad.addColorStop(0.3, "#D4AF37");
  divGrad.addColorStop(0.7, "#D4AF37");
  divGrad.addColorStop(1, "transparent");
  ctx.strokeStyle = divGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(160, 808);
  ctx.lineTo(SIZE - 160, 808);
  ctx.stroke();

  // "My FIFA GOAT" — red rounded badge with white text
  const badgeLabel = `My FIFA GOAT  ‘${player.name}’`;
  ctx.font = "bold 46px system-ui, sans-serif";
  const badgeTextW = ctx.measureText(badgeLabel).width;
  const bPadX = 56, bPadY = 22, bR = 22;
  const bW = Math.max(badgeTextW + bPadX * 2, 640);
  const bH = 46 * 1.4 + bPadY * 2;
  const bX = (SIZE - bW) / 2;
  const bY = 835;
  ctx.fillStyle = "#C62828";
  ctx.beginPath();
  ctx.moveTo(bX + bR, bY);
  ctx.lineTo(bX + bW - bR, bY);
  ctx.quadraticCurveTo(bX + bW, bY, bX + bW, bY + bR);
  ctx.lineTo(bX + bW, bY + bH - bR);
  ctx.quadraticCurveTo(bX + bW, bY + bH, bX + bW - bR, bY + bH);
  ctx.lineTo(bX + bR, bY + bH);
  ctx.quadraticCurveTo(bX, bY + bH, bX, bY + bH - bR);
  ctx.lineTo(bX, bY + bR);
  ctx.quadraticCurveTo(bX, bY, bX + bR, bY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 46px system-ui, sans-serif";
  ctx.fillText(badgeLabel, SIZE / 2, bY + bH / 2 + 17);

  // Who is YOUR FIFA GOAT?
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 40px system-ui, sans-serif";
  ctx.fillText("Who is YOUR FIFA GOAT?", SIZE / 2, 958);

  // Join The Challenge
  ctx.fillStyle = "rgba(46,196,182,0.9)";
  ctx.font = "32px system-ui, sans-serif";
  ctx.fillText(`Join The Challenge  →  ${appUrl}`, SIZE / 2, 1016);

  // Footer
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText("FIFA 2026 World Cup  ·  USA · Canada · Mexico", SIZE / 2, 1058);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png", 0.95));
}

/* ─── Share Modal ──────────────────────────────────────────────────────────── */
function ShareModal({ onClose, userPickPlayer }: {
  onClose: () => void;
  userPickPlayer: PlayerRanked | undefined;
}) {
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://fifawcpredict.com";
  const playerName = userPickPlayer?.name || "";
  const shareText = playerName
    ? `🏆 My FIFA GOAT is '${playerName}'!\n\nWho is YOUR FIFA GOAT?\nJoin The Challenge 👉 ${appUrl}/`
    : `⚽ Who is YOUR FIFA GOAT?\nJoin The Challenge 👉 ${appUrl}/`;

  const [generating, setGenerating] = useState(false);
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect desktop: Web Share API with files unsupported on most desktops
    const noFileShare = !navigator.canShare || !navigator.canShare({ files: [new File([], "t.png", { type: "image/png" })] });
    setIsDesktop(noFileShare);

    if (!userPickPlayer) return;
    setGenerating(true);
    generateGoatCard(userPickPlayer, appUrl)
      .then((blob) => {
        if (!blob) return;
        setCardBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      })
      .finally(() => setGenerating(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function downloadCard() {
    if (!cardBlob) return;
    const url = URL.createObjectURL(cardBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-goat-${(playerName).toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyImageToClipboard() {
    if (!cardBlob) return;
    try {
      const item = new ClipboardItem({ "image/png": cardBlob });
      await navigator.clipboard.write([item]);
      setStatusMsg("Image copied! Now paste (Ctrl+V) into Facebook, Twitter or Instagram.");
    } catch {
      // Clipboard API not available — fall back to download
      downloadCard();
      setStatusMsg("Saved! Upload the image when posting on social media.");
    }
  }

  async function shareNative() {
    if (!cardBlob) return;
    const file = new File([cardBlob], `goat-${userPickPlayer?.id}.png`, { type: "image/png" });
    try {
      await navigator.share({ files: [file], text: shareText });
    } catch { /* dismissed */ }
  }

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodeURIComponent(shareText)}`;
  const twitterUrl  = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(16px)" }}>
      <div className="glass rounded-3xl p-5 w-full max-w-sm overflow-y-auto" style={{ maxHeight: "92vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black text-white">Share My GOAT Card</h3>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-base"
            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.06)" }}>
            &#x2715;
          </button>
        </div>

        {/* Card preview */}
        <div className="flex justify-center mb-3">
          <div className="rounded-2xl overflow-hidden relative"
            style={{ width: 260, height: 260, background: "#0D1B2A", border: "2px solid #D4AF37" }}>
            {generating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full animate-spin"
                  style={{ border: "3px solid rgba(212,175,55,0.15)", borderTopColor: "#D4AF37" }} />
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Building card&hellip;</p>
              </div>
            )}
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="GOAT card" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
          </div>
        </div>

        <p className="text-center text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.22)" }}>
          1080 &times; 1080 px &mdash; Instagram &amp; WhatsApp ready
        </p>

        {/* Status message */}
        {statusMsg && (
          <div className="rounded-xl px-3 py-2 mb-3 text-xs font-semibold text-center"
            style={{ background: "rgba(46,196,182,0.12)", color: "#2EC4B6", border: "1px solid rgba(46,196,182,0.3)" }}>
            {statusMsg}
          </div>
        )}

        {/* Tip for desktop */}
        {isDesktop && !statusMsg && (
          <div className="rounded-xl px-3 py-2 mb-3 text-xs text-center"
            style={{ background: "rgba(212,175,55,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(212,175,55,0.15)" }}>
            On laptop/desktop: Copy the image &rarr; paste (Ctrl+V) into Facebook, Twitter, or Instagram
          </div>
        )}

        <div className="flex flex-col gap-2">

          {/* Desktop primary: Copy to clipboard */}
          {isDesktop && (
            <button
              onClick={copyImageToClipboard}
              disabled={generating || !cardBlob}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-black text-sm disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg,#D4AF37,#C5A059)",
                color: "#0D1B2A",
                boxShadow: "0 4px 20px rgba(212,175,55,0.4)",
              }}>
              {generating ? "⏳ Building card…" : "📋  Copy Card Image to Clipboard"}
            </button>
          )}

          {/* Mobile primary: Native share with image */}
          {!isDesktop && (
            <button
              onClick={shareNative}
              disabled={generating || !cardBlob}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-black text-sm disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg,#2EC4B6,#22a99c)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(46,196,182,0.4)",
              }}>
              {generating ? "Building card…" : "📲  Share Card to Facebook / Instagram"}
            </button>
          )}

          {/* Save image — universal */}
          <button
            onClick={downloadCard}
            disabled={generating || !cardBlob}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-sm disabled:opacity-40"
            style={{ background: "rgba(212,175,55,0.08)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)" }}>
            &#x2B07;&#xFE0F;  Save Card Image (1080&times;1080)
          </button>

          {/* Facebook */}
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#1877F2" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook {isDesktop ? "(text + paste image)" : ""}
          </a>

          {/* Twitter / X */}
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-sm text-white"
            style={{ background: "#000000" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
            </svg>
            Twitter / X
          </a>

          {/* Copy text */}
          <button
            onClick={() => navigator.clipboard?.writeText(shareText).then(() => setStatusMsg("Message text copied!"))}
            className="w-full py-2.5 rounded-full font-bold text-xs"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
            &#x1F4CB;  Copy Message Text
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── My GOAT Card display ─────────────────────────────────────────────────── */
function MyGoatCard({ player, onShare }: { player: PlayerRanked; onShare: () => void }) {
  return (
    <div className="flex flex-col items-center mb-10">
      <p className="text-xs font-black uppercase tracking-widest mb-4"
        style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>
        Your GOAT Pick
      </p>

      <div className="relative rounded-3xl overflow-hidden border-glow-pulse"
        style={{
          width: 240,
          border: "2px solid #D4AF37",
          boxShadow: "0 0 50px rgba(212,175,55,0.3), 0 0 100px rgba(212,175,55,0.1)",
          background: "rgba(13,27,42,0.9)",
        }}>
        {/* Crown */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: "rgba(13,27,42,0.8)", border: "1px solid rgba(212,175,55,0.5)", backdropFilter: "blur(8px)" }}>
          <span className="text-xs">&#x1F451;</span>
          <span className="text-[10px] font-black" style={{ color: "#D4AF37" }}>GOAT</span>
        </div>

        {/* Player image */}
        <div style={{ position: "relative", height: 300, width: "100%" }}>
          <Image
            src={player.imagePath}
            alt={player.name}
            fill
            sizes="240px"
            style={{ objectFit: "cover", objectPosition: "top center" }}
            priority
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 50%, rgba(13,27,42,0.98) 100%)",
          }} />
        </div>

        {/* Card info */}
        <div className="px-4 pt-2 pb-5 text-center" style={{ background: "rgba(13,27,42,0.98)", marginTop: -2 }}>
          <p className="text-lg font-black text-white leading-tight">{player.name}</p>
          <p className="text-xs mt-1 mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
            {player.flag} {player.country}
          </p>
          <div className="flex justify-center gap-4 mb-3 pt-2"
            style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
            <div className="text-center">
              <p className="font-black text-sm" style={{ color: "#D4AF37" }}>{player.totalWins || 0}</p>
              <p className="text-[9px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>Wins</p>
            </div>
            <div className="text-center">
              <p className="font-black text-sm" style={{ color: "#D4AF37" }}>{player.era}</p>
              <p className="text-[9px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.3)" }}>Era</p>
            </div>
          </div>
          <div className="rounded-xl px-3 py-2.5"
            style={{ background: "#C62828" }}>
            <p className="text-xs font-black text-white text-center tracking-wide">
              My FIFA GOAT &lsquo;{player.name}&rsquo;
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onShare}
        className="mt-5 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
        style={{
          background: "linear-gradient(135deg,#D4AF37,#C5A059)",
          color: "#0D1B2A",
          boxShadow: "0 4px 24px rgba(212,175,55,0.4)",
        }}>
        &#x2191; Share My GOAT Card
      </button>
    </div>
  );
}

/* ─── Win bar ──────────────────────────────────────────────────────────────── */
function WinBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.07)" }}>
        <div className="h-full rounded-full win-bar-animate"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#D4AF37,#e8c86a)" }} />
      </div>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", minWidth: 30, textAlign: "right" }}>
        {pct.toFixed(0)}%
      </span>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */
export default function LeaderboardPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<PlayerRanked[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<FilterTab>("All");
  const [voterCount, setVoterCount] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [userSession, setUserSession] = useState<{ email: string; name: string; goatPick: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bo_user");
    if (stored) {
      try { setUserSession(JSON.parse(stored)); setIsAuthenticated(true); } catch { /* ignore */ }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("bo_user");
    setUserSession(null);
    setIsAuthenticated(false);
    router.push("/");
  }

  useEffect(() => {
    fetch("/api/players")
      .then((r) => r.json())
      .then((d) => {
        const raw: Player[] = d.players?.length ? d.players : PLAYERS;
        const sorted = [...raw].sort((a, b) => (b.totalWins || 0) - (a.totalWins || 0));
        setPlayers(sorted.map((p, i) => ({ ...p, rank: i + 1 })));
      })
      .catch(() => {
        setPlayers([...PLAYERS].sort((a, b) => b.totalWins - a.totalWins).map((p, i) => ({ ...p, rank: i + 1 })));
      })
      .finally(() => setLoading(false));

    fetch("/api/voters")
      .then((r) => r.json())
      .then((d) => setVoterCount(d.count || 0))
      .catch(() => {});
  }, []);

  const userPickPlayer = players.find((p) => p.id === userSession?.goatPick);
  const filtered = players.filter((p) => tab === "All" ? true : p.era === tab);
  const maxWins = Math.max(...players.map((p) => p.totalWins || 0), 1);

  const tabActive: React.CSSProperties = {
    background: "linear-gradient(135deg,#D4AF37,#C5A059)", color: "#0D1B2A",
    fontWeight: 700, borderRadius: 50, padding: "8px 18px", fontSize: 13, border: "none", cursor: "pointer",
  };
  const tabInactive: React.CSSProperties = {
    background: "rgba(212,175,55,0.07)", color: "rgba(255,255,255,0.45)", fontWeight: 600,
    borderRadius: 50, padding: "8px 18px", fontSize: 13, border: "1px solid rgba(212,175,55,0.2)", cursor: "pointer",
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="glass-gold rounded-3xl p-10 max-w-sm w-full">
          <div className="text-6xl mb-4">&#x1F512;</div>
          <h1 className="text-2xl font-black text-white mb-3">Members Only</h1>
          <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Complete the GOAT Challenge or sign in to see the rankings.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="block py-3 rounded-full font-bold text-center"
              style={{ background: "linear-gradient(135deg,#2EC4B6,#22a99c)", color: "#fff" }}>
              Take the GOAT Challenge
            </Link>
            <Link href="/signin" className="block py-3 rounded-full font-bold text-center text-sm"
              style={{ border: "1px solid rgba(212,175,55,0.4)", color: "#D4AF37" }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      {showShare && (
        <ShareModal
          onClose={() => setShowShare(false)}
          userPickPlayer={userPickPlayer}
        />
      )}

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(to bottom,#e8c86a,#D4AF37)" }} />
              <div>
                <h1 className="text-3xl sm:text-4xl font-black">
                  <span className="text-gradient-gold">GOAT</span>
                  <span className="text-white"> Leaderboard</span>
                </h1>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {voterCount.toLocaleString()} total votes
                  {userSession && (
                    <span style={{ color: "rgba(255,255,255,0.25)", marginLeft: 8 }}>
                      &middot; {userSession.name || userSession.email}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold mt-1 transition-all"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(252,165,165,0.8)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.18)"; (e.currentTarget as HTMLElement).style.color = "#fca5a5"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(252,165,165,0.8)"; }}
            >
              &#x1F6AA; Logout
            </button>
          </div>
        </div>

        {/* My GOAT Card */}
        {!loading && userPickPlayer ? (
          <MyGoatCard player={userPickPlayer} onShare={() => setShowShare(true)} />
        ) : !loading && !userPickPlayer && (
          <div className="glass-gold rounded-2xl p-6 text-center mb-8">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              You haven&apos;t picked a GOAT yet.{" "}
              <Link href="/" style={{ color: "#D4AF37", fontWeight: 700 }}>Take the Challenge &rarr;</Link>
            </p>
          </div>
        )}

        {/* Community Rankings */}
        <div className="mb-5">
          <h2 className="text-lg font-black text-white mb-1">Community Rankings</h2>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            How all {voterCount.toLocaleString()} fans voted
          </p>
        </div>

        <div className="flex gap-2 mb-5">
          {(["All", "Active", "Legend"] as FilterTab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={tab === t ? tabActive : tabInactive}>
              {t === "All" ? "All Players" : `${t} Only`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(212,175,55,0.06)" }} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((player) => {
              const isMyPick = userSession?.goatPick === player.id;
              const winPct = ((player.totalWins || 0) / maxWins) * 100;
              return (
                <div key={player.id}
                  className="lb-row flex items-center gap-3 sm:gap-4 rounded-xl px-4 py-3"
                  style={isMyPick ? {
                    background: "linear-gradient(135deg,rgba(212,175,55,0.12),rgba(180,120,0,0.06))",
                    border: "1px solid rgba(212,175,55,0.4)",
                  } : {
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}>

                  <div className="flex-shrink-0 w-8 flex justify-center">
                    <span className="text-sm font-bold"
                      style={{ color: isMyPick ? "#D4AF37" : "rgba(255,255,255,0.3)" }}>
                      {player.rank}
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    <AvatarCircle player={player} size={44} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-bold text-sm leading-tight truncate">{player.name}</p>
                      {isMyPick && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: "rgba(212,175,55,0.18)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.35)" }}>
                          My GOAT &#x1F451;
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {player.flag} {player.country}
                    </p>
                    <WinBar pct={winPct} />
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p style={{ color: "#D4AF37", fontWeight: 900, fontSize: 15 }}>{player.totalWins || 0}</p>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10 }}>wins</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs mt-8" style={{ color: "rgba(255,255,255,0.1)" }}>
          Rankings update live &middot; Win the GOAT debate!
        </p>
      </div>
    </div>
  );
}
