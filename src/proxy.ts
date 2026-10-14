import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE, readSession } from "@/server/token";

// Pages only. API routes check the session themselves and answer with 401.
export async function proxy(request: NextRequest) {
  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = request.nextUrl.pathname === "/login";
  if (!session && !onLogin) return NextResponse.redirect(new URL("/login", request.url));
  if (session && (onLogin || request.nextUrl.pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*", "/customer/:path*"],
};
