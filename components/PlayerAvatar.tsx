"use client";
import Image from "next/image";
import { Player } from "@/lib/players";

/* â”€â”€ Small circular avatar (leaderboard / crowning) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function AvatarCircle({ player, size = 64 }: { player: Player; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        border: "2px solid rgba(212,175,55,0.35)",
        background: `linear-gradient(135deg, ${player.gradientFrom}, ${player.gradientTo})`,
      }}
    >
      <Image
        src={player.imagePath}
        alt={player.name}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "cover", objectPosition: "top center" }}
      />
    </div>
  );
}

/* â”€â”€ Game 1v1 card â€” full card image, 200px wide â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function GamePlayerCard({
  player,
  isChampion,
  isSelected,
  isLoser,
  onClick,
}: {
  player: Player;
  isChampion?: boolean;
  isSelected?: boolean;
  isLoser?: boolean;
  onClick?: () => void;
}) {
  const borderColor = isSelected
    ? "#22c55e"
    : isLoser
    ? "rgba(255,255,255,0.06)"
    : isChampion
    ? "#D4AF37"
    : "rgba(255,255,255,0.18)";

  return (
    <div
      onClick={onClick}
      className={isSelected ? "picked-flash" : ""}
      style={{
        width: "min(82vw, 320px)",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `2px solid ${borderColor}`,
        borderRadius: 20,
        overflow: "hidden",
        cursor: onClick ? "pointer" : "default",
        opacity: isLoser ? 0.35 : 1,
        transition: "all 0.2s ease",
        boxShadow: isChampion
          ? "0 0 32px rgba(212,175,55,0.4)"
          : isSelected
          ? "0 0 32px rgba(34,197,94,0.4)"
          : "none",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        if (onClick && !isLoser) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-6px) scale(1.03)";
          el.style.borderColor = "#D4AF37";
          el.style.boxShadow = "0 12px 40px rgba(212,175,55,0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !isLoser) {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "";
          el.style.borderColor = borderColor;
          el.style.boxShadow = isChampion ? "0 0 32px rgba(212,175,55,0.4)" : "none";
        }
      }}
    >
      {/* Card image â€” fills top portion */}
      <div style={{ position: “relative”, width: “100%”, height: “min(82vw, 300px)” }}>
        <Image
          src={player.imagePath}
          alt={player.name}
          fill
          sizes="200px"
          style={{ objectFit: "cover", objectPosition: "top center" }}
          priority
        />
        {/* subtle gradient fade at bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: "linear-gradient(to bottom, transparent, rgba(10,5,30,0.85))",
          }}
        />
      </div>

      {/* Name / country strip */}
      <div
        style={{
          padding: "10px 12px 12px",
          textAlign: "center",
          background: "rgba(10,5,30,0.85)",
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", lineHeight: 1.2 }}>
          {player.name}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
          {player.flag} {player.country}
        </div>
      </div>
    </div>
  );
}

/* â”€â”€ Leaderboard avatar (alias) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export function LeaderboardAvatar({ player }: { player: Player }) {
  return <AvatarCircle player={player} size={44} />;
}


