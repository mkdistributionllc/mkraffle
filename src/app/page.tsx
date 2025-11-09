import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ClaimFreeTicket from "@/components/raffle/ClaimFreeTicket";
import { RaffleEntriesWheel } from "@/components/raffle/EntriesWheel";
import PurchaseAdditionalTickets from "@/components/raffle/PurchaseAdditionalTickets";
import RaffleCountdown from "@/components/raffle/RaffleCountdown";
import RaffleRules from "@/components/raffle/Rules";
import raffleEntries from "@/data/mockRaffleEntries.json";

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-white">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-zinc-950/60 py-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6">
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-amber-300">
                MK100 Black Friday Raffle
              </span>
              <RaffleCountdown start_date="2025-11-29T00:00:00Z" />
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Spin to win over $100 worth of MK100 glass!
              </h1>
              <p className="max-w-2xl text-sm text-zinc-300 sm:text-base">
                Claim a FREE ticket per account, stack additional entries, and watch the live raffle wheel fill up with your odds. The drawing happens at midnight PST—don’t miss out.
              </p>
            </div>
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-8 shadow-2xl shadow-black/40">
                <RaffleEntriesWheel entries={raffleEntries} />
              </div>
              <div className="flex flex-col gap-8">
                <ClaimFreeTicket />
                <PurchaseAdditionalTickets />
              </div>
            </div>
          </div>
        </section>
        <RaffleRules />
      </main>
      <Footer />
    </div>
  );
}
