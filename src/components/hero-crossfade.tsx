"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/pour-over-hero.jpg",
    alt: "Water poured from a kettle over a pour-over dripper and cup.",
  },
  {
    src: "/images/pour-over-kettle.jpg",
    alt: "A gooseneck kettle brewing a single cup of pour-over coffee.",
  },
  {
    src: "/images/cooling-tray.jpg",
    alt: "Freshly roasted coffee beans turning in a cooling tray.",
  },
];

export default function HeroCrossfade() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      stop();
      timer = setInterval(() => {
        setActive((current) => (current + 1) % slides.length);
      }, 6500);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="hero-photo">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={index === active ? slide.alt : ""}
          aria-hidden={index !== active}
          fill
          priority={index === 0}
          sizes="(min-width: 768px) 40vw, 85vw"
          className={index === active ? "is-active" : ""}
        />
      ))}
    </div>
  );
}
