"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import PhoneStep from "./PhoneStep";
import OtpStep from "./OtpStep";
import EmailStep from "./EmailStep";

type LoginTab = "phone" | "email";
type PhoneFlowStep = "phone" | "otp";

export default function LoginCard() {
  const [tab, setTab] = useState<LoginTab>("phone");
  const [phoneStep, setPhoneStep] = useState<PhoneFlowStep>("phone");
  const [phone, setPhone] = useState("");

  function handleSendCode(phoneNumber: string) {
    setPhone(phoneNumber);
    setPhoneStep("otp");
  }

  function handleTabChange(next: LoginTab) {
    setTab(next);
    setPhoneStep("phone");
  }

  const subtitle =
    tab === "email"
      ? "E-posta ve şifrenizle giriş yapın."
      : phoneStep === "phone"
      ? "Telefon numaranıza doğrulama kodu göndereceğiz."
      : `${phone} numarasına gönderilen 6 haneli kodu girin.`;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      {/* Başlık */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Giriş Yap</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Sekmeler — OTP adımında gizle */}
      {phoneStep !== "otp" && (
        <div className="mb-6 flex rounded-xl bg-muted p-1">
          {(["phone", "email"] as LoginTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200",
                tab === t
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "phone" ? "Telefon ile Giriş" : "E-posta ile Giriş"}
            </button>
          ))}
        </div>
      )}

      {/* İçerik */}
      {tab === "phone" ? (
        phoneStep === "phone" ? (
          <PhoneStep onSend={handleSendCode} />
        ) : (
          <OtpStep phone={phone} onBack={() => setPhoneStep("phone")} />
        )
      ) : (
        <EmailStep />
      )}

      {/* Kayıt Ol linki */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Hesabın yok mu?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}
