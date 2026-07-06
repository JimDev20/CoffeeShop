import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Truck, HeadphonesIcon, Award } from "lucide-react";
import Image from "next/image";

const categories = [
  { name: "Coffee Beans", slug: "coffee-beans", image: "/img/category-beans.jpg", desc: "Single origin & blends" },
  { name: "Ground Coffee", slug: "ground-coffee", image: "/img/category-ground.jpg", desc: "Pre-ground for convenience" },
  { name: "Capsules", slug: "capsules", image: "/img/category-capsules.jpg", desc: "Compatible with all machines" },
  { name: "Accessories", slug: "accessories", image: "/img/category-accessories.jpg", desc: "Brew like a pro" },
];

const features = [
  { icon: Coffee, title: "Specialty Roasting", desc: "Small-batch roasted for peak flavor" },
  { icon: Truck, title: "Fast Delivery", desc: "Delivered fresh to your doorstep" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "Always here when you need us" },
  { icon: Award, title: "Premium Quality", desc: "Only the finest Arabica beans" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/img/hero-bg.jpg')] bg-cover bg-center opacity-30" />
        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your Perfect <span className="text-amber-400">Cup</span> Starts Here
            </h1>
            <p className="text-lg md:text-xl text-amber-100/80 mb-8 max-w-xl">
              Freshly roasted specialty coffee, brewing equipment, and accessories. 
              Crafted for those who appreciate the perfect cup.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold">
                  Order Now
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-amber-400 text-amber-300 hover:bg-amber-800/50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 to-transparent" />
      </section>

      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-4">
            Why Choose <span className="text-amber-700">Brew & Co.</span>
          </h2>
          <p className="text-center text-stone-500 mb-12 max-w-xl mx-auto">
            We&apos;re passionate about bringing you the best coffee experience possible.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {features.map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <f.icon className="h-7 w-7 text-amber-700" />
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{f.title}</h3>
                <p className="text-sm text-stone-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-4">
            Shop by <span className="text-amber-700">Category</span>
          </h2>
          <p className="text-center text-stone-500 mb-12 max-w-xl mx-auto">
            Find exactly what you&apos;re looking for.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/menu?category=${cat.slug}`}>
                <Card className="group hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
                  <div className="aspect-square bg-stone-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-100 flex items-center justify-center">
                      <Coffee className="h-16 w-16 text-amber-700/40" />
                    </div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-stone-800 group-hover:text-amber-700 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">{cat.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-amber-800 to-amber-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-amber-100/80 mb-8 max-w-lg mx-auto">
            Browse our full menu and place your order. Fresh coffee is just a few clicks away.
          </p>
          <Link href="/menu">
            <Button size="lg" className="bg-white text-amber-800 hover:bg-amber-50 font-semibold">
              View Full Menu
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              The Coffee You&apos;ve Been Looking For Is Right Here
            </h2>
            <p className="text-stone-500 mb-6">
              Quality in every bean, flavor in every cup. Every coffee is an excuse to be together. 
              We&apos;re here to prepare fresh, delicious coffee for you.
            </p>
            <Link href="tel:+1234567890">
              <Button variant="outline" className="border-amber-700 text-amber-700">
                Call to Order: +1 (234) 567-890
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
