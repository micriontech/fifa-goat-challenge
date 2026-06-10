import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";
import { getUserByEmail } from "@/lib/googleSheets";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

    const result = await verifyOTP(email, otp);
    if (!result.valid) return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });

    // Fetch full user profile from sheets
    const user = await getUserByEmail(email);
    if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      email,
      name: user[1] || "",
      goatPick: user[4] || "",
    });
  } catch (err) {
    console.error("[SIGNIN VERIFY]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
