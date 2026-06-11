import { NextRequest, NextResponse } from "next/server";
import { generateOTP, storeOTP } from "@/lib/otp";
import { getUserByEmail } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email. Please complete the GOAT Challenge to register." },
        { status: 404 }
      );
    }

    const name = user[1] || "Fan";
    const otp = generateOTP();
    await storeOTP(email, otp, { name, phone: user[3] || "", goatPick: user[4] || "" });

    const { data, error } = await resend.emails.send({
      from: "FIFAWCPREDICT <noreply@fifawcpredict.com>",
      to: email,
      subject: "Your FIFAWCPREDICT sign-in code",
      html: `
        <div style="background:#06040f;color:#fff;padding:40px;font-family:Inter,sans-serif;max-width:500px;margin:0 auto;border-radius:12px;">
          <h1 style="color:#EF9F27;text-align:center;font-size:28px;margin-bottom:8px;">FIFAWCPREDICT</h1>
          <p style="text-align:center;color:#aaa;margin-bottom:32px;">FIFA 2026 World Cup</p>
          <h2 style="font-size:20px;margin-bottom:16px;">Welcome back, ${name}!</h2>
          <p style="color:#ddd;line-height:1.6;margin-bottom:24px;">Use the code below to sign in.</p>
          <div style="background:#12122a;border:2px solid #EF9F27;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <p style="color:#aaa;font-size:14px;margin:0 0 8px;">Your sign-in code</p>
            <p style="color:#EF9F27;font-size:48px;font-weight:bold;letter-spacing:12px;margin:0;">${otp}</p>
          </div>
          <p style="color:#888;font-size:13px;text-align:center;">Valid for 10 minutes. Do not share this code.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 422 });
    }

    console.log("[SIGNIN] OTP sent, Resend ID:", data?.id);
    return NextResponse.json({ success: true, name });
  } catch (err) {
    console.error("[SIGNIN] Exception:", err);
    return NextResponse.json({ error: "Failed to send sign-in code" }, { status: 500 });
  }
}
