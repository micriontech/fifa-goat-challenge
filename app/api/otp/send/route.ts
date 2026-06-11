import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("[OTP-SEND] Handler called");
  try {
    const body = await req.json();
    console.log("[OTP-SEND] Body parsed:", JSON.stringify(body));

    const { email, name, phone, goatPick } = body;
    if (!email || !name) {
      return NextResponse.json({ error: "Email and name required" }, { status: 400 });
    }

    // Step 1: test Redis
    console.log("[OTP-SEND] Testing Redis...");
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(`otp:${email}`, { otp, userData: { name, phone, goatPick } }, { ex: 600 });
    console.log("[OTP-SEND] Redis OK, OTP stored:", otp);

    // Step 2: test Resend
    console.log("[OTP-SEND] Testing Resend...");
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "FIFAWCPREDICT <noreply@fifawcpredict.com>",
      to: email,
      subject: "Your FIFAWCPREDICT verification code",
      html: `<div style="font-family:sans-serif;padding:32px;background:#0a0a1a;color:#fff;border-radius:12px;max-width:480px">
        <h2 style="color:#EF9F27">Hi ${name},</h2>
        <p>Your verification code is:</p>
        <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#EF9F27;margin:24px 0">${otp}</div>
        <p style="color:#888;font-size:13px">Valid for 10 minutes.</p>
      </div>`,
    });

    if (error) {
      console.error("[OTP-SEND] Resend error:", JSON.stringify(error));
      return NextResponse.json({ success: false, error: error.message }, { status: 422 });
    }

    console.log("[OTP-SEND] Email sent:", data?.id);
    return NextResponse.json({ success: true });

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[OTP-SEND] CRASH:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
