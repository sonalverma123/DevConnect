import NextAuth from "next-auth";
import { authOptions } from "../../../lib/authOptions";

// Export NextAuth with custom options
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
