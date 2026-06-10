"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Zap, ChevronRight, Star } from "lucide-react";
import { type Player } from "@/lib/players";
import GOATGame from "@/components/GOATGame";
import SignupForm from "@/components/SignupForm";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

type Phase = "home" | "game" | "signup";

function StatPill({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1 px-5 py-3 rounded-2xl"
      style={{
        background: "rgba(13,27,42,0.6)",
        border: "1px solid rgba(212,175,55,0.25)",
        backdropFilter: "blur(12px)",
      }}>
      <div style={{ color: "#D4AF37" }}>{icon}</div>
      <span className="font-black text-xl" style={{ color: "#D4AF37" }}>{value}</span>
      <span className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
    </div>
  );
}

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("home");
  const [gameWinner, setGameWinner] = useState<Player | null>(null);
  const [voterCount, setVoterCount] = useState(0);

  useEffect(() => {
    fetch("/api/voters")
      .then((r) => r.json())
      .then((d) => setVoterCount(d.count || 0))
      .catch(() => {});
  }, []);

  if (phase === "game") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black"
              style={{
                background: "linear-gradient(135deg,#e8c86a,#D4AF37)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              GOAT Challenge
            </h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Pick the greatest football player of all time
            </p>
          </div>
          <GOATGame
            onComplete={(winner) => {
              setGameWinner(winner);
              setPhase("signup");
            }}
          />
          <button
            onClick={() => setPhase("home")}
            className="mt-10 mx-auto block text-sm transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
          >
            &larr; Back to home
          </button>
        </div>
      </div>
    );
  }

  if (phase === "signup" && gameWinner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <SignupForm winner={gameWinner} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <HeroGeometric badge="" title1="" title2="">
        {/* All content appears instantly — no delays */}
        <div className="flex flex-col items-center gap-5">

          {/* Voter count */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.35)",
              backdropFilter: "blur(12px)",
            }}>
            <Users className="w-3.5 h-3.5" style={{ color: "#D4AF37" }} />
            <span style={{ color: "#D4AF37", fontWeight: 800, fontSize: 14 }}>
              {voterCount.toLocaleString()}
            </span>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>votes cast worldwide</span>
          </div>

          {/* CTA button */}
          <motion.button
            onClick={() => setPhase("game")}
            whileHover={{ scale: 1.06, boxShadow: "0 0 60px rgba(46,196,182,0.65)" }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 px-8 py-4 rounded-full font-black text-lg"
            style={{
              background: "linear-gradient(135deg,#2EC4B6,#22a99c)",
              color: "#fff",
              boxShadow: "0 4px 32px rgba(46,196,182,0.45)",
            }}
          >
            <Zap className="w-5 h-5" />
            Take the GOAT Challenge
            <ChevronRight className="w-5 h-5" />
          </motion.button>

          {/* Stats */}
          <div className="flex items-center gap-3">
            <StatPill value="20" label="Players" icon={<Star className="w-4 h-4" />} />
            <StatPill value="19" label="Rounds" icon={<Zap className="w-4 h-4" />} />
            <StatPill value="1" label="GOAT" icon={<Trophy className="w-4 h-4" />} />
          </div>
        </div>
      </HeroGeometric>

      {/* Features section */}
      <div className="relative z-10 px-4 py-20"
        style={{ background: "linear-gradient(to bottom, #0D1B2A 0%, #0a1520 100%)" }}>
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black mb-3">
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg,#e8c86a,#D4AF37,#2EC4B6)" }}>
                The Ultimate Football Debate
              </span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>
              20 legends. 1 tournament. Your verdict decides the GOAT.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "⚽", title: "1v1 GOAT Battle",       desc: "Vote head-to-head through 19 rounds. The greatest survives.",              border: "rgba(212,175,55,0.25)" },
              { icon: "🏆", title: "Live Leaderboard",      desc: "See how the world votes in real time. Is your GOAT leading?",             border: "rgba(212,175,55,0.3)" },
              { icon: "📰", title: "Latest Football News",  desc: "FIFA 2026 updates, team news, and match results as they happen.",          border: "rgba(46,196,182,0.2)" },
              { icon: "📅", title: "Full Fixture List",     desc: "All 104 FIFA 2026 matches. Filter by group, stage or team.",               border: "rgba(46,196,182,0.25)" },
              { icon: "👥", title: "Join the Community",    desc: `${voterCount.toLocaleString() || "Thousands of"} fans voted. Add yours.`,  border: "rgba(0,86,179,0.3)" },
              { icon: "🌍", title: "USA · Canada · Mexico", desc: "16 host cities, 3 countries, 1 World Cup. Full tournament coverage.",       border: "rgba(30,63,32,0.5)" },
            ].map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(13,27,42,0.7)",
                  border: `1px solid ${card.border}`,
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="font-black text-white text-base mb-2">{card.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <motion.button
              onClick={() => { setPhase("game"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(46,196,182,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-base"
              style={{
                background: "linear-gradient(135deg,#2EC4B6,#22a99c)",
                color: "#fff",
                boxShadow: "0 4px 32px rgba(46,196,182,0.4)",
              }}
            >
              <Trophy className="w-5 h-5" />
              Start the GOAT Challenge
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
