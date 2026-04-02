import { client } from "@/lib/sanity/client";
import ArticleList from "@/components/article-list";

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

async function getArticles(): Promise<Article[]> {
  const query = `*[_type == "article"] | order(date desc){
    _id,
    title,
    slug,
    date,
    category,
    level,
    excerpt,
    videoUrl
  }`;

  return await client.fetch(query);
}

export default async function Home() {
  const articles = await getArticles();

  return <ArticleList articles={articles} />;
}