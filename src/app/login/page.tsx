import Header from "@/shared/components/Header";
import LoginCard from "@/features/auth/components/LoginCard";

export const metadata = {
  title: "Giriş Yap | Harpia",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <LoginCard />
      </main>
    </>
  );
}
