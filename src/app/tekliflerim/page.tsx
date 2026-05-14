import Header from "@/shared/components/Header";
import Sidebar from "@/shared/components/Sidebar";
import MyBidsContent from "@/features/auction/components/MyBidsContent";

export const metadata = {
  title: "Teklif Verdiklerim | Harpia",
};

export default function MyBidsPage() {
  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <MyBidsContent />
        </main>
      </div>
    </>
  );
}
