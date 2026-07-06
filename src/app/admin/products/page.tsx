import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Edit, Plus, Trash2 } from "lucide-react";

const products = [
  { id: 1, name: "Ethiopian Yirgacheffe", price: 450, stock: 50, available: true, category: "Coffee Beans" },
  { id: 2, name: "Colombian Supremo", price: 420, stock: 35, available: true, category: "Coffee Beans" },
  { id: 3, name: "Espresso Capsules x10", price: 280, stock: 0, available: false, category: "Capsules" },
];

export default function AdminProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">Products</h1>
          <p className="text-stone-500 mt-1">Manage your product catalog</p>
        </div>
        <Button className="bg-amber-700 hover:bg-amber-800">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                <Coffee className="h-6 w-6 text-stone-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-800">{product.name}</h3>
                <p className="text-sm text-stone-500">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-amber-800">₱{product.price}</p>
                <p className="text-xs text-stone-500">Stock: {product.stock}</p>
              </div>
              <Badge variant={product.available ? "success" : "destructive"}>
                {product.available ? "Active" : "Inactive"}
              </Badge>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-500"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
