"use client"

import { generateCoverLetter } from "@/actions/cover-letter"
import { coverLetterSchema } from "@/app/lib/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useFetch from "@/hooks/useFetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const CoverLetterGenerator = () => {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(coverLetterSchema)
    })

    const {
        loading: generating,
        fn: generateLetterFn,
        data: generatedLetter,
    } = useFetch(generateCoverLetter)

    useEffect(() => {
        if (generatedLetter) {
            toast.success("Cover letter generated successfully!")
            router.push(`/ai-cover-letter/${generatedLetter.id}`)
            reset()
        }
    }, [generatedLetter])

    const onSubmit = async (data) => {
        try {
            await generateLetterFn(data);
        } catch (error) {
            toast.error(error.message || "Failed to generate cover letter");
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                    <CardDescription>
                        Provide information about the position you're applying for.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Company + Job Title */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <label htmlFor="companyName" className="text-sm font-medium">
                                    Company Name
                                </label>

                                <input
                                    id="companyName"
                                    placeholder="Enter company name"
                                    {...register("companyName")}
                                    className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />

                                {errors.companyName && (
                                    <p className="text-sm text-red-500">
                                        {errors.companyName.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="jobTitle" className="text-sm font-medium">
                                    Job Title
                                </label>

                                <input
                                    id="jobTitle"
                                    placeholder="Enter job title"
                                    {...register("jobTitle")}
                                    className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                                />

                                {errors.jobTitle && (
                                    <p className="text-sm text-red-500">
                                        {errors.jobTitle.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <label htmlFor="jobDescription" className="text-sm font-medium">
                                Job Description
                            </label>

                            <textarea
                                id="jobDescription"
                                placeholder="Paste the job description here"
                                {...register("jobDescription")}
                                className="w-full border rounded-md px-3 py-2 text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-primary"
                            />

                            {errors.jobDescription && (
                                <p className="text-sm text-red-500">
                                    {errors.jobDescription.message}
                                </p>
                            )}
                        </div>

                        {/* Button */}
                        <div className="flex justify-end">
                            <Button>
                                {generating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Cover Letter"
                                )}
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CoverLetterGenerator