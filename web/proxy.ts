import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Next.js 16 renamed `middleware.ts`/`middleware` to `proxy.ts`/`proxy`.
// This is a convenience gate only — every Server Action that touches user
// data re-checks the session itself (see lib/actions/*), since Server
// Functions are POST requests that can be called independently of this file.
export const proxy = auth((req) => {
  if (!req.auth) {
    const loginUrl = new URL("/compte/connexion", req.url);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/compte/annonces/:path*", "/compte/messages/:path*"],
};
