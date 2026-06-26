import NextAuth, { type NextAuthOptions } from "next-auth";
import type { Provider } from "next-auth/providers/index";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { queryRows, execute, hasMysqlEnv } from "@/lib/mysql";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  password_hash?: string | null;
};

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
      if (!email || !password || !hasMysqlEnv()) return null;

      const [profile] = await queryRows<ProfileRow & { password_hash: string | null }>(
        "select id,email,full_name,password_hash from profiles where email = ? limit 1",
        [email]
      );

      if (!profile?.password_hash) return null;
      const ok = await bcrypt.compare(password, profile.password_hash);
      if (!ok) return null;

      return { id: profile.id, email: profile.email, name: profile.full_name ?? profile.email };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }));
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(FacebookProvider({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET }));
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!hasMysqlEnv() || !user.email) return false;

      if (account?.provider !== "credentials") {
        const profile = await upsertOAuthProfile(user.email, user.name ?? null);
        user.id = profile.id;
        user.name = profile.full_name ?? profile.email;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const profile = await findProfileByEmail(user.email);
        token.sub = profile?.id ?? user.id;
        token.name = profile?.full_name ?? user.name;
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

async function findProfileByEmail(email: string) {
  const [profile] = await queryRows<ProfileRow>("select id,email,full_name from profiles where email = ? limit 1", [email.toLowerCase()]);
  return profile ?? null;
}

async function upsertOAuthProfile(email: string, fullName: string | null) {
  const normalizedEmail = email.toLowerCase();
  const existing = await findProfileByEmail(normalizedEmail);
  if (existing) return existing;

  const id = randomUUID();
  await execute(
    "insert into profiles (id,email,full_name,email_verified_at,auth_provider) values (?,?,?,?,?)",
    [id, normalizedEmail, fullName, new Date(), "oauth"]
  );
  return { id, email: normalizedEmail, full_name: fullName };
}

export const nextAuthHandler = NextAuth(authOptions);
