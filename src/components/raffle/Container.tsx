
import ClaimFreeTicket from "@/components/raffle/ClaimFreeTicket";
import { RaffleEntriesWheel } from "@/components/raffle/EntriesWheel";
import raffleEntries from "@/data/mockRaffleEntries.json";
import PurchaseAdditionalTickets from "@/components/raffle/PurchaseAdditionalTickets";

export default function RaffleContainer() {

  return (
    <section className="py-4">
      <div className="container mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-2 lg:p-8 shadow-2xl shadow-black/40">
            <RaffleEntriesWheel entries={raffleEntries} />
          </div>
          <div className="flex flex-col gap-8">
            <ClaimFreeTicket raffleId={1} />
            <PurchaseAdditionalTickets />
          </div>
        </div>
      </div>
    </section>
  );
}