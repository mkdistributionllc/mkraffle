"use client";

import { useEffect, useMemo, useState } from "react";

import LoginForm from "@/components/auth/LoginForm";
import { authUtils } from "@/lib/api";

type RaffleTicket = {
  id: number;
  ticket_number: string;
  buyer_name: string;
  buyer_email: string;
  product_id: number;
  raffle_id: number;
  purchase_date: string;
};

type RaffleResponse = {
  raffle: {
    id: number;
    name: string;
    description: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
  };
  tickets: RaffleTicket[];
};

type MyTicketsResponse = {
  tickets: RaffleTicket[];
};

export default function AccountContainer() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<RaffleTicket[]>([]);
  const [rafflesById, setRafflesById] = useState<Record<number, RaffleResponse["raffle"]>>({});
  const [error, setError] = useState<string | null>(null);

  const authHeader = useMemo(() => {
    if (!authUtils.isAuthenticated()) {
      return null;
    }
    const token = authUtils.getToken();
    const user = authUtils.getCurrentUser();
    const username = user?.username || user?.email;
    if (!token || !username) return null;
    if (typeof window === "undefined") return null;
    return `Basic ${window.btoa(`${username}:${token}`)}`;
  }, [isLoggedIn]);

  useEffect(() => {
    const updateAuthState = () => {
      const loggedIn = authUtils.isAuthenticated();
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        setTickets([]);
        setRafflesById({});
      }
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

  useEffect(() => {
    if (!isLoggedIn || !authHeader) {
      setIsLoading(false);
      return;
    }
    fetchTickets();
  }, [isLoggedIn, authHeader]);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!baseUrl) {
        throw new Error("API base URL is not configured.");
      }
      const authHeaderValue = authHeader;
      if (!authHeaderValue) {
        throw new Error("You must be logged in to view raffle tickets.");
      }
      const response = await fetch(
        `${baseUrl}/wp-json/mk100glass/v1/my-raffle-tickets`,
        {
          headers: {
            Authorization: authHeaderValue,
          },
        }
      );
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as Partial<MyTicketsResponse> & {
          error?: string;
          message?: string;
        };
        throw new Error(data?.error || data?.message || "Unable to load raffle tickets.");
      }
      const responseData = (await response.json()) as MyTicketsResponse;
      const ticketData = responseData?.tickets ?? [];
      setTickets(ticketData);
      if (ticketData.length) {
        const raffleIds = Array.from(new Set(ticketData.map((ticket) => ticket.raffle_id)));
        const raffleResponses = await Promise.all(
          raffleIds.map(async (raffleId) => {
            const res = await fetch(
              `${baseUrl}/wp-json/mk100glass/v1/raffles/${raffleId}`,
              {
                headers: {
                  Authorization: authHeader,
                },
              }
            );
            if (!res.ok) {
              const data = (await res.json().catch(() => ({}))) as Partial<RaffleResponse> & {
                error?: string;
                message?: string;
              };
              throw new Error(data?.error || data?.message || "Unable to load raffle details.");
            }
            return (await res.json()) as RaffleResponse;
          })
        );
        const indexedRaffles = raffleResponses.reduce<Record<number, RaffleResponse["raffle"]>>(
          (acc, raffleResponse) => {
            acc[raffleResponse.raffle.id] = raffleResponse.raffle;
            return acc;
          },
          {}
        );
        setRafflesById(indexedRaffles);
      }
    } catch (fetchError) {
      const message =
        (fetchError as Error)?.message || "Unable to load raffle tickets. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="bg-black text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6">Sign in to view your raffle tickets</h2>
          <LoginForm
            onSuccess={() => {
              setIsLoggedIn(true);
            }}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">My Raffle Tickets</h2>
            <p className="text-sm text-zinc-400">
              Review every ticket you’ve claimed or purchased across active raffles.
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-300">
            {tickets.length} tickets
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-8 text-center text-sm text-zinc-300">
            Loading your raffle history…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        ) : tickets.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-zinc-900/80 p-8 text-center text-sm text-zinc-300">
            You haven’t claimed any tickets yet. Claim your free entry or purchase additional tickets to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket: RaffleTicket) => {
              const raffle = rafflesById[ticket.raffle_id];
              return (
                <article
                  key={ticket.id}
                  className="rounded-2xl border border-white/10 bg-zinc-900/80 p-6 shadow-lg shadow-black/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {raffle?.name || `Raffle #${ticket.raffle_id}`}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Ticket <span className="font-semibold text-emerald-300">{ticket.ticket_number}</span>
                      </p>
                    </div>
                    <div className="text-right text-xs text-zinc-400">
                      <span className="block uppercase tracking-[0.3em] text-zinc-500">Claimed</span>
                      <time dateTime={ticket.purchase_date}>
                        {new Date(ticket.purchase_date).toLocaleString()}
                      </time>
                    </div>
                  </div>
                  {raffle?.description && (
                    <p className="mt-3 text-sm text-zinc-300">{raffle.description}</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}