import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import { connectDB } from "./db";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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
    async signIn({ user }) {
      const allowedEmails = ["av0587992@gmail.com"];
      return allowedEmails.includes(user.email);
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user._id;
        token.email = user.email;
        token.role = user.role || "user";
      }

      if (account?.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: token.email });
        if (!existingUser) {
          const newUser = await User.create({
            name: token.name,
            email: token.email,
            image: token.picture,
            role: "user", // 👈 default role; change to "admin" if needed
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

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },

    async redirect({ url, baseUrl, token }) {
      const adminEmail = "av0587992@gmail.com";
      if (token?.email === adminEmail) {
        return `${baseUrl}/admin`; // 👈 send admin to admin panel
      }
      return `${baseUrl}/dashboard`; // 👈 default for regular users
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
