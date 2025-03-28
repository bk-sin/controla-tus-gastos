import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { Database } from "@/lib/database.types";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  // Si el usuario no está autenticado y está intentando acceder a una ruta protegida
  if (
    !session &&
    (req.nextUrl.pathname === "/dashboard" ||
      req.nextUrl.pathname.startsWith("/api/protected"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // Si el usuario está autenticado y está intentando acceder a la página de login
  if (session && req.nextUrl.pathname === "/login") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/dashboard", "/login", "/api/protected/:path*"],
};
