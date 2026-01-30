import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { getTursoClient } from "@turso/turso";

export const server = {
  submitForm: defineAction({
    accept: "form",

    input: z.object({
      website: z.string().optional(),

      auctionCarLot: z.coerce.number().int().positive().optional(),

      availableCarId: z.coerce.number().int().positive().optional(),

      carMake: z.string().optional(),
      carModel: z.string().optional(),

      sourceUrl: z.string().url(),

      name: z.string().min(2).max(100).trim(),

      email: z.string().email().max(255).trim().toLowerCase(),

      phone: z
        .string()
        .min(7)
        .max(18)
        .regex(/^[0-9+\s\-()]+$/)
        .trim()
        .optional(),

      message: z
        .string()
        .max(1000)
        .transform((val) => val.trim().replace(/<[^>]*>/g, ""))
        .optional(),
    }),

    handler: async (input) => {
      if (input.website) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Invalid submission",
        });
      }

      try {
        const turso = getTursoClient();
        let carMake: string | undefined;
        let carModel: string | undefined;
        let formType: string;

        if (input.auctionCarLot) {
          formType = "auction_car";
          const carResult = await turso.execute({
            sql: "SELECT make, model FROM cars WHERE lotNumber = ?",
            args: [input.auctionCarLot],
          });
          if (carResult.rows.length === 0) {
            throw new ActionError({
              code: "NOT_FOUND",
              message: "Автомобилът не е намерен",
            });
          }
          const car = carResult.rows[0];
          carMake = String(car.make);
          carModel = String(car.model);
        } else if (input.availableCarId) {
          formType = "available_car";
          carMake = input.carMake;
          carModel = input.carModel;
        } else {
          formType = "contact";
          carMake = undefined;
          carModel = undefined;
        }

        await turso.execute({
          sql: `
          INSERT INTO form_submissions (
            type,
            name,
            email,
            phone,
            message,
            auctionCarLot,
            availableCarId,
            carMake,
            carModel,
            sourceUrl
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
          args: [
            formType,
            input.name,
            input.email,
            input.phone ?? null,
            input.message ?? null,
            input.auctionCarLot ?? null,
            input.availableCarId ?? null,
            carMake ?? null,
            carModel ?? null,
            input.sourceUrl,
          ],
        });

        return {
          success: true,
          message: "Заявката е изпратена успешно! Ще се свържем с вас скоро.",
        };
      } catch (error) {
        console.error("❌ Грешка при обработка на заявка:", error);

        if (error instanceof ActionError) {
          throw error;
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "Възникна грешка при изпращане на заявката. Моля опитайте отново.",
        });
      }
    },
  }),
};
