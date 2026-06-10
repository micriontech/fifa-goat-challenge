"use client";
import { useState, useMemo } from "react";
import { FIXTURES, GROUPS, STAGES, type Fixture } from "@/lib/fixtures";

const hostFlags: Record<string, string> = {
  USA: "ðŸ‡ºðŸ‡¸", Canada: "ðŸ‡¨ðŸ‡¦", Mexico: "ðŸ‡²ðŸ‡½",
};

function FixtureCard({ fixture }: { fixture: Fixture }) {
  const hostFlag = hostFlags[fixture.country] || "";
  const dateObj = new Date(fixture.date + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = dateObj.getTime() === today.getTime();
  const isUpcoming = dateObj >= today;

  return (
    <div className="glass-cyan card-hover card-hover-cyan card-3d relative overflow-hidden"
      style={{ padding: "0" }}>

      {/* Top color stripe */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #06b6d4, #0ea5e9, #06b6d4)", borderRadius: "16px 16px 0 0" }} />

      <div style={{ padding: "16px 18px 18px" }}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            {fixture.group && (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{ background: "rgba(6,182,212,0.18)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.35)", letterSpacing: "0.05em" }}>
                GROUP {fixture.group}
              </span>
            )}
            <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>{fixture.stage}</span>
          </div>

          <div className="flex items-center gap-2">
            {isToday && (
              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.4)" }}>
                <span className="live-dot" /> LIVE TODAY
              </span>
            )}
            {fixture.result && (
              <span className="text-xs font-black px-2.5 py-1 rounded-lg"
                style={{ background: "rgba(6,182,212,0.15)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.3)", fontVariantNumeric: "tabular-nums" }}>
                {fixture.result}
              </span>
            )}
            {!fixture.result && isUpcoming && !isToday && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" }}>
                Upcoming
              </span>
            )}
          </div>
        </div>

        {/* Teams row â€” scoreboard style */}
        <div className="flex items-center justify-between gap-3">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <span style={{ fontSize: 40, lineHeight: 1, filter: "drop-shadow(0 2px 8px rgba(6,182,212,0.3))" }}>
              {fixture.homeFlag}
            </span>
            <p className="font-black text-sm leading-tight" style={{ color: "#fff" }}>{fixture.homeTeam}</p>
          </div>

          {/* VS orb */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(14,165,233,0.1))",
                border: "2px solid rgba(6,182,212,0.4)",
                boxShadow: "0 0 20px rgba(6,182,212,0.2)",
              }}>
              <span style={{ color: "#22d3ee", fontWeight: 900, fontSize: 13 }}>VS</span>
            </div>
            <span className="text-[10px] font-semibold" style={{ color: "rgba(6,182,212,0.5)" }}>{fixture.time}</span>
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-2 text-center">
            <span style={{ fontSize: 40, lineHeight: 1, filter: "drop-shadow(0 2px 8px rgba(6,182,212,0.3))" }}>
              {fixture.awayFlag}
            </span>
            <p className="font-black text-sm leading-tight" style={{ color: "#fff" }}>{fixture.awayTeam}</p>
          </div>
        </div>

        {/* Details bar */}
        <div className="mt-4 pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs"
          style={{ borderTop: "1px solid rgba(6,182,212,0.12)", color: "rgba(255,255,255,0.35)" }}>
          <span>ðŸ“… {dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          <span>ðŸŸï¸ {fixture.venue}</span>
          <span>ðŸ“ {hostFlag} {fixture.city}, {fixture.country}</span>
        </div>
      </div>
    </div>
  );
}

export default function FixturesPage() {
  const [selectedGroup, setSelectedGroup] = useState<string>("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return FIXTURES.filter((f: Fixture) => {
      if (selectedGroup !== "All" && f.group !== selectedGroup) return false;
      if (selectedStage !== "All" && f.stage !== selectedStage) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !f.homeTeam.toLowerCase().includes(q) &&
          !f.awayTeam.toLowerCase().includes(q) &&
          !f.city.toLowerCase().includes(q) &&
          !f.venue.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [selectedGroup, selectedStage, search]);

  const tabActive = (color = "#06b6d4", bg = "rgba(6,182,212,0.15)") => ({
    background: bg, color, fontWeight: 700,
    borderRadius: 50, padding: "6px 14px", fontSize: 12,
    border: `1px solid ${color}66`, cursor: "pointer",
  });
  const tabInactive = {
    background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", fontWeight: 600,
    borderRadius: 50, padding: "6px 14px", fontSize: 12,
    border: "1px solid rgba(6,182,212,0.15)", cursor: "pointer",
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-10 rounded-full" style={{ background: "linear-gradient(to bottom, #06b6d4, #0284c7)" }} />
            <div>
              <h1 className="text-3xl sm:text-4xl font-black">
                <span className="text-gradient-cyan">FIFA 2026</span>
                <span className="text-white"> Fixtures</span>
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                All 104 matches â€” ðŸ‡ºðŸ‡¸ USA Â· ðŸ‡¨ðŸ‡¦ Canada Â· ðŸ‡²ðŸ‡½ Mexico
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              { label: "Total Matches", value: "104" },
              { label: "Groups", value: "12" },
              { label: "Host Cities", value: "16" },
              { label: "Showing", value: String(filtered.length) },
            ].map((s) => (
              <div key={s.label} className="glass-cyan px-4 py-2 flex flex-col items-center" style={{ borderRadius: 12, minWidth: 72 }}>
                <span className="font-black text-lg" style={{ color: "#22d3ee" }}>{s.value}</span>
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: "rgba(6,182,212,0.6)" }}>ðŸ”</span>
            <input
              type="text"
              placeholder="Search team, city or venueâ€¦"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all"
              style={{
                background: "rgba(6,182,212,0.06)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.2)")}
            />
          </div>
        </div>

        {/* Stage filter */}
        <div className="flex flex-wrap gap-2 mb-3">
          {["All", ...STAGES].map((s) => (
            <button key={s}
              onClick={() => { setSelectedStage(s); setSelectedGroup("All"); }}
              style={selectedStage === s && selectedGroup === "All" ? tabActive() : tabInactive}>
              {s}
            </button>
          ))}
        </div>

        {/* Group filter */}
        {(selectedStage === "All" || selectedStage === "Group Stage") && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => setSelectedGroup("All")}
              style={selectedGroup === "All" ? tabActive() : tabInactive}>
              All Groups
            </button>
            {GROUPS.map((g) => (
              <button key={g}
                onClick={() => { setSelectedGroup(g); setSelectedStage("Group Stage"); }}
                style={selectedGroup === g ? tabActive() : tabInactive}>
                Group {g}
              </button>
            ))}
          </div>
        )}

        {/* Fixture grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center py-20" style={{ color: "rgba(255,255,255,0.25)" }}>
              <div className="text-5xl mb-3">âš½</div>
              No fixtures found for that search.
            </div>
          ) : (
            filtered.map((fixture) => <FixtureCard key={fixture.id} fixture={fixture} />)
          )}
        </div>
      </div>
    </div>
  );
}

