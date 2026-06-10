import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
  await redis.set(`otp:${email}`, { otp, userData }, { ex: 600 }); // 10-min TTL
}

export async function verifyOTP(
  email: string,
  otp: string
): Promise<{ valid: boolean; userData?: OTPEntry["userData"] }> {
  const entry = await redis.get<OTPEntry>(`otp:${email}`);
  if (!entry) return { valid: false };
  if (entry.otp !== otp) return { valid: false };
  await redis.del(`otp:${email}`); // single-use
  return { valid: true, userData: entry.userData };
}
