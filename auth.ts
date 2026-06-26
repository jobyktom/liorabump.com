import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getPrisma, hasDatabaseUrl } from "@/lib/prisma";

const providers: Provider[] = [
  CredentialsProvider({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password ?? "";
      if (!email || !password || !hasDatabaseUrl()) return null;

      const profile = await getPrisma().user.findUnique({ where: { email } });

      if (!profile?.passwordHash) return null;
      const ok = await bcrypt.compare(password, profile.passwordHash);
      if (!ok) return null;

      return { id: profile.id, email: profile.email, name: profile.name ?? profile.email };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, allowDangerousEmailAccountLinking: true }));
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET, allowDangerousEmailAccountLinking: true }));
}

export const authOptions: NextAuthOptions = {
  adapter: hasDatabaseUrl() ? PrismaAdapter(getPrisma()) : undefined,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!hasDatabaseUrl() || !user.email) return false;

      if (account?.provider && account.provider !== "credentials" && user.id) {
        await getPrisma().user.update({
          where: { id: user.id },
          data: { authProvider: "oauth", emailVerified: new Date() },
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const profile = await getPrisma().user.findUnique({ where: { email: user.email.toLowerCase() } });
        token.sub = profile?.id ?? user.id;
        token.name = profile?.name ?? user.name;
        token.email = profile?.email ?? user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
      }
      return session;
    },
  },
};

export const nextAuthHandler = NextAuth(authOptions);
