"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthShell } from "@/app/components/AuthShell";
import ThemeToggle from "@/app/ThemeToggle";

export function VerifyForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") || "";
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otp = digits.join("");

  function setOtpDigits(startIndex: number, value: string) {
    const entered = value.replace(/\D/g, "").slice(0, 6 - startIndex);
    const next = [...digits];
    if (!entered) next[startIndex] = "";
    else entered.split("").forEach((digit, offset) => { next[startIndex + offset] = digit; });
    setDigits(next);
    const nextIndex = Math.min(startIndex + Math.max(entered.length, 1), 5);
    if (entered) inputRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push("/");
    } catch {
      setError("Unable to verify the code. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ThemeToggle />
      <AuthShell
        eyebrow="STEP 2 OF 2"
        title={<>Check your<br />inbox.</>}
        text={`We sent a six-digit code to ${email || "your email address"}.`}
      >
        <form onSubmit={handleSubmit} className="auth-form">
        <fieldset className="otp-fieldset">
          <legend>Verification code</legend>
          <div className="otp-group">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { inputRefs.current[index] = element; }}
                className="otp-box"
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={6}
                required
                aria-label={`Digit ${index + 1}`}
                value={digit}
                onChange={(e) => setOtpDigits(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  setOtpDigits(0, e.clipboardData.getData("text"));
                }}
              />
            ))}
          </div>
        </fieldset>
        {error && <p className="auth-error">{error}</p>}
        <button disabled={loading || otp.length !== 6} type="submit">
          {loading ? "Verifying..." : "Unlock experience"}
          <span>→</span>
        </button>
        <button
          type="button"
          className="auth-back"
          onClick={() => router.push("/gate")}
        >
          Use a different email
        </button>
      </form>
    </AuthShell>
    </>
  );
}
