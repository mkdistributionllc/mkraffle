"use client";
import { useEffect, useMemo, useState } from "react";
import { authUtils } from "@/lib/api";
import { Button } from "@/components/ui/button";

type ClaimFreeTicketProps = {
  raffleId: number;
  onClaim?: () => Promise<void> | void;
  className?: string;
};

export default function ClaimFreeTicket({
  raffleId,
  onClaim,
  className,
}: ClaimFreeTicketProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasClaimed, setHasClaimed] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(authUtils.isAuthenticated());
      setCurrentUser(authUtils.getCurrentUser());
    };
    updateAuthState();
    if (typeof window !== "undefined") {
      window.addEventListener("authStateChanged", updateAuthState);
      window.addEventListener("storage", updateAuthState);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("authStateChanged", updateAuthState);
        window.removeEventListener("storage", updateAuthState);
      }
    };
  }, []);

  const authHeader = useMemo(() => {
    if (!isLoggedIn || !currentUser) return null;
    const token = authUtils.getToken();
    const username = currentUser?.username || currentUser?.email;
    if (!token || !username) return null;
    return `Basic ${typeof window !== "undefined" ? window.btoa(`${username}:${token}`) : ""}`;
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!isLoggedIn || !authHeader || !baseUrl) {
      setHasClaimed(false);
      if (!isLoggedIn) {
        setStatus("idle");
        setMessage(null);
      }
      return;
    }
    let cancelled = false;
    const fetchExistingTicket = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/wp-json/mk100glass/v1/raffles/${raffleId}/tickets`,
          {
            headers: {
              Authorization: authHeader,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 404) {
            if (!cancelled) {
              setHasClaimed(false);
              setStatus("idle");
              setMessage(null);
            }
            return;
          }
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.error || data?.message || "Unable to verify ticket status.");
        }
        const data = await response.json().catch(() => ({}));
        const alreadyClaimed = Array.isArray(data?.tickets) && data.tickets.length > 0;
        if (!cancelled) {
          setHasClaimed(alreadyClaimed);
          if (alreadyClaimed) {
            setStatus("success");
            setMessage("You have already claimed your free ticket for this raffle.");
          } else {
            setStatus("idle");
            setMessage(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage((error as Error)?.message || "Unable to verify ticket status.");
        }
      }
    };
    fetchExistingTicket();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, authHeader, raffleId]);

  async function handleClaim() {
    if (!authHeader) {
      setStatus("error");
      setMessage("Please sign in to claim your ticket.");
      return;
    }
    try {
      setIsSubmitting(true);
      setStatus("idle");
      setMessage(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("API base URL is not configured.");
      }
      const response = await fetch(
        `${baseUrl}/wp-json/mk100glass/v1/raffles/${raffleId}/tickets`,
        {
          method: "POST",
          headers: {
            Authorization: authHeader,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (response.status === 409) {
          setHasClaimed(true);
          throw new Error(
            data?.error ||
              data?.message ||
              "You have already claimed your free ticket for this raffle."
          );
        }
        throw new Error(data?.error || data?.message || "Unable to claim ticket.");
      }
      await onClaim?.();
      setHasClaimed(true);
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
            Claim Your FREE Raffle Ticket
          </h3>
          <p className="mt-3 text-sm text-emerald-100/80">
            Every registered account receives one complimentary ticket. Sign in to secure your spot in the raffle.
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
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
        {!isLoggedIn && (
          <p className="text-sm text-emerald-200/80">
            You need to be logged in to claim your free ticket.
          </p>
        )}
        <Button
          type="button"
          onClick={handleClaim}
          className="w-full bg-emerald-400 text-emerald-900 hover:bg-emerald-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || !isLoggedIn || hasClaimed}
        >
          {isSubmitting ? "Claiming…" : hasClaimed ? "Ticket Already Claimed" : "Claim Free Ticket"}
        </Button>
      </div>
    </section>
  );
}