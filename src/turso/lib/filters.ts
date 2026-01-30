import type { Client } from "@libsql/client";
import { ITEMS_PER_PAGE } from "@turso/lib/getCars";

export type CarStatus = "active" | "sold" | "expired" | "";

export interface Filters {
  platforms: string[];
  priceFrom?: number;
  priceTo?: number;
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  odometerFrom?: number;
  odometerTo?: number;
  buyNow?: boolean;
  page: number;
}

export function parseFilters(searchParams: URLSearchParams): Filters {
  const platformParam = searchParams.get("platform");
  const priceFromParam = searchParams.get("priceFrom");
  const priceToParam = searchParams.get("priceTo");
  const makeParam = searchParams.get("make");
  const modelParam = searchParams.get("model");
  const yearFromParam = searchParams.get("yearFrom");
  const yearToParam = searchParams.get("yearTo");
  const odometerFromParam = searchParams.get("odometerFrom");
  const odometerToParam = searchParams.get("odometerTo");
  const buyNowParam = searchParams.get("buyNow");

  return {
    platforms: platformParam ? platformParam.split(",") : ["copart", "IAAI"],
    priceFrom: priceFromParam ? parseInt(priceFromParam) : undefined,
    priceTo: priceToParam ? parseInt(priceToParam) : undefined,
    make: makeParam || undefined,
    model: modelParam || undefined,
    yearFrom: yearFromParam ? parseInt(yearFromParam) : undefined,
    yearTo: yearToParam ? parseInt(yearToParam) : undefined,
    odometerFrom: odometerFromParam ? parseInt(odometerFromParam) : undefined,
    odometerTo: odometerToParam ? parseInt(odometerToParam) : undefined,
    buyNow: buyNowParam === "true",
    page: parseInt(searchParams.get("page") || "1"),
  };
}

function buildWhereClause(options: {
  filters?: Filters;
  baseCondition?: string;
  status?: CarStatus;
}) {
  const { filters, baseCondition, status = "active" } = options;

  const conditions: string[] = [];
  const args: any[] = [];

  if (baseCondition) {
    conditions.push(baseCondition);
  }

  if (status !== "") {
    conditions.push("status = ?");
    args.push(status);
  }

  if (filters) {
    if (filters.platforms.length > 0 && filters.platforms.length < 2) {
      const placeholders = filters.platforms.map(() => "?").join(",");
      conditions.push(`auctionPlatform IN (${placeholders})`);
      args.push(...filters.platforms);
    }

    if (filters.priceFrom && filters.priceFrom > 0) {
      conditions.push("estimatedPriceToBulgariaBgn >= ?");
      args.push(filters.priceFrom);
    }

    if (filters.priceTo && filters.priceTo > 0) {
      conditions.push("estimatedPriceToBulgariaBgn <= ?");
      args.push(filters.priceTo);
    }

    if (filters.make) {
      conditions.push("make = ?");
      args.push(filters.make);
    }

    if (filters.model) {
      conditions.push("model = ?");
      args.push(filters.model);
    }

    if (filters.yearFrom) {
      conditions.push("manufactureYear >= ?");
      args.push(filters.yearFrom);
    }

    if (filters.yearTo) {
      conditions.push("manufactureYear <= ?");
      args.push(filters.yearTo);
    }

    if (filters.odometerFrom && filters.odometerFrom > 0) {
      conditions.push("odometerKm >= ?");
      args.push(filters.odometerFrom);
    }

    if (filters.odometerTo && filters.odometerTo > 0) {
      conditions.push("odometerKm <= ?");
      args.push(filters.odometerTo);
    }

    if (filters.buyNow) {
      conditions.push("isBuyNow = ?");
      args.push(1);
    }
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return { whereClause, args };
}

export async function getFilteredCars(
  filters: Filters,
  turso: Client,
  status: CarStatus = "active"
) {
  const { page } = filters;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { whereClause, args } = buildWhereClause({ filters, status });

  const sql = `SELECT * FROM cars ${whereClause} ORDER BY saleDate DESC LIMIT ? OFFSET ?`;

  const result = await turso.execute({
    sql,
    args: [...args, ITEMS_PER_PAGE, offset],
  });

  return result.rows;
}

export async function getFilteredPaginationData(
  filters: Filters,
  turso: Client,
  status: CarStatus = "active"
) {
  const { whereClause, args } = buildWhereClause({ filters, status });

  const countResult = await turso.execute({
    sql: `SELECT COUNT(*) as count FROM cars ${whereClause}`,
    args,
  });

  const totalCars = countResult.rows[0].count as number;
  const totalPages = Math.ceil(totalCars / ITEMS_PER_PAGE);

  return { totalCars, totalPages };
}

export async function getMaxPrice(turso: Client, status: CarStatus = "active") {
  const { whereClause, args } = buildWhereClause({
    baseCondition: "estimatedPriceToBulgariaBgn IS NOT NULL",
    status,
  });

  const result = await turso.execute({
    sql: `SELECT MAX(estimatedPriceToBulgariaBgn) as maxPrice FROM cars ${whereClause}`,
    args,
  });

  const maxPrice = Math.ceil((result.rows[0].maxPrice as number) / 1000) * 1000;

  return maxPrice;
}

export async function getMakes(turso: Client, status: CarStatus = "active") {
  const { whereClause, args } = buildWhereClause({
    baseCondition: "make IS NOT NULL",
    status,
  });

  const result = await turso.execute({
    sql: `SELECT DISTINCT make FROM cars ${whereClause} ORDER BY make ASC`,
    args,
  });

  return result.rows.map((row) => row.make as string);
}

export async function getModelsByMake(
  make: string,
  turso: Client,
  status: CarStatus = "active"
) {
  const conditions = ["make = ?", "model IS NOT NULL"];
  const args: any[] = [make];

  if (status !== "") {
    conditions.push("status = ?");
    args.push(status);
  }

  const result = await turso.execute({
    sql: `SELECT DISTINCT model FROM cars WHERE ${conditions.join(" AND ")} ORDER BY model ASC`,
    args,
  });

  return result.rows.map((row) => row.model as string);
}

export async function getMinYear(turso: Client, status: CarStatus = "active") {
  const { whereClause, args } = buildWhereClause({
    baseCondition: "manufactureYear IS NOT NULL",
    status,
  });

  const result = await turso.execute({
    sql: `SELECT MIN(manufactureYear) as minYear FROM cars ${whereClause}`,
    args,
  });

  const minYear = result.rows[0].minYear as number;

  return minYear;
}

export async function getMaxOdometer(
  turso: Client,
  status: CarStatus = "active"
) {
  const { whereClause, args } = buildWhereClause({
    baseCondition: "odometerKm IS NOT NULL",
    status,
  });

  const result = await turso.execute({
    sql: `SELECT MAX(odometerKm) as maxOdometer FROM cars ${whereClause}`,
    args,
  });

  const maxOdometer =
    Math.ceil((result.rows[0].maxOdometer as number) / 1000) * 1000;

  return maxOdometer;
}
