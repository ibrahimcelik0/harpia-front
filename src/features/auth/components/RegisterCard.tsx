"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/features/auth/store/authStore";

// ─────────────────────────────────────────────
// Adım 1 — Kayıt formu
// ─────────────────────────────────────────────
interface FormStepProps {
  onSendCode: (data: { email: string; phone: string; password: string }) => void;
}

function FormStep({ onSendCode }: FormStepProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = confirm === "" || password === confirm;
  const canSubmit =
    !loading && !!email && !!phone.trim() && !!password && !!confirm && passwordsMatch;

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    setLoading(true);
    // TODO: Firebase — createUserWithEmailAndPassword + sendSmsCode(phone) buraya gelecek
    setTimeout(() => {
      setLoading(false);
      onSendCode({ email, phone, password });
    }, 800); // Simülasyon: SMS gönderildi
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* E-posta */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-email" className="text-sm font-medium text-foreground">
          E-posta
        </label>
        <Input
          id="reg-email"
          type="email"
          placeholder="ornek@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-border bg-background text-sm"
          required
        />
      </div>

      {/* Telefon */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-phone" className="text-sm font-medium text-foreground">
          Telefon Numarası
        </label>
        <Input
          id="reg-phone"
          type="tel"
          placeholder="+90 5__ ___ __ __"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/[^\d+\s\-().]/g, ""))}
          className="rounded-xl border-border bg-background text-sm"
          required
        />
      </div>

      {/* Şifre */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-password" className="text-sm font-medium text-foreground">
          Şifre
        </label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            placeholder="En az 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border-border bg-background pr-10 text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Şifre Tekrar */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="reg-confirm" className="text-sm font-medium text-foreground">
          Şifre Tekrar
        </label>
        <div className="relative">
          <Input
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="Şifrenizi tekrar girin"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cn(
              "rounded-xl border-border bg-background pr-10 text-sm",
              !passwordsMatch && "border-red-400 focus-visible:ring-red-400"
            )}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showConfirm ? "Şifreyi gizle" : "Şifreyi göster"}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {!passwordsMatch && (
          <p className="text-xs text-red-500">Şifreler eşleşmiyor.</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "SMS kodu gönderiliyor…" : "Devam Et"}
      </Button>
    </form>
  );
}

// ─────────────────────────────────────────────
// Adım 2 — SMS doğrulama
// ─────────────────────────────────────────────
const RESEND_DELAY = 60;

interface OtpStepProps {
  phone: string;
  email: string;
  onBack: () => void;
}

function RegisterOtpStep({ phone, email, onBack }: OtpStepProps) {
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
    // TODO: Firebase — confirmCode(otp) ile telefon doğrulaması + hesap kaydı buraya gelecek
    setTimeout(() => {
      login(phone, email);
      router.push("/");
    }, 800); // Simülasyon: doğrulama başarılı, hesap oluşturuldu
  }

  function handleResend() {
    setResendLoading(true);
    setOtp("");
    // TODO: Firebase — sendSmsCode(phone) tekrar çağrısı
    setTimeout(() => {
      setResendLoading(false);
      setCountdown(RESEND_DELAY);
    }, 800); // Simülasyon: SMS tekrar gönderildi
  }

  return (
    <form onSubmit={handleConfirm} className="flex flex-col gap-6">
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

      <Button
        type="submit"
        disabled={otp.length !== 6 || loading}
        className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Hesap oluşturuluyor…" : "Doğrula ve Kayıt Ol"}
      </Button>

      <div className="flex flex-col items-center gap-3">
        {/* Geri sayımlı SMS gönder */}
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

        {/* Forma geri dön */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Bilgileri düzenle
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────
// Ana kart — adım yönetimi
// ─────────────────────────────────────────────
type RegisterStep = "form" | "otp";

export default function RegisterCard() {
  const [step, setStep] = useState<RegisterStep>("form");
  const [formData, setFormData] = useState({ email: "", phone: "", password: "" });

  function handleSendCode(data: { email: string; phone: string; password: string }) {
    setFormData(data);
    setStep("otp");
  }

  const subtitle =
    step === "form"
      ? "Harpia'ya üye olun, artırmalara katılın."
      : `${formData.phone} numarasına gönderilen 6 haneli kodu girin.`;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">
          {step === "form" ? "Kayıt Ol" : "Telefonunuzu Doğrulayın"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {step === "form" ? (
        <FormStep onSendCode={handleSendCode} />
      ) : (
        <RegisterOtpStep
          phone={formData.phone}
          email={formData.email}
          onBack={() => setStep("form")}
        />
      )}

      {/* Giriş Yap linki — sadece form adımında */}
      {step === "form" && (
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten hesabın var mı?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Giriş Yap
          </Link>
        </p>
      )}
    </div>
  );
}
