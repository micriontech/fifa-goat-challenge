// Uses Web Crypto API for JWT signing — avoids Node.js 18 OpenSSL 3.0 legacy issue
// that breaks crypto.createSign() with Google service account keys.

interface TokenCache { token: string; expiresAt: number; }
let _tokenCache: TokenCache | null = null;

function getCredentials() {
  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  let privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try {
      const c = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
      clientEmail = c.client_email || clientEmail;
      privateKey = c.private_key || privateKey;
    } catch {}
  }
  return { clientEmail, privateKey };
}

function pemToBuffer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "");
  const bin = atob(body);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function b64url(input: string | Uint8Array): string {
  const str = typeof input === "string" ? input : String.fromCharCode(...input);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(): Promise<string> {
  if (_tokenCache && Date.now() < _tokenCache.expiresAt - 300_000) {
    return _tokenCache.token;
  }

  const { clientEmail, privateKey } = getCredentials();
  const keyBuf = pemToBuffer(privateKey);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuf,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));

  const sigInput = new TextEncoder().encode(`${header}.${payload}`);
  const sigBuf = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, sigInput);
  const sig = b64url(new Uint8Array(sigBuf));
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const json = await res.json() as { access_token?: string; error?: string; error_description?: string };
  if (!json.access_token) {
    throw new Error(`Google auth failed: ${json.error} — ${json.error_description}`);
  }
  _tokenCache = { token: json.access_token, expiresAt: Date.now() + 3_600_000 };
  return json.access_token;
}

const BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const SID = () => process.env.GOOGLE_SHEETS_ID!;

async function sGet(range: string): Promise<string[][]> {
  const tok = await getAccessToken();
  const r = await fetch(`${BASE}/${SID()}/values/${encodeURIComponent(range)}`, {
    headers: { Authorization: `Bearer ${tok}` },
  });
  if (!r.ok) throw new Error(`Sheets GET ${range} → ${r.status}`);
  const d = await r.json() as { values?: string[][] };
  return d.values ?? [];
}

async function sPut(range: string, values: unknown[][]) {
  const tok = await getAccessToken();
  const r = await fetch(`${BASE}/${SID()}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  if (!r.ok) throw new Error(`Sheets PUT ${range} → ${r.status}`);
}

async function sAppend(range: string, values: unknown[][]) {
  const tok = await getAccessToken();
  const r = await fetch(
    `${BASE}/${SID()}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    }
  );
  if (!r.ok) throw new Error(`Sheets append ${range} → ${r.status}`);
}

/* ─── Public API ──────────────────────────────────────────────────────────── */

export async function getPlayers() {
  try {
    const rows = await sGet("Players!A2:G");
    return rows.map((r) => ({
      id: r[0] || "",
      name: r[1] || "",
      country: r[2] || "",
      era: r[3] || "",
      totalWins: parseInt(r[4] || "0", 10),
      totalAppearances: parseInt(r[5] || "0", 10),
      winRate: parseFloat(r[6] || "0"),
    }));
  } catch { return null; }
}

export async function updatePlayerWin(playerId: string) {
  const rows = await sGet("Players!A2:G");
  const idx = rows.findIndex((r) => r[0] === playerId);
  if (idx === -1) return;
  const row = rows[idx];
  const wins = parseInt(row[4] || "0", 10) + 1;
  const appearances = parseInt(row[5] || "0", 10) + 1;
  const winRate = (wins / appearances).toFixed(4);
  await sPut(`Players!E${idx + 2}:G${idx + 2}`, [[wins, appearances, winRate]]);
}

export async function updatePlayerAppearance(playerId: string) {
  const rows = await sGet("Players!A2:G");
  const idx = rows.findIndex((r) => r[0] === playerId);
  if (idx === -1) return;
  const row = rows[idx];
  const wins = parseInt(row[4] || "0", 10);
  const appearances = parseInt(row[5] || "0", 10) + 1;
  const winRate = appearances > 0 ? (wins / appearances).toFixed(4) : "0";
  await sPut(`Players!F${idx + 2}:G${idx + 2}`, [[appearances, winRate]]);
}

export async function getUsers(): Promise<string[][]> {
  return sGet("Users!A2:H");
}

export async function getUserByEmail(email: string) {
  const rows = await getUsers();
  return rows.find((r) => r[2] === email) || null;
}

export async function createUser(data: {
  name: string; email: string; phone: string; goatPick: string; referralId: string;
}) {
  const allUsers = await getUsers();
  const userId = `U${Date.now()}`;
  const signupDate = new Date().toISOString();
  await sAppend("Users!A:H", [[userId, data.name, data.email, data.phone, data.goatPick, signupDate, data.referralId, "true"]]);
  return { userId, signupDate, totalUsers: allUsers.length + 1 };
}

export async function getTotalVoters() {
  try {
    const rows = await sGet("Users!A2:A");
    return rows.length;
  } catch { return 0; }
}

export interface BlogPost {
  slug: string; title: string; content: string; author: string;
  date: string; coverImage: string; published: boolean; tags: string;
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const rows = await sGet("Blogs!A2:H");
    return rows
      .filter((r) => r[6]?.toString().toLowerCase() === "true")
      .map((r) => ({
        slug: r[0] || "", title: r[1] || "", content: r[2] || "",
        author: r[3] || "FIFAWCPREDICT", date: r[4] || "", coverImage: r[5] || "",
        published: true, tags: r[7] || "",
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch { return []; }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export async function initializeSheets() {
  const { PLAYERS } = await import("./players");

  const playerCheck = await sGet("Players!A1:G1");
  if (!playerCheck.length) {
    await sPut("Players!A1", [
      ["PlayerID", "Name", "Country", "Era", "TotalWins", "TotalAppearances", "WinRate"],
      ...PLAYERS.map((p) => [p.id, p.name, p.country, p.era, 0, 0, 0]),
    ]);
  }

  const userCheck = await sGet("Users!A1:H1");
  if (!userCheck.length) {
    await sPut("Users!A1", [["UserID", "Name", "Email", "Phone", "GOATpick", "SignupDate", "ReferralID", "Verified"]]);
  }
}
