interface SEOTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
}

interface ReplacementData {
  [key: string]: string | number | undefined | null;
}

export function generateMeta(
  data: ReplacementData,
  template: SEOTemplate
): { title: string; description: string } {
  let title = template.titleTemplate;
  let description = template.descriptionTemplate;

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    const replacement =
      value !== null && value !== undefined ? String(value) : "";

    title = title.replace(new RegExp(placeholder, "g"), replacement);
    description = description.replace(
      new RegExp(placeholder, "g"),
      replacement
    );
  });

  title = title.replace(/\s+/g, " ").trim();
  description = description.replace(/\s+/g, " ").trim();

  return {
    title,
    description,
  };
}

export function generateAvailableCarMeta<T extends Record<string, any>>(
  car: T,
  template: SEOTemplate,
  siteName: string
) {
  return generateMeta(
    {
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      odometer: car.odometer,
      transmission: car.transmission,
      fuelType: car.fuelType,
      horsepower: car.horsepower,
      driveType: car.driveType,
      siteName,
    },
    template
  );
}

export function generateAuctionCarMeta<T extends Record<string, any>>(
  car: T,
  template: SEOTemplate,
  siteName: string
) {
  return generateMeta(
    {
      heading: car.heading,
      fullName: car.fullName,
      make: car.make,
      model: car.model,
      manufactureYear: car.manufactureYear,
      odometerKm: car.odometerKm,
      fuelBulgarian: car.fuelBulgarian,
      movableConditionBulgarian: car.movableConditionBulgarian,
      primaryDamageBulgarian: car.primaryDamageBulgarian,
      siteName,
    },
    template
  );
}
