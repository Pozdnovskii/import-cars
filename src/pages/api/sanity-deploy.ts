import type { APIRoute } from "astro";
import { DEPLOY_HOOK } from "astro:env/server";

export const POST: APIRoute = async () => {
  if (!DEPLOY_HOOK) {
    return Response.json(
      { error: "Deploy hook not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(DEPLOY_HOOK, {
      method: "POST",
      signal: AbortSignal.timeout(10000),
    });

    return Response.json({
      success: true,
      status: response.status,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Deploy failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

export const prerender = false;
