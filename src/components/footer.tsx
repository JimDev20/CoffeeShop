import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <div className="footer-word">Brew &amp; Co.</div>

      <div className="footer-grid">
        <div>
          <h3>Shop</h3>
          <div className="footer-links">
            <Link href="/menu">The menu</Link>
            <Link href="/menu?category=coffee-beans">Coffee beans</Link>
            <Link href="/cart">Cart</Link>
            <Link href="/orders">Orders</Link>
          </div>
        </div>

        <div>
          <h3>Account</h3>
          <div className="footer-links">
            <Link href="/auth/login">Sign in</Link>
            <Link href="/auth/register">Create account</Link>
            <Link href="/orders">Order history</Link>
          </div>
        </div>

        <div>
          <h3>How we work</h3>
          <p className="text-sm leading-relaxed">
            Single-origin lots, roasted in small batches. Every bag lists its origin, roast level and weight.
            Prices are in Philippine pesos.
          </p>
        </div>

        <p className="footer-credits">
          Photographs:{" "}
          <a href="https://commons.wikimedia.org/w/index.php?curid=70214599" target="_blank" rel="noreferrer">
            Manual drip by Kim Sanso
          </a>{" "}
          (CC0),{" "}
          <a href="https://commons.wikimedia.org/w/index.php?curid=84501930" target="_blank" rel="noreferrer">
            Open coffee cherry by Roger Burger
          </a>{" "}
          (CC0),{" "}
          <a href="https://commons.wikimedia.org/w/index.php?curid=87521821" target="_blank" rel="noreferrer">
            Pour-over equipment
          </a>{" "}
          and{" "}
          <a href="https://commons.wikimedia.org/w/index.php?curid=87521822" target="_blank" rel="noreferrer">
            brewing by HungryHuy
          </a>{" "}
          (
          <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">
            CC BY 2.0
          </a>
          ),{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Coffee_Beans_in_a_Cooling_Tray.JPG"
            target="_blank"
            rel="noreferrer"
          >
            Coffee beans in a cooling tray by Jkafader
          </a>{" "}
          (
          <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">
            CC BY-SA 3.0
          </a>
          ), via Wikimedia Commons.
        </p>

        <div className="footer-base">
          <span>&copy; {new Date().getFullYear()} Brew &amp; Co.</span>
          <span>Prices in PHP. Photographs are credited above.</span>
        </div>
      </div>
    </footer>
  );
}
