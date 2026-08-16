import bcrypt from "bcryptjs";
import { getDb } from "./db";

interface AdminUserDoc {
  username: string;
  password_hash: string;
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const db = await getDb();
  const admin = await db.collection<AdminUserDoc>("admin_users").findOne({ username });
  if (!admin) return false;
  return bcrypt.compare(password, admin.password_hash);
}
