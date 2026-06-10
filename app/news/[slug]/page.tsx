import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug } from "@/lib/googleSheets";
import type { Metadata } from "next";
import type { ReactNode } from "react";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — FIFAWCPREDICT`,
    description: post.content.slice(0, 155).replace(/[#*\-]/g, "").trim(),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 155).replace(/[#*\-]/g, "").trim(),
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

/* ─── Markdown-lite renderer (no extra packages) ────────────────────────── */
function inlineFormat(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="font-black text-white">{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*"))
      return <em key={i} className="italic">{p.slice(1, -1)}</em>;
    return p;
  });
}

function renderContent(raw: string): ReactNode[] {
  const lines = raw.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      nodes.push(<h2 key={i} className="text-3xl font-black text-white mt-10 mb-4 leading-tight">{line.slice(2)}</h2>);
    } else if (line.startsWith("## ")) {
      nodes.push(<h3 key={i} className="text-2xl font-black text-white mt-8 mb-3">{line.slice(3)}</h3>);
    } else if (line.startsWith("### ")) {
      nodes.push(<h4 key={i} className="text-xl font-bold mt-6 mb-2" style={{ color: "#D4AF37" }}>{line.slice(4)}</h4>);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul${i}`} className="my-4 space-y-1.5 pl-4" style={{ listStyleType: "disc", color: "rgba(255,255,255,0.8)" }}>
          {items.map((item, j) => (
            <li key={j} className="text-sm leading-relaxed">{inlineFormat(item)}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("> ")) {
      nodes.push(
        <blockquote key={i} className="my-4 pl-4 py-2 text-sm italic"
          style={{ borderLeft: "3px solid #D4AF37", color: "rgba(255,255,255,0.65)", background: "rgba(212,175,55,0.06)", borderRadius: "0 8px 8px 0" }}>
          {inlineFormat(line.slice(2))}
        </blockquote>
      );
    } else if (line.trim() === "") {
      // blank line — skip
    } else {
      nodes.push(
        <p key={i} className="text-sm leading-relaxed my-3" style={{ color: "rgba(255,255,255,0.78)" }}>
          {inlineFormat(line)}
        </p>
      );
    }

    i++;
  }

  return nodes;
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogBySlug(params.slug);
  if (!post) notFound();

  const readingMinutes = Math.max(1, Math.ceil(post.content.split(" ").length / 200));

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link href="/news"
          className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={undefined}>
          &#x2190; Back to News &amp; Blog
        </Link>

        {/* Cover image */}
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <div className="rounded-2xl overflow-hidden mb-8" style={{ maxHeight: 380 }}>
            <img src={post.coverImage} alt={post.title}
              className="w-full h-full object-cover" style={{ maxHeight: 380 }} />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-black px-3 py-1 rounded-full"
            style={{ background: "rgba(212,175,55,0.15)", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.35)" }}>
            &#x270D;&#xFE0F; OUR BLOG
          </span>
          {post.tags && post.tags.split(",").map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{post.title}</h1>

        {/* Author line */}
        <div className="flex items-center gap-3 mb-8 pb-6"
          style={{ borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#D4AF37,#C5A059)", color: "#0D1B2A" }}>
            {post.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{post.author}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {post.date} &nbsp;&middot;&nbsp; {readingMinutes} min read
            </p>
          </div>
        </div>

        {/* Content */}
        <article className="prose-custom">
          {renderContent(post.content)}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(212,175,55,0.15)" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            Continue the debate
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg,#2EC4B6,#22a99c)", color: "#fff", boxShadow: "0 4px 20px rgba(46,196,182,0.3)" }}>
            &#x26BD; Take the GOAT Challenge
          </Link>
        </div>

      </div>
    </div>
  );
}
