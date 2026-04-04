import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import CoverLetterGenerator from "../_components/cover-letter-generator"


const NewCoverLetterPage = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col space-y-2">
                <Link href="/ai-cover-letter">
                    <Button variant="link" className="gap-2 pl-0">
                        <ArrowLeft className="size-4" />
                        Back to Cover Letters
                    </Button>
                </Link>

                <div className="pb-6 px-7">
                    <div className="text-6xl font-bold gradient-title">
                        <h1 className="text-6xl font-bold gradient-title">
                            Create Cover Letter
                        </h1>
                        <p className="text-muted-foreground ">
                            Generate a tailored cover letter for your job application
                        </p>
                    </div>
                </div>
            </div>

            <CoverLetterGenerator />
        </div>
    )
}

export default NewCoverLetterPage