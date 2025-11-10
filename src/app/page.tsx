import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import HomeHero from "@/components/home/Hero";
import RaffleContainer from "@/components/raffle/Container";
import RaffleRules from "@/components/raffle/Rules";

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-white">
      <Header />
      <main className="flex-1">
        <HomeHero />
        <RaffleContainer />
        <RaffleRules />
      </main>
      <Footer />
    </div>
  );
}
