import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Coffee, Plus } from "lucide-react";
import Link from "next/link";

const products = [
  { id: 1, name: "Ethiopian Yirgacheffe", category: "Coffee Beans", price: 450, slug: "ethiopian-yirgacheffe", desc: "Floral, fruity, wine-like", badge: "Best Seller" },
  { id: 2, name: "Colombian Supremo", category: "Coffee Beans", price: 420, slug: "colombian-supremo", desc: "Caramel, nutty, smooth", badge: "Popular" },
  { id: 3, name: "Dark Roast Espresso", category: "Coffee Beans", price: 380, slug: "dark-roast-espresso", desc: "Bold, chocolate, rich", badge: null },
  { id: 4, name: "Breakfast Blend", category: "Ground Coffee", price: 350, slug: "breakfast-blend", desc: "Balanced, bright, medium", badge: "New" },
  { id: 5, name: "French Roast", category: "Ground Coffee", price: 370, slug: "french-roast", desc: "Smoky, intense, dark", badge: null },
  { id: 6, name: "Espresso Capsules x10", category: "Capsules", price: 280, slug: "espresso-capsules", desc: "Compatible with Nespresso", badge: null },
  { id: 7, name: "Ceramic Pour Over", category: "Accessories", price: 650, slug: "ceramic-pour-over", desc: "Handcrafted ceramic dripper", badge: null },
  { id: 8, name: "Coffee Grinder Pro", category: "Accessories", price: 1200, slug: "coffee-grinder-pro", desc: "Adjustable burr grinder", badge: "Sale" },
];

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-stone-800 mb-4">Our <span className="text-amber-700">Menu</span></h1>
        <p className="text-stone-500 max-w-xl mx-auto">
          Explore our selection of premium coffee and accessories. Every product is carefully curated for the best experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all">
            <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center">
              <Coffee className="h-20 w-20 text-stone-300 group-hover:text-amber-700/40 transition-colors" />
              {product.badge && (
                <Badge className="absolute top-3 right-3">{product.badge}</Badge>
              )}
            </div>
            <CardContent className="p-4">
              <p className="text-xs text-stone-500 mb-1">{product.category}</p>
              <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-stone-500 mt-1">{product.desc}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-amber-800">₱{product.price}</span>
                <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
