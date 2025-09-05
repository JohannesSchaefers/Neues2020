import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req) {
    return new Response(null, {
      status: 303, // Consistent with middleware.ts
      headers: { Location: "/login" },
    });
  },
};

export default function Home() {
  return null; // No content needed, as it redirects
}