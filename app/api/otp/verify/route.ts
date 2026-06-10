import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";
import { createUser, getUserByEmail } from "@/lib/googleSheets";

function generateReferralId() {
  return "BO" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    const result = await verifyOTP(email, otp);
    if (!result.valid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const { userData } = result;
    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ success: true, existing: true, email });
    }

    const referralId = generateReferralId();
    await createUser({
      name: userData?.name || "",
      email,
      phone: userData?.phone || "",
      goatPick: userData?.goatPick || "",
      referralId,
    });

    return NextResponse.json({ success: true, email, goatPick: userData?.goatPick });
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
