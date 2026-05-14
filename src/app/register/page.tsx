import Header from "@/shared/components/Header";
import RegisterCard from "@/features/auth/components/RegisterCard";

export const metadata = {
  title: "Kayıt Ol | Harpia",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <RegisterCard />
      </main>
    </>
  );
}
