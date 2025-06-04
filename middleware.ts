import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./utils/checkAuth";

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token =
    request.cookies.get("token")?.value ||
    request.cookies.get("auth-token")?.value;

  const authState = checkAuth(request);
  const { user } = authState || {}; // Use optional chaining

  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/verify"];

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without a token, redirect to signin
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If user is authenticated but not verified, redirect to verify-email
  if (user && !user.verified && pathname !== "/verify") {
    const url = request.nextUrl.clone();
    url.pathname = "/verify";
    return NextResponse.redirect(url);
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/verify/:path*"],
};
