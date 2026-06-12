"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { StepBasics } from "./step-basics";
import { StepBirth } from "./step-birth";
import { StepProfile } from "./step-profile";
import { StepContact } from "./step-contact";
import {
  nameFormSchema,
  defaultFormValues,
  stepFields,
  stepMeta,
  type NameFormData,
} from "@/lib/form/types";

/**
 * NameWizard — 4-step multi-step form for collecting user info
 * and generating Chinese names.
 *
 * Matches the desktop/form-step*.html design spec exactly:
 * - 72px sticky header with logo + step indicator
 * - 3px progress bar (25% per step)
 * - Centered card layout (max-w-[640px])
 * - Step-by-step navigation with validation
 * - Final step submits to /api/name/generate
 */
export function NameWizard() {
  const params = useParams<{ lang: string }>();
  const router = useRouter();
  const lang = params?.lang ?? "en";

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: defaultFormValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  /** Navigate to the next step after validating current step fields */
  const handleNext = useCallback(async () => {
    const fields = stepFields[step];
    if (fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  }, [step, trigger]);

  /** Navigate to the previous step */
  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  /** Submit all form data to the API */
  const onSubmit = useCallback(
    async (data: NameFormData) => {
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/name/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            english_name: `${data.firstName} ${data.lastName}`.trim(),
            gender: data.gender,
            birth_date: data.birthDate || undefined,
            birth_time: data.birthTime || undefined,
            profession: data.occupation || "other",
            personality: (data.personality ?? []),
            preferred_style: data.nameStyle,
            purpose: data.namePurpose,
          }),
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(
            errBody.error ?? `API responded with ${response.status}`
          );
        }

        const result = await response.json();

        // Store results in sessionStorage for the results page
        sessionStorage.setItem("nameResults", JSON.stringify(result));

        // Redirect to the results page
        router.push(`/${lang}/results`);
      } catch (error) {
        console.error("[NameWizard] Submission failed:", error);
        // TODO: Show user-friendly error toast / message
      } finally {
        setIsSubmitting(false);
      }
    },
    [lang, router]
  );

  const meta = stepMeta[step];
  const progressPercent = ((step + 1) / 4) * 100;

  /** Render the step-specific form fields */
  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBasics register={register} errors={errors} />;
      case 1:
        return <StepBirth register={register} errors={errors} />;
      case 2:
        return (
          <StepProfile
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        );
      case 3:
        return (
          <StepContact
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* ── Header ── */}
      <header className="h-[72px] flex items-center justify-between px-6 md:px-10 bg-bg sticky top-0 z-10 border-b border-border-light">
        <div className="font-cjk text-lg md:text-xl font-bold text-primary">
          华名堂 NameInChinese
        </div>
        <div className="font-body text-sm font-medium text-text-tertiary">
          Step {step + 1} of 4
        </div>
      </header>

      {/* ── Progress Bar ── */}
      <div className="h-[3px] bg-border-light">
        <div
          className="h-full bg-primary transition-all duration-[400ms] ease"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Main Content ── */}
      <main className="flex justify-center px-4 md:px-6 pt-8 md:pt-12 pb-20">
        <div className="w-full max-w-[640px] bg-surface rounded-2xl shadow-md p-6 md:p-12">
          {/* Title */}
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-text mb-2">
            {meta.title}
          </h1>

          {/* Subtitle */}
          <p className="font-body text-sm md:text-[15px] text-text-tertiary leading-relaxed mb-8 md:mb-9">
            {meta.subtitle}
          </p>

          {/* Form — wraps all steps; submit only on step 4 */}
          <form
            onSubmit={step === 3 ? handleSubmit(onSubmit) : undefined}
            className="flex flex-col gap-6"
          >
            {renderStep()}

            {/* ── Navigation Buttons ── */}
            {step < 3 && (
              <div className="flex flex-col gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full h-12 bg-primary text-white rounded-md font-body text-base font-semibold
                             hover:bg-primary-hover transition-colors duration-200"
                >
                  Continue
                </button>
                {step > 0 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full h-12 bg-transparent text-text-secondary border border-border rounded-md
                               font-body text-sm font-medium hover:border-primary hover:text-primary
                               transition-colors duration-200"
                  >
                    Back
                  </button>
                )}
              </div>
            )}

            {/* Step 4 handles its own submit button inside StepContact */}
          </form>
        </div>
      </main>
    </>
  );
}
