import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Next.js 16 renamed `middleware.ts`/`middleware` to `proxy.ts`/`proxy`.
// This is a convenience gate only — every Server Action that touches user
// data re-checks the session itself (see lib/actions/*), since Server
// Functions are POST requests that can be called independently of this file.
export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/compte/connexion", req.url);
    // Conserve la page demandée pour y revenir après connexion : sans ça, un
    // visiteur qui clique « Déposer une annonce » se retrouvait sur « Mes
    // annonces » une fois identifié, et devait recommencer.
    loginUrl.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/compte/annonces/:path*", "/compte/messages/:path*"],
};
