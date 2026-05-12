import type { Product } from "../data/mockProducts";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function WonCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Görsel */}
      <div className="flex h-44 items-center justify-center rounded-t-2xl bg-muted/70">
        <span className="select-none text-3xl opacity-30">📦</span>
      </div>

      {/* İçerik */}
      <div className="flex flex-col gap-3 p-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {product.category}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {product.name}
          </h3>
        </div>

        <div>
          <p className="text-[11px] text-muted-foreground">Kazanılan Teklif</p>
          <p className="text-xl font-bold tracking-tight text-foreground">
            {formatCurrency(product.currentBid)}
          </p>
        </div>

        <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Kazandınız
        </span>
      </div>
    </article>
  );
}
