import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("auth-token")?.value;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/payment"];

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without a token, redirect to signin
  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/signin", request.url);
    // Optionally add the current path as a redirect parameter
    signInUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
};
