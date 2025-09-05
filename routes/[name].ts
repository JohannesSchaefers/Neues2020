import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const { name } = ctx.params;
    const subdomain = Deno.env.get("SUBDOMAIN") || "subdomain.domain.de";
    // Weiterleitung zur Subdomain-URL
    return Response.redirect(`https://${subdomain}/${name}`, 302);
  },
};