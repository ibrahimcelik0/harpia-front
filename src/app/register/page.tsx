import Header from "@/shared/components/Header";

export const metadata = {
  title: "Kayıt Ol | Harpia",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
          <h1 className="text-xl font-semibold text-foreground">Kayıt Ol</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kayıt ekranı yakında burada olacak.
          </p>
        </div>
      </main>
    </>
  );
}
