"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "email" | "otp";

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/signin/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
          setStep("otp");
        } else {
          throw new Error(data.error || "Failed to send code");
        }
      } else {
        setUserName(data.name || "");
        setStep("otp");
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
      const res = await fetch("/api/signin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid code");
      localStorage.setItem("bo_user", JSON.stringify({
        email: data.email,
        name: data.name,
        goatPick: data.goatPick,
      }));
      router.push("/leaderboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all";
  const inputStyle = {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(212,175,55,0.25)",
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
          {step === "email" ? (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">&#x1F464;</div>
                <h1 className="text-2xl font-black text-white">Sign In</h1>
                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Enter your registered email to continue
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs mb-1.5 font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputCls}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.25)")}
                  />
                </div>

                {error && (
                  <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>
                    {error}
                    {error.includes("GOAT Challenge") && (
                      <div className="mt-2">
                        <Link href="/" className="font-bold underline" style={{ color: "#D4AF37" }}>
                          Take the GOAT Challenge &#x2192;
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full mt-1"
                  style={{ padding: "14px 0", opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? "Sending code&hellip;" : "Send Sign-In Code &#x2192;"}
                </button>
              </form>

              <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
                New here?{" "}
                <Link href="/" style={{ color: "#D4AF37" }}>
                  Take the GOAT Challenge to register
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">&#x2709;&#xFE0F;</div>
                <h1 className="text-2xl font-black text-white">
                  {userName ? `Welcome back, ${userName.split(" ")[0]}!` : "Check Your Email"}
                </h1>
                <p className="text-sm mt-2" style={{ color: "rgba(255,255,255,0.45)" }}>
                  We sent a 6-digit code to<br />
                  <span className="text-white font-semibold">{email}</span>
                </p>
              </div>

              {devOtpHint && (
                <div className="mb-4 rounded-xl p-3" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.4)" }}>
                  <p className="text-xs font-bold mb-1" style={{ color: "#D4AF37" }}>&#x26A0;&#xFE0F; Email blocked (Resend trial mode)</p>
                  <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>Use this code:</p>
                  <p className="text-2xl font-black tracking-widest" style={{ color: "#D4AF37" }}>{devOtpHint}</p>
                </div>
              )}

              <form onSubmit={handleOTPSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                  className="w-full px-4 py-4 text-center rounded-xl focus:outline-none"
                  style={{
                    fontSize: 32, fontWeight: 900, letterSpacing: "1rem",
                    background: "rgba(255,255,255,0.07)",
                    border: "2px solid rgba(212,175,55,0.3)",
                    color: "#D4AF37",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.3)")}
                />

                {error && (
                  <p className="text-sm text-center rounded-xl py-2" style={{ color: "#f87171", background: "rgba(239,68,68,0.1)" }}>
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="btn-gold w-full"
                  style={{ padding: "14px 0", opacity: loading || otp.length !== 6 ? 0.5 : 1 }}
                >
                  {loading ? "Signing in&hellip;" : "Sign In &#x2192;"}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(""); setOtp(""); setDevOtpHint(""); }}
                  className="text-sm transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)")}
                >
                  &#x2190; Change email
                </button>
              </form>

              <p className="text-xs text-center mt-4" style={{ color: "rgba(255,255,255,0.15)" }}>
                Code valid for 10 minutes &middot; Check spam folder
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-4">
          <Link href="/" className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            &#x2190; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
