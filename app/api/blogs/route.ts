import { NextResponse } from "next/server";
import { getBlogs } from "@/lib/googleSheets";

export async function GET() {
  try {
    const blogs = await getBlogs();
    return NextResponse.json({ blogs }, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json({ blogs: [] });
  }
}
