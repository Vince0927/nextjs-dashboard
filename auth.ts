import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import type { User } from "@/app/lib/definitions";
import bcrypt from "bcryptjs";
import postgres from "postgres";

const isLocal =
  process.env.POSTGRES_HOST === "localhost" ||
  process.env.POSTGRES_HOST === "127.0.0.1";

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: isLocal ? false : "require",
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          console.log("DEBUG: Authorize - Received credentials:", {
            email,
            password: "[REDACTED]",
          });

          const user = await getUser(email);
          console.log("DEBUG: Authorize - User from DB:", user);
          if (!user) return null;

          console.log(
            "DEBUG: Authorize - Comparing passwords. Input:",
            "[REDACTED]",
            "DB Hash:",
            user.password,
          );
          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log("DEBUG: Authorize - Passwords match:", passwordsMatch);
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});
