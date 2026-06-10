"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfettiEffect from "./ConfettiEffect";
import { AvatarCircle } from "@/components/PlayerAvatar";
import type { Player } from "@/lib/players";
import { playCelebrationSound } from "@/lib/celebrationSound";

type Step = "crowning" | "form" | "otp";

interface SignupFormProps {
  winner: Player;
}

export default function SignupForm({ winner }: SignupFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("crowning");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Trigger celebration audio on mount
  useEffect(() => {
    const timer = setTimeout(() => playCelebrationSound(), 300);
    return () => clearTimeout(timer);
  }, []);

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, goatPick: winner.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If Resend blocked it (e.g. trial mode), the OTP is returned in devOtp
        if (data.devOtp) {
          setDevOtpHint(data.devOtp);
          setStep("otp");
        } else {
          throw new Error(data.error || "Failed to send OTP");
        }
      } else {
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
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid OTP");
      localStorage.setItem("bo_user", JSON.stringify({ email, name, goatPick: winner.id }));
      router.push("/leaderboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(212,175,55,0.3)",
    borderRadius: 14,
    color: "#fff",
    width: "100%",
    padding: "14px 16px",
    fontSize: 14,
    outline: "none",
  };

  // â”€â”€ CROWNING SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (step === "crowning") {
    return (
      <div className="flex flex-col items-center gap-6 text-center max-w-sm mx-auto">
        <ConfettiEffect />

        {/* Headline */}
        <div>
          <div className="text-4xl mb-2">ðŸ‘‘</div>
          <h2
            className="text-3xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg,#e8c86a,#D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            YOU HAVE FOUND
          </h2>
          <h2
            className="text-3xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg,#D4AF37,#C5A059)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            YOUR GOAT!
          </h2>
        </div>

        {/* Winner card */}
        <div
          className="avatar-spin-in flex flex-col items-center gap-4 w-full rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "2px solid #D4AF37",
            boxShadow: "0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.1)",
          }}
        >
          <AvatarCircle player={winner} size={120} />
          <div>
            <p className="text-white font-black text-2xl">{winner.name}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 2 }}>
              {winner.flag} {winner.country}
            </p>
          </div>
        </div>

        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
          Save your pick and see how the world voted!
        </p>

        <button
          onClick={() => setStep("form")}
          className="btn-gold w-full text-lg"
          style={{ padding: "14px 0", borderRadius: 50 }}
        >
          Save My Pick & Sign Up
        </button>
      </div>
    );
  }

  // â”€â”€ SIGNUP FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (step === "form") {
    return (
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <AvatarCircle player={winner} size={44} />
          <div className="text-left">
            <p className="font-black text-lg" style={{ color: "#D4AF37" }}>Create Account</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              Your GOAT: <span style={{ color: "#fff" }}>{winner.name}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.3)")}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.3)")}
          />
          <input
            type="tel"
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
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
            disabled={loading}
            className="btn-gold w-full"
            style={{ padding: "14px 0", borderRadius: 50, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Sending codeâ€¦" : "Send Verification Code â†’"}
          </button>
        </form>
      </div>
    );
  }

  // â”€â”€ OTP SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="w-full max-w-sm mx-auto text-center">
      <div className="text-4xl mb-4">ðŸ“§</div>
      <h2 className="text-2xl font-black mb-2" style={{ color: "#D4AF37" }}>Check Your Email</h2>
      <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-white">{email}</span>
      </p>

      {/* Dev hint â€” shown only when Resend trial blocks delivery */}
      {devOtpHint && (
        <div className="mb-4 rounded-xl p-3 text-left" style={{ background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.4)" }}>
          <p className="text-xs font-bold mb-1" style={{ color: "#D4AF37" }}>âš ï¸ Email not delivered (Resend trial mode)</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Your code for testing:</p>
          <p className="text-2xl font-black tracking-widest mt-1" style={{ color: "#D4AF37" }}>{devOtpHint}</p>
        </div>
      )}

      <form onSubmit={handleOTPSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          required
          style={{
            ...inputStyle,
            fontSize: 32, fontWeight: 900, letterSpacing: "1rem",
            textAlign: "center", padding: "16px",
            color: "#D4AF37", border: "2px solid rgba(212,175,55,0.3)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.3)")}
        />

        {error && (
          <p className="text-sm rounded-xl py-2" style={{ color: "#f87171", background: "rgba(239,68,68,0.1)" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="btn-gold w-full"
          style={{ padding: "14px 0", borderRadius: 50, opacity: loading || otp.length !== 6 ? 0.5 : 1 }}
        >
          {loading ? "Verifyingâ€¦" : "Verify & Enter Leaderboard"}
        </button>

        <button
          type="button"
          onClick={() => { setStep("form"); setError(""); setOtp(""); }}
          className="text-sm transition-colors"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
        >
          â† Change email address
        </button>
      </form>

      <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
        Valid for 10 minutes Â· Check your spam folder
      </p>
    </div>
  );
}


