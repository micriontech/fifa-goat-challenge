import { NextRequest, NextResponse } from "next/server";
import { checkOTP, consumeOTP } from "@/lib/otp";
import { createUser, getUserByEmail } from "@/lib/googleSheets";

export const dynamic = "force-dynamic";

function generateReferralId() {
  return "BO" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    console.log("[OTP-VERIFY] email:", email, "otp:", otp);
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });
    }

    // Check OTP without deleting it yet
    const check = await checkOTP(email, otp);
    console.log("[OTP-VERIFY] check result:", JSON.stringify(check));
    if (!check.valid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const { userData } = check;

    // Try Google Sheets — if it fails, user can retry (OTP still in Redis)
    let existing = null;
    try {
      existing = await getUserByEmail(email);
    } catch (err) {
      console.error("[OTP-VERIFY] getUserByEmail error:", err);
      return NextResponse.json(
        { error: "Could not reach database. Please try again in a moment." },
        { status: 503 }
      );
    }

    if (!existing) {
      try {
        const referralId = generateReferralId();
        await createUser({
          name: userData?.name || "",
          email,
          phone: userData?.phone || "",
          goatPick: userData?.goatPick || "",
          referralId,
        });
      } catch (err) {
        console.error("[OTP-VERIFY] createUser error:", err);
        return NextResponse.json(
          { error: "Could not save your account. Please try again in a moment." },
          { status: 503 }
        );
      }
    }

    // Only delete OTP after everything succeeded
    await consumeOTP(email);
    return NextResponse.json({ success: true, email, goatPick: userData?.goatPick });
  } catch (err) {
    console.error("[OTP-VERIFY] crash:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
