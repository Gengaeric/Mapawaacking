export type AdminFilters = {
  q: string;
  province: string;
  crew: string;
  eventType: string;
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

export function buildAdminFilters(params: Record<string, string | undefined>): AdminFilters {
  return {
    q: parseFilterValue(params.q).toLowerCase(),
    province: parseFilterValue(params.provincia),
    crew: parseFilterValue(params.crew),
    eventType: parseFilterValue(params.tipoEvento),
    includeDeleted: params.eliminados === "1"
  };
}
