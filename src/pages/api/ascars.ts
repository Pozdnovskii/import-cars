export const prerender = false;
import type { APIRoute } from "astro";
import { turso } from "@turso/turso";
import { ITEMS_PER_PAGE } from "@turso/lib/getCars";

export const GET: APIRoute = async ({ url }) => {
  const platformParam = url.searchParams.get("platform") || "copart,IAAI";
  const page = parseInt(url.searchParams.get("page") || "1");
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const platforms = platformParam
    .split(",")
    .filter((p) => p === "copart" || p === "IAAI");

  if (platforms.length === 0) {
    platforms.push("copart", "IAAI");
  }

  const placeholders = platforms.map(() => "?").join(",");

  const carsQuery = `
    SELECT * FROM cars 
    WHERE auctionPlatform IN (${placeholders})
    ORDER BY saleDate DESC 
    LIMIT ? OFFSET ?
  `;

  const countQuery = `
    SELECT COUNT(*) as count FROM cars 
    WHERE auctionPlatform IN (${placeholders})
  `;

  const [carsResult, countResult] = await Promise.all([
    turso.execute({
      sql: carsQuery,
      args: [...platforms, ITEMS_PER_PAGE, offset],
    }),
    turso.execute({
      sql: countQuery,
      args: platforms,
    }),
  ]);

  const totalCars = countResult.rows[0].count as number;

  return new Response(
    JSON.stringify({
      cars: carsResult.rows,
      totalCars,
      totalPages: Math.ceil(totalCars / ITEMS_PER_PAGE),
      currentPage: page,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=60",
      },
    }
  );
};
