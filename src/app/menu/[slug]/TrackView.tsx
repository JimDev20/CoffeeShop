"use client";

import { recordRecentlyViewed } from "@/lib/recently-viewed";
import { useEffect } from "react";

export default function TrackView({ productId }: { productId: number }) {
  useEffect(() => {
    recordRecentlyViewed(productId);
  }, [productId]);

  return null;
}
