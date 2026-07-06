import { ProductService } from "@/services/ProductService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Plus } from "lucide-react";
import Link from "next/link";

const productService = new ProductService();

export default async function MenuPage() {
  let products = await productService.getAllAvailable().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Our <span className="text-amber-700">Menu</span></h1>
        <p className="text-stone-500 max-w-xl mx-auto">
          Explore our selection of premium coffee and accessories. Every product is carefully curated for the best experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 && <p className="col-span-full text-center text-stone-400 py-16">No products available yet.</p>}
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center">
              <Coffee className="h-20 w-20 text-stone-300 group-hover:text-amber-700/40 transition-colors" />
              {product.is_featured && <Badge className="absolute top-3 right-3">Featured</Badge>}
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-stone-500 mb-1">{product.category_name || "Uncategorized"}</p>
              <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">{product.name}</h3>
              <p className="text-sm text-stone-500 mt-1">{product.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-amber-800">\u20B1{Number(product.price).toLocaleString()}</span>
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
