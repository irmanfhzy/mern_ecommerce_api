import axios from "axios";
import AppError from "../utils/AppError.js";

const biteship = axios.create({
  baseURL: "https://api.biteship.com",
  headers: {
    Authorization: `Bearer ${process.env.BITESHIP_API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const searchAreas = async (query) => {
  try {
    const response = await biteship.get("/v1/maps/areas", {
      params: {
        input: query,
      },
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data;

    throw new AppError(data?.error || "Biteship area search failed", status);
  }
};

export const getShippingRates = async ({
  originPostalCode,
  destinationPostalCode,
  weight,
  couriers,
  value,
}) => {
  if (!originPostalCode || !destinationPostalCode) {
    throw new AppError(
      "originPostalCode and destinationPostalCode are required",
      400,
    );
  }

  if (!weight) {
    throw new AppError("weight is required", 400);
  }

  if (!couriers) {
    throw new AppError(
      'couriers is required (e.g. "jne" or "jne,jnt,sicepat")',
      400,
    );
  }

  if (!value) {
    throw new AppError("value (item declared value in IDR) is required", 400);
  }

  const originPC = Number(originPostalCode);
  const destinationPC = Number(destinationPostalCode);

  if (Number.isNaN(originPC) || Number.isNaN(destinationPC)) {
    throw new AppError("Postal codes must be valid numbers", 400);
  }

  // Cocokkan kode pos tujuan dengan data Biteship
  const areaResult = await searchAreas(destinationPC);

  const areas = areaResult?.areas || [];

  const matchedArea = areas.find((area) =>
    area.postal_code?.includes(destinationPC),
  );

  if (!matchedArea) {
    throw new AppError(
      "Destination postal code is not available in Biteship",
      400,
    );
  }

  try {
    const response = await biteship.post("/v1/rates/couriers", {
      origin_postal_code: originPC,
      destination_postal_code: destinationPC,
      couriers,
      items: [
        {
          name: "Package",
          weight,
          quantity: 1,
          value,
        },
      ],
    });

    return response.data;
  } catch (error) {
    const status = error.response?.status ?? 502;
    const data = error.response?.data;

    throw new AppError(data?.error || "Biteship rates request failed", status);
  }
};
