/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CSSProperties } from "react";
import HeroCrossfade from "@/components/hero-crossfade";
import RoastCatalogue from "@/components/roast-catalogue";
import { CategoryService } from "@/services/CategoryService";
import { ProductService } from "@/services/ProductService";

export const dynamic = "force-dynamic";

const categoryService = new CategoryService();
const productService = new ProductService();

const tiles = [
  { word: "Ethiopia", caption: "Origin", tone: "olive" },
  { word: "Colombia", caption: "Origin", tone: "surface" },
  { photo: "/images/pour-over-gear.jpg", alt: "Pour-over dripper, kettle, grinder and scales on a wooden table.", caption: "Pour-over gear", tone: "photo" },
  { word: "Brazil", caption: "Origin", tone: "olive" },
  { word: "Light", caption: "Roast", tone: "surface" },
  { word: "Medium", caption: "Roast", tone: "olive" },
  { photo: "/images/pour-over-kettle.jpg", alt: "A kettle pouring water through a white dripper into a glass.", caption: "Brewing", tone: "photo" },
  { word: "Dark", caption: "Roast", tone: "surface" },
  { word: "200g", caption: "Weight", tone: "olive" },
  { word: "250g", caption: "Weight", tone: "surface" },
  { word: "Whole bean", caption: "Format", tone: "olive" },
  { photo: "/images/cooling-tray.jpg", alt: "Roasted coffee beans moving across a cooling tray.", caption: "Roasting", tone: "photo" },
] as const;

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    categoryService.getAllActive(),
    productService.getAllAvailable(),
  ]);

  const coffee = products.filter((product) => product.roast_level);
  const minPrice = coffee.length > 0 ? Math.min(...coffee.map((product) => Number(product.price))) : 0;
  const weights = Array.from(new Set(coffee.map((product) => product.weight).filter(Boolean)));

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-card">
          <div className="hero-disc" aria-hidden="true" />
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-title">
              Coffee with
              <br />a source.
            </h1>
            <p className="hero-sentence">
              Single-origin beans from Ethiopia, Colombia and Brazil, roasted in small batches and delivered
              across the Philippines.
            </p>
            <div className="hero-actions">
              <Link href="/menu" className="btn-pill">
                Shop the coffee
              </Link>
              <Link href="#story" className="text-sm underline underline-offset-4 hover:decoration-2">
                Read our story
              </Link>
            </div>
            <div className="hero-links">
              <Link href="#menu">Menu</Link>
              <Link href="#roast">Roast levels</Link>
              <Link href="/orders">Track an order</Link>
            </div>
          </div>
        </div>

        <div className="hero-media">
          <HeroCrossfade />
          <div className="hero-stamp">
            <span>Small batch</span>
            <strong>Est. 2024</strong>
          </div>
        </div>
      </section>

      <section id="menu" className="section-space" aria-labelledby="menu-title">
        <div className="page-shell">
          <RoastCatalogue products={products} categories={categories} />
        </div>
      </section>

      <section id="story" className="story" aria-labelledby="story-title">
        <div className="story-panel">
          <h2 id="story-title" className="story-title" data-reveal>
            Two seeds.
            <br />
            One cup.
          </h2>

          <div className="story-copy">
            <div className="story-block" data-reveal style={{ "--reveal-delay": "80ms" } as CSSProperties}>
              <h3>Sourced, not blended</h3>
              <p>
                The lots come from Ethiopia, Colombia and Brazil. Each one is sold on its own, so the origin on
                the bag is the origin in the cup.
              </p>
            </div>
            <div className="story-block" data-reveal style={{ "--reveal-delay": "160ms" } as CSSProperties}>
              <h3>Roasted in small batches</h3>
              <p>
                We roast to order, pack at 200g and 250g, and list the roast level so you can choose a light,
                medium or dark cup before you buy.
              </p>
            </div>
            <div className="story-actions" data-reveal style={{ "--reveal-delay": "240ms" } as CSSProperties}>
              <Link href="/menu" className="btn-pill btn-pill--light">
                Shop the coffee
              </Link>
            </div>
          </div>

          <div className="story-photo" data-reveal style={{ "--reveal-delay": "120ms" } as CSSProperties}>
            <img
              src="/images/coffee-cherry.jpg"
              width={1920}
              height={1440}
              alt="A split coffee cherry held in a hand, showing its two seeds."
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section id="roast" className="section-space" aria-labelledby="roast-title">
        <div className="page-shell">
          <div className="gallery-head">
            <div>
              <h2 id="roast-title" className="section-title" data-reveal>
                What is on the bag.
              </h2>
              <p className="section-lead mt-6" data-reveal style={{ "--reveal-delay": "70ms" } as CSSProperties}>
                Origin, roast and weight, written plainly on every bag. No house blend hiding the source.
              </p>
            </div>
            <Link
              href="/menu"
              className="btn-pill btn-pill--ghost"
              data-reveal
              style={{ "--reveal-delay": "140ms" } as CSSProperties}
            >
              See every lot
            </Link>
          </div>

          <div className="gallery-grid">
            {tiles.map((tile, index) => (
              <div
                key={tile.caption + index}
                className={`tile tile--${tile.tone}`}
                data-reveal
                style={{ "--reveal-delay": `${(index % 4) * 50}ms` } as CSSProperties}
              >
                {"photo" in tile ? (
                  <div className="tile-photo">
                    <img src={tile.photo} alt={tile.alt} loading="lazy" decoding="async" />
                  </div>
                ) : (
                  <span className="tile-word">{tile.word}</span>
                )}
                <span className="tile-caption">{tile.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="cta" aria-labelledby="order-title">
        <div className="cta-media" data-reveal>
          <div className="cta-photo">
            <img
              src="/images/cooling-tray.jpg"
              width={1920}
              height={2885}
              alt="Roasted coffee beans moving across a cooling tray."
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="cta-copy">
          <h2 id="order-title" className="cta-title" data-reveal>
            Take a bag home.
          </h2>
          <p data-reveal style={{ "--reveal-delay": "70ms" } as CSSProperties}>
            Order one lot or build a shelf from all three origins. Every bag lists its origin, roast level and
            weight before it leaves us.
          </p>
          <p className="cta-fact" data-reveal style={{ "--reveal-delay": "140ms" } as CSSProperties}>
            From ₱{minPrice.toLocaleString()}
            {weights.length > 0 ? ` · ${weights.join(" and ")} bags` : ""}
          </p>
          <div data-reveal style={{ "--reveal-delay": "210ms" } as CSSProperties}>
            <Link href="/menu" className="btn-pill">
              Order the coffee
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
