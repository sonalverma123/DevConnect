import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectDB } from "./db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid credentials");

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ✅ 1. Persist user ID and role in JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user._id;
        token.role = user.role || "user";
      }

      // ✅ 2. If Google sign-in, ensure user is in DB
      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: token.email });
        if (!existingUser) {
          const newUser = await User.create({
            name: token.name,
            email: token.email,
            image: token.picture,
            role: "user", // default role
          });
          token.id = newUser._id;
          token.role = newUser.role;
        } else {
          token.id = existingUser._id;
          token.role = existingUser.role;
        }
      }

      return token;
    },

    // ✅ 3. Inject user ID and role into session
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },

    // ✅ 4. Redirect after login
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
