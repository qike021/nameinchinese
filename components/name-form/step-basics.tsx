"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { NameFormData } from "@/lib/form/types";
import { useTranslations } from "next-intl";

interface StepBasicsProps {
  register: UseFormRegister<NameFormData>;
  errors: FieldErrors<NameFormData>;
}

export function StepBasics({ register, errors }: StepBasicsProps) {
  const t = useTranslations("form");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="firstName" className="font-body text-sm font-medium text-text">
          {t("firstName")} <span className="text-primary">*</span>
        </label>
        <input id="firstName" type="text" placeholder="Michael" {...register("firstName")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-primary w-full" />
        {errors.firstName && <p className="font-body text-xs text-error mt-1">{errors.firstName.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="lastName" className="font-body text-sm font-medium text-text">
          {t("lastName")} <span className="text-primary">*</span>
        </label>
        <input id="lastName" type="text" placeholder="Jordan" {...register("lastName")}
          className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface outline-none transition-colors duration-200 placeholder:text-text-muted focus:border-primary w-full" />
        {errors.lastName && <p className="font-body text-xs text-error mt-1">{errors.lastName.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-body text-sm font-medium text-text">{t("gender")} <span className="text-primary">*</span></span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" value="male" {...register("gender")}
              className="appearance-none w-5 h-5 border-2 border-border rounded-full checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white] transition-all duration-200 cursor-pointer" />
            <span className="font-body text-sm text-text-secondary group-hover:text-text transition-colors">{t("male")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" value="female" {...register("gender")}
              className="appearance-none w-5 h-5 border-2 border-border rounded-full checked:border-primary checked:bg-primary checked:shadow-[inset_0_0_0_3px_white] transition-all duration-200 cursor-pointer" />
            <span className="font-body text-sm text-text-secondary group-hover:text-text transition-colors">{t("female")}</span>
          </label>
        </div>
        {errors.gender && <p className="font-body text-xs text-error mt-1">{errors.gender.message}</p>}
      </div>
    </div>
  );
}
