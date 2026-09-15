import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Alias to static JSON — prefer /data/cards.json for CDN cache. */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/data/cards.json", request.url), 308);
}
