import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    role: "user" | "admin";
    displayName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin";
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!row) {
          return null;
        }

        const valid = await compare(password, row.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: row.id,
          email: row.email,
          name: row.displayName,
          displayName: row.displayName,
          role: row.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }): JWT => {
      if (user) {
        token.id = user.id!;
        token.role = user.role as "user" | "admin";
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/compte/connexion",
  },
});
