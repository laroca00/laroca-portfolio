import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { isUnknownContentPath, type ContentManifest } from "./content/manifest";
import manifest from "./generated/content-manifest.json";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    isUnknownContentPath(pathname, manifest as ContentManifest, {
      includeDrafts: process.env.NODE_ENV !== "production",
    })
  ) {
    // Unknown project/post: hand it to the catch-all route, which 404s before streaming.
    const locale = pathname.split("/")[1];
    return NextResponse.rewrite(new URL(`/${locale}/__not-found`, request.url));
  }
  return intl(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
