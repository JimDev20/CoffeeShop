"use client";

import ProductMark from "@/components/product-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryService, type CategoryRow } from "@/services/CategoryService";
import { ProductService, type ProductRow } from "@/services/ProductService";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

const productService = new ProductService();
const categoryService = new CategoryService();

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  "name-asc": "Name A-Z",
  "name-desc": "Name Z-A",
  "price-asc": "Price low to high",
  "price-desc": "Price high to low",
  newest: "Newest",
};

function MenuSkeleton() {
  return (
    <div className="page-shell" aria-label="Loading menu">
      <div className="page-head">
        <div className="h-16 w-3/4 max-w-xl bg-surface" />
        <div className="mt-6 h-5 w-2/3 max-w-md bg-surface" />
      </div>
      <div className="grid grid-cols-1 gap-x-16 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex gap-4 py-6">
            <div className="h-14 w-14 shrink-0 rounded-full bg-surface" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/2 bg-surface" />
              <div className="h-3 w-3/4 bg-surface" />
              <div className="h-3 w-1/3 bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <MenuContent />
    </Suspense>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  useEffect(() => {
    Promise.all([
      productService.getAllAvailable().catch(() => []),
      categoryService.getAllActive().catch(() => []),
    ]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.category_name && product.category_name.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      const category = categories.find((item) => item.slug === selectedCategory);
      if (category) {
        result = result.filter((product) => product.category_id === category.id);
      }
    }

    switch (sortBy) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  }, [products, search, selectedCategory, sortBy, categories]);

  const hasFilters = Boolean(search || selectedCategory || sortBy !== "name-asc");

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("name-asc");
  }, []);

  if (loading) return <MenuSkeleton />;

  return (
    <div className="page-shell">
      <div className="page-head">
        <h1 className="page-title" data-reveal>
          Everything on the shelf.
        </h1>
        <p className="section-lead mt-6" data-reveal style={{ "--reveal-delay": "70ms" } as CSSProperties}>
          Beans, ground coffee, capsules and the gear to brew them. Search the shelf or filter it to the lot you
          want.
        </p>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input
            placeholder="Search the shelf"
            aria-label="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-11"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          aria-label="Filter by category"
          className="field min-h-11 md:w-auto"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
          aria-label="Sort products"
          className="field min-h-11 md:w-auto"
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {hasFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <p className="mt-8 text-sm text-muted" aria-live="polite">
        {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
      </p>

      {filteredProducts.length === 0 ? (
        <div className="py-20">
          <h2 className="section-title">Nothing matches that.</h2>
          <p className="section-lead mt-4">Try a different word or show the whole shelf.</p>
          <Button className="mt-8" onClick={clearFilters}>
            Show every item
          </Button>
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-x-16 lg:grid-cols-2">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/menu/${product.slug}`}
              className="list-row"
              data-reveal
              style={{ "--reveal-delay": `${(index % 4) * 50}ms` } as CSSProperties}
            >
              <ProductMark product={product} />
              <span className="min-w-0">
                <span className="block text-[1.0625rem] font-medium leading-snug">{product.name}</span>
                {product.description && (
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-muted">
                    {product.description}
                  </span>
                )}
                <span className="mt-2 block text-[0.8125rem]">
                  {[
                    product.category_name,
                    product.origin,
                    product.roast_level,
                    product.weight,
                    product.is_featured ? "Featured" : null,
                  ]
                    .filter(Boolean)
                    .join(" / ")}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-[1.0625rem] font-medium">₱{Number(product.price).toLocaleString()}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[0.8125rem] underline underline-offset-4">
                  View
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
