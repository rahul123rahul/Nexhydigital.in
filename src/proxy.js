import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "hygenx-hr-super-secret-jwt-key-2026"
);

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. Protect Admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const { payload } = await jwtVerify(token, SECRET);
      // Enforce admin role check (must be super_admin to manage CRM/Careers)
      if (payload.role !== "super_admin" && payload.role !== "admin") {
        return NextResponse.redirect(
          new URL("/login?error=unauthorized", request.url)
        );
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // 2. Protect Customer routes
  if (pathname.startsWith("/customer")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      const { payload } = await jwtVerify(token, SECRET);
      if (payload.role !== "client" && payload.role !== "super_admin" && payload.role !== "admin") {
        return NextResponse.redirect(
          new URL("/login?error=unauthorized", request.url)
        );
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // 3. Redirect logged-in user away from Login page
  if (pathname === "/login") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET);
        if (payload.role === "super_admin" || payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        } else if (payload.role === "client") {
          return NextResponse.redirect(new URL("/customer/dashboard", request.url));
        }
      } catch (err) {
        // Token invalid, allow login page access
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/login"],
};
