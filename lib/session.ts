import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "";

if (!SECRET && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET is not set");
}

function sign(payloadB64: string) {
  return crypto.createHmac("sha256", SECRET).update(payloadB64).digest("hex");
}

export function encodeSession(payload: Record<string, any>, ttlSeconds: number) {
  const body = { ...payload, exp: Date.now() + ttlSeconds * 1000 };
  const payloadB64 = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function decodeSession<T = any>(token: string | undefined | null): T | null {
  if (!token) return null;
  const [payloadB64, sig] = token.split(".");
  if (!payloadB64 || !sig) return null;

  const expectedSig = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const body = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
    if (typeof body.exp !== "number" || Date.now() > body.exp) return null;
    return body as T;
  } catch {
    return null;
  }
}
