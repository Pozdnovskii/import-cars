import type { APIRoute } from "astro";
import { getTursoClient } from "@turso/turso";
import { API_SECRET_KEY, DEPLOY_HOOK } from "astro:env/server";

function generateSlug(make: string, model: string, lotNumber: string): string {
  const title = `${make || ""} ${model || ""}`.trim() || "car";

  const cleanTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${cleanTitle}-${lotNumber}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.substring(7);

    if (token !== API_SECRET_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const turso = getTursoClient();
    const { operation, data } = await request.json();

    // ==================== CREATE ====================
    if (operation === "create" && Array.isArray(data)) {
      // Строгая валидация для новых авто
      const validCars = data.filter((car) => {
        return (
          car.lotNumber &&
          car.make &&
          car.model &&
          car.estimatedPriceToBulgariaBgn
        );
      });

      if (validCars.length === 0) {
        return Response.json(
          { error: "No valid cars to insert" },
          { status: 400 }
        );
      }

      const carsWithSlugs = validCars.map((car) => {
        const slug = generateSlug(car.make, car.model, String(car.lotNumber));
        const status = car.status || "active";

        return { lotNumber: car.lotNumber, slug, status, car };
      });

      const statements = carsWithSlugs.map(({ slug, status, car }) => {
        return {
          sql: `INSERT INTO cars (
            lotNumber, vin, slug, 
            heading, fullName, make, model, manufactureYear,
            engine, driveType, fuelBulgarian, transmissionBulgarian, odometerKm,
            primaryDamageBulgarian, secondaryDamageBulgarian,
            movableConditionBulgarian, hasKeyBulgarian,
            auctionPlatform, saleDate, isBuyNow,
            estimatedWinningBidUsd, estimatedPriceToBulgariaBgn, estimatedPriceToBulgariaEur,
            status, soldAt, finalBidUsd, imageUrls
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(lotNumber) DO NOTHING`,
          args: [
            car.lotNumber,
            car.vin || null,
            slug,
            car.heading || null,
            car.fullName || null,
            car.make || null,
            car.model || null,
            car.manufactureYear || null,
            car.engine || null,
            car.driveType || null,
            car.fuelBulgarian || null,
            car.transmissionBulgarian || null,
            car.odometerKm || null,
            car.primaryDamageBulgarian || null,
            car.secondaryDamageBulgarian || null,
            car.movableConditionBulgarian || null,
            car.hasKeyBulgarian || null,
            car.auctionPlatform || null,
            car.saleDate || null,
            car.isBuyNow ? 1 : 0,
            car.estimatedWinningBidUsd || null,
            car.estimatedPriceToBulgariaBgn || null,
            car.estimatedPriceToBulgariaEur || null,
            status,
            car.soldAt || null,
            car.finalBidUsd || null,
            car.imageUrls ? JSON.stringify(car.imageUrls) : null,
          ],
        };
      });

      const results = await turso.batch(statements, "write");

      // Подсчитываем вставленные и пропущенные (дубликаты)
      const inserted = results.filter((r) => r.rowsAffected > 0).length;
      const duplicates = validCars.length - inserted;

      await triggerDeploy();

      return Response.json(
        {
          success: true,
          operation: "create",
          inserted,
          duplicates,
          skipped: data.length - validCars.length,
          deploy_triggered: true,
          cars: carsWithSlugs.map(({ lotNumber, slug }) => ({
            lotNumber,
            url: `https://xclusivecars.bg/auction-cars/${slug}`,
          })),
        },
        { status: 200 }
      );
    }

    // ==================== UPDATE ====================
    if (operation === "update" && Array.isArray(data)) {
      // Требуем только lotNumber
      const validCars = data.filter((car) => car.lotNumber);

      if (validCars.length === 0) {
        return Response.json(
          { error: "No valid cars to update" },
          { status: 400 }
        );
      }

      const statements = validCars.map((car) => {
        const updates: string[] = [];
        const args: any[] = [];

        // Динамически добавляем только указанные поля
        if (car.vin !== undefined) {
          updates.push("vin = ?");
          args.push(car.vin);
        }
        if (car.heading !== undefined) {
          updates.push("heading = ?");
          args.push(car.heading);
        }
        if (car.fullName !== undefined) {
          updates.push("fullName = ?");
          args.push(car.fullName);
        }
        if (car.engine !== undefined) {
          updates.push("engine = ?");
          args.push(car.engine);
        }
        if (car.driveType !== undefined) {
          updates.push("driveType = ?");
          args.push(car.driveType);
        }
        if (car.fuelBulgarian !== undefined) {
          updates.push("fuelBulgarian = ?");
          args.push(car.fuelBulgarian);
        }
        if (car.transmissionBulgarian !== undefined) {
          updates.push("transmissionBulgarian = ?");
          args.push(car.transmissionBulgarian);
        }
        if (car.odometerKm !== undefined) {
          updates.push("odometerKm = ?");
          args.push(car.odometerKm);
        }
        if (car.manufactureYear !== undefined) {
          updates.push("manufactureYear = ?");
          args.push(car.manufactureYear);
        }
        if (car.primaryDamageBulgarian !== undefined) {
          updates.push("primaryDamageBulgarian = ?");
          args.push(car.primaryDamageBulgarian);
        }
        if (car.secondaryDamageBulgarian !== undefined) {
          updates.push("secondaryDamageBulgarian = ?");
          args.push(car.secondaryDamageBulgarian);
        }
        if (car.movableConditionBulgarian !== undefined) {
          updates.push("movableConditionBulgarian = ?");
          args.push(car.movableConditionBulgarian);
        }
        if (car.hasKeyBulgarian !== undefined) {
          updates.push("hasKeyBulgarian = ?");
          args.push(car.hasKeyBulgarian);
        }
        if (car.saleDate !== undefined) {
          updates.push("saleDate = ?");
          args.push(car.saleDate);
        }
        if (car.isBuyNow !== undefined) {
          updates.push("isBuyNow = ?");
          args.push(car.isBuyNow ? 1 : 0);
        }
        if (car.estimatedWinningBidUsd !== undefined) {
          updates.push("estimatedWinningBidUsd = ?");
          args.push(car.estimatedWinningBidUsd);
        }
        if (car.estimatedPriceToBulgariaBgn !== undefined) {
          updates.push("estimatedPriceToBulgariaBgn = ?");
          args.push(car.estimatedPriceToBulgariaBgn);
        }
        if (car.estimatedPriceToBulgariaEur !== undefined) {
          updates.push("estimatedPriceToBulgariaEur = ?");
          args.push(car.estimatedPriceToBulgariaEur);
        }
        if (car.status !== undefined) {
          updates.push("status = ?");
          args.push(car.status);
        }
        if (car.soldAt !== undefined) {
          updates.push("soldAt = ?");
          args.push(car.soldAt);
        }
        if (car.finalBidUsd !== undefined) {
          updates.push("finalBidUsd = ?");
          args.push(car.finalBidUsd);
        }
        if (car.imageUrls !== undefined) {
          updates.push("imageUrls = ?");
          args.push(car.imageUrls ? JSON.stringify(car.imageUrls) : null);
        }

        // Всегда обновляем updatedAt
        updates.push("updatedAt = unixepoch()");

        // Добавляем lotNumber в конец для WHERE
        args.push(car.lotNumber);

        return {
          sql: `UPDATE cars SET ${updates.join(", ")} WHERE lotNumber = ?`,
          args,
        };
      });

      const results = await turso.batch(statements, "write");
      const updated = results.filter((r) => r.rowsAffected > 0).length;

      await triggerDeploy();

      return Response.json(
        {
          success: true,
          operation: "update",
          updated,
          skipped: data.length - validCars.length,
          deploy_triggered: true,
        },
        { status: 200 }
      );
    }

    // ==================== DELETE_EXPIRED ====================
    if (operation === "delete_expired" && Array.isArray(data)) {
      const lotNumbers = data.map((car) => car.lotNumber).filter(Boolean);

      if (lotNumbers.length === 0) {
        return Response.json(
          { error: "No lot numbers provided" },
          { status: 400 }
        );
      }

      const placeholders = lotNumbers.map(() => "?").join(",");

      const result = await turso.execute({
        sql: `UPDATE cars 
              SET status = 'expired', updatedAt = unixepoch() 
              WHERE lotNumber IN (${placeholders})`,
        args: lotNumbers,
      });

      await triggerDeploy();

      return Response.json(
        {
          success: true,
          operation: "delete_expired",
          updated: result.rowsAffected,
          deploy_triggered: true,
        },
        { status: 200 }
      );
    }

    return Response.json({ error: "Invalid operation" }, { status: 400 });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: "Failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

async function triggerDeploy() {
  if (!DEPLOY_HOOK) {
    console.warn("Deploy hook not configured");
    return;
  }

  try {
    await fetch(DEPLOY_HOOK, {
      method: "POST",
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Deploy trigger failed:", error);
  }
}

export const prerender = false;
