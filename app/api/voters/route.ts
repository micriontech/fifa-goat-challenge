import { NextResponse } from "next/server";
import { getTotalVoters } from "@/lib/googleSheets";

export async function GET() {
  try {
    const count = await getTotalVoters();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
