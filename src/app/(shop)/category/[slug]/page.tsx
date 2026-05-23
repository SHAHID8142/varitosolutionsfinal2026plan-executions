/**
 * @file page.tsx
 * @path /category/[slug]
 * @description Server component for Category page.
 *              Handles dynamic metadata (SEO) and wraps CategoryContent.
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

import { Metadata } from "next"
import CategoryContent from "./category-content"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

/**
 * Generates dynamic metadata based on the category slug.
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  
  const categoryName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const title = `${categoryName} | Varito Solutions`
  const description = `Shop premium ${categoryName.toLowerCase()} in Bangladesh. Quality products, competitive pricing, and fast delivery at Varito Solutions.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://varitosolutions.com/category/${slug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await params
  return <CategoryContent />
}
