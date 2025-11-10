
import RaffleCountdown from "@/components/raffle/RaffleCountdown";
import RaffleProducts from "@/components/raffle/Products";

export default function HomeHero() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[512px] bg-gradient-to-b from-zinc-950 via-zinc-950/90 to-zinc-950/60 py-8 md:py-16">
      <div className="container mx-auto">
        <div className="mx-auto text-center w-[fit-content] mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-red-500 font-bold">MK100 Black Friday Raffle</span>
          <RaffleCountdown start_date="2025-11-29T00:00:00Z" />
        </div>
        <div className="mx-auto flex flex-col lg:flex-row w-full max-w-6xl flex-col gap-12 px-6">
          <div className="flex md:flex-1 justify-center items-center">
            <RaffleProducts />
          </div>
          <div className="flex flex-col md:flex-1 items-center gap-3 text-center lg:text-left">
            <h1 className="text-3xl font-semibold sm:text-5xl">
              Spin to win over <span className="text-green-500">$100</span> worth of MK100 glass!
            </h1>
            <p className="max-w-2xl text-sm text-zinc-300 sm:text-base">Claim a FREE ticket per account and stack additional entries! Dont miss out!</p>
          </div>
        </div>
      </div>
    </section>
  );
}
