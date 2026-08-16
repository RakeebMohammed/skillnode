"use client";

import { useMemo, useState } from "react";

type Visit = { email: string; ip: string | null; city: string | null; region: string | null; country: string | null; user_agent: string | null; createdAt: string };
type Lead = { email: string; name: string | null; phone: string | null; message: string | null; createdAt: string };

export default function DashboardClient({ admin, visits, leads }: { admin: string; visits: Visit[]; leads: Lead[] }) {
  const [tab, setTab] = useState<"visits" | "leads">("visits");
  const [query, setQuery] = useState("");
  const currentRows = tab === "visits" ? visits : leads;
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? currentRows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(term))) : currentRows;
  }, [query, currentRows]);
  const todayVisits = visits.filter((visit) => new Date(visit.createdAt).toDateString() === new Date().toDateString()).length;

  return <main className="dashboard-shell">
    <header className="dashboard-topbar"><div><p className="eyebrow">DANA / CONTROL ROOM</p><h1>Good to see you, {admin}.</h1><p className="subtle">A live view of verified visitors and new conversations.</p></div><form action="/api/admin/logout" method="post"><button className="logout-button">Log out</button></form></header>
    <section className="metric-grid"><Metric label="Total visits" value={visits.length} detail={`${todayVisits} today`} accent="violet" /><Metric label="New enquiries" value={leads.length} detail="Form submissions" accent="mint" /><Metric label="Conversion" value={visits.length ? `${Math.round((leads.length / visits.length) * 100)}%` : "--"} detail="Leads / verified visits" accent="orange" /></section>
    <section className="data-panel"><div className="data-panel-head"><div className="tab-group"><button className={tab === "visits" ? "tab active" : "tab"} onClick={() => setTab("visits")}>Visitors <span>{visits.length}</span></button><button className={tab === "leads" ? "tab active" : "tab"} onClick={() => setTab("leads")}>Leads <span>{leads.length}</span></button></div><input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${tab}...`} /></div><p className="results-note">Showing {filtered.length} of {currentRows.length} {tab}</p>{tab === "visits" ? <VisitorTable rows={filtered as Visit[]} /> : <LeadTable rows={filtered as Lead[]} />}</section>
  </main>;
}

function Metric({ label, value, detail, accent }: { label: string; value: string | number; detail: string; accent: string }) { return <article className={`metric-card ${accent}`}><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>; }
function VisitorTable({ rows }: { rows: Visit[] }) { return <Table headers={["Email", "Location", "IP address", "Browser", "Verified"]} rows={rows.map((v) => [v.email, [v.city, v.region, v.country].filter(Boolean).join(", ") || "Unknown", v.ip || "Unknown", browserName(v.user_agent), formatDate(v.createdAt)])} empty="No visitors match your search." />; }
function LeadTable({ rows }: { rows: Lead[] }) { return <Table headers={["Contact", "Phone", "Message", "Received"]} rows={rows.map((l) => [<span key={l.email}><b>{l.name || "Unnamed contact"}</b><small>{l.email}</small></span>, l.phone || "--", l.message || "No message", formatDate(l.createdAt)])} empty="No leads match your search." />; }
function Table({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) { return <div className="table-scroll"><table className="data-table"><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : <tr><td className="empty-cell" colSpan={headers.length}>{empty}</td></tr>}</tbody></table></div>; }
function formatDate(value: string) { return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
function browserName(userAgent: string | null) { if (!userAgent) return "Unknown"; if (userAgent.includes("Edg/")) return "Microsoft Edge"; if (userAgent.includes("Chrome/")) return "Google Chrome"; if (userAgent.includes("Firefox/")) return "Mozilla Firefox"; if (userAgent.includes("Safari/")) return "Safari"; return "Other browser"; }
