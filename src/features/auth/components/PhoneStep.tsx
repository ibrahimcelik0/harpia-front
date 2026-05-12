"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhoneStepProps {
  onSend: (phone: string) => void;
}

export default function PhoneStep({ onSend }: PhoneStepProps) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setLoading(true);
    // TODO: Firebase — sendSmsCode(phone) çağrısı buraya gelecek
    setTimeout(() => {
      setLoading(false);
      onSend(phone);
    }, 800); // Simülasyon gecikmesi
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Telefon Numaranız
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+90 5__ ___ __ __"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-xl border-border bg-background text-sm"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !phone.trim()}
        className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Gönderiliyor…" : "SMS Kodu Gönder"}
      </Button>
    </form>
  );
}
