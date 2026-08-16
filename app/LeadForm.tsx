"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const EXPERIENCE = ["0-1 Year", "2-5 Years", "5+ Years"] as const;

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    experience: "" as (typeof EXPERIENCE)[number] | "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("done");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginTop: 8, fontSize: 16, opacity: 0.85 }}
      >
        Thanks — you're on the list. We'll be in touch. 🤝
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={inputStyle}
      />

      <input
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        style={inputStyle}
      />

      <ChipGroup
        label="Experience"
        options={EXPERIENCE}
        value={form.experience}
        onChange={(v) => setForm({ ...form, experience: v })}
      />

      <textarea
        placeholder="Anything you'd like us to know? (optional)"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
      />

      {error && <p style={{ color: "#c83d3d", fontSize: 14, margin: 0 }}>{error}</p>}

      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        disabled={status === "loading" || !form.phone.trim() || !form.experience}
        type="submit"
        style={{ ...buttonStyle, opacity: status === "loading" || !form.phone.trim() || !form.experience ? 0.6 : 1 }}
      >
        {status === "loading" ? "Submitting..." : "Submit"}
      </motion.button>

      <p style={{ fontSize: 13, opacity: 0.55, margin: 0, textAlign: "center" }}>
        Early birds get priority visibility 🤝✨
      </p>
    </form>
  );
}

function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | "";
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <p style={{ fontSize: 13, opacity: 0.6, margin: "0 0 8px" }}>{label}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <motion.button
              key={opt}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(opt)}
              style={{
                padding: "9px 16px",
                borderRadius: 999,
                border: active ? "1px solid var(--landing-accent)" : "1px solid var(--landing-border)",
                background: active ? "var(--landing-accent)" : "var(--landing-input)",
                color: active ? "#1d100a" : "var(--landing-text)",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "13px 16px",
  borderRadius: 10,
  border: "1px solid var(--landing-border)",
  background: "var(--landing-input)",
  color: "var(--landing-text)",
  fontSize: 15,
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: 10,
  border: "none",
  background: "var(--landing-accent)",
  color: "#1d100a",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
};
