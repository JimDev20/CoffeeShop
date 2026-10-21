import { roastInk, roastTone } from "@/lib/catalogue";
import type { ProductRow } from "@/services/ProductService";

export default function ProductMark({ product, size = 56 }: { product: ProductRow; size?: number }) {
  return (
    <span
      className="bean-mark"
      style={{ background: roastTone(product.roast_level), width: size, height: size }}
      aria-hidden="true"
    >
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt="" loading="lazy" />
      ) : (
        <svg viewBox="0 0 24 24" style={{ color: roastInk(product.roast_level) }} className="h-1/2 w-1/2">
          <ellipse cx="12" cy="12" rx="6" ry="9" transform="rotate(32 12 12)" fill="currentColor" />
          <path
            d="M8.6 6.7c2.3 1.6 1 3.7 3 5.3s3.7 1.2 3.7 4.4"
            fill="none"
            stroke="var(--bone)"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}
