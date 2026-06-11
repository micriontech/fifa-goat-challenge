import { google } from "googleapis";

// Normalize a PEM private key to valid 64-char-line format.
// Handles: literal \n, actual newlines, or a single-line blob with no newlines.
function normalizePem(key: string): string {
  const raw = key.replace(/\\n/g, "\n");
  const body = raw
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/[\r\n\s]/g, "");
  const lines = body.match(/.{1,64}/g) ?? [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----\n`;
}

function getAuth() {
  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
  let privateKey = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  if (process.env.GOOGLE_CREDENTIALS_JSON) {
    try {
      const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
      clientEmail = creds.client_email || clientEmail;
      privateKey = creds.private_key || privateKey;
    } catch {}
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: normalizePem(privateKey),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function getSheetsClient() {
  const auth = getAuth();
  return google.sheets({ version: "v4", auth });
}

export async function getPlayers() {
  try {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Players!A2:G",
    });
    const rows = res.data.values || [];
    return rows.map((row) => ({
      id: row[0] || "",
      name: row[1] || "",
      country: row[2] || "",
      era: row[3] || "",
      totalWins: parseInt(row[4] || "0", 10),
      totalAppearances: parseInt(row[5] || "0", 10),
      winRate: parseFloat(row[6] || "0"),
    }));
  } catch {
    return null;
  }
}

export async function updatePlayerWin(playerId: string) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Players!A2:G",
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === playerId);
  if (rowIndex === -1) return;

  const row = rows[rowIndex];
  const wins = parseInt(row[4] || "0", 10) + 1;
  const appearances = parseInt(row[5] || "0", 10) + 1;
  const winRate = appearances > 0 ? wins / appearances : 0;
  const sheetRow = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: `Players!E${sheetRow}:G${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[wins, appearances, winRate.toFixed(4)]],
    },
  });
}

export async function updatePlayerAppearance(playerId: string) {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Players!A2:G",
  });
  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((r) => r[0] === playerId);
  if (rowIndex === -1) return;

  const row = rows[rowIndex];
  const wins = parseInt(row[4] || "0", 10);
  const appearances = parseInt(row[5] || "0", 10) + 1;
  const winRate = appearances > 0 ? wins / appearances : 0;
  const sheetRow = rowIndex + 2;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: `Players!F${sheetRow}:G${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[appearances, winRate.toFixed(4)]],
    },
  });
}

export async function getUsers() {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Users!A2:H",
  });
  return res.data.values || [];
}

export async function getUserByEmail(email: string) {
  const rows = await getUsers();
  return rows.find((r) => r[2] === email) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  phone: string;
  goatPick: string;
  referralId: string;
}) {
  const sheets = await getSheetsClient();
  const allUsers = await getUsers();
  const userId = `U${Date.now()}`;
  const signupDate = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Users!A:H",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          userId,
          data.name,
          data.email,
          data.phone,
          data.goatPick,
          signupDate,
          data.referralId,
          "true",
        ],
      ],
    },
  });

  return { userId, signupDate, totalUsers: allUsers.length + 1 };
}

export async function getTotalVoters() {
  try {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Users!A2:A",
    });
    return (res.data.values || []).length;
  } catch {
    return 0;
  }
}

/* ─── Blog functions ──────────────────────────────────────────────────────── */
export interface BlogPost {
  slug: string;
  title: string;
  content: string;
  author: string;
  date: string;
  coverImage: string;
  published: boolean;
  tags: string;
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const sheets = await getSheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Blogs!A2:H",
    });
    const rows = res.data.values || [];
    return rows
      .filter((r) => r[6]?.toString().toLowerCase() === "true")
      .map((r) => ({
        slug:       r[0] || "",
        title:      r[1] || "",
        content:    r[2] || "",
        author:     r[3] || "FIFAWCPREDICT",
        date:       r[4] || "",
        coverImage: r[5] || "",
        published:  true,
        tags:       r[7] || "",
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug) || null;
}

export async function initializeSheets() {
  const sheets = await getSheetsClient();

  // Check if Players tab has headers
  const check = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Players!A1:G1",
  });

  if (!check.data.values || check.data.values.length === 0) {
    // Write headers + player data
    const { PLAYERS } = await import("./players");
    const playerRows = [
      [
        "PlayerID",
        "Name",
        "Country",
        "Era",
        "TotalWins",
        "TotalAppearances",
        "WinRate",
      ],
      ...PLAYERS.map((p) => [p.id, p.name, p.country, p.era, 0, 0, 0]),
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Players!A1",
      valueInputOption: "RAW",
      requestBody: { values: playerRows },
    });
  }

  // Check/create Users tab header
  const userCheck = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    range: "Users!A1:H1",
  });

  if (!userCheck.data.values || userCheck.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "Users!A1",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "UserID",
            "Name",
            "Email",
            "Phone",
            "GOATpick",
            "SignupDate",
            "ReferralID",
            "Verified",
          ],
        ],
      },
    });
  }
}
