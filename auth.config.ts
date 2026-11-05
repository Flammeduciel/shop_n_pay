import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/connexion",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "client";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");
        session.user.role = String(token.role ?? "client");
      }

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
