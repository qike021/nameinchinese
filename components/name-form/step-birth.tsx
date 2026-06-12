"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { NameFormData } from "@/lib/form/types";
import { timezoneOptions } from "@/lib/form/types";

interface StepBirthProps {
  register: UseFormRegister<NameFormData>;
  errors: FieldErrors<NameFormData>;
}

/**
 * Step 2: Birth details — date of birth, time of birth, birthplace, timezone.
 * Matches desktop/form-step2.html layout exactly.
 * All fields are optional; privacy notice is displayed.
 */
export function StepBirth({ register, errors }: StepBirthProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Date of Birth */}
      <div className="flex flex-col gap-2">
        <label htmlFor="birthDate" className="font-body text-sm font-medium text-text">
          Date of Birth <span className="text-primary">*</span>
        </label>
        <input
          id="birthDate"
          type="date"
          placeholder="MM / DD / YYYY"
          {...register("birthDate")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 placeholder:text-text-muted
                     focus:border-primary w-full"
        />
        {errors.birthDate && (
          <p className="font-body text-xs text-error mt-1">{errors.birthDate.message}</p>
        )}
      </div>

      {/* Birth Time */}
      <div className="flex flex-col gap-2">
        <label htmlFor="birthTime" className="font-body text-sm font-medium text-text">
          Birth Time{" "}
          <span className="font-normal text-text-muted text-xs">(optional)</span>
        </label>
        <select
          id="birthTime"
          {...register("birthTime")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 focus:border-primary w-full
                     appearance-none
                     bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2378716C%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                     bg-no-repeat bg-[right_16px_center] pr-11"
        >
          <option value="" disabled>
            Select time of day
          </option>
          <option value="morning">Morning (5am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 5pm)</option>
          <option value="evening">Evening (5pm - 9pm)</option>
          <option value="night">Night (9pm - 5am)</option>
        </select>
      </div>

      {/* Birthplace */}
      <div className="flex flex-col gap-2">
        <label htmlFor="birthPlace" className="font-body text-sm font-medium text-text">
          Birthplace
        </label>
        <input
          id="birthPlace"
          type="text"
          placeholder="City, Country"
          {...register("birthPlace")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 placeholder:text-text-muted
                     focus:border-primary w-full"
        />
      </div>

      {/* Time Zone */}
      <div className="flex flex-col gap-2">
        <label htmlFor="timezone" className="font-body text-sm font-medium text-text">
          Time Zone
        </label>
        <select
          id="timezone"
          {...register("timezone")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 focus:border-primary w-full
                     appearance-none
                     bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2378716C%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                     bg-no-repeat bg-[right_16px_center] pr-11"
        >
          <option value="" disabled>
            UTC-5 (EST)
          </option>
          {timezoneOptions.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Privacy Notice */}
      <div className="font-body text-xs text-text-tertiary flex items-center gap-1.5">
        <span>&#x1F512;</span>
        <span>
          Your birth data is encrypted and never shared. We use it solely for Five Elements
          analysis.
        </span>
      </div>
    </div>
  );
}
