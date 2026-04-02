import Link from "next/link";
import { client } from "@/lib/sanity/client";

type Article = {
  title: string;
  date?: string;
  category?: string;
  level?: string;
  excerpt?: string;
  body?: string;
  videoUrl?: string;
  slug?: string;
};

const query = `*[_type == "article" && slug.current == $slug][0]{
  title,
  date,
  category,
  level,
  excerpt,
  body,
  videoUrl,
  "slug": slug.current
}`;

function toYouTubeEmbedUrl(url?: string) {
  if (!url) return undefined;
  const u = url.trim();
  if (!u) return undefined;

  if (u.includes("youtube.com/embed/")) return u;

  try {
    const parsed = new URL(u);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : undefined;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.replace("/shorts/", "").split("/")[0];
        return id ? `https://www.youtube.com/embed/${id}` : undefined;
      }

      const v = parsed.searchParams.get("v");
      return v ? `https://www.youtube.com/embed/${v}` : undefined;
    }
  } catch {}

  return undefined;
}

function levelColor(level?: string) {
  switch (level) {
    case "初級":
      return "bg-green-100 text-green-700";
    case "中級":
      return "bg-yellow-100 text-yellow-700";
    case "上級":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await Promise.resolve(params);
  const article: Article | null = await client.fetch(query, { slug });

  if (!article) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          ← 戻る
        </Link>
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">記事が見つかりませんでした</h1>
          <p className="mt-3 text-zinc-600">slug: {slug}</p>
        </div>
      </main>
    );
  }

  const embedUrl = toYouTubeEmbedUrl(article.videoUrl);

  return (
    <main className="bg-zinc-50 py-10">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          ← 戻る
        </Link>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap gap-2">
            {article.category && (
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                {article.category}
              </span>
            )}
            {article.level && (
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColor(article.level)}`}>
                {article.level}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            {article.title}
          </h1>

          <p className="mt-3 text-sm text-zinc-500">{article.date || "日付なし"}</p>

          {article.excerpt && (
            <p className="mt-6 rounded-2xl bg-zinc-50 p-4 text-zinc-700">
              {article.excerpt}
            </p>
          )}

          {embedUrl && (
            <div className="mt-8 overflow-hidden rounded-2xl">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={embedUrl}
                  title="YouTube video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-zinc-800">
            {article.body || "本文はまだありません。"}
          </div>
        </div>
      </article>
    </main>
  );
}