/**
 * Usage:
 *   npm run create-admin -- myusername mypassword
 *
 * Requires MONGODB_URI (and optionally MONGODB_DB) to be set in your
 * environment before running this.
 */
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

async function main() {
  const [, , username, password] = process.argv;
  if (!username || !password) {
    console.error("Usage: npm run create-admin -- <username> <password>");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "popin");

  const hash = await bcrypt.hash(password, 10);

  await db.collection("admin_users").updateOne(
    { username },
    { $set: { username, password_hash: hash } },
    { upsert: true }
  );

  await db.collection("admin_users").createIndex({ username: 1 }, { unique: true });
  await db.collection("otps").createIndex({ email: 1, created_at: -1 });
  await db.collection("visits").createIndex({ created_at: -1 });
  await db.collection("visits").createIndex({ email: 1 });
  await db.collection("leads").createIndex({ created_at: -1 });

  console.log(`Admin user "${username}" created/updated.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
