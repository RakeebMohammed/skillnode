import { MongoClient, Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "popin";

if (!uri && process.env.NODE_ENV === "production") {
  throw new Error("MONGODB_URI is not set");
}

function createClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(uri);
  return client.connect();
}

// Reuse the connection across hot reloads in dev; one client per process in prod.
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ?? createClientPromise();

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}

// Call once at startup (or lazily on first use) to create indexes.
export async function ensureIndexes() {
  const db = await getDb();
  await db.collection("otps").createIndex({ email: 1, created_at: -1 });
  await db.collection("visits").createIndex({ created_at: -1 });
  await db.collection("visits").createIndex({ email: 1 });
  await db.collection("leads").createIndex({ created_at: -1 });
  await db.collection("admin_users").createIndex({ username: 1 }, { unique: true });
}
