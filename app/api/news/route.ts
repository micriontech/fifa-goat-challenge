import { NextResponse } from "next/server";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  pubDate: string;
  category: string;
}

function parseRSS(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let i = 0;

  while ((match = itemRegex.exec(xml)) !== null && i < 20) {
    const block = match[1];
    const get = (tag: string) => {
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? (m[1] || m[2] || "").trim() : "";
    };
    const imgMatch = block.match(/url="([^"]+)"|<media:content[^>]+url="([^"]+)"|<enclosure[^>]+url="([^"]+)"/);
    const imgUrl = imgMatch ? (imgMatch[1] || imgMatch[2] || imgMatch[3] || "") : "";

    const title = get("title");
    const description = get("description").replace(/<[^>]+>/g, "").slice(0, 200);
    const url = get("link") || get("guid");
    const pubDate = get("pubDate");

    if (title) {
      const category = categorize(title + " " + description);
      items.push({ id: `${source}-${i}`, title, description, url, imageUrl: imgUrl, source, pubDate, category });
      i++;
    }
  }
  return items;
}

function categorize(text: string): string {
  const lower = text.toLowerCase();
  if (/injur|hamstring|fitness|doubt|ruled out|return|recovery/.test(lower)) return "Injury";
  if (/transfer|sign|deal|contract|move|join|leave/.test(lower)) return "Team News";
  if (/result|score|win|defeat|draw|goal|final|match/.test(lower)) return "Results";
  return "General";
}

export const revalidate = 600; // 10-minute ISR cache

export async function GET() {
  const feeds = [
    { url: "https://feeds.bbci.co.uk/sport/football/rss.xml", source: "BBC Sport" },
    { url: "https://www.espn.com/espn/rss/soccer/news", source: "ESPN FC" },
  ];

  const allItems: NewsItem[] = [];

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, {
        next: { revalidate: 600 },
        headers: { "User-Agent": "BracketOracle/1.0" },
      });
      if (res.ok) {
        const xml = await res.text();
        allItems.push(...parseRSS(xml, feed.source));
      }
    } catch {
      // Skip failed feed
    }
  }

  // Sort by date desc
  allItems.sort((a, b) => {
    const da = new Date(a.pubDate).getTime() || 0;
    const db = new Date(b.pubDate).getTime() || 0;
    return db - da;
  });

  return NextResponse.json({ articles: allItems.slice(0, 30) });
}
