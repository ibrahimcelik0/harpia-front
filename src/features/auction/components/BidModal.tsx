"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuctionStore } from "../store/auctionStore";
import { useNotificationStore } from "../store/notificationStore";
import type { Product } from "../data/mockProducts";

type BidStep = "amount" | "otp";

interface BidModalProps {
  product: Product;
  currentBid: number;
  open: boolean;
  onClose: () => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function BidModal({ product, currentBid, open, onClose }: BidModalProps) {
  const [step, setStep] = useState<BidStep>("amount");
  const [rawValue, setRawValue] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const placeBid = useAuctionStore((s) => s.placeBid);
  const addNotification = useNotificationStore((s) => s.addNotification);

  /* ── Adım 1: Tutar doğrulama ── */
  function handleAmountConfirm() {
    const amount = Number(rawValue);
    if (!amount || amount <= currentBid) {
      setError("Mevcut fiyattan daha yüksek bir teklif vermelisiniz.");
      return;
    }
    setError("");
    setStep("otp");
  }

  /* ── Adım 2: OTP onayı ── */
  function handleOtpConfirm() {
    if (otp.length !== 6) return;
    setLoading(true);
    // TODO: Firebase — confirmCode(otp) çağrısı buraya gelecek
    setTimeout(() => {
      const amount = Number(rawValue);
      placeBid(product.id, amount);
      toast.success("Teklifiniz başarıyla alındı!", {
        description: `${product.name} için ${formatCurrency(amount)} teklifiniz onaylandı.`,
      });
      handleClose();

      // Simülasyon: 10-15 sn sonra teklif geçildi bildirimi
      const delay = 10_000 + Math.random() * 5_000;
      setTimeout(() => {
        addNotification({ productId: product.id, productName: product.name, type: "outbid" });
        toast.error(`Teklifiniz geçildi!`, {
          description: `${product.name} için daha yüksek bir teklif verildi.`,
        });
      }, delay);
    }, 800);
  }

  function handleClose() {
    onClose();
    // Kısa bir gecikmeyle sıfırla (kapanma animasyonunu bozmamak için)
    setTimeout(() => {
      setStep("amount");
      setRawValue("");
      setOtp("");
      setError("");
      setLoading(false);
    }, 300);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-sm rounded-2xl bg-white p-6">

        {/* ── ADIM 1: Tutar girişi ── */}
        {step === "amount" && (
          <>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-base font-semibold leading-snug">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-5">
              <div className="rounded-xl bg-muted/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Mevcut En Yüksek Teklif</p>
                <p className="mt-0.5 text-xl font-bold text-foreground">
                  {formatCurrency(currentBid)}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="bid-input" className="text-sm font-medium text-foreground">
                  Teklifiniz (₺)
                </label>
                <Input
                  id="bid-input"
                  type="text"
                  inputMode="numeric"
                  placeholder={String(currentBid + 100)}
                  value={rawValue}
                  onChange={(e) => {
                    setRawValue(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className="rounded-xl border-border text-sm"
                  autoFocus
                />
                {error && (
                  <p className="text-xs font-medium text-destructive">{error}</p>
                )}
              </div>

              <Button
                onClick={handleAmountConfirm}
                disabled={!rawValue}
                className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                Teklifi Onayla
              </Button>
            </div>
          </>
        )}

        {/* ── ADIM 2: OTP doğrulaması ── */}
        {step === "otp" && (
          <>
            <DialogHeader className="mb-2">
              <DialogTitle className="text-base font-semibold leading-snug">
                SMS Doğrulaması
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-muted/60 px-4 py-3">
                <p className="text-xs text-muted-foreground">Onaylanacak Teklifiniz</p>
                <p className="mt-0.5 text-xl font-bold text-foreground">
                  {formatCurrency(Number(rawValue))}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Teklifinizi onaylamak için telefonunuza gelen 6 haneli kodu girin.
                </p>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-11 w-11 rounded-xl border-border text-base"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleOtpConfirm}
                disabled={otp.length !== 6 || loading}
                className="w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? "Onaylanıyor…" : "Son Onay"}
              </Button>

              <button
                type="button"
                onClick={() => { setStep("amount"); setOtp(""); }}
                className="text-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Tutarı değiştir
              </button>
            </div>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}
