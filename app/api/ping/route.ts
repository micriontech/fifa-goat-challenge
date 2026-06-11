export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: true, time: new Date().toISOString() });
}

export async function POST() {
  return Response.json({ ok: true, method: "POST" });
}
