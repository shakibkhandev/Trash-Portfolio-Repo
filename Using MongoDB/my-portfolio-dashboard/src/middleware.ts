import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  // If user has access token and tries to access root page, redirect to dashboard
  if (accessToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user doesn't have access token and tries to access protected routes
  if (!accessToken && pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};