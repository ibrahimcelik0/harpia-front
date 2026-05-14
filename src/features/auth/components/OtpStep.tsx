"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/features/auth/store/authStore";

interface OtpStepProps {
  phone: string;
  onBack: () => void;
}

const RESEND_DELAY = 60;

export default function OtpStep({ phone, onBack }: OtpStepProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const [resendLoading, setResendLoading] = useState(false);

  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  function handleConfirm(e: React.SyntheticEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    // TODO: Firebase — confirmCode(otp) çağrısı buraya gelecek
    setTimeout(() => {
      login(phone);
      router.push("/");
    }, 800);
  }

  function handleResend() {
    setResendLoading(true);
    setOtp("");
    // TODO: Firebase — sendSmsCode(phone) tekrar çağrısı
    setTimeout(() => {
      setResendLoading(false);
      setCountdown(RESEND_DELAY);
    }, 800);
  }

  return (
    <form onSubmit={handleConfirm} className="flex flex-col gap-6">
      {/* OTP input */}
      <div className="flex flex-col items-center gap-4">
        <InputOTP maxLength={6} value={otp} onChange={setOtp} className="gap-2">
          <InputOTPGroup className="gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-12 w-12 rounded-xl border-border text-base"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Onayla butonu */}
      <Button
        type="submit"
        disabled={otp.length !== 6 || loading}
        className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Doğrulanıyor…" : "Onayla ve Giriş Yap"}
      </Button>

      {/* Tekrar SMS Gönder */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resendLoading}
          className={cn(
            "text-sm transition-colors",
            countdown > 0 || resendLoading
              ? "cursor-not-allowed text-muted-foreground"
              : "font-medium text-primary underline-offset-4 hover:underline"
          )}
        >
          {resendLoading
            ? "Gönderiliyor…"
            : countdown > 0
            ? `Tekrar SMS Gönder (${countdown}s)`
            : "Tekrar SMS Gönder"}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Farklı numara kullan
        </button>
      </div>
    </form>
  );
}
