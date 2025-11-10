"use client";
import axios from "axios";
import { useState } from "react";
import { authUtils } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type LoginCredentials = {
  login: string;
  password: string;
  remember?: boolean;
};

export type LoginResult = {
  token?: string;
  user?: any;
  [key: string]: unknown;
};

export type LoginFormProps = {
  onSuccess?: (result: LoginResult) => void;
  onSubmit?: (creds: LoginCredentials) => Promise<LoginResult>;
  onError?: (error: Error) => void;
  initialLogin?: string;
  compact?: boolean;
  submitLabel?: string;
  onForgotPassword?: () => void;
  className?: string;
};

export default function LoginForm({
  onSuccess,
  onSubmit,
  onError,
  initialLogin = '',
  compact = false,
  submitLabel = 'Log In',
  onForgotPassword,
  className,
}: LoginFormProps) {
  const [login, setLogin] = useState(initialLogin);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (!login || !password) {
      setErrorMsg("Please enter your email/username and password.");
      return;
    }
    try {
      setIsLoading(true);
      let result: LoginResult | undefined;
      if (onSubmit) {
        result = await onSubmit({ login, password, remember });
      } else {
        const response = await axios.post(process.env.NEXT_PUBLIC_API_BASE_URL + "/wp-json/mk100glass/v1/login", {
          login,
          password,
          remember,
        });
        const data = response?.data ?? {};
        if (data?.success === false) {
          throw new Error(data?.message || data?.error || "Login failed");
        }
        result = {
          token: data?.token,
          user: data?.user,
          ...data,
        };
        if (result?.token && result?.user) {
          authUtils.setAuthData(result.token as string, result.user, remember);
        }
      }
      if (result?.token && result?.user) {
        authUtils.setAuthData(result.token as string, result.user, remember);
      }
      if (!result) {
        throw new Error(
          'No login handler attached. Provide onSubmit prop or ensure "/mk100glass/v1/login" is available.'
        );
      }
      // Redirect when used on the standalone login page
      if (typeof window !== "undefined" && window.location.pathname === "/login") {
        window.location.reload();
      }
      onSuccess?.(result);
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
            err.response?.data?.error ||
            err.message
          : (err as Error)?.message || "Login failed. Please try again.";
      setErrorMsg(message);
      onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  }

  const wrapper = compact ? "space-y-3" : "space-y-4";
  const labelClass = compact ? "text-sm" : "";

  return (
    <form onSubmit={handleSubmit} className={wrapper + (className ? ` ${className}` : "")}>
      <div className="grid gap-2">
        <Label htmlFor="login" className={labelClass + " text-white"}>
          Email
        </Label>
        <Input
          id="login"
          type="text"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          // placeholder="you@example.com"
          autoComplete="username"
          className="text-white"
          required
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className={labelClass + " text-white"}>
            Password
          </Label>
          <Button
            variant="ghost"
            className="text-xs text-muted-foreground hover:text-foreground underline"
            onClick={() => setShowPassword((s) => !s)}
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // placeholder="••••••••"
          autoComplete="current-password"
          className="text-white"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(Boolean(v))}
          />
          <Label htmlFor="remember" className="text-sm text-muted-foreground">
            Remember me
          </Label>
        </div>
        {onForgotPassword ? (
          <button type="button" onClick={onForgotPassword} className="text-sm underline">
            Forgot password?
          </button>
        ) : (
          <a href="/lost-pass" className="text-sm underline">
            Forgot password?
          </a>
        )}
      </div>
      {errorMsg && (
        <p role="alert" className="text-sm text-red-500">
          {errorMsg}
        </p>
      )}
      <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? "Signing in…" : submitLabel}
      </Button>
    </form>
  );
}