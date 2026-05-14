"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/authStore";

export default function EmailStep() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    // TODO: Firebase — signInWithEmailAndPassword buraya gelecek
    setTimeout(() => {
      login("", email);
      router.push("/");
    }, 800);
  }

  function openForgot() {
    setForgotEmail("");
    setForgotSent(false);
    setForgotOpen(true);
  }

  function handleForgotSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    // TODO: Firebase — sendPasswordResetEmail buraya gelecek
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSent(true);
    }, 800);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* E-posta */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="em-email" className="text-sm font-medium text-foreground">
            E-posta
          </label>
          <Input
            id="em-email"
            type="email"
            placeholder="ornek@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-border bg-background text-sm"
            required
          />
        </div>

        {/* Şifre */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="em-password" className="text-sm font-medium text-foreground">
            Şifre
          </label>
          <div className="relative">
            <Input
              id="em-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
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
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Şifremi Unuttum linki */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={openForgot}
            className="text-xs text-primary underline-offset-4 hover:underline"
          >
            Şifremi Unuttum
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
        </Button>
      </form>

      {/* ── Şifremi Unuttum Modal ── */}
      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setForgotOpen(false);
          }}
        >
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300 relative w-full max-w-sm rounded-2xl bg-white px-8 py-8 shadow-[0_8px_40px_rgba(0,0,0,0.14)]">
            {/* Kapat butonu */}
            <button
              type="button"
              onClick={() => setForgotOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                Şifremi Unuttum
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                E-posta adresinize şifre sıfırlama bağlantısı gönderilecek.
              </p>
            </div>

            {forgotSent ? (
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 px-4 py-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <p className="text-sm text-emerald-700">
                  Sıfırlama bağlantısı{" "}
                  <strong className="font-medium">{forgotEmail}</strong>{" "}
                  adresine gönderildi. Gelen kutunuzu kontrol edin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="text-sm font-medium text-foreground"
                  >
                    E-posta
                  </label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="rounded-xl border-border bg-background text-sm"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={forgotLoading || !forgotEmail}
                  className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                >
                  {forgotLoading
                    ? "Gönderiliyor…"
                    : "Sıfırlama Bağlantısı Gönder"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
