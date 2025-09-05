// import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { FreshContext } from "$fresh/server.ts";
//import { getCookies } from "$std/http/cookie"; // or "$std/http" if using JSR
import { getCookies } from "https://deno.land/std@0.224.0/http/cookie.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
): Promise<Response> {
  const url = new URL(req.url);
  const cookies = getCookies(req.headers);

  // Skip middleware for /login and static assets
  if (url.pathname === "/login" || url.pathname.startsWith("/static")) {
    return await ctx.next();
  }

  // Check for session cookie
  const session = cookies["session"];
  if (session !== "1") {
    return new Response(null, {
      status: 302,
      headers: { Location: "/login" },
    });
  }

  // Continue to the next handler
  return await ctx.next();
}