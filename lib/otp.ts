import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getDb } from "./db";

const OTP_TTL_MINUTES = 10;
const MAX_REQUESTS_PER_WINDOW = 5; // per email, per RATE_WINDOW_MINUTES
const RATE_WINDOW_MINUTES = 15;
const MAX_VERIFY_ATTEMPTS = 5;

interface OtpDoc {
  email: string;
  otp_hash: string;
  expires_at: Date;
  attempts: number;
  consumed: boolean;
  created_at: Date;
}

export function generateOtp(): string {
  // 6-digit numeric code, zero-padded, cryptographically random
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, "0");
}

export async function isRateLimited(email: string): Promise<boolean> {
  const db = await getDb();
  const windowStart = new Date(Date.now() - RATE_WINDOW_MINUTES * 60 * 1000);
  const count = await db
    .collection<OtpDoc>("otps")
    .countDocuments({ email, created_at: { $gt: windowStart } });
  return count >= MAX_REQUESTS_PER_WINDOW;
}

export async function createOtp(email: string): Promise<string> {
  const db = await getDb();
  const otp = generateOtp();
  const hash = await bcrypt.hash(otp, 10);

  await db.collection<OtpDoc>("otps").insertOne({
    email,
    otp_hash: hash,
    expires_at: new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000),
    attempts: 0,
    consumed: false,
    created_at: new Date(),
  });

  return otp;
}

export async function verifyOtp(
  email: string,
  candidate: string
): Promise<{ ok: boolean; reason?: string }> {
  const db = await getDb();
  const collection = db.collection<OtpDoc>("otps");

  const row = await collection.findOne(
    { email },
    { sort: { created_at: -1 } }
  );
  console.log(row);
  

  if (!row) return { ok: false, reason: "No OTP requested for this email." };
  if (row.consumed) return { ok: false, reason: "This code was already used. Request a new one." };
  if (row.expires_at.getTime() < Date.now())
    return { ok: false, reason: "This code has expired. Request a new one." };
  if (row.attempts >= MAX_VERIFY_ATTEMPTS) {
    await collection.updateOne({ _id: row._id }, { $set: { consumed: true } });
    return { ok: false, reason: "Too many incorrect attempts. Request a new code." };
  }

  const match = await bcrypt.compare(candidate, row.otp_hash);

  if (!match) {
    await collection.updateOne({ _id: row._id }, { $inc: { attempts: 1 } });
    return { ok: false, reason: "Incorrect code." };
  }

  await collection.updateOne({ _id: row._id }, { $set: { consumed: true } });
  return { ok: true };
}
