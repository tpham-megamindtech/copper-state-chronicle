import Link from "next/link";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import ArticleListItem from "@/components/ArticleListItem";
import { CATEGORIES } from "@/lib/categories";
import { getFeaturedArticle, getLatestByCategory } from "@/lib/content";

export default function HomePage() {
  const featured = getFeaturedArticle();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Hero article={featured} />

      {CATEGORIES.map((category) => {
        const articles = getLatestByCategory(category.slug, 4);
        if (articles.length === 0) return null;

        const [lead, ...rest] = articles;

        return (
          <section key={category.slug} className="mt-14">
            <div className="mb-5 flex items-end justify-between border-b border-canyon-100 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-canyon-900">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-canyon-500">
                  {category.description}
                </p>
              </div>
              <Link
                href={`/category/${category.slug}`}
                className="whitespace-nowrap text-sm font-semibold text-turq-700 hover:text-turq-800"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
              <div className="lg:col-span-2">
                <ArticleCard article={lead} featured />
              </div>
              <div className="divide-y divide-canyon-100 lg:col-span-1">
                {rest.map((article) => (
                  <ArticleListItem key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
