import "server-only";
import { getGeocodeCacheByQuery, upsertGeocodeCache } from "@/lib/data";
import type { Json } from "@/lib/supabase/db";

const COUNTRY = "Argentina";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const MIN_REQUEST_GAP_MS = 1000;

let lastGeocodeRequestAt = 0;

export function normalizeLocation(city: string, province: string) {
  const cityValue = city.trim().replace(/\s+/g, " ");
  const provinceValue = province.trim().replace(/\s+/g, " ");
  return `${cityValue}, ${provinceValue}, ${COUNTRY}`;
}

async function waitForRateLimit() {
  const now = Date.now();
  const waitMs = lastGeocodeRequestAt + MIN_REQUEST_GAP_MS - now;
  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  lastGeocodeRequestAt = Date.now();
}

export async function geocodeLocation(city: string, province: string) {
  const normalizedCity = city.trim();
  const normalizedProvince = province.trim();
  if (!normalizedCity || !normalizedProvince) return null;

  const query = normalizeLocation(normalizedCity, normalizedProvince);
  const cached = await getGeocodeCacheByQuery(query);
  if (cached) {
    return { lat: cached.lat, lng: cached.lng, raw: cached.raw };
  }

  await waitForRateLimit();

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "1",
    countrycodes: "ar",
    addressdetails: "1"
  });

  const userAgent = process.env.GEOCODER_USER_AGENT ?? "Mapawaacking/1.0 (contacto@mapawaacking.local)";

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": userAgent,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      console.error("[geocode] Nominatim error", response.status, await response.text());
      return null;
    }

    const results = (await response.json()) as Array<{ lat: string; lon: string } & Record<string, unknown>>;
    const first = results[0];
    if (!first) return null;

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    await upsertGeocodeCache({
      query,
      city: normalizedCity,
      province: normalizedProvince,
      country: COUNTRY,
      lat,
      lng,
      raw: first as Json
    });

    return { lat, lng, raw: first };
  } catch (error) {
    console.error("[geocode] unexpected error", error);
    return null;
  }
}
