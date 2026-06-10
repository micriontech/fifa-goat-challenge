"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { PLAYERS, type Player } from "@/lib/players";
import { GamePlayerCard } from "@/components/PlayerAvatar";
import { useGameAudio } from "@/hooks/useGameAudio";

interface GOATGameProps {
  onComplete: (winner: Player) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_ROUNDS = PLAYERS.length - 1;
const TENSION_THRESHOLD = 4; // last N rounds get heartbeat

export default function GOATGame({ onComplete }: GOATGameProps) {
  const queueRef  = useRef<Player[]>([]);
  const [champion,  setChampion]  = useState<Player | null>(null);
  const [challenger, setChallenger] = useState<Player | null>(null);
  const [round,     setRound]     = useState(1);
  const [selected,  setSelected]  = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  // Flip keys — incrementing re-mounts the wrapper, replaying the CSS animation
  const [champFlipKey, setChampFlipKey] = useState(0);
  const [chalFlipKey,  setChalFlipKey]  = useState(0);

  const audio = useGameAudio();

  useEffect(() => {
    const shuffled = shuffle(PLAYERS);
    setChampion(shuffled[0]);
    setChallenger(shuffled[1]);
    queueRef.current = shuffled.slice(2);
  }, []);

  const handlePick = useCallback(
    async (winner: Player, loser: Player) => {
      if (animating || selected) return;
      setSelected(winner.id);
      setAnimating(true);

      // Sound: pick impact fires immediately on tap
      audio.playPick();

      // Heartbeat tension for final rounds
      const remaining = TOTAL_ROUNDS - round;
      if (remaining < TENSION_THRESHOLD) audio.playHeartbeat();

      fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId: winner.id, loserId: loser.id }),
      }).catch(() => {});

      await new Promise((r) => setTimeout(r, 820));

      if (round >= TOTAL_ROUNDS) {
        audio.playGoatCrowned();
        onComplete(winner);
        return;
      }

      // Pull next challenger from queue ref (no state race)
      const [next, ...rest] = queueRef.current;
      queueRef.current = rest;

      // Sound: whoosh as cards flip in
      audio.playFlip();

      const challengerWon = winner.id !== champion?.id;
      setChampion(winner);
      setChallenger(next);
      setChalFlipKey((k) => k + 1);          // right card always flips
      if (challengerWon) setChampFlipKey((k) => k + 1); // left card flips only when winner changes

      setRound((r) => r + 1);
      setSelected(null);
      setAnimating(false);
    },
    [animating, selected, round, onComplete, champion, audio]
  );

  if (!champion || !challenger) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{ border: "4px solid rgba(212,175,55,0.3)", borderTopColor: "#D4AF37" }}
        />
      </div>
    );
  }

  const progress   = ((round - 1) / TOTAL_ROUNDS) * 100;
  const remaining  = TOTAL_ROUNDS - round + 1;
  const isTension  = remaining <= TENSION_THRESHOLD;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto px-4">

      {/* Progress bar + mute toggle */}
      <div className="w-full">
        <div className="flex justify-between items-center text-xs mb-2">
          <span style={{ color: "rgba(255,255,255,0.55)" }}>
            Round{" "}
            <span style={{ color: isTension ? "#ef4444" : "#D4AF37", fontWeight: 700 }}>{round}</span>
            {" "}of {TOTAL_ROUNDS}
          </span>
          <div className="flex items-center gap-3">
            {isTension && (
              <span className="text-xs font-black animate-pulse"
                style={{ color: "#ef4444", letterSpacing: "0.05em" }}>
                FINAL ROUNDS
              </span>
            )}
            <span style={{ color: "#D4AF37", fontWeight: 700 }}>{remaining} left</span>
            {/* Mute toggle */}
            <button
              onClick={audio.toggleMute}
              title={audio.muted ? "Unmute" : "Mute"}
              className="w-7 h-7 flex items-center justify-center rounded-full text-sm transition-all"
              style={{
                background: audio.muted ? "rgba(255,255,255,0.06)" : "rgba(212,175,55,0.12)",
                border: audio.muted ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(212,175,55,0.3)",
                color: audio.muted ? "rgba(255,255,255,0.3)" : "#D4AF37",
              }}>
              {audio.muted ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 8, background: "rgba(255,255,255,0.1)", border: `1px solid ${isTension ? "rgba(239,68,68,0.4)" : "rgba(212,175,55,0.2)"}` }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: isTension
                ? "linear-gradient(90deg, #b91c1c, #ef4444, #fca5a5)"
                : "linear-gradient(90deg, #292996, #D4AF37, #e8c86a)",
              boxShadow: isTension
                ? "0 0 14px rgba(239,68,68,0.7)"
                : "0 0 12px rgba(212,175,55,0.5)",
            }}
          />
        </div>
      </div>

      <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
        {isTension
          ? "⚡ Every vote counts — who is the TRUE GOAT?"
          : "Tap the player you think is the greater football GOAT"}
      </p>

      {/* VS layout */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 w-full flex-wrap sm:flex-nowrap">

        {/* Champion — flips from left when the winner changes */}
        <div key={`champ-${champFlipKey}`} className="card-flip-left">
          <GamePlayerCard
            player={champion}
            isChampion={true}
            isSelected={selected === champion.id}
            isLoser={selected !== null && selected !== champion.id}
            onClick={() => handlePick(champion, challenger)}
          />
        </div>

        {/* VS orb */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div
            className={isTension ? "border-glow-pulse" : ""}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: isTension ? "rgba(239,68,68,0.12)" : "rgba(212,175,55,0.1)",
              border: `2px solid ${isTension ? "rgba(239,68,68,0.6)" : "rgba(212,175,55,0.4)"}`,
              boxShadow: isTension ? "0 0 24px rgba(239,68,68,0.3)" : "0 0 24px rgba(212,175,55,0.2)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 0,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>⚡</span>
            <span
              style={{
                fontSize: 22, fontWeight: 900, lineHeight: 1.1,
                background: isTension
                  ? "linear-gradient(135deg,#fca5a5,#ef4444)"
                  : "linear-gradient(135deg,#e8c86a,#D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >VS</span>
          </div>
        </div>

        {/* Challenger — always flips from the right */}
        <div key={`chal-${chalFlipKey}`} className="card-flip-right">
          <GamePlayerCard
            player={challenger}
            isChampion={false}
            isSelected={selected === challenger.id}
            isLoser={selected !== null && selected !== challenger.id}
            onClick={() => handlePick(challenger, champion)}
          />
        </div>
      </div>
    </div>
  );
}
