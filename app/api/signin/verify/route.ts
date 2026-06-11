import { NextRequest, NextResponse } from "next/server";
import { checkOTP, consumeOTP } from "@/lib/otp";
import { getUserByEmail } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

    const check = await checkOTP(email, otp);
    if (!check.valid) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

    let user;
    try {
      user = await getUserByEmail(email);
    } catch (err) {
      console.error("[SIGNIN VERIFY] Sheets error:", err);
      return NextResponse.json({ error: "Could not reach database. Please try again." }, { status: 503 });
    }

    if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    await consumeOTP(email);
    return NextResponse.json({ success: true, email, name: user[1] || "", goatPick: user[4] || "" });
  } catch (err) {
    console.error("[SIGNIN VERIFY]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
