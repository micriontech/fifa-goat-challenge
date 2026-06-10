import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  console.log("\n[TEST-EMAIL] Firing test email");
  console.log("[TEST-EMAIL] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
  console.log("[TEST-EMAIL] Key prefix:", process.env.RESEND_API_KEY?.slice(0, 8));

  const { data, error } = await resend.emails.send({
    from: "FIFAWCPREDICT <onboarding@resend.dev>",
    to: "micriontechnology@gmail.com",
    subject: "FIFAWCPREDICT — connection test",
    html: "<p>Resend connection is working correctly.</p>",
  });

  if (error) {
    console.error("[TEST-EMAIL] ❌ Resend error:", JSON.stringify(error, null, 2));
    return NextResponse.json({ success: false, error }, { status: 422 });
  }

  console.log("[TEST-EMAIL] ✅ Sent! Resend ID:", data?.id);
  return NextResponse.json({ success: true, resendId: data?.id });
}
