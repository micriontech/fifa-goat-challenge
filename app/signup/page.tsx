"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "form" | "otp";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, goatPick: "" }),
      });
      let data: Record<string, string> = {};
      try { data = await res.json(); } catch { /* empty body */ }
      if (res.ok) {
        setStep("otp");
      } else if (data.devOtp) {
        setDevOtpHint(data.devOtp);
        setStep("otp");
      } else {
        throw new Error(data.error || "Failed to send OTP");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleOTPSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      let data: Record<string, string> = {};
      try { data = await res.json(); } catch { /* empty body */ }
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      localStorage.setItem("bo_user", JSON.stringify({ email, name, goatPick: "" }));
      router.push("/leaderboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-colors text-sm";
  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(212,175,55,0.25)",
    outline: "none",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-2xl font-black tracking-tight">
              <span style={{ color: "#fff" }}>FIFA</span>
              <span style={{ color: "#D4AF37" }}>WC</span>
              <span style={{ color: "#fff" }}>PREDICT</span>
            </span>
          </Link>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>FIFA 2026 World Cup</p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          {step === "form" ? (
            <>
              <h1 className="text-2xl font-black text-white text-center mb-1">Create Account</h1>
              <p className="text-center mb-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Join the GOAT debate and track FIFA 2026
              </p>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs mb-1.5 font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Full Name</label>
                  <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required
                    className={inputCls} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.25)")} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>Email Address</label>
                  <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className={inputCls} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.25)")} />
                </div>
                <div>
                  <label className="block text-xs mb-1.5 font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Phone <span style={{ color: "rgba(255,255,255,0.2)" }}>(optional)</span>
                  </label>
                  <input type="tel" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className={inputCls} style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.25)")} />
                </div>

                {error && (
                  <p className="text-sm text-center rounded-xl py-2 px-3" style={{ color: "#f87171", background: "rgba(239,68,68,0.1)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="btn-gold w-full mt-1"
                  style={{ padding: "14px 0", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Sending code…" : "Send Verification Code →"}
                </button>
              </form>

              <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
                Already have an account?{" "}
                <Link href="/leaderboard" style={{ color: "#D4AF37" }}>View Leaderboard</Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">&#x2709;&#xFE0F;</div>
                <h1 className="text-2xl font-black text-white">Check Your Email</h1>
                <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                  We sent a 6-digit code to<br />
                  <span className="text-white font-semibold">{email}</span>
                </p>
              </div>

              {devOtpHint && (
                <div className="mb-4 rounded-xl p-3" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.4)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "#D4AF37" }}>&#x26A0;&#xFE0F; Email blocked (Resend trial mode)</p>
                  <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Use this code to continue:</p>
                  <p className="text-2xl font-black tracking-widest" style={{ color: "#D4AF37" }}>{devOtpHint}</p>
                </div>
              )}

              <form onSubmit={handleOTPSubmit} className="flex flex-col gap-4">
                <input type="text" inputMode="numeric" maxLength={6} placeholder="000000" value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required
                  className="w-full px-4 py-4 text-center rounded-xl focus:outline-none transition-colors"
                  style={{ fontSize: 32, fontWeight: 900, letterSpacing: "1rem", background: "rgba(255,255,255,0.07)", border: "2px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.3)")} />

                {error && (
                  <p className="text-sm text-center rounded-xl py-2" style={{ color: "#f87171", background: "rgba(239,68,68,0.1)" }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading || otp.length !== 6} className="btn-gold w-full"
                  style={{ padding: "14px 0", opacity: loading || otp.length !== 6 ? 0.5 : 1 }}>
                  {loading ? "Verifying…" : "Verify & Enter →"}
                </button>

                <button type="button" onClick={() => { setStep("form"); setError(""); setOtp(""); setDevOtpHint(""); }}
                  className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}>
                  &#x2190; Change email address
                </button>
              </form>

              <p className="text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.15)" }}>
                Code valid for 10 minutes &middot; Check spam folder
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm transition-colors" style={{ color: "rgba(255,255,255,0.25)" }}>
            &#x2190; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
