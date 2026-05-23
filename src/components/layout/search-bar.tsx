/**
 * @file search-bar.tsx
 * @description Search input component with suggestions dropdown.
 *              Used in the header and on the mobile search page.
 *
 * @example
 * <SearchBar placeholder="Search for products..." />
 *
 * @owner    Gemini Design Agent
 * @updated  2026-05-23
 */

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePostHog } from "posthog-js/react"

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

/**
 * Search input with suggestions dropdown.
 * Fires a PostHog 'search_performed' event on submit.
 * Navigates to /search?q= if no custom onSearch handler is provided.
 */
export function SearchBar({
  placeholder = "Search for products, categories...",
  className,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const router = useRouter()
  const posthog = usePostHog()

  const handleClear = () => {
    setQuery("")
    if (onSearch) {
      onSearch("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      posthog?.capture('search_performed', {
        query: query.trim(),
      });
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      }
      setIsFocused(false)
    }
  }

  const handleSuggestionClick = (s: string) => {
    setQuery(s)
    if (onSearch) {
      onSearch(s)
    } else {
      router.push(`/search?q=${encodeURIComponent(s)}`)
    }
    setIsFocused(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "relative flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 transition-all overflow-hidden",
        isFocused && "border-primary ring-2 ring-primary/20 bg-white",
        className
      )}
    >
      {/* Search icon — left side, decorative on desktop, submit button on mobile */}
      <button
        type="submit"
        aria-label="Search"
        className="flex items-center justify-center size-10 shrink-0 text-gray-400 hover:text-primary transition-colors"
      >
        <Search className="size-5" />
      </button>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        placeholder={placeholder}
        aria-label="Search products"
        className="flex-1 min-w-0 bg-transparent py-2 pr-2 text-sm font-medium outline-none placeholder:text-gray-400"
      />

      {/* Clear button — only when there is text */}
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="flex items-center justify-center size-8 mr-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Clear search"
        >
          <X className="size-4" />
        </button>
      )}

      {/* Suggestions Dropdown */}
      {isFocused && query.length > 1 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-gray-100 bg-white p-2 shadow-lg animate-in fade-in zoom-in-95">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-2">
            Suggested for &quot;{query}&quot;
          </div>
          <div className="flex flex-col gap-1">
            {["Sanitary Ware", "Packaging Tape", "Luxury Faucets"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left font-bold"
              >
                <Search className="size-3.5 text-gray-400" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}
