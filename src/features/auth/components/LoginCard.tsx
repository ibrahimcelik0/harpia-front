"use client";

import { useState } from "react";
import PhoneStep from "./PhoneStep";
import OtpStep from "./OtpStep";

export type AuthStep = "phone" | "otp";

export default function LoginCard() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");

  // TODO: Firebase Phone Auth — sendSmsCode(phone) buraya bağlanacak
  function handleSendCode(phoneNumber: string) {
    setPhone(phoneNumber);
    setStep("otp");
  }

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground">Giriş Yap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {step === "phone"
            ? "Telefon numaranıza doğrulama kodu göndereceğiz."
            : `${phone} numarasına gönderilen 6 haneli kodu girin.`}
        </p>
      </div>

      {step === "phone" ? (
        <PhoneStep onSend={handleSendCode} />
      ) : (
        <OtpStep phone={phone} onBack={() => setStep("phone")} />
      )}
    </div>
  );
}
