/* eslint-disable @next/next/no-img-element */
"use client";

import { ProductService, ProductRow } from "@/services/ProductService";
import { CategoryService, CategoryRow } from "@/services/CategoryService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coffee, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const productService = new ProductService();
const categoryService = new CategoryService();

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  "name-asc": "Name A-Z",
  "name-desc": "Name Z-A",
  "price-asc": "Price Low-High",
  "price-desc": "Price High-Low",
  "newest": "Newest",
};

export default function MenuPage() {
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
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id);
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

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("name-asc");
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center text-stone-500">Loading menu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Our <span className="text-amber-700">Menu</span></h1>
        <p className="text-stone-500 max-w-xl mx-auto">
          Explore our selection of premium coffee and accessories. Every product is carefully curated for the best experience.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border rounded-lg text-sm text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {Object.entries(sortLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {(search || selectedCategory || sortBy !== "name-asc") && (
          <Button variant="outline" onClick={clearFilters} className="text-sm">
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-stone-400 py-16">
            No products found. {(search || selectedCategory) && (
              <button onClick={clearFilters} className="text-amber-700 hover:underline ml-1">Clear filters</button>
            )}
          </p>
        )}
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <Coffee className="h-20 w-20 text-stone-300 group-hover:text-amber-700/40 transition-colors" />
              )}
              {product.is_featured && <Badge className="absolute top-3 right-3">Featured</Badge>}
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-stone-500 mb-1">{product.category_name || "Uncategorized"}</p>
              <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">{product.name}</h3>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-amber-800">₱{Number(product.price).toLocaleString()}</span>
                <Link href={`/menu/${product.slug}`}>
                  <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
