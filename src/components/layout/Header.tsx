"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { authUtils } from "@/lib/api";
import { User } from "lucide-react";

const navItems = [
  { label: "Shop", href: "https://mk100glass.com/shop/" },
  { label: "Raffle", href: "/raffle" },
];

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkStatus = () => setIsLoggedIn(authUtils.isAuthenticated());
    checkStatus();
    if (typeof window !== "undefined") {
      window.addEventListener("authStateChanged", checkStatus);
      window.addEventListener("storage", checkStatus);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("authStateChanged", checkStatus);
        window.removeEventListener("storage", checkStatus);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="sr-only">MK Raffle</span>
          <img
            src="https://mk100glass.com/wp-content/themes/mk100glass-new-new/assets/images/logo-white.png"
            alt="MK100 Glass logo"
            className="h-12 w-auto"
            loading="lazy"
          />
          {/* <span className="text-sm font-semibold uppercase tracking-widest text-white">
            MK Raffle
          </span> */}
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-300">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {!isLoggedIn ? (
            <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 bg-transparent text-white cursor-pointer"
                >
                  <User className="w-4 h-4 mr-1" />Login
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md border-white/10 bg-zinc-950">
                <DialogHeader>
                  <DialogTitle className="text-white">Log in to your account</DialogTitle>
                  <DialogDescription>
                    Access raffle entries and manage your profile.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm
                  onSuccess={() => {
                    setLoginOpen(false);
                    setIsLoggedIn(true);
                  }}
                  className="mt-4"
                />
                <p>
                  Do not have an account yet?{" "}
                  <Link href="/join" className="text-sm underline">
                    Create account
                  </Link>
                </p>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="outline"
              className="border-white/20 bg-transparent text-white cursor-pointer"
            >
              <User className="w-4 h-4 mr-1" />Account
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}