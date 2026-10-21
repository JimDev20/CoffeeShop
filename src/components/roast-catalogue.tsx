"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { CategoryRow } from "@/services/CategoryService";
import type { ProductRow } from "@/services/ProductService";
import { roastInk, roastTone } from "@/lib/catalogue";

const roasts = ["All", "Light", "Medium", "Dark"] as const;
type Roast = (typeof roasts)[number];

function BeanMark({ product }: { product: ProductRow }) {
  return (
    <span className="bean-mark" style={{ background: roastTone(product.roast_level) }} aria-hidden="true">
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt="" loading="lazy" />
      ) : (
        <svg viewBox="0 0 24 24" className="h-6 w-6" style={{ color: roastInk(product.roast_level) }}>
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

export default function RoastCatalogue({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: CategoryRow[];
}) {
  const [roast, setRoast] = useState<Roast>("All");

  const groups = useMemo(() => {
    const filtered =
      roast === "All"
        ? products
        : products.filter((product) => product.roast_level?.toLowerCase() === roast.toLowerCase());

    const ordered = categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        items: filtered.filter((product) => product.category_id === category.id),
      }))
      .filter((group) => group.items.length > 0);

    const grouped = new Set(ordered.map((group) => group.id));
    const rest = filtered.filter((product) => !product.category_id || !grouped.has(product.category_id));
    if (rest.length > 0) {
      ordered.push({ id: -1, name: "Also on the menu", items: rest });
    }

    return ordered;
  }, [categories, products, roast]);

  const shown = groups.reduce((count, group) => count + group.items.length, 0);

  return (
    <>
      <div className="catalogue-head">
        <div>
          <h2 id="menu-title" className="section-title" data-reveal>
            The current lots.
          </h2>
          <p className="section-lead mt-6" data-reveal style={{ "--reveal-delay": "70ms" } as CSSProperties}>
            Every bag names its origin, roast and weight. Filter the shelf to the cup you want to brew.
          </p>
        </div>

        <fieldset className="roast-control" data-reveal style={{ "--reveal-delay": "140ms" } as CSSProperties}>
          <legend className="roast-label">Filter by roast level</legend>
          <div className="roast-buttons">
            {roasts.map((option) => (
              <button
                key={option}
                type="button"
                className="roast-btn"
                aria-pressed={roast === option}
                onClick={() => setRoast(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="roast-count" aria-live="polite">
            {shown} {shown === 1 ? "lot" : "lots"} on the shelf
          </p>
        </fieldset>
      </div>

      {shown === 0 ? (
        <p className="catalogue-empty">
          Nothing at this roast right now.{" "}
          <button type="button" className="underline underline-offset-4" onClick={() => setRoast("All")}>
            Show every lot
          </button>
          .
        </p>
      ) : (
        <div className="catalogue-grid">
          {groups.map((group, groupIndex) => (
            <div
              key={group.id}
              className="catalogue-group"
              data-reveal
              style={{ "--reveal-delay": `${groupIndex * 60}ms` } as CSSProperties}
            >
              <div className="catalogue-group-head">
                <h3>{group.name}</h3>
                <span>
                  {group.items.length} {group.items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <ul>
                {group.items.map((product) => (
                  <li key={product.id} className="catalogue-item">
                    <Link href={`/menu/${product.slug}`}>
                      <BeanMark product={product} />
                      <span>
                        <span className="catalogue-name">{product.name}</span>
                        {product.description && <span className="catalogue-desc">{product.description}</span>}
                        <span className="catalogue-meta">
                          {[product.origin, product.roast_level, product.weight].filter(Boolean).join(" / ") ||
                            product.category_name ||
                            "Brew & Co."}
                        </span>
                      </span>
                      <span className="catalogue-price">₱{Number(product.price).toLocaleString()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
