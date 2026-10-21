/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import { roastInk, roastTone } from "@/lib/catalogue";
import { ProductService } from "@/services/ProductService";

export const dynamic = "force-dynamic";

const productService = new ProductService();

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) {
    notFound();
  }

  const facts = [
    ["Category", product.category_name || "Uncategorized"],
    ["Origin", product.origin],
    ["Roast level", product.roast_level],
    ["Weight", product.weight],
    ["Stock", product.stock > 0 ? `${product.stock} in stock` : "Out of stock"],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return (
    <div className="page-shell">
      <div className="py-8">
        <Link href="/menu" className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to the shelf
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-10 pb-24 md:grid-cols-2 md:gap-16">
        <div
          className="relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center overflow-hidden rounded-full"
          style={{ background: roastTone(product.roast_level) }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-2/5 w-2/5"
              style={{ color: roastInk(product.roast_level) }}
              aria-hidden="true"
            >
              <ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(32 12 12)" fill="currentColor" />
              <path
                d="M8.6 6.7c2.3 1.6 1 3.7 3 5.3s3.7 1.2 3.7 4.4"
                fill="none"
                stroke="var(--bone)"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        <div className="max-w-xl">
          <p className="text-sm text-muted">
            {product.category_name || "Uncategorized"}
            {product.is_featured ? " / Featured lot" : ""}
          </p>
          <h1 className="page-title mt-3">{product.name}</h1>
          {product.description && <p className="mt-6 text-lg leading-relaxed">{product.description}</p>}
          <p className="mt-8 font-display text-4xl leading-none">₱{Number(product.price).toLocaleString()}</p>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[0.8125rem] text-muted">{label}</dt>
                <dd className="mt-1 text-[1.0625rem]">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10">
            <AddToCartButton product={product} />
          </div>

          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-1 text-sm underline underline-offset-4 hover:decoration-2"
          >
            See the rest of the shelf
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
