import type { Client } from "@libsql/client";

export const ITEMS_PER_PAGE = 3;

interface GetCarsOptions {
  excludeSlug?: string;
  limit?: number;
  orderBy?: string;
  offset?: number;
  status?: string;
  excludeExpired?: boolean;
}

export async function getCars(turso: Client, options: GetCarsOptions = {}) {
  const {
    excludeSlug,
    limit = ITEMS_PER_PAGE,
    orderBy = "saleDate DESC",
    offset = 0,
    status = "active",
    excludeExpired = false,
  } = options;

  const conditions: string[] = [];
  const args: any[] = [];

  if (status) {
    conditions.push("status = ?");
    args.push(status);
  }

  if (excludeSlug) {
    conditions.push("slug != ?");
    args.push(excludeSlug);
  }

  if (excludeExpired) {
    const now = Math.floor(Date.now() / 1000);
    conditions.push("saleDate > ?");
    args.push(now);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  args.push(limit, offset);

  const sql = `SELECT * FROM cars ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;

  const result = await turso.execute({ sql, args });

  return result.rows;
}

export async function getPaginationData(
  turso: Client,
  status: string = "active"
) {
  const countResult = await turso.execute({
    sql: "SELECT COUNT(*) as count FROM cars WHERE status = ?",
    args: [status],
  });
  const totalCars = countResult.rows[0].count as number;
  const totalPages = Math.ceil(totalCars / ITEMS_PER_PAGE);

  return { totalCars, totalPages };
}
