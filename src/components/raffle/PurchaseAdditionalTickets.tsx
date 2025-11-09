"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TICKET_PRICE = 1;
const TICKET_BUNDLES = [
  { id: "bundle-1", label: "1 ticket", quantity: 1 },
  { id: "bundle-5", label: "5 tickets", quantity: 5 },
  { id: "bundle-10", label: "10 tickets", quantity: 10 },
  { id: "bundle-25", label: "25 tickets", quantity: 25 },
];

type PurchaseAdditionalTicketsProps = {
  currency?: string;
  onPurchase?: (bundleId: string, email: string) => Promise<void> | void;
  className?: string;
};

export default function PurchaseAdditionalTickets({
  currency = "USD",
  onPurchase,
  className,
}: PurchaseAdditionalTicketsProps) {
  const [selectedBundle, setSelectedBundle] = useState<string>(TICKET_BUNDLES[1].id);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const activeBundle = useMemo(
    () => TICKET_BUNDLES.find((bundle) => bundle.id === selectedBundle),
    [selectedBundle]
  );
  const formattedTicketPrice = formatCurrency(TICKET_PRICE, currency);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);
    if (!activeBundle) {
      setStatus("error");
      setMessage("Choose a ticket bundle before continuing.");
      return;
    }
    if (!email) {
      setStatus("error");
      setMessage("Enter the email tied to your MK100 account.");
      return;
    }
    try {
      setIsSubmitting(true);
      await onPurchase?.(activeBundle.id, email);
      setStatus("success");
      setMessage(
        `Purchased ${activeBundle.quantity} ticket${
          activeBundle.quantity > 1 ? "s" : ""
        } for ${formatCurrency(activeBundle.quantity * TICKET_PRICE, currency)}! Look for a receipt and ticket numbers in your inbox.`
      );
    } catch (error) {
      setStatus("error");
      setMessage((error as Error)?.message || "Purchase failed. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={
        "rounded-2xl border border-amber-400/20 bg-amber-400/10 p-6 text-amber-50 shadow-lg shadow-amber-900/40 " +
        (className ?? "")
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">
            Step 2
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Purchase Additional Tickets
          </h3>
          <p className="mt-3 text-sm text-amber-100/80">
            Increase your chances with simple, flat pricing. Each entry costs {formattedTicketPrice}. Tickets are applied to your
            account instantly after purchase.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="text-xs font-medium uppercase tracking-[0.2em] text-amber-200">
            Choose Quantity
          </legend>
          {TICKET_BUNDLES.map((bundle) => {
            const isActive = bundle.id === selectedBundle;
            return (
              <button
                type="button"
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle.id)}
                className={
                  "rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-amber-300/60 focus:ring-offset-2 focus:ring-offset-zinc-900 " +
                  (isActive
                    ? "border-amber-300 bg-amber-300/10 text-white shadow-inner shadow-amber-900/30"
                    : "border-amber-300/20 bg-transparent text-amber-100/80 hover:border-amber-300/40 hover:bg-amber-300/5")
                }
              >
                <p className="text-sm font-semibold">{bundle.label}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-amber-200">
                  {bundle.quantity} entries
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {formatCurrency(bundle.quantity * TICKET_PRICE, currency)}
                </p>
              </button>
            );
          })}
        </fieldset>
        {/* <div className="grid gap-2">
          <Label htmlFor="purchase-email" className="text-amber-50">
            Account email
          </Label>
          <Input
            id="purchase-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="border-amber-400/40 bg-amber-400/10 text-white placeholder:text-amber-100/60 focus-visible:border-amber-200 focus-visible:ring-amber-200/40"
            required
          />
        </div> */}
        {status !== "idle" && message && (
          <p
            className={
              "text-sm " +
              (status === "success" ? "text-amber-200" : "text-amber-100/80")
            }
          >
            {message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full bg-amber-400 text-amber-950 hover:bg-amber-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing…" : `Purchase Ticket${activeBundle && activeBundle.quantity > 1 ? "s" : ""}`}
        </Button>
      </form>
    </section>
  );
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

