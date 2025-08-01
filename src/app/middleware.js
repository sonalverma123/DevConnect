import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

// Protect dashboard and admin routes
export async function middleware(req) {
  const token = await getToken({ req });
  const isProtected = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin");

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/admin"],
};
