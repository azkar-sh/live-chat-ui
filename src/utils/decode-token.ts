export interface TokenPayload {
  sub?: string;
  username?: string;
  fullName?: string;
  email?: string;
}

/**
 * Decodes a JWT (with or without "Bearer " prefix) without verifying the
 * signature. Only used for reading non-sensitive claims like user id / name.
 */
export function decodeToken(token: string): TokenPayload {
  try {
    const clean = token
      .trim()
      .replace(/^Bearer\s+/i, "")
      .replace(/\s+/g, "");
    const parts = clean.split(".");
    // Standard JWT has 3 parts; pick the payload segment (index 1).
    // If only 2 parts exist (header.payload), pick index 0.
    const payload = parts.length >= 3 ? parts[1] : parts[0];
    if (!payload) return {};
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}
