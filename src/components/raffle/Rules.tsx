const sections = [
  {
    title: "Eligibility & Timing",
    items: [
      "Open to verified MK100 customer accounts. You must be 21+ to enter.",
      // "Entries open at 12:00 AM PST on Black Friday and close at 11:59 PM PST the same day.",
      "One free ticket per verified account. Additional tickets can be purchased while the raffle is live.",
    ],
  },
  {
    title: "How Entries Work",
    items: [
      "Claim your free ticket after logging in. Each ticket is uniquely numbered and tied to your account.",
      "Purchase extra tickets to boost your odds. Purchased entries are confirmed instantly and non‑refundable.",
      "All tickets—free and paid—enter the same drawing pool. The `EntriesWheel` visualizes the spread in real time.",
    ],
  },
  {
    title: "Winner Selection & Prizes",
    items: [
      "A single winning ticket is drawn live using the raffle wheel once entries close.",
      "Winners receive an email and dashboard notification with instructions to claim the prize within 48 hours.",
      "If the prize is not claimed, we redraw from the remaining tickets until a verified winner accepts.",
    ],
  },
];

export default function RaffleRules() {
  return (
    <section className="py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-6 text-zinc-200">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-red-500 font-bold">MK100 Black Friday Raffle</span>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            How the Raffle Works
          </h2>
          <p className="mt-4 text-sm text-zinc-400 sm:text-base">
            Review the rules, understand how entries are counted, and learn what happens when you win.
          </p>
        </div>
        <div className="grid gap-10">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-white/5 bg-zinc-900/60 p-7 shadow-lg shadow-black/30"
            >
              <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
                {section.items.map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-amber-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        {/* <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-6 text-sm text-amber-100">
          Have questions? Reach out to{" "}
          <a
            href="mailto:support@mk100glass.com"
            className="font-semibold underline decoration-amber-200/60 underline-offset-4 hover:text-white"
          >
            support@mk100glass.com
          </a>{" "}
          before the drawing closes.
        </div> */}
      </div>
    </section>
  );
}