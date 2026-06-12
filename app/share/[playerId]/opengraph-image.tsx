import { ImageResponse } from "next/og";
import { PLAYERS } from "@/lib/players";

export const runtime = "edge";
export const alt = "FIFA GOAT Challenge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { playerId: string } }) {
  const player = PLAYERS.find((p) => p.id === params.playerId);
  const name = player?.name ?? "FIFA Legend";
  const country = player?.country ?? "";
  const flag = player?.flag ?? "";
  const base = "https://fifawcpredict.com";
  const imageUrl = player ? `${base}${player.imagePath}` : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "linear-gradient(135deg, #0D1B2A 0%, #1a2f45 50%, #0D1B2A 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Player image — right side */}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              height: "100%",
              width: "50%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />
        )}

        {/* Gradient overlay on image */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(to right, #0D1B2A 0%, transparent 40%)",
            display: "flex",
          }}
        />

        {/* Left content */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "62%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 60px",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", marginBottom: 24 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#D4AF37", letterSpacing: 2 }}>
              FIFAWCPREDICT
            </span>
          </div>

          {/* Label */}
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "rgba(255,255,255,0.6)",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            My FIFA GOAT is
          </div>

          {/* Player name */}
          <div
            style={{
              display: "flex",
              fontSize: name.length > 14 ? 64 : 76,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            {name}
          </div>

          {/* Country */}
          <div style={{ display: "flex", fontSize: 32, color: "rgba(255,255,255,0.7)", marginBottom: 40 }}>
            {flag}  {country}
          </div>

          {/* CTA badge */}
          <div
            style={{
              display: "flex",
              background: "#D4AF37",
              borderRadius: 50,
              padding: "16px 36px",
              width: "fit-content",
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 900, color: "#0D1B2A" }}>
              Who is YOUR FIFA GOAT?
            </span>
          </div>

          {/* URL */}
          <div style={{ display: "flex", marginTop: 24, fontSize: 20, color: "rgba(255,255,255,0.35)" }}>
            fifawcpredict.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
