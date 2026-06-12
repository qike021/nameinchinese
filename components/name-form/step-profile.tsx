"use client";

import type { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import type { NameFormData } from "@/lib/form/types";
import {
  personalityTraits,
  occupationOptions,
  styleOptions,
  purposeOptions,
} from "@/lib/form/types";

interface StepProfileProps {
  register: UseFormRegister<NameFormData>;
  setValue: UseFormSetValue<NameFormData>;
  watch: UseFormWatch<NameFormData>;
  errors: FieldErrors<NameFormData>;
}

/**
 * Step 3: Personality traits (chips), occupation, name style, and name purpose.
 * Matches desktop/form-step3.html layout exactly.
 */
export function StepProfile({ register, setValue, watch, errors }: StepProfileProps) {
  const selectedTraits = watch("personality") ?? [];

  const toggleTrait = (trait: string) => {
    const updated = selectedTraits.includes(trait)
      ? selectedTraits.filter((t) => t !== trait)
      : [...selectedTraits, trait];
    setValue("personality", updated, { shouldValidate: false });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Personality Traits — Chips */}
      <div className="flex flex-col gap-2">
        <span className="font-body text-sm font-medium text-text">Personality Traits</span>
        <div className="grid grid-cols-3 gap-2">
          {personalityTraits.map((trait) => {
            const active = selectedTraits.includes(trait.value);
            return (
              <button
                key={trait.value}
                type="button"
                onClick={() => toggleTrait(trait.value)}
                className={`
                  flex items-center justify-center h-11 border rounded-md
                  font-body text-sm font-medium cursor-pointer select-none
                  transition-all duration-200
                  ${
                    active
                      ? "bg-primary-light border-primary text-primary"
                      : "bg-surface border-border text-text-secondary hover:border-primary hover:text-primary"
                  }
                `}
              >
                {trait.label}
              </button>
            );
          })}
        </div>
        {errors.personality && (
          <p className="font-body text-xs text-error mt-1">{errors.personality.message}</p>
        )}
      </div>

      {/* Occupation */}
      <div className="flex flex-col gap-2">
        <label htmlFor="occupation" className="font-body text-sm font-medium text-text">
          Occupation{" "}
          <span className="font-normal text-text-muted text-xs">(optional)</span>
        </label>
        <select
          id="occupation"
          {...register("occupation")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 focus:border-primary w-full
                     appearance-none
                     bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2378716C%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                     bg-no-repeat bg-[right_16px_center] pr-11"
        >
          {occupationOptions.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Name Style */}
      <div className="flex flex-col gap-2">
        <span className="font-body text-sm font-medium text-text">Preferred Style</span>
        <div className="flex flex-col gap-3">
          {styleOptions.map((style) => (
            <label
              key={style.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                value={style.value}
                {...register("nameStyle")}
                className="appearance-none w-5 h-5 border-2 border-border rounded-full
                           checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white]
                           transition-all duration-200 cursor-pointer shrink-0
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              />
              <span className="font-body text-sm text-text-secondary group-hover:text-text transition-colors">
                {style.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Name Purpose */}
      <div className="flex flex-col gap-2">
        <span className="font-body text-sm font-medium text-text">Name Purpose</span>
        <div className="flex flex-col gap-3">
          {purposeOptions.map((purpose) => (
            <label
              key={purpose.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                value={purpose.value}
                {...register("namePurpose")}
                className="appearance-none w-5 h-5 border-2 border-border rounded-full
                           checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white]
                           transition-all duration-200 cursor-pointer shrink-0
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              />
              <span className="font-body text-sm text-text-secondary group-hover:text-text transition-colors">
                {purpose.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
