import { Redis } from "@upstash/redis";

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

interface OTPEntry {
  otp: string;
  userData?: {
    name: string;
    phone: string;
    goatPick: string;
  };
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(
  email: string,
  otp: string,
  userData?: OTPEntry["userData"]
): Promise<void> {
  await getRedis().set(`otp:${email}`, { otp, userData }, { ex: 600 });
}

// Checks OTP without deleting — safe to call before committing the signup
export async function checkOTP(
  email: string,
  otp: string
): Promise<{ valid: boolean; userData?: OTPEntry["userData"] }> {
  const redis = getRedis();
  const entry = await redis.get<OTPEntry>(`otp:${email}`);
  console.log("[CHECK-OTP] entry:", JSON.stringify(entry), "received:", otp);
  if (!entry) return { valid: false };
  if (entry.otp !== otp) return { valid: false };
  return { valid: true, userData: entry.userData };
}

export async function consumeOTP(email: string): Promise<void> {
  await getRedis().del(`otp:${email}`);
}

export async function verifyOTP(
  email: string,
  otp: string
): Promise<{ valid: boolean; userData?: OTPEntry["userData"] }> {
  const result = await checkOTP(email, otp);
  if (result.valid) await consumeOTP(email);
  return result;
}
