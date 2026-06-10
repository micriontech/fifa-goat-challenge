import { NextRequest, NextResponse } from "next/server";
import { updatePlayerWin, updatePlayerAppearance } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const { winnerId, loserId } = await req.json();
    if (!winnerId || !loserId) {
      return NextResponse.json({ error: "Missing player IDs" }, { status: 400 });
    }
    await Promise.all([
      updatePlayerWin(winnerId),
      updatePlayerAppearance(loserId),
    ]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json({ success: false, error: "Sheet update failed" }, { status: 500 });
  }
}
