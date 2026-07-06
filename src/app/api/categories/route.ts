import { NextResponse } from "next/server";
import { CategoryService } from "@/services/CategoryService";

const categoryService = new CategoryService();

export async function GET() {
  try {
    const categories = await categoryService.getAllActive();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
