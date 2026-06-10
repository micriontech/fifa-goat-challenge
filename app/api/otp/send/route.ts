import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOTP, storeOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("[OTP] Request received");

  try {
    const body = await req.json();
    const { email, name, phone, goatPick } = body;

    console.log("[OTP] Target email:", email);
    console.log("[OTP] Name:", name);
    console.log("[OTP] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);
    console.log("[OTP] Key prefix:", process.env.RESEND_API_KEY?.slice(0, 8));

    if (!email || !name) {
      return NextResponse.json({ error: "Email and name required" }, { status: 400 });
    }

    const otp = generateOTP();
    await storeOTP(email, otp, { name, phone, goatPick });
    console.log("[OTP] Generated OTP:", otp, "(stored in memory)");

    // Use Resend's sandbox sender — works without domain verification.
    // NOTE: free-tier Resend only delivers to the account owner's email
    // (micriontechnology@gmail.com). To send to any address, verify a
    // domain at resend.com/domains and change from to noreply@yourdomain.com
    const fromAddress = "FIFAWCPREDICT <noreply@fifawcpredict.com>";
    console.log("[OTP] Sending from:", fromAddress);
    console.log("[OTP] Calling Resend API…");

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Your FIFAWCPREDICT verification code",
      html: `
        <div style="background:#0a0a1a;color:#fff;padding:40px;font-family:Inter,sans-serif;max-width:500px;margin:0 auto;border-radius:12px;">
          <h1 style="color:#EF9F27;text-align:center;font-size:28px;margin-bottom:8px;">FIFAWCPREDICT</h1>
          <p style="text-align:center;color:#aaa;margin-bottom:32px;">FIFA 2026 World Cup</p>
          <h2 style="font-size:20px;margin-bottom:16px;">Hi ${name},</h2>
          <p style="color:#ddd;line-height:1.6;margin-bottom:24px;">
            Your GOAT pick is in! Enter the code below to complete your registration.
          </p>
          <div style="background:#12122a;border:2px solid #EF9F27;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <p style="color:#aaa;font-size:14px;margin:0 0 8px;">Your verification code</p>
            <p style="color:#EF9F27;font-size:48px;font-weight:bold;letter-spacing:12px;margin:0;">${otp}</p>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">
            Valid for 10 minutes. Do not share this code.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("[OTP] ❌ Resend error:", JSON.stringify(error, null, 2));
      // OTP is still stored — return it in dev so the UI can still proceed
      return NextResponse.json({
        success: false,
        error: error.message,
        // Only expose OTP in non-production for manual testing
        ...(process.env.NODE_ENV !== "production" && { devOtp: otp }),
      }, { status: 422 });
    }

    console.log("[OTP] ✅ Email sent! Resend ID:", data?.id);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("[OTP] ❌ Exception:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
