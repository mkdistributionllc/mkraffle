import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { RaffleEntriesWheel } from "@/components/raffle/EntriesWheel";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main>
        <RaffleEntriesWheel entries={[]} />
      </main>
      <Footer />
    </div>
  );
}
