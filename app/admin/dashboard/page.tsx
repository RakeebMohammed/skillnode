import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession } from "@/lib/session";
import { getDb } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

interface Visit { email: string; ip: string | null; city: string | null; region: string | null; country: string | null; user_agent: string | null; verified_at?: Date; created_at: Date; }
interface Lead { email: string; name: string | null; phone: string | null; message: string | null; created_at: Date; }

export default async function AdminDashboard() {
  const session = decodeSession<{ admin: string }>(cookies().get("admin_session")?.value);
  if (!session) redirect("/admin/login");

  const db = await getDb();
  const [visits, leads] = await Promise.all([
    db.collection<Visit>("visits").find({}).sort({ created_at: -1 }).limit(200).toArray(),
    db.collection<Lead>("leads").find({}).sort({ created_at: -1 }).limit(200).toArray(),
  ]);

 return (
  <DashboardClient
    admin={session.admin}
    visits={visits.map((v) => ({
      email: v.email,
      ip: v.ip ?? null,
      city: v.city ?? null,
      region: v.region ?? null,
      country: v.country ?? null,
      user_agent: v.user_agent ?? null,
      createdAt: (v.verified_at ?? v.created_at).toISOString(),
    }))}
    leads={leads.map((l) => ({
      email: l.email,
      name: l.name ?? null,
      phone: l.phone ?? null,
      message: l.message ?? null,
      createdAt: l.created_at.toISOString(),
    }))}
  />
);
}
