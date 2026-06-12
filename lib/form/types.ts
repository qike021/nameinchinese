import { z } from "zod";

/**
 * Combined Zod schema for all 4 form steps.
 * Step 1 fields are required, Step 2-3 are optional with defaults,
 * Step 4 fields (email + terms) are required.
 */
export const nameFormSchema = z.object({
  // ── Step 1: Basics ──
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Please select a gender"),

  // ── Step 2: Birth Details (all optional) ──
  birthDate: z.string().optional().default(""),
  birthTime: z.string().optional().default(""),
  birthPlace: z.string().optional().default(""),
  timezone: z.string().optional().default(""),

  // ── Step 3: Profile ──
  occupation: z.string().optional().default(""),
  personality: z.array(z.string()).default([]),
  nameStyle: z.enum(["traditional", "balanced", "modern"]).default("balanced"),
  namePurpose: z.enum(["study", "work", "social", "tattoo", "other"]).default("study"),

  // ── Step 4: Contact ──
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  agreedToTerms: z
    .boolean()
    .refine((v) => v === true, "You must agree to the terms and privacy policy"),
});

export type NameFormData = z.infer<typeof nameFormSchema>;

/** Default / initial values for the form */
export const defaultFormValues: NameFormData = {
  firstName: "",
  lastName: "",
  gender: "",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  timezone: "",
  occupation: "",
  personality: [],
  nameStyle: "balanced",
  namePurpose: "study",
  email: "",
  agreedToTerms: false,
};

/** Labels for step validation triggers */
export const stepFields: Record<number, (keyof NameFormData)[]> = {
  0: ["firstName", "lastName", "gender"],
  1: [],
  2: [],
  3: ["email", "agreedToTerms"],
};

/** Step metadata */
export interface StepInfo {
  title: string;
  subtitle: string;
}

export const stepMeta: StepInfo[] = [
  {
    title: "Your Name",
    subtitle: "Tell us your name so we can find the perfect Chinese characters for you.",
  },
  {
    title: "Birth Details",
    subtitle:
      "Your birth information helps us calculate Bazi and Five Elements for a more meaningful name.",
  },
  {
    title: "Your Personality",
    subtitle:
      "Choose traits that resonate with you. This helps us select characters with matching energy.",
  },
  {
    title: "Almost There!",
    subtitle: "Enter your email to receive your personalized Chinese name report.",
  },
];

/** Personality trait config (key -> display label) */
export const personalityTraits: { value: string; label: string }[] = [
  { value: "creative", label: "Creative" },
  { value: "thoughtful", label: "Thoughtful" },
  { value: "ambitious", label: "Ambitious" },
  { value: "gentle", label: "Gentle" },
  { value: "adventurous", label: "Adventurous" },
  { value: "intellectual", label: "Intellectual" },
  { value: "artistic", label: "Artistic" },
  { value: "spiritual", label: "Spiritual" },
];

/** Occupation options */
export const occupationOptions: { value: string; label: string }[] = [
  { value: "", label: "Select occupation" },
  { value: "student", label: "Student" },
  { value: "business", label: "Business" },
  { value: "arts", label: "Arts & Creative" },
  { value: "tech", label: "Technology" },
  { value: "other", label: "Other" },
];

/** Name style options */
export const styleOptions: { value: NameFormData["nameStyle"]; label: string }[] = [
  { value: "traditional", label: "Classical & Traditional" },
  { value: "balanced", label: "Balanced & Modern" },
  { value: "modern", label: "Trendy & Contemporary" },
];

/** Name purpose options */
export const purposeOptions: { value: NameFormData["namePurpose"]; label: string }[] = [
  { value: "study", label: "Studying Chinese" },
  { value: "work", label: "Working in China" },
  { value: "social", label: "Social & Dating" },
  { value: "tattoo", label: "Tattoo Design" },
  { value: "other", label: "Other" },
];

/** Time zone options (matching the design spec) */
export const timezoneOptions: { value: string; label: string }[] = [
  { value: "UTC-12", label: "UTC-12 (Baker Island)" },
  { value: "UTC-11", label: "UTC-11 (Samoa)" },
  { value: "UTC-10", label: "UTC-10 (Hawaii)" },
  { value: "UTC-9", label: "UTC-9 (Alaska)" },
  { value: "UTC-8", label: "UTC-8 (PST)" },
  { value: "UTC-7", label: "UTC-7 (MST)" },
  { value: "UTC-6", label: "UTC-6 (CST)" },
  { value: "UTC-5", label: "UTC-5 (EST)" },
  { value: "UTC-4", label: "UTC-4 (AST)" },
  { value: "UTC-3", label: "UTC-3 (BRT)" },
  { value: "UTC-2", label: "UTC-2 (Mid-Atlantic)" },
  { value: "UTC-1", label: "UTC-1 (Azores)" },
  { value: "UTC+0", label: "UTC+0 (GMT)" },
  { value: "UTC+1", label: "UTC+1 (CET)" },
  { value: "UTC+2", label: "UTC+2 (EET)" },
  { value: "UTC+3", label: "UTC+3 (MSK)" },
  { value: "UTC+4", label: "UTC+4 (GST)" },
  { value: "UTC+5", label: "UTC+5 (PKT)" },
  { value: "UTC+5:30", label: "UTC+5:30 (IST)" },
  { value: "UTC+6", label: "UTC+6 (BST)" },
  { value: "UTC+7", label: "UTC+7 (ICT)" },
  { value: "UTC+8", label: "UTC+8 (CST)" },
  { value: "UTC+9", label: "UTC+9 (JST)" },
  { value: "UTC+10", label: "UTC+10 (AEST)" },
  { value: "UTC+11", label: "UTC+11 (SBT)" },
  { value: "UTC+12", label: "UTC+12 (NZST)" },
];
