import { NextResponse } from "next/server";
import { initializeSheets } from "@/lib/googleSheets";

export async function GET() {
  try {
    await initializeSheets();
    return NextResponse.json({ success: true, message: "Sheets initialised" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
