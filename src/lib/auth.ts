import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const { db } = await import("@/lib/db");
          const schema = await import("@/lib/db/schema");
          const { eq } = await import("drizzle-orm");
          const bcrypt = await import("bcryptjs");

          const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, credentials.email as string))
            .limit(1);

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(credentials.password as string, user.password);
          if (!isValid) return null;

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role;
        (token as any).id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
});
