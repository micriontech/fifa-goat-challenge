export const dynamic = "force-dynamic";

function pemToBuffer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/^["']+|["']+$/g, "")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "");
  const bin = atob(body);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

export async function GET() {
  const report: Record<string, unknown> = {};

  // Step 1: check env vars
  report.hasCredJson = !!process.env.GOOGLE_CREDENTIALS_JSON;
  report.hasRawKey = !!process.env.GOOGLE_PRIVATE_KEY;
  report.hasEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  report.hasSheetsId = !!process.env.GOOGLE_SHEETS_ID;

  // Step 2: extract key
  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  let privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/^["']+|["']+$/g, "").replace(/\\n/g, "\n");
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try {
      const c = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
      clientEmail = c.client_email || clientEmail;
      privateKey = c.private_key || privateKey;
      report.credJsonParsed = true;
    } catch (e) {
      report.credJsonParseError = String(e);
    }
  }
  report.clientEmail = clientEmail;
  report.keyLength = privateKey.length;
  report.keyNewlines = (privateKey.match(/\n/g) ?? []).length;
  report.keyStart = privateKey.substring(0, 40);

  // Step 3: try pemToBuffer
  let keyBuf: ArrayBuffer;
  try {
    keyBuf = pemToBuffer(privateKey);
    report.pemToBufferBytes = keyBuf.byteLength;
  } catch (e) {
    report.pemToBufferError = String(e);
    return Response.json(report);
  }

  // Step 4: try crypto.subtle.importKey
  let cryptoKey: CryptoKey;
  try {
    cryptoKey = await crypto.subtle.importKey(
      "pkcs8", keyBuf,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false, ["sign"]
    );
    report.importKeyOk = true;
  } catch (e) {
    report.importKeyError = String(e);
    return Response.json(report);
  }

  // Step 5: try signing
  try {
    const testData = new TextEncoder().encode("test");
    await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, testData);
    report.signOk = true;
  } catch (e) {
    report.signError = String(e);
    return Response.json(report);
  }

  // Step 6: try token exchange
  try {
    const now = Math.floor(Date.now() / 1000);
    const b64url = (s: string) => btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = b64url(JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now, exp: now + 3600,
    }));
    const sigInput = new TextEncoder().encode(`${header}.${payload}`);
    const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, sigInput);
    const sig = btoa(String.fromCharCode(...new Uint8Array(sigBuf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const jwt = `${header}.${payload}.${sig}`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });
    const tokenJson = await tokenRes.json() as Record<string, unknown>;
    report.tokenStatus = tokenRes.status;
    report.tokenHasAccessToken = !!tokenJson.access_token;
    if (!tokenJson.access_token) report.tokenError = tokenJson;
  } catch (e) {
    report.tokenExchangeError = String(e);
  }

  return Response.json(report);
}
