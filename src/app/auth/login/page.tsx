"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-md py-16 md:py-24">
        <div className="grid h-16 w-16 place-content-center rounded-full bg-field text-field-ink">
          <span className="font-display text-[1.375rem] leading-none">B&amp;Co</span>
        </div>
        <h1 className="page-title mt-8">Welcome back.</h1>
        <p className="section-lead mt-4">Sign in to see your orders and keep your delivery details ready.</p>

        <div className="mt-10 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <Input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <Input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && (
            <p className="text-sm text-[#7a2a1f]" role="alert">
              {error}
            </p>
          )}
          <Button className="w-full" size="lg" onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted">
          New here?{" "}
          <Link href="/auth/register" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
