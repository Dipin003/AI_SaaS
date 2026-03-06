import { z } from "zod"

export const onboardingSchema = z.object({
    industry: z.string().min(1, "Industry is required"),

    subIndustry: z.string().min(1, "Specialization is required"),

    experience: z
        .string()
        .min(1, "Experience is required")
        .transform((val) => parseInt(val)),

    skills: z
        .string()
        .min(1, "Skills are required")
        .transform((val) =>
            val.split(",").map((skill) => skill.trim())
        ),

    bio: z
        .string()
        .min(1, "Bio is required")
        .max(500, "Bio must be under 500 characters"),
})