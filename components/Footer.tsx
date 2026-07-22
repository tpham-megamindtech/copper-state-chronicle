import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-canyon-900 text-canyon-100">
      <div className="desert-divider" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="font-serif text-xl font-bold text-white">
              Copper State Chronicle
            </span>
            <p className="mt-2 max-w-xs text-sm text-canyon-300">
              Finance, business, wellness, education, and healthcare news from
              across Arizona.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-turq-300">
              Categories
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-canyon-200 transition-colors hover:text-turq-300"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-canyon-700 pt-6 text-xs text-canyon-400">
          &copy; {year} Copper State Chronicle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
