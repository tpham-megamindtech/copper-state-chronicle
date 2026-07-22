export type CategorySlug =
  | "finance-economy"
  | "business-leaders"
  | "beauty-wellness"
  | "education"
  | "healthcare";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "finance-economy",
    name: "Finance & Economy",
    description: "Markets, banking, and the economic pulse of Arizona.",
  },
  {
    slug: "business-leaders",
    name: "Business Leaders",
    description: "Founders and executives shaping the Grand Canyon State.",
  },
  {
    slug: "beauty-wellness",
    name: "Beauty & Wellness",
    description: "Desert spas, skincare, and wellness trends from the Southwest.",
  },
  {
    slug: "education",
    name: "Education",
    description: "Schools, universities, and learning across Arizona.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description: "Hospitals, clinics, and health care news statewide.",
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
