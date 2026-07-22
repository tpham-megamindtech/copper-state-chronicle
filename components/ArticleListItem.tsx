import Image from "next/image";
import Link from "next/link";
import { ArticleMeta } from "@/lib/content";

export default function ArticleListItem({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex items-center gap-4 py-6 first:pt-0 last:pb-0"
    >
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-brand-100 sm:h-28 sm:w-40">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          sizes="160px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <h4 className="line-clamp-2 font-serif text-base font-bold leading-snug text-canyon-900 group-hover:text-brand-700 sm:text-lg">
          {article.title}
        </h4>
        <p className="mt-1 line-clamp-2 text-sm text-canyon-500">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}
