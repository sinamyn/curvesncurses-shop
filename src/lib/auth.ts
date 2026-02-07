import bcrypt from "bcryptjs";
import crypto from "crypto";
import { env } from "./env";

export function hashPassword(pw: string) { return bcrypt.hashSync(pw, 10); }
export function verifyPassword(pw: string, hash: string) { return bcrypt.compareSync(pw, hash); }

export function signSession(payload: object) {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const sig = crypto.createHmac("sha256", env.authSecret).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}
export function verifySession(token?: string): any | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const expected = crypto.createHmac("sha256", env.authSecret).update(b64).digest("base64url");
  if (expected !== sig) return null;
  try { return JSON.parse(Buffer.from(b64, "base64url").toString("utf-8")); } catch { return null; }
}
