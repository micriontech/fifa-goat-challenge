import { createPrivateKey } from "crypto";

export const dynamic = "force-dynamic";

function normalizePem(key: string): string {
  const body = key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "");
  const lines = body.match(/.{1,64}/g) ?? [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

export async function GET() {
  const report: Record<string, unknown> = {};

  // Where is the key coming from?
  const hasCredJson = !!process.env.GOOGLE_CREDENTIALS_JSON;
  const hasRawKey = !!process.env.GOOGLE_PRIVATE_KEY;
  report.source = hasCredJson ? "GOOGLE_CREDENTIALS_JSON" : hasRawKey ? "GOOGLE_PRIVATE_KEY" : "NONE";

  let rawKey = "";
  let clientEmail = "";

  if (hasCredJson) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON!);
      rawKey = creds.private_key || "";
      clientEmail = creds.client_email || "";
      report.credsParsed = true;
      report.clientEmail = clientEmail;
    } catch (e) {
      report.credsParseError = String(e);
    }
  } else if (hasRawKey) {
    rawKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
    clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
    report.clientEmail = clientEmail;
  }

  report.rawKeyLength = rawKey.length;
  report.rawKeyNewlines = (rawKey.match(/\n/g) ?? []).length;
  report.rawKeyFirst60 = rawKey.substring(0, 60);

  // Try normalizing and creating key object
  try {
    const normalized = normalizePem(rawKey);
    report.normalizedLength = normalized.length;
    report.normalizedNewlines = (normalized.match(/\n/g) ?? []).length;
    createPrivateKey(normalized);
    report.createPrivateKey = "SUCCESS";
  } catch (e) {
    report.createPrivateKeyError = String(e);
  }

  return Response.json(report);
}
