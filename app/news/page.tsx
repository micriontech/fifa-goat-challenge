"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Article {
  id: string; title: string; description: string;
  url: string; imageUrl: string; source: string;
  pubDate: string; category: string;
}

interface BlogPost {
  slug: string; title: string; content: string;
  author: string; date: string; coverImage: string; tags: string;
}

const CATEGORIES = ["All", "General", "Team News", "Injury", "Results"];

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 0)      return "Just now";
  if (diff < 60)     return `${diff}s ago`;
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function safeDesc(desc: string | null | undefined): string {
  if (!desc || desc === "null" || desc.trim() === "") return "";
  return desc;
}

const catConfig: Record<string, { bg: string; color: string; border: string; icon: string }> = {
  General:     { bg: "rgba(59,130,246,0.15)",  color: "#93c5fd", border: "rgba(59,130,246,0.35)",  icon: "📰" },
  "Team News": { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7", border: "rgba(16,185,129,0.35)",  icon: "👕" },
  Injury:      { bg: "rgba(239,68,68,0.15)",   color: "#fca5a5", border: "rgba(239,68,68,0.35)",   icon: "🚑" },
  Results:     { bg: "rgba(212,175,55,0.15)",  color: "#D4AF37", border: "rgba(212,175,55,0.35)",  icon: "⚽" },
};

/* ── Blog Card ─────────────────────────────────────────────────────────────── */
function BlogCard({ blog }: { blog: BlogPost }) {
  const excerpt = blog.content.replace(/[#*>\-]/g, "").trim().slice(0, 100);
  return (
    <Link href={`/news/${blog.slug}`}
      className="glass-gold card-hover card-hover-gold block overflow-hidden group"
      style={{ borderRadius: 16, textDecoration: "none" }}>
      <div className="relative overflow-hidden" style={{ height: 140 }}>
        {blog.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.coverImage} alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: "linear-gradient(135deg,rgba(212,175,55,0.15),rgba(13,27,42,0.95))" }}>
            &#x270D;&#xFE0F;
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(13,27,42,0.92) 0%,transparent 60%)" }} />
        <div className="absolute top-3 left-3 text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: "rgba(212,175,55,0.2)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.45)" }}>
          &#x270D;&#xFE0F; OUR BLOG
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-black text-sm text-white leading-snug line-clamp-2 transition-colors group-hover:text-[#D4AF37]">
          {blog.title}
        </h3>
        {excerpt && (
          <p className="text-xs mt-1.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.35)" }}>{excerpt}&hellip;</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>By {blog.author}</span>
          <span className="text-xs font-semibold" style={{ color: "#D4AF37" }}>Read &#x2192;</span>
        </div>
      </div>
    </Link>
  );
}

/* ── News Card ─────────────────────────────────────────────────────────────── */
function NewsCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const cat = catConfig[article.category] || catConfig.General;
  const desc = safeDesc(article.description);

  if (featured) {
    return (
      <a href={article.url} target="_blank" rel="noopener noreferrer"
        className="col-span-1 sm:col-span-2 lg:col-span-3 glass-green card-hover card-hover-green block overflow-hidden group"
        style={{ borderRadius: 20 }}>
        <div className="relative overflow-hidden" style={{ height: 240, background: "rgba(16,185,129,0.06)" }}>
          {article.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.imageUrl} alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">⚽</div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,27,42,0.92) 0%, rgba(13,27,42,0.3) 60%, transparent 100%)" }} />
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.5)", backdropFilter: "blur(8px)" }}>
            <span className="live-dot" style={{ background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.8)" }} />
            <span className="text-[11px] font-black" style={{ color: "#34d399" }}>FEATURED</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
                {cat.icon} {article.category}
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{article.source}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug line-clamp-2 group-hover:text-green-300 transition-colors">
              {article.title}
            </h3>
            {desc && <p className="text-xs mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>}
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer"
      className="glass-green card-hover card-hover-green block overflow-hidden group"
      style={{ borderRadius: 16 }}>
      <div className="relative overflow-hidden" style={{ height: 150, background: "rgba(16,185,129,0.06)" }}>
        {article.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={article.imageUrl} alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">⚽</div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,27,42,0.85) 0%, transparent 55%)" }} />
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}>
            {cat.icon} {article.category}
          </span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{article.source}</span>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginLeft: "auto" }}>{timeAgo(article.pubDate)}</span>
        </div>
        <h3 className="font-bold text-sm leading-snug line-clamp-2 transition-colors"
          style={{ color: "#fff" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#34d399")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#fff")}>
          {article.title}
        </h3>
        {desc && (
          <p className="text-xs mt-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            {desc}
          </p>
        )}
        <p className="text-xs mt-3 font-semibold" style={{ color: "#10b981" }}>Read more &#x2192;</p>
      </div>
    </a>
  );
}

/* ── Ticker ────────────────────────────────────────────────────────────────── */
function NewsTicker({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  const items = articles.slice(0, 8);
  const text = items.map((a) => `${catConfig[a.category]?.icon || "⚽"} ${a.title}`).join("   ·   ");
  return (
    <div className="overflow-hidden" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "8px 0" }}>
      <div className="flex items-center gap-4 px-4">
        <span className="flex items-center gap-1.5 flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-full"
          style={{ background: "rgba(16,185,129,0.25)", color: "#34d399", border: "1px solid rgba(16,185,129,0.5)" }}>
          <span className="live-dot" style={{ background: "#10b981", boxShadow: "0 0 8px rgba(16,185,129,0.8)" }} />
          LIVE
        </span>
        <div className="overflow-hidden flex-1 relative" style={{ maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)" }}>
          <div className="ticker-track inline-flex">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)", paddingRight: "3rem" }}>{text}</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.65)", paddingRight: "3rem" }}>{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────────── */
export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      const data = await res.json();
      setArticles(data.articles || []);
      setLastUpdated(new Date());
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000);
    fetch("/api/blogs").then((r) => r.json()).then((d) => setBlogs(d.blogs || [])).catch(() => {});
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered = articles.filter((a) => category === "All" || a.category === category);
  const [featured, ...rest] = filtered;

  const tabActive   = { background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff",                   fontWeight: 700, borderRadius: 50, padding: "6px 16px", fontSize: 13, border: "none",                            cursor: "pointer" };
  const tabInactive = { background: "rgba(16,185,129,0.07)",                   color: "rgba(255,255,255,0.45)", fontWeight: 600, borderRadius: 50, padding: "6px 16px", fontSize: 13, border: "1px solid rgba(16,185,129,0.2)", cursor: "pointer" };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start sm:items-end justify-between gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-12 rounded-full" style={{ background: "linear-gradient(to bottom, #34d399, #059669)" }} />
              <div>
                <h1 className="text-3xl sm:text-4xl font-black">
                  <span className="text-gradient-green">Football</span>
                  <span className="text-white"> News</span>
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Latest from BBC Sport &amp; ESPN FC
                  {lastUpdated && (
                    <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: 8 }}>
                      &middot; Updated {timeAgo(lastUpdated.toISOString())}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button onClick={fetchNews} disabled={loading}
              className="self-start px-4 py-2 text-sm font-semibold rounded-full transition-all disabled:opacity-50"
              style={{ border: "1px solid rgba(16,185,129,0.35)", color: "#10b981", background: "rgba(16,185,129,0.07)", cursor: "pointer" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.15)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(16,185,129,0.07)")}>
              {loading ? "Refreshing…" : "↻ Refresh"}
            </button>
          </div>

          {!loading && articles.length > 0 && <NewsTicker articles={articles} />}
        </div>

        {/* Our Blog section */}
        {blogs.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 rounded-full" style={{ background: "linear-gradient(to bottom,#e8c86a,#D4AF37)" }} />
                <h2 className="text-xl font-black">
                  <span className="text-gradient-gold">Our Blog</span>
                </h2>
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                {blogs.length} post{blogs.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogs.map((blog) => <BlogCard key={blog.slug} blog={blog} />)}
            </div>
            <div className="mt-4" style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(212,175,55,0.2),transparent)" }} />
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} style={category === cat ? tabActive : tabInactive}>
              {catConfig[cat]?.icon && cat !== "All" ? `${catConfig[cat].icon} ` : ""}
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl h-64 animate-pulse"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.1)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📰</p>
            <p style={{ color: "rgba(255,255,255,0.3)" }}>No articles found. Try a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured && <NewsCard article={featured} featured />}
            {rest.map((article) => <NewsCard key={article.id} article={article} />)}
          </div>
        )}

        <p className="text-center text-xs mt-10" style={{ color: "rgba(255,255,255,0.12)" }}>
          Auto-refreshes every 10 minutes &middot; Content from BBC Sport &amp; ESPN FC
        </p>
      </div>
    </div>
  );
}
