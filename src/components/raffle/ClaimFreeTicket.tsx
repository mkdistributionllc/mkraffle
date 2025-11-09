"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClaimFreeTicketProps = {
  onClaim?: (email: string) => Promise<void> | void;
  className?: string;
};

export default function ClaimFreeTicket({ onClaim, className }: ClaimFreeTicketProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    if (!email) {
      setStatus("error");
      setMessage("Enter the email tied to your MK100 account.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onClaim?.(email);
      setStatus("success");
      setMessage("Free ticket claimed! Check your dashboard for confirmation.");
    } catch (error) {
      setStatus("error");
      setMessage(
        (error as Error)?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      className={
        "rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-emerald-50 shadow-lg shadow-emerald-900/40 " +
        (className ?? "")
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200">
            Step 1
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            Claim your free raffle ticket
          </h3>
          <p className="mt-3 text-sm text-emerald-100/80">
            Every registered MK100 account receives one complimentary ticket. Enter
            your account email to secure your spot in the drawing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="claim-email" className="text-emerald-50">
            Account email
          </Label>
          <Input
            id="claim-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="border-emerald-400/40 bg-emerald-400/10 text-white placeholder:text-emerald-100/60 focus-visible:border-emerald-300 focus-visible:ring-emerald-200/40"
            required
          />
        </div>

        {status !== "idle" && message && (
          <p
            className={
              "text-sm " +
              (status === "success" ? "text-emerald-200" : "text-emerald-300/80")
            }
          >
            {message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-emerald-400 text-emerald-900 hover:bg-emerald-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Claiming…" : "Claim free ticket"}
        </Button>
      </form>
    </section>
  );
}

