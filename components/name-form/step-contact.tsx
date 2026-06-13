"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { NameFormData } from "@/lib/form/types";
import { useTranslations } from "next-intl";

interface StepContactProps {
  register: UseFormRegister<NameFormData>;
  errors: FieldErrors<NameFormData>;
  isSubmitting: boolean;
}

export function StepContact({ register, errors, isSubmitting }: StepContactProps) {
  const t = useTranslations("form");

  return (
    <div className="flex flex-col gap-6">
      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-body text-sm font-medium text-text">
          {t("email")} <span className="text-primary">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 placeholder:text-text-muted
                     focus:border-primary w-full"
        />
        {errors.email && (
          <p className="font-body text-xs text-error mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-4">
        {/* Terms checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("agreedToTerms")}
            className="appearance-none w-5 h-5 min-w-[20px] border border-border rounded-sm
                       checked:bg-primary checked:border-primary
                       transition-all duration-200 cursor-pointer mt-0.5
                       focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                       checked:bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M20%206L9%2017l-5-5%22%2F%3E%3C%2Fsvg%3E')]
                       bg-no-repeat bg-center"
          />
          <span className="font-body text-xs text-text-secondary leading-relaxed">
            {t("termsAgreement")}
          </span>
        </label>
        {errors.agreedToTerms && (
          <p className="font-body text-xs text-error mt-1">
            {errors.agreedToTerms.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 bg-primary text-white rounded-md font-body text-base font-semibold
                   hover:bg-primary-hover transition-colors duration-200 mt-3
                   disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            {t("generating")}
          </>
        ) : (
          t("submit")
        )}
      </button>

      {/* Security Note */}
      <p className="font-body text-xs text-text-tertiary text-center mt-1">
        &#x1F512; Your information is secure and will never be shared.
      </p>
    </div>
  );
}
