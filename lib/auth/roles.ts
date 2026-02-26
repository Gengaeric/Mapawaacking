export type UserRole = "usuario" | "moderador" | "admin";

function parseAdminEmails(): Set<string> {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function resolveUserRole(email: string | undefined, appMetadataRole: unknown): UserRole {
  if (typeof appMetadataRole === "string") {
    if (appMetadataRole === "admin" || appMetadataRole === "moderador") {
      return appMetadataRole;
    }
  }

  if (email && parseAdminEmails().has(email.toLowerCase())) {
    return "admin";
  }

  return "usuario";
}

export function canAccessAdmin(role: UserRole): boolean {
  return role === "admin" || role === "moderador";
}
