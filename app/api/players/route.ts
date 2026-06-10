import { NextResponse } from "next/server";
import { getPlayers } from "@/lib/googleSheets";
import { PLAYERS } from "@/lib/players";

export async function GET() {
  try {
    const sheetRows = await getPlayers();

    if (sheetRows && sheetRows.length > 0) {
      // Merge live wins from Sheets into static player data (which has gradients, flags, etc.)
      const merged = PLAYERS.map((p) => {
        const live = sheetRows.find((r) => r.id === p.id);
        return {
          ...p,
          totalWins: live?.totalWins ?? 0,
          totalAppearances: live?.totalAppearances ?? 0,
          winRate: live?.winRate ?? 0,
        };
      });
      return NextResponse.json({ players: merged });
    }
  } catch {
    // Sheets not configured yet — return static data
  }
  return NextResponse.json({ players: PLAYERS });
}
