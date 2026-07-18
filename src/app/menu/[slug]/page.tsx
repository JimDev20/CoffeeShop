import { ProductService } from "@/services/ProductService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

const productService = new ProductService();

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/menu" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-stone-100 rounded-xl flex items-center justify-center relative overflow-hidden">
          <Coffee className="h-32 w-32 text-stone-300" />
          {product.is_featured && (
            <Badge className="absolute top-4 right-4">Featured</Badge>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-stone-500 mb-1">{product.category_name || "Uncategorized"}</p>
            <h1 className="text-3xl font-bold text-stone-800">{product.name}</h1>
          </div>

          <p className="text-stone-600 leading-relaxed">{product.description}</p>

          <div className="text-3xl font-bold text-amber-800">
            ₱{Number(product.price).toLocaleString()}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {product.weight && (
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-stone-500">Weight</p>
                  <p className="font-medium text-stone-800">{product.weight}</p>
                </CardContent>
              </Card>
            )}
            {product.origin && (
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-stone-500">Origin</p>
                  <p className="font-medium text-stone-800">{product.origin}</p>
                </CardContent>
              </Card>
            )}
            {product.roast_level && (
              <Card>
                <CardContent className="p-3">
                  <p className="text-xs text-stone-500">Roast Level</p>
                  <p className="font-medium text-stone-800">{product.roast_level}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="p-3">
                <p className="text-xs text-stone-500">Stock</p>
                <p className="font-medium text-stone-800">{product.stock} units</p>
              </CardContent>
            </Card>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
