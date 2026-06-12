"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { NameFormData } from "@/lib/form/types";

interface StepBasicsProps {
  register: UseFormRegister<NameFormData>;
  errors: FieldErrors<NameFormData>;
}

/**
 * Step 1: English name (first + last) and gender selection.
 * Matches desktop/form-step1.html layout exactly.
 */
export function StepBasics({ register, errors }: StepBasicsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* First Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="firstName" className="font-body text-sm font-medium text-text">
          First Name <span className="text-primary">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          {...register("firstName")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 placeholder:text-text-muted
                     focus:border-primary w-full"
        />
        {errors.firstName && (
          <p className="font-body text-xs text-error mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="lastName" className="font-body text-sm font-medium text-text">
          Last Name <span className="text-primary">*</span>
        </label>
        <input
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          {...register("lastName")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface
                     outline-none transition-colors duration-200 placeholder:text-text-muted
                     focus:border-primary w-full"
        />
        {errors.lastName && (
          <p className="font-body text-xs text-error mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Gender */}
      <div className="flex flex-col gap-2">
        <span className="font-body text-sm font-medium text-text">
          Gender <span className="text-primary">*</span>
        </span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              value="male"
              {...register("gender")}
              className="appearance-none w-5 h-5 border-2 border-border rounded-full
                         checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white]
                         transition-all duration-200 cursor-pointer
                         focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            />
            <span className="font-body text-sm text-text-secondary group-hover:text-text transition-colors">
              Male
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              value="female"
              {...register("gender")}
              className="appearance-none w-5 h-5 border-2 border-border rounded-full
                         checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white]
                         transition-all duration-200 cursor-pointer
                         focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            />
            <span className="font-body text-sm text-text-secondary group-hover:text-text transition-colors">
              Female
            </span>
          </label>
        </div>
        {errors.gender && (
          <p className="font-body text-xs text-error mt-1">{errors.gender.message}</p>
        )}
      </div>
    </div>
  );
}
