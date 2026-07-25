import crypto from "node:crypto";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h, cf. SECURITY.md section 1

export function generateResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  return { rawToken, hashedToken, expiresAt };
}

export function hashToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
