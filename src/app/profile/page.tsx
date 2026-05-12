import type { Metadata } from "next";
import Header from "@/shared/components/Header";
import ProfileContent from "@/features/auth/components/ProfileContent";

export const metadata: Metadata = {
  title: "Profilim | Harpia",
};

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <ProfileContent />
      </main>
    </>
  );
}
