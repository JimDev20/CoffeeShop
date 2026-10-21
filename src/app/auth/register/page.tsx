"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/auth/login?registered=true");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="mx-auto max-w-md py-16 md:py-24">
        <div className="grid h-16 w-16 place-content-center rounded-full bg-field text-field-ink">
          <span className="font-display text-xl leading-none">B&amp;Co</span>
        </div>
        <h1 className="page-title mt-8">Create an account.</h1>
        <p className="section-lead mt-4">Keep your orders in one place and check out with fewer steps next time.</p>

        <div className="mt-10 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Full name</span>
            <Input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
          </label>
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <span className="mt-1 block text-xs text-muted">At least 6 characters.</span>
          </label>
          {error && (
            <p className="text-sm text-[#7a2a1f]" role="alert">
              {error}
            </p>
          )}
          <Button className="w-full" size="lg" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-ink underline underline-offset-4">
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
