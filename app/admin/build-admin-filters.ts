export type AdminFilters = {
  q: string;
  province: string;
  crew: string;
  eventType: string;
  startYear?: number;
  startYearFrom?: number;
  startYearTo?: number;
  includeDeleted: boolean;
};

function parseFilterValue(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

function parseProvince(value?: string) {
  const parsed = parseFilterValue(value);
  if (!parsed) return "";
  return /^[\p{L}\s]+$/u.test(parsed) ? parsed : "";
}

export function buildAdminFilters(params: Record<string, string | undefined>): AdminFilters {
  const startYearRaw = parseFilterValue(params.start_year);
  const startYearFromRaw = parseFilterValue(params.start_year_from);
  const startYearToRaw = parseFilterValue(params.start_year_to);
  const startYearRangeMatch = startYearRaw.match(/^(\d{4})\s*(?:-|\.\.)\s*(\d{4})$/);

  const parsedStartYear = /^\d{4}$/.test(startYearRaw) ? Number(startYearRaw) : undefined;
  const parsedStartYearFrom = /^\d{4}$/.test(startYearFromRaw)
    ? Number(startYearFromRaw)
    : startYearRangeMatch
      ? Number(startYearRangeMatch[1])
      : undefined;
  const parsedStartYearTo = /^\d{4}$/.test(startYearToRaw)
    ? Number(startYearToRaw)
    : startYearRangeMatch
      ? Number(startYearRangeMatch[2])
      : undefined;

  return {
    q: parseFilterValue(params.q).toLowerCase(),
    province: parseProvince(params.provincia),
    crew: parseFilterValue(params.crew),
    eventType: parseFilterValue(params.tipoEvento),
    startYear: parsedStartYear,
    startYearFrom: parsedStartYearFrom,
    startYearTo: parsedStartYearTo,
    includeDeleted: params.eliminados === "1"
  };
}
