"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function OtpStep({ phone, onBack }: OtpStepProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    // TODO: Firebase — confirmCode(otp) çağrısı buraya gelecek
    setTimeout(() => {
      login(phone);
      router.push("/");
    }, 800); // Simülasyon gecikmesi
  }

  return (
    <form onSubmit={handleConfirm} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          className="gap-2"
        >
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={0} className="h-12 w-12 rounded-xl border-border text-base" />
            <InputOTPSlot index={1} className="h-12 w-12 rounded-xl border-border text-base" />
            <InputOTPSlot index={2} className="h-12 w-12 rounded-xl border-border text-base" />
            <InputOTPSlot index={3} className="h-12 w-12 rounded-xl border-border text-base" />
            <InputOTPSlot index={4} className="h-12 w-12 rounded-xl border-border text-base" />
            <InputOTPSlot index={5} className="h-12 w-12 rounded-xl border-border text-base" />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        type="submit"
        disabled={otp.length !== 6 || loading}
        className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Doğrulanıyor…" : "Onayla ve Giriş Yap"}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Farklı numara kullan
      </button>
    </form>
  );
}
