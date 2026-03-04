import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

type Primitive = string | number | boolean;

type OrderOptions = {
  ascending?: boolean;
  nullsFirst?: boolean;
};

function encodeFilterValue(value: Primitive) {
  return encodeURIComponent(String(value));
}

class RestQueryBuilder<T> {
  private readonly table: string;
  private readonly params = new URLSearchParams();

  constructor(table: string) {
    this.table = table;
  }

  select(columns = "*") {
    this.params.set("select", columns);
    return this;
  }

  eq(column: string, value: Primitive) {
    this.params.append(column, `eq.${encodeFilterValue(value)}`);
    return this;
  }

  in(column: string, values: Primitive[]) {
    if (!values.length) return this;
    const encodedValues = values.map((value) => encodeFilterValue(value)).join(",");
    this.params.set(column, `in.(${encodedValues})`);
    return this;
  }

  ilike(column: string, value: string) {
    this.params.append(column, `ilike.${encodeFilterValue(value)}`);
    return this;
  }

  gte(column: string, value: Primitive) {
    this.params.append(column, `gte.${encodeFilterValue(value)}`);
    return this;
  }

  lte(column: string, value: Primitive) {
    this.params.append(column, `lte.${encodeFilterValue(value)}`);
    return this;
  }

  order(column: string, options?: OrderOptions) {
    const direction = options?.ascending === false ? "desc" : "asc";
    const nulls = options?.nullsFirst ? "nullsfirst" : "nullslast";
    this.params.set("order", `${column}.${direction}.${nulls}`);
    return this;
  }

  range(from: number, to: number) {
    this.params.set("offset", String(from));
    this.params.set("limit", String(to - from + 1));
    return this;
  }

  async execute() {
    const query = this.params.toString();
    const response = await fetch(`${getSupabaseUrl()}/rest/v1/${this.table}?${query}`, {
      method: "GET",
      headers: {
        apikey: getSupabaseServiceRoleKey(),
        Authorization: `Bearer ${getSupabaseServiceRoleKey()}`,
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as
        | { message?: string; code?: string; details?: string; hint?: string }
        | null;

      const error = new Error(payload?.message ?? `Error al leer ${this.table}`) as Error & {
        status: number;
        code?: string;
        details?: string;
        hint?: string;
      };

      error.name = "SupabaseQueryError";
      error.status = response.status;
      error.code = payload?.code;
      error.details = payload?.details;
      error.hint = payload?.hint;
      throw error;
    }

    return (await response.json()) as T[];
  }
}

export function fromTable<T>(table: string) {
  return new RestQueryBuilder<T>(table);
}
