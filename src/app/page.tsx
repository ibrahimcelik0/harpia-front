import Header from "@/shared/components/Header";
import Sidebar from "@/shared/components/Sidebar";
import AuctionGrid from "@/features/auction/components/AuctionGrid";

export default function Home() {
  return (
    <>
      <Header />
      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <AuctionGrid />
        </main>
      </div>
    </>
  );
}
