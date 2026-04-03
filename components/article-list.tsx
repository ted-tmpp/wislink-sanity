"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Article = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  date?: string;
  category?: string;
  level?: string;
  excerpt?: string;
  videoUrl?: string;
};

function getYouTubeThumbnail(url?: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.replace("/shorts/", "").split("/")[0];
        return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
      }

      const v = parsed.searchParams.get("v");
      return v ? `https://img.youtube.com/vi/${v}/hqdefault.jpg` : null;
    }
  } catch {}

  return null;
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

export default function ArticleList({ articles }: { articles: Article[] }) {
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [selectedLevel, setSelectedLevel] = useState("すべて");

  // 固定カテゴリ
  const categories = [
    "すべて",
    "ソフトスキル",
    "ハードスキル",
    "マインド",
    "副業",
    "転職",
    "QOL",
  ];

  // 固定レベル
  const levels = ["すべて", "初級", "中級", "上級"];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory =
        selectedCategory === "すべて" || article.category === selectedCategory;
      const matchLevel =
        selectedLevel === "すべて" || article.level === selectedLevel;
      return matchCategory && matchLevel;
    });
  }, [articles, selectedCategory, selectedLevel]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-700 px-6 py-10 text-white shadow-sm sm:px-8">
          <p className="text-sm font-semibold tracking-wide text-zinc-300">
            ARTICLE PLATFORM
          </p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            記事一覧
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-200 sm:text-base">
            知らないと損する、社会人の攻略法をわかりやすくまとめています。
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {/* フィルター */}
        <div className="mb-8 flex flex-col gap-6">
          <div>
            <p className="mb-3 text-sm font-semibold text-zinc-700">カテゴリ</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-zinc-700">レベル</p>
            <div className="flex flex-wrap gap-2">
              {levels.map((level) => {
                const active = selectedLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 記事数 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900">最新記事</h2>
          <p className="text-sm text-zinc-500">{filteredArticles.length}件の記事</p>
        </div>

        {/* 記事一覧 */}
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-zinc-500 shadow-sm">
            条件に合う記事が見つかりません。
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => {
              const thumb = getYouTubeThumbnail(article.videoUrl);

              return (
                <Link
                  key={article._id}
                  href={`/articles/${article.slug?.current}`}
                  className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* サムネ */}
                  <div className="relative aspect-video bg-zinc-100">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                        No Thumbnail
                      </div>
                    )}
                  </div>

                  {/* 本文 */}
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {article.category && (
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                          {article.category}
                        </span>
                      )}
                      {article.level && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${levelColor(
                            article.level
                          )}`}
                        >
                          {article.level}
                        </span>
                      )}
                    </div>

                    <h3 className="line-clamp-2 text-lg font-bold text-zinc-900 transition group-hover:text-zinc-600">
                      {article.title}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-500">
                      {article.date || "日付なし"}
                    </p>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                      {article.excerpt || "概要はまだありません。"}
                    </p>

                    <div className="mt-5 text-sm font-semibold text-zinc-900">
                      続きを読む →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}