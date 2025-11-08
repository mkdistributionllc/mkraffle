"use client";

import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type JoinFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

export type JoinFormResult = {
  token?: string;
  user?: unknown;
  [key: string]: unknown;
};

export type JoinFormProps = {
  onSuccess?: (result: JoinFormResult) => void;
  onSubmit?: (values: JoinFormValues) => Promise<JoinFormResult>;
  onError?: (error: Error) => void;
  initialValues?: Partial<JoinFormValues>;
  compact?: boolean;
  submitLabel?: string;
  className?: string;
};

const defaultInitialValues: JoinFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};

export default function JoinForm({
  onSuccess,
  onSubmit,
  onError,
  initialValues,
  compact = false,
  submitLabel = "Create account",
  className,
}: JoinFormProps) {
  const [values, setValues] = useState<JoinFormValues>({
    ...defaultInitialValues,
    ...initialValues,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateField<Field extends keyof JoinFormValues>(
    field: Field,
    value: JoinFormValues[Field]
  ) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg(null);

    if (!values.email || !values.password || !values.confirmPassword) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const payload: JoinFormValues = {
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      };

      let result: JoinFormResult | undefined;

      if (onSubmit) {
        result = await onSubmit(payload);
      } else {
        const response = await axios.post("/mk100glass/v1/register", payload);
        const data = response?.data ?? {};

        if (data?.success === false) {
          throw new Error(data?.message || data?.error || "Account creation failed");
        }

        result = {
          token: data?.token,
          user: data?.user,
          ...data,
        };
      }

      if (!result) {
        throw new Error(
          'No registration handler attached. Provide onSubmit prop or ensure "/mk100glass/v1/register" is available.'
        );
      }

      onSuccess?.(result);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error)
          ? error.response?.data?.message ||
            error.response?.data?.error ||
            error.message
          : (error as Error)?.message || "Account creation failed. Please try again.";

      setErrorMsg(message);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }

  const wrapper = compact ? "space-y-3" : "space-y-4";
  const labelClass = compact ? "text-sm" : "";
  const fieldBaseClass = "text-white";

  return (
    <form
      onSubmit={handleSubmit}
      className={wrapper + (className ? ` ${className}` : "")}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="firstName" className={labelClass + " text-white"}>
            First name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            className={fieldBaseClass}
            value={values.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder="Jane"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName" className={labelClass + " text-white"}>
            Last name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            className={fieldBaseClass}
            value={values.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email" className={labelClass + " text-white"}>
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={fieldBaseClass}
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className={labelClass + " text-white"}>
            Password
          </Label>
          <Button
            type="button"
            variant="ghost"
            className="text-xs text-muted-foreground underline hover:text-foreground"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className={fieldBaseClass}
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="confirmPassword" className={labelClass + " text-white"}>
            Confirm password
          </Label>
          <Button
            type="button"
            variant="ghost"
            className="text-xs text-muted-foreground underline hover:text-foreground"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </Button>
        </div>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          autoComplete="new-password"
          className={fieldBaseClass}
          value={values.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      {errorMsg && (
        <p role="alert" className="text-sm text-red-500">
          {errorMsg}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account…" : submitLabel}
      </Button>
    </form>
  );
}