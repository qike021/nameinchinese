"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { NameFormData } from "@/lib/form/types";
import { timezoneOptions } from "@/lib/form/types";
import { useTranslations } from "next-intl";

interface StepBirthProps { register: UseFormRegister<NameFormData>; errors: FieldErrors<NameFormData>; }

export function StepBirth({ register, errors }: StepBirthProps) {
  const t = useTranslations("form");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="birthDate" className="font-body text-sm font-medium text-text">{t("birthDate")}</label>
        <input id="birthDate" type="date" {...register("birthDate")} className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface outline-none focus:border-primary w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="birthTime" className="font-body text-sm font-medium text-text">{t("birthTime")}</label>
        <input id="birthTime" type="time" {...register("birthTime")} className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface outline-none focus:border-primary w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="timezone" className="font-body text-sm font-medium text-text">{t("timezone")}</label>
        <select id="timezone" {...register("timezone")} className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface outline-none focus:border-primary w-full">
          {timezoneOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="birthPlace" className="font-body text-sm font-medium text-text">{t("birthPlace")}</label>
        <input id="birthPlace" type="text" placeholder="London, UK" {...register("birthPlace")} className="h-11 border border-border rounded-md px-4 font-body text-sm text-text bg-surface outline-none focus:border-primary w-full" />
      </div>
      <div className="bg-primary-light/50 rounded-lg px-4 py-3">
        <p className="font-body text-xs text-text-tertiary leading-relaxed">{t("privacyNotice")}</p>
      </div>
    </div>
  );
}
