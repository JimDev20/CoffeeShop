import { NextResponse } from "next/server";
import { AuthService } from "@/services/AuthService";
import { registerSchema } from "@/lib/validations";

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    const existing = await authService.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const user = await authService.register({ name, email, password });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}
